import pool from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return new Response(JSON.stringify(result.rows), {
    headers: { "Content-Type": "application/json" },
  });
}
