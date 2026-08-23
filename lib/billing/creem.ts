import type { BillingCadence } from './types';

const CREEM_BASE_URL =
  process.env.CREEM_ENVIRONMENT === 'live'
    ? 'https://api.creem.io'
    : 'https://test-api.creem.io';

const productEnvironment = process.env.CREEM_ENVIRONMENT === 'live' ? 'LIVE' : 'TEST';

const getCreemApiKey = () => process.env[`CREEM_${productEnvironment}_API_KEY`];

export function getCreemProductId(cadence: BillingCadence): string {
  const suffix = cadence === 'monthly' ? 'MONTHLY' : 'ANNUAL';
  const productId = process.env[`CREEM_${productEnvironment}_${suffix}_PRODUCT_ID`];
  if (!productId) throw new Error(`CREEM_${productEnvironment}_${suffix}_PRODUCT_ID is not configured`);
  return productId;
}

export function getCadenceForProduct(productId: string): BillingCadence | null {
  if (productId === process.env[`CREEM_${productEnvironment}_MONTHLY_PRODUCT_ID`]) return 'monthly';
  if (productId === process.env[`CREEM_${productEnvironment}_ANNUAL_PRODUCT_ID`]) return 'annual';
  return null;
}

async function creemRequest<T>(path: string, init: RequestInit): Promise<T> {
  const apiKey = getCreemApiKey();
  if (!apiKey) throw new Error(`CREEM_${productEnvironment}_API_KEY is not configured`);
  const response = await fetch(`${CREEM_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Creem request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export async function createCreemCheckout(input: {
  cadence: BillingCadence;
  userId: string;
  email: string;
  customerId?: string | null;
  successUrl: string;
  trialEligible: boolean;
}): Promise<{ checkout_url: string; id: string }> {
  return creemRequest('/v1/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      product_id: getCreemProductId(input.cadence),
      request_id: input.userId,
      success_url: input.successUrl,
      customer: input.customerId ? { id: input.customerId } : { email: input.email },
      metadata: {
        userId: input.userId,
        cadence: input.cadence,
        trialEligible: String(input.trialEligible),
      },
    }),
  });
}

export async function createCreemPortal(customerId: string): Promise<{ customer_portal_link: string }> {
  return creemRequest('/v1/customers/billing', {
    method: 'POST',
    body: JSON.stringify({ customer_id: customerId }),
  });
}

export async function upgradeCreemSubscription(subscriptionId: string, productId: string): Promise<void> {
  await creemRequest(`/v1/subscriptions/${subscriptionId}/upgrade`, {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, update_behavior: 'proration-charge-immediately' }),
  });
}

export async function cancelCreemSubscription(subscriptionId: string): Promise<void> {
  await creemRequest(`/v1/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ mode: 'scheduled', onExecute: 'cancel' }),
  });
}
