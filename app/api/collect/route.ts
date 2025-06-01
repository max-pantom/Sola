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

    await pool.query(
      `INSERT INTO analytics (id, path, referrer, userAgent, ip, country)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        body.id,
        body.path,
        body.referrer,
        body.userAgent,
        ip,
        body.country || null,
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
