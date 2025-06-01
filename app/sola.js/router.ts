export function GET() {
  const js = `
  (function() {
    const id = window.SOLA_SITE_ID || 'unknown';
    const payload = {
      id: id,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };

    fetch("https://sola.yourdomain.com/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  })();
`;


  return new Response(js, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received data:', body); // Log the received data

  // ... rest of your code
}