export async function GET() {
    const js = `
      (function() {
        const endpoint = '/api/collect';
        const id = document.currentScript.getAttribute('data-site') || 'default';
        const body = {
          id: id,
          path: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent
        };
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      })();
    `;
    return new Response(js, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
  