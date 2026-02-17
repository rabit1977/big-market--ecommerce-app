import console from "console";
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
            title: "New Guest Inquiry",
            message: `${args.guestName} sent a message about "${listing.title}"`,
            isRead: false,
            createdAt: Date.now(),
            link: `/listings/${args.listingId}` // Or purely informational
            // We could link to a seller dashboard page if it existed, but linking to listing is okay
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
    const inquiryId = await ctx.runMutation(internal.inquiries.store, args);
    console.log("Inquiry stored in DB with ID:", inquiryId);

    // 2. Get Seller Email
    const seller = await ctx.runQuery(api.users.getByExternalId, { externalId: args.sellerId });
    
    // 3. Get Listing Title
    const listing = await ctx.runQuery(api.listings.getById, { id: args.listingId });

    if (!seller) {
        console.warn(`Seller not found for ID: ${args.sellerId}. This listing might be orphaned.`);
        return { success: true, inquiryId, emailStatus: "skipped", reason: "seller_not_found" };
    }
    
    if (!seller.email) {
      console.warn(`Seller found (ID: ${args.sellerId}) but has no email address.`);
      return { success: true, inquiryId, emailStatus: "skipped", reason: "seller_no_email" };
    } else if (!listing) {
       console.warn("Listing not found. Skipping email details. ListingID:", args.listingId);
       return { success: true, inquiryId, emailStatus: "skipped", reason: "listing_not_found" };
    } else {
        // 4. Send Email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("CRITICAL: RESEND_API_KEY is not set in environment variables!");
            return { success: true, inquiryId, emailStatus: "failed", reason: "missing_api_key" };
        } else {
            const resend = new Resend(resendApiKey);
            try {
                const { data, error } = await resend.emails.send({
                    from: 'Marketplace <onboarding@resend.dev>', // Update this with your verified domain in production
                    to: seller.email,
                    subject: `New Inquiry: ${listing.title}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
                                <tr>
                                    <td align="center" style="padding: 40px 20px;">
                                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #e4e4e7;">
                                            
                                            <!-- Header -->
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 40px; text-align: center;">
                                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Buyer Inquiry</h1>
                                                    <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0 0; font-size: 14px;">Someone is interested in your listing</p>
                                                </td>
                                            </tr>

                                            <!-- Content -->
                                            <tr>
                                                <td style="padding: 40px;">
                                                    <!-- Listing Details -->
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-bottom: 1px solid #e4e4e7;">
                                                        <tr>
                                                            <td style="padding-bottom: 24px;">
                                                                <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Listing</p>
                                                                <h2 style="margin: 8px 0 0 0; color: #18181b; font-size: 20px; font-weight: 700;">${listing.title}</h2>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Sender Card -->
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                                                        <tr>
                                                            <td style="padding: 24px;">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="48" valign="top">
                                                                            <div style="width: 40px; height: 40px; background-color: #000000; border-radius: 50%; color: white; line-height: 40px; text-align: center; font-weight: bold; font-size: 16px;">
                                                                                ${args.guestName ? args.guestName.charAt(0).toUpperCase() : 'G'}
                                                                            </div>
                                                                        </td>
                                                                        <td valign="top">
                                                                            <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 16px; line-height: 20px;">${args.guestName}</p>
                                                                            <a href="mailto:${args.guestEmail}" style="color: #2563eb; text-decoration: none; font-size: 14px; line-height: 20px;">${args.guestEmail}</a>
                                                                            ${args.guestPhone ? `<br><a href="tel:${args.guestPhone}" style="color: #64748b; text-decoration: none; font-size: 14px; line-height: 20px;">${args.guestPhone}</a>` : ''}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding-top: 16px;">
                                                                            <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-style: italic; color: #334155; line-height: 1.6; font-size: 15px;">
                                                                                "${args.message}"
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Action Button -->
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="padding-top: 8px;">
                                                                <a href="mailto:${args.guestEmail}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; transition: opacity 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                                                    Reply via Email
                                                                </a>
                                                                <p style="margin-top: 24px; color: #94a3b8; font-size: 13px;">
                                                                    You can also reply directly to this email to respond.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
                                                    <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                                                        Powered by Classifieds Platform
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `,
                    replyTo: args.guestEmail
                });

                if (error) {
                    console.error("Resend API returned error:", error);
                    return { success: true, inquiryId, emailStatus: "failed", reason: "resend_api_error", error };
                } else {
                    console.log("Email sent successfully via Resend. Data:", data);
                    return { success: true, inquiryId, emailStatus: "sent", data };
                }
            } catch (error) {
                console.error("Failed to send email notification", error);
                return { success: true, inquiryId, emailStatus: "failed", reason: "exception", error: String(error) };
            }
        }
    }
    
  },
});

// Debug tool: Check if API Key is set
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
