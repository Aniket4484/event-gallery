import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({ where: { id: params.eventId } });
  if (!event || event.adminId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const analytics = await prisma.analytics.findUnique({
    where: { eventId: params.eventId },
  });

  const photoCount = await prisma.photo.count({ where: { eventId: params.eventId } });
  const guestPhotos = await prisma.photo.count({
    where: { eventId: params.eventId, isGuestUpload: true },
  });

  const categoryBreakdown = await prisma.photo.groupBy({
    by: ["category"],
    where: { eventId: params.eventId },
    _count: true,
  });

  return NextResponse.json({
    data: {
      ...analytics,
      photoCount,
      guestPhotos,
      categoryBreakdown,
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
  const body = await req.json();
  const { type } = body;

  await prisma.analytics.upsert({
    where: { eventId: params.eventId },
    create: {
      eventId: params.eventId,
      totalDownloads: type === "download" ? 1 : 0,
      guestCount: type === "guest" ? 1 : 0,
    },
    update: {
      totalDownloads: type === "download" ? { increment: 1 } : undefined,
      guestCount: type === "guest" ? { increment: 1 } : undefined,
    },
  });

  return NextResponse.json({ message: "Analytics recorded" });
}
