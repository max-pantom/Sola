export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}
