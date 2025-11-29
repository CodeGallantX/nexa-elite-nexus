/**
 * Shared utility functions for Web Push API
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
 */

/**
 * Convert ArrayBuffer to Base64 string
 * Used for converting push subscription keys (p256dh and auth) to storable format
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription/getKey
 */
export function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert URL-safe Base64 to Uint8Array for VAPID key
 * The VAPID public key is typically in URL-safe Base64 format and needs
 * to be converted to Uint8Array for the PushManager.subscribe() method
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe#applicationserverkey
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
