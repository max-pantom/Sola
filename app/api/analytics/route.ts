import { prisma } from '@/lib/prisma';

export async function GET() {
  const all = await prisma.analytics.findMany({
    orderBy: { timestamp: 'desc' },
  });

  return new Response(JSON.stringify(all), {
    headers: { 'Content-Type': 'application/json' },
  });
}
