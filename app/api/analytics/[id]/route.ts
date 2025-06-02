import { NextRequest, NextResponse } from 'next/server';
import pool from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return NextResponse.json(result.rows);
}
