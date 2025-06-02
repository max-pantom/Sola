import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Await the params to access the id
  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
      [id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in /api/analytics/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}