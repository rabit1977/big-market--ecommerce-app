"use convex";

import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";



export const syncTransactions = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
        console.error("STRIPE_SECRET_KEY is missing");
        return { success: false, error: "Configuration Error" };
    }

    const limit = args.limit || 100;
    console.log(`Syncing up to ${limit} transactions from Stripe...`);

    // Use fetch directly to bypass ESM loader issues with Stripe SDK on Windows/Convex
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    // Expand line items and payment intent
    params.append('expand[]', 'data.line_items');
    params.append('expand[]', 'data.payment_intent');

    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        }
    });

    if (!response.ok) {
        console.error(`Stripe API error: ${response.status} ${response.statusText}`);
        return { success: false, error: "Stripe API Error" };
    }

    const sessions = await response.json();

    console.log(`Fetched ${sessions.data.length} sessions from Stripe`);

    let syncedCount = 0;

    for (const session of sessions.data) {
        // filter for paid sessions only
        if (session.payment_status !== 'paid') continue;
        
        
        console.log(`Processing session ${session.id}:`, {
            amount: session.amount_total,
            metadata: session.metadata,
            lineItems: session.line_items?.data.map((i: any) => i.description)
        });

        const { userId, type, tier, listingId, plan } = session.metadata || {};
        const amount = (session.amount_total || 0) / 100;
        
        // Determine description based on metadata
        let description = "Payment";
        let transactionType = "UNKNOWN";

        if (type === 'LISTING_PROMOTION') {
            transactionType = 'PROMOTION';
            description = `Listing Promotion: ${tier || 'Unknown Tier'}`;
            if (listingId) description += ` (Listing #${listingId.slice(-6)})`;
        } else if (type === 'SUBSCRIPTION' || plan) {
            transactionType = 'SUBSCRIPTION';
            description = `${plan || 'Premium'} Subscription`;
        } else {
             // Fallback if metadata is missing
             const lineItem = session.line_items?.data[0];
             if (lineItem) {
                 description = lineItem.description || "Stripe Payment";
                 // Try to guess type from description
                 if (description.includes('Promotion') || description.includes('listing')) {
                     transactionType = 'PROMOTION';
                 } else if (description.includes('Subscription') || description.includes('Plan')) {
                     transactionType = 'SUBSCRIPTION';
                 }
             }
        }

        // IMPORTANT: Handling missing userId
        // If we don't have a userId in metadata (e.g. from direct payment links or old system),
        // we can try to look it up by customer email if we have it?
        // But for now, let's log it.
        if (!userId) {
             console.log(`Skipping session ${session.id} - no userId in metadata. Email: ${session.customer_details?.email}`);
             // potential fallback: verify user by email? 
             // avoiding for now to prevent wrong attribution.
             continue;
        }

        // Call internal mutation to record
        try {
            await ctx.runMutation(api.transactions.record, {
                userId: userId,
                amount: amount,
                type: transactionType,
                description: description,
                status: 'COMPLETED',
                stripeId: session.id,
                metadata: session.metadata || {}, // save all metadata
                createdAt: session.created * 1000 // Use actual Stripe timestamp
            });
            syncedCount++;
        } catch (e) {
            console.error(`Failed to record transaction ${session.id}:`, e);
        }
    }

    return { success: true, count: syncedCount };
  },
});
