import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: any // fallback if type inference fails
): Promise<Response> {
  const id = context.params.id;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return Response.json(result.rows);
}
