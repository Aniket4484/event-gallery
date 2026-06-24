import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      photos: {
        where: { isApproved: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
      analytics: true,
      _count: { select: { photos: true } },
    },
  });

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (session?.user?.id !== event.adminId) {
    const { watermarkText: _w, ...safeEvent } = event;
    return NextResponse.json({ data: safeEvent });
  }

  return NextResponse.json({ data: event });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event || event.adminId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      name: body.name,
      coupleNames: body.coupleNames,
      date: body.date ? new Date(body.date) : undefined,
      venue: body.venue,
      description: body.description,
      downloadControl: body.downloadControl,
      watermarkEnabled: body.watermarkEnabled,
      watermarkText: body.watermarkText,
      guestUploadEnabled: body.guestUploadEnabled,
      isActive: body.isActive,
      primaryColor: body.primaryColor,
      coverImage: body.coverImage,
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { photos: true },
  });
  if (!event || event.adminId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Promise.allSettled(event.photos.map((p) => deleteFromCloudinary(p.publicId)));
  if (event.coverImagePublicId) await deleteFromCloudinary(event.coverImagePublicId).catch(() => {});

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Event deleted" });
}
