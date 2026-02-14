'use server';

import { convex } from '@/lib/convex-server';
import Stripe from 'stripe';
import { api } from '../../convex/_generated/api';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover' as any,
  typescript: true,
});

import { headers } from 'next/headers';

/**
 * Gets the base URL for the application, handling both local and deployed environments.
 */
async function getBaseUrl() {
  const host = (await headers()).get('host');
  const protocol = (await headers()).get('x-forwarded-proto') || 'http';
  
  // If NEXT_PUBLIC_APP_URL is set and not localhost, use it.
  // Otherwise, use the dynamic host from headers.
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  
  return `${protocol}://${host}`;
}

/**
 * Creates a Stripe checkout session for listing promotion
 */
export async function createPromotionCheckoutSession(
  listingId: string,
  userId: string,
  userEmail: string,
  promotionName: string,
  promotionTier: string, // e.g., 'PREMIUM', 'TOP_POSITION'
  priceAmount: number
) {
  try {
    const baseUrl = await getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mkd',
            product_data: {
              name: `Listing Promotion: ${promotionName}`,
              description: `Upgrade listing ${listingId} with ${promotionName} for 14 days`,
            },
            unit_amount: Math.round(priceAmount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/my-listings?promoted=true&listingId=${listingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/listings/${listingId}/success`, // Return to success selection page
      metadata: {
        userId,
        listingId,
        tier: promotionTier,
        type: 'LISTING_PROMOTION' // Distinct from SUBSCRIPTION
      },
      customer_email: userEmail,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating Stripe promotion session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Existing subscription checkout (kept for reference/compatibility)
 */
export async function createStripeCheckoutSession(
  userId: string,
  userEmail: string,
  planName: string,
  priceAmount: number,
  duration: 'monthly' | 'yearly'
) {
  try {
    const baseUrl = await getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mkd',
            product_data: {
              name: `${planName} Plan (${duration})`,
              description: `Subscription to ${planName} features for ${duration === 'monthly' ? '1 month' : '1 year'}`,
            },
            unit_amount: Math.round(priceAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium`,
      metadata: {
        userId,
        plan: planName,
        duration,
        type: 'SUBSCRIPTION'
      },
      customer_email: userEmail,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function verifyStripePayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { userId, plan, duration, listingId, tier, type } = session.metadata || {};

      if (type === 'LISTING_PROMOTION') {
         if (!listingId || !tier) throw new Error('Missing promotion metadata');
         
         // Apply promotion directly for immediate feedback
         await convex.mutation(api.promotions.applyPromotion, {
             listingId: listingId as any,
             tier: tier
         });

         // Record Transaction
         await convex.mutation(api.transactions.record, {
             userId: userId || 'unknown',
             amount: (session.amount_total || 0) / 100,
             type: 'PROMOTION',
             description: `Listing Promotion: ${tier}`,
             status: 'COMPLETED',
             stripeId: sessionId,
             metadata: session.metadata
         });

         return { success: true, type: 'PROMOTION', tier };
      }

      if (!userId || !plan || !duration) {
        throw new Error('Missing metadata in Stripe session');
      }

      // Perform the upgrade within Convex
      const amount = (session.amount_total || 0) / 100;
      
      await convex.mutation(api.users.upgradeMembership, {
        externalId: userId,
        plan: plan,
        duration: duration,
        price: amount,
      });

      // Record Transaction for Subscription (Duplicate check handled by mutation)
      await convex.mutation(api.transactions.record, {
          userId: userId,
          amount: amount,
          type: 'SUBSCRIPTION',
          description: `${plan} Membership (${duration})`,
          status: 'COMPLETED',
          stripeId: sessionId,
          metadata: session.metadata
      });

      return { success: true, plan };
    }

    return { success: false, error: 'Payment not completed' };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: 'Verification failed' };
  }
}
