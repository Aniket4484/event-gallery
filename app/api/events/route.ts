import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateEventCode } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { adminId: session.user.id },
    include: {
      _count: { select: { photos: true } },
      analytics: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: events });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    coupleNames,
    date,
    venue,
    description,
    downloadControl,
    watermarkEnabled,
    watermarkText,
    guestUploadEnabled,
    primaryColor,
  } = body;

  if (!name || !coupleNames || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let code = generateEventCode();
  let exists = await prisma.event.findUnique({ where: { code } });
  while (exists) {
    code = generateEventCode();
    exists = await prisma.event.findUnique({ where: { code } });
  }

  const event = await prisma.event.create({
    data: {
      name,
      coupleNames,
      date: new Date(date),
      venue,
      description,
      code,
      downloadControl: downloadControl || "VIEW_ONLY",
      watermarkEnabled: watermarkEnabled || false,
      watermarkText,
      guestUploadEnabled: guestUploadEnabled || false,
      primaryColor: primaryColor || "#B76E79",
      adminId: session.user.id,
    },
    include: { _count: { select: { photos: true } } },
  });

  await prisma.analytics.create({
    data: { eventId: event.id },
  });

  return NextResponse.json({ data: event }, { status: 201 });
}
