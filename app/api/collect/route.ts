import pool from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

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

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
