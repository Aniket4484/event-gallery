import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";
  const eventId = searchParams.get("eventId");

  const where: Record<string, unknown> = {
    event: { adminId: session.user.id },
    status,
  };
  if (eventId) where.eventId = eventId;

  const requests = await prisma.downloadRequest.findMany({
    where,
    include: {
      photo: { select: { url: true, thumbnailUrl: true, filename: true } },
      event: { select: { name: true, coupleNames: true, code: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: requests });
}
