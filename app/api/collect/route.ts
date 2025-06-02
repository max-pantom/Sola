import { getDeviceType } from "@/app/utils/getDeviceType";
import pool from "@/lib/db";


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Or set to your domain only
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    let country = null; // Initialize country variable
    try {
      const geo = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geo.ok) {
        const geoData = await geo.json();
        country = geoData.country_name || null; // Set country based on geo data
      }
    } catch (err) {
      console.error('Geo lookup failed:', err); // Log any errors during geo lookup
    }

    const device = getDeviceType(body.userAgent);

    await pool.query(
      `INSERT INTO analytics (id, path, referrer, userAgent, ip, country, device, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        body.id,
        body.path,
        body.referrer,
        body.userAgent,
        ip,
        country,
        device
      ]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}






