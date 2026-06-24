import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event || !event.isActive) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const where = {
    eventId: params.id,
    isApproved: true,
    ...(category && category !== "ALL" ? { category: category as never } : {}),
  };

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.photo.count({ where }),
  ]);

  return NextResponse.json({
    data: photos,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
