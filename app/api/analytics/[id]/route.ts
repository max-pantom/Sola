import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [params.id]
  );

  return Response.json(result.rows);
}
