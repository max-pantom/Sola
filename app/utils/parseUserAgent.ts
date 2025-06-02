export function getBrowser(userAgent: string): string {
    if (/firefox|fxios/i.test(userAgent)) return "Firefox";
    if (/edg/i.test(userAgent)) return "Edge";
    if (/opr\//i.test(userAgent)) return "Opera";
    if (/chrome|crios/i.test(userAgent)) return "Chrome";
    if (/safari/i.test(userAgent)) return "Safari";
    if (/msie|trident/i.test(userAgent)) return "Internet Explorer";
    if (/edge/i.test(userAgent)) return "Edge";
    if (/samsung/i.test(userAgent)) return "Samsung Internet";
    if (/firefox/i.test(userAgent)) return "Firefox";
    if (/chrome/i.test(userAgent)) return "Chrome";
    if (/safari/i.test(userAgent)) return "Safari";
    if (/opera/i.test(userAgent)) return "Opera";
    if (/vivaldi/i.test(userAgent)) return "Vivaldi";
    if (/brave/i.test(userAgent)) return "Brave";
    if (/yandex/i.test(userAgent)) return "Yandex";
    return "Unknown";
  }
  