import { NextRequest } from 'next/server';
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return Response.json(result.rows);
}
