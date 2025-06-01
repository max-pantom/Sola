import pool from '@/lib/db';

export async function GET() {
  const result = await pool.query(`SELECT * FROM analytics ORDER BY timestamp DESC`);
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
