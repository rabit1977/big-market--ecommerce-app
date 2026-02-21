import { v } from "convex/values";
import { Resend } from "resend";
import { api, internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";

// Internal mutation to store the inquiry and notify seller on dashboard
export const store = internalMutation({
  args: {
    listingId: v.id("listings"),
    sellerId: v.string(),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Store the inquiry
    const inquiryId = await ctx.db.insert("listingInquiries", {
      ...args,
      createdAt: Date.now(),
      isRead: false,
    });

    // 2. Create Notification for Seller
    const listing = await ctx.db.get(args.listingId);
    if (listing) {
        await ctx.db.insert("notifications", {
            userId: args.sellerId,
            type: "INQUIRY",
            title: "New Email Inquiry",
            message: `${args.guestName} sent an email about "${listing.title}"`,
            isRead: false,
            createdAt: Date.now(),
            link: `/listings/${args.listingId}`,
            metadata: {
                guestEmail: args.guestEmail,
                guestName: args.guestName,
                listingId: args.listingId,
                listingTitle: listing.title
            }
        });
    }

    return inquiryId;
  },
});

export const submit = action({
  args: {
    listingId: v.id("listings"),
    sellerId: v.string(),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Submit action started for listing:", args.listingId);
    // 1. Store the inquiry and notification
    const inquiryId = await ctx.runMutation(internal.inquiries.store, args) as any;
    console.log("Inquiry stored in DB with ID:", inquiryId);

    // 2. Get Seller Email (Robust Lookup)
    let seller = await ctx.runQuery(api.users.getByExternalId, { externalId: args.sellerId });
    
    // Fallback: If not found by external ID, try as internal ID
    if (!seller) {
        try {
            // We use getPublicProfile or a similar query that handles internal IDs
            // actually we can just check if the ID looks like a Convex ID and try to get it
            // but inquiries.ts doesn't have a direct query for internal ID easily accessible here
            // let's use getAdminUserDetails but that's a query and we are in an action
            // Actually, we can just use the provided sellerId to try and find the user if they were created with internal ID
            // Since we're in an action, we can call any query.
            const allUsers = await ctx.runQuery(api.users.list);
            seller = allUsers.find(u => u._id === args.sellerId || u.externalId === args.sellerId) || null;
        } catch (e) {
            console.error("Error during fallback seller lookup:", e);
        }
    }
    
    // 3. Get Listing Title
    const listing = await ctx.runQuery(api.listings.getById, { id: args.listingId });

    if (!seller) {
      console.warn(`[INQUIRY_ERROR] Seller account not found for ID: ${args.sellerId}`);
      return { success: true, inquiryId, emailStatus: "skipped", reason: "seller_not_found" };
    }

    if (!seller.email) {
      console.warn(`[INQUIRY_ERROR] Seller found (${args.sellerId}) but has no email.`);
      return { success: true, inquiryId, emailStatus: "skipped", reason: "seller_no_email" };
    }
    
    if (!listing) {
       console.warn(`[INQUIRY_ERROR] Listing not found for ID: ${args.listingId}`);
       return { success: true, inquiryId, emailStatus: "skipped", reason: "listing_not_found" };
    }

    // 4. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("CRITICAL: RESEND_API_KEY is not set!");
        return { success: true, inquiryId, emailStatus: "failed", reason: "missing_api_key" };
    }

    const resend = new Resend(resendApiKey);
    try {
        const { data, error } = await resend.emails.send({
            from: 'Marketplace <onboarding@resend.dev>',
            to: seller.email,
            subject: `New Email Inquiry: ${listing.title}`,
            html: `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: sans-serif;">
                    <div style="padding: 20px; background-color: #ffffff; border-radius: 8px; margin: 20px;">
                        <h2>New Email Inquiry for "${listing.title}"</h2>
                        <p><strong>From:</strong> ${args.guestName} (${args.guestEmail})</p>
                        <p><strong>Message:</strong></p>
                        <div style="padding: 15px; background-color: #f8fafc; border-left: 4px solid #18181b;">
                            ${args.message}
                        </div>
                        <p style="margin-top: 20px;"><a href="mailto:${args.guestEmail}" style="padding: 10px 20px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px;">Reply to Guest</a></p>
                    </div>
                </body>
                </html>
            `,
            replyTo: args.guestEmail
        });

        if (error) {
            console.error("Resend API error:", error);
            return { success: true, inquiryId, emailStatus: "failed", reason: "resend_api_error", error };
        }
        
        console.log("Email sent successfully!");
        return { success: true, inquiryId, emailStatus: "sent", data };
    } catch (error) {
        console.error("Exception during email send:", error);
        return { success: true, inquiryId, emailStatus: "failed", reason: "exception", error: String(error) };
    }
  },
});
export const debugResend = action({
  args: {},
  handler: async () => {
    const key = process.env.RESEND_API_KEY;
    return {
      isSet: !!key,
      length: key ? key.length : 0,
      prefix: key ? key.substring(0, 5) + "..." : null
    };
  }
});

// Debug tool: Get last inquiry to verify DB storage
export const getLastInquiry = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("listingInquiries").order("desc").first();
    }
});

// Debug tool: List all users to check external IDs
export const debugListUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(u => ({
      _id: u._id,
      externalId: u.externalId,
      email: u.email,
      name: u.name
    }));
  }
});
