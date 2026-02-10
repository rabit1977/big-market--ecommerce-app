import { convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { api } from '../../../../../convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Fallback for development without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          const { userId, plan, duration } = session.metadata || {};
          
          if (userId && plan && duration) {
            const amount = (session.amount_total || 0) / 100;
            
            await convex.mutation(api.users.upgradeMembership, {
              externalId: userId,
              plan: plan,
              duration: duration,
              price: amount,
            });

            console.log(`✅ Upgraded user ${userId} to ${plan} plan`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await convex.mutation(api.users.cancelMembership, {
            externalId: userId,
          });
          console.log(`❌ Cancelled subscription for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
