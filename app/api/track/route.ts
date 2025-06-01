// import { NextRequest, NextResponse } from 'next/server';
// import db from '@/lib/db';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { site_id, event, url, timestamp } = body;

//   if (!site_id || !event || !url) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   try {
//     db.prepare(
//       'INSERT INTO analytics (site_id, event, url, timestamp) VALUES (?, ?, ?, ?)'
//     ).run(site_id, event, url, timestamp || Date.now());

//     return NextResponse.json({ message: 'Tracked successfully' });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
//   }
// }
