import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { siteId, path, referrer, userAgent, ip, country } = body;

  const newEntry = await prisma.analytics.create({
    data: {
      siteId: siteId || 'default',
      path,
      referrer,
      userAgent,
      ip,
      country,
    },
  });

  return new Response(JSON.stringify(newEntry), { status: 200 });
}
