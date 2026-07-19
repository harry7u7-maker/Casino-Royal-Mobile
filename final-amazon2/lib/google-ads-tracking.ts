/**
 * Google Ads Conversion Tracking Module
 *
 * Tracks conversion events for Google Ads (AW-18224885812).
 * In web builds, this sends events to the Google tag.
 * In native builds, events are queued for later reporting.
 */

// Conversion event ID for purchase tracking
const GOOGLE_ADS_CONVERSION_ID = "AW-18224885812";
const GOOGLE_ADS_CONVERSION_LABEL = "ndciCI21yL0cELTgpvJD";

// Pending events queue for native builds
const pendingEvents: Array<{ event: string; params: Record<string, unknown> }> = [];

export interface GoogleAdsConversionParams {
  transactionId?: string;
  value?: number;
  currency?: string;
  newCustomer?: boolean;
}

/**
 * Track a purchase/conversion event.
 * In web builds, this calls gtag directly.
 * In native builds, events are stored for later sync.
 */
export function trackConversion(params: GoogleAdsConversionParams = {}) {
  const { transactionId = "", value, currency, newCustomer } = params;

  const eventParams: Record<string, unknown> = {
    send_to: `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    transaction_id: transactionId,
  };

  if (value !== undefined) {
    eventParams.value = value;
  }
  if (currency !== undefined) {
    eventParams.currency = currency;
  }
  if (newCustomer !== undefined) {
    eventParams.new_customer = newCustomer;
  }

  // Web build: send directly via gtag
  if (typeof window !== "undefined" && typeof (window as unknown as Record<string, unknown>).gtag === "function") {
    const gtag = (window as unknown as Record<string, unknown>).gtag as (
      command: string,
      action: string,
      params: Record<string, unknown>
    ) => void;

    gtag("event", "conversion", eventParams);
  } else {
    // Native/mobile build: queue for later
    pendingEvents.push({
      event: "conversion",
      params: eventParams,
    });
  }
}

/**
 * Track a page view / screen view event.
 */
export function trackPageView(pageName: string) {
  if (typeof window !== "undefined" && typeof (window as unknown as Record<string, unknown>).gtag === "function") {
    const gtag = (window as unknown as Record<string, unknown>).gtag as (
      command: string,
      action: string,
      params: Record<string, unknown>
    ) => void;

    gtag("event", "page_view", {
      page_title: pageName,
    });
  }
}

/**
 * Track a custom event.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof (window as unknown as Record<string, unknown>).gtag === "function") {
    const gtag = (window as unknown as Record<string, unknown>).gtag as (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;

    gtag("event", eventName, params);
  } else {
    pendingEvents.push({
      event: eventName,
      params: params || {},
    });
  }
}

/**
 * Get pending events queue (for sync purposes).
 */
export function getPendingEvents() {
  return [...pendingEvents];
}

/**
 * Clear pending events queue.
 */
export function clearPendingEvents() {
  pendingEvents.length = 0;
}
