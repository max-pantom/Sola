import { NextRequest } from 'next/server';
import pool from "@/lib/db";

// use a named function parameter for context
export async function GET(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const id = context.params.id;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return Response.json(result.rows);
}
