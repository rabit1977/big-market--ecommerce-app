import { v } from "convex/values";
import { Resend } from "resend";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const sendWithEmail = action({
  args: {
    content: v.string(),
    listingId: v.optional(v.id("listings")),
    senderId: v.string(),
    receiverId: v.string(),
    imageUrl: v.optional(v.string()), 
    type: v.optional(v.string()), 
  },
  handler: async (ctx, args): Promise<string> => {
    // 1. Store the message in the database via the existing mutation
    const messageId = await ctx.runMutation(api.messages.send, args);

    // 2. Fetch Receiver Details
    const receiver = await ctx.runQuery(api.users.getByExternalId, { externalId: args.receiverId });
    if (!receiver || !receiver.email) {
      console.log("Receiver not found or has no email, skipping notification email.");
      return messageId;
    }

    // 3. Fetch Sender Details
    const sender = await ctx.runQuery(api.users.getByExternalId, { externalId: args.senderId });
    const senderName = sender?.name || "A user";

    // 4. Fetch Listing Details (if applicable)
    let listingTitle = "General Inquiry";
    if (args.listingId) {
        const listing = await ctx.runQuery(api.listings.getById, { id: args.listingId });
        if (listing) {
            listingTitle = listing.title;
        }
    }

    // 5. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("RESEND_API_KEY is not set, skipping email send.");
        return messageId;
    }

    const resend = new Resend(resendApiKey);
    try {
        await resend.emails.send({
            from: 'Marketplace <onboarding@resend.dev>',
            to: receiver.email,
            subject: `New Email from ${senderName}: ${listingTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: sans-serif;">
                    <div style="padding: 20px; background-color: #ffffff; border-radius: 8px; margin: 20px;">
                        <h2 style="color: #18181b;">You've received a new email!</h2>
                        <p><strong>From:</strong> ${senderName}</p>
                        <p><strong>Topic:</strong> ${listingTitle}</p>
                        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                        <p><strong>Message:</strong></p>
                        <div style="padding: 15px; background-color: #f8fafc; border-left: 4px solid #18181b; color: #3f3f46;">
                            ${args.content}
                        </div>
                        <p style="margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/messages" 
                               style="padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Reply in Dashboard
                            </a>
                        </p>
                    </div>
                </body>
                </html>
            `,
        });
        console.log("Notification email sent to:", receiver.email);
    } catch (error) {
        console.error("Failed to send notification email:", error);
    }

    return messageId;
  },
});
