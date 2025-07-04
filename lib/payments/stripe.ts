import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil'
});

export async function createCheckoutSession({
  user,
  priceId
}: {
  user: User | null;
  priceId: string;
}) {
  const currentUser = await getUser();

  if (!user || !currentUser) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  // Simplified for now - will be replaced with LemonSqueezy
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer_email: currentUser.email
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(session.url);
}

// Placeholder functions for compatibility - will be replaced with LemonSqueezy
export async function getSubscriptionByCustomerId(customerId: string) {
  return null;
}

export async function updateSubscription(subscriptionId: string, data: any) {
  return null;
}

export async function getStripePrices() {
  // Placeholder - will be replaced with LemonSqueezy
  return [];
}

export async function getStripeProducts() {
  // Placeholder - will be replaced with LemonSqueezy
  return [];
}

export async function createCustomerPortalSession(user: User) {
  // Placeholder - will be replaced with LemonSqueezy
  return { url: '/pricing' };
}

export async function handleSubscriptionChange(event: any) {
  // Placeholder - will be replaced with LemonSqueezy
  console.log('Subscription change:', event.type);
}