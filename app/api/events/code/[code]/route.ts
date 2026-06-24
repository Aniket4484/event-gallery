import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const event = await prisma.event.findUnique({
    where: { code: params.code.toUpperCase() },
    include: {
      _count: { select: { photos: true } },
    },
  });

  if (!event || !event.isActive) {
    return NextResponse.json({ error: "Event not found or inactive" }, { status: 404 });
  }

  await prisma.analytics.upsert({
    where: { eventId: event.id },
    create: { eventId: event.id, totalViews: 1 },
    update: { totalViews: { increment: 1 } },
  });

  return NextResponse.json({ data: event });
}
