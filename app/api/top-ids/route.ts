import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(`
    SELECT id, COUNT(*) AS clicks
    FROM analytics
    GROUP BY id
    ORDER BY clicks DESC
  `);

  return new Response(JSON.stringify(result.rows), {
    headers: { "Content-Type": "application/json" },
  });
}
