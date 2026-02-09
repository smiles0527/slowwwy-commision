/**
 * Utility helpers for the Slowwwy storefront.
 */

/** Concatenate CSS class names, filtering falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a price in USD. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
