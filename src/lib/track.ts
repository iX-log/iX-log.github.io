// Umami custom events. A no-op until the script has loaded, and when analytics is off (no umamiId, dev, blockers).
type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

export function track(event: string, data?: Record<string, string | number>) {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch { /* analytics never breaks the page */ }
}
