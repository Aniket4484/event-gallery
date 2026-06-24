import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photo = await prisma.photo.findUnique({
    where: { id: params.id },
    include: { event: true },
  });

  if (!photo || photo.event.adminId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.photo.update({
    where: { id: params.id },
    data: {
      caption: body.caption,
      category: body.category,
      isApproved: body.isApproved,
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photo = await prisma.photo.findUnique({
    where: { id: params.id },
    include: { event: true },
  });

  if (!photo || photo.event.adminId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteFromCloudinary(photo.publicId);
  await prisma.photo.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Photo deleted" });
}
