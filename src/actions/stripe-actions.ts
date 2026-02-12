'use server';

import { convex } from '@/lib/convex-server';
import Stripe from 'stripe';
import { api } from '../../convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function createStripeCheckoutSession(
  userId: string,
  userEmail: string,
  planName: string,
  priceAmount: number,
  duration: 'monthly' | 'yearly'
) {
  try {
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
            unit_amount: Math.round(priceAmount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Using 'payment' for simplicity, 'subscription' requires Stripe Product IDs
      success_url: `${APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/premium`,
      metadata: {
        userId,
        plan: planName,
        duration,
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
      const { userId, plan, duration } = session.metadata || {};

      if (!userId || !plan || !duration) {
        throw new Error('Missing metadata in Stripe session');
      }

      // Perform the upgrade within Convex
      // Note: We're calling the mutation from the server using the http client
      const amount = (session.amount_total || 0) / 100;
      
      await convex.mutation(api.users.upgradeMembership, {
        externalId: userId,
        plan: plan,
        duration: duration,
        price: amount,
      });

      return { success: true, plan };
    }

    return { success: false, error: 'Payment not completed' };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: 'Verification failed' };
  }
}
