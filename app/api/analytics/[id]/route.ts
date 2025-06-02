import { NextApiRequest, NextApiResponse } from 'next';
import pool from "@/lib/db";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const result = await pool.query(
    `SELECT * FROM analytics WHERE id = $1 ORDER BY timestamp DESC`,
    [id]
  );

  return res.status(200).json(result.rows);
}
