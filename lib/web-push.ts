import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidContact = process.env.VAPID_CONTACT_EMAIL || 'mailto:no-reply@goalyx.app';
let vapidInitialized = false;

function ensureVapidConfigured() {
  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error('Missing VAPID keys. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.');
  }

  if (!vapidInitialized) {
    webpush.setVapidDetails(vapidContact, vapidPublicKey, vapidPrivateKey);
    vapidInitialized = true;
  }
}

export function getVapidPublicKey() {
  if (!vapidPublicKey) {
    throw new Error('Missing VAPID public key. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY.');
  }
  return vapidPublicKey;
}

export async function sendWebPushNotification(subscription: any, payload: { title: string; body: string; data?: Record<string, unknown> }) {
  if (!subscription || typeof subscription !== 'object') {
    throw new Error('Invalid push subscription provided');
  }

  ensureVapidConfigured();
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
