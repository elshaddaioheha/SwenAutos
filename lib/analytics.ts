export function logEvent(name: string, payload: Record<string, any> = {}) {
  // lightweight placeholder analytics: send to console now; replace with real provider later
  try {
    console.info("analytics:event", { name, ...payload, ts: new Date().toISOString() });
    // TODO: send to real analytics endpoint or window.dataLayer
  } catch (e) {
    // noop
  }
}
