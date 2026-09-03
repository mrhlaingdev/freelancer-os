import posthog from "posthog-js";

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (posthog.__loaded) {
    posthog.capture(event, properties);
  }
}