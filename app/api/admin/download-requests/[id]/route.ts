import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const request = await prisma.downloadRequest.findFirst({
    where: { id: params.id, event: { adminId: session.user.id } },
  });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.downloadRequest.update({
    where: { id: params.id },
    data: { status },
    include: { photo: { select: { url: true, filename: true } } },
  });

  return NextResponse.json({ data: updated });
}
