import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const request = await prisma.downloadRequest.findUnique({
    where: { token: params.token },
    include: { photo: { select: { url: true, filename: true } } },
  });

  if (!request || request.status !== "APPROVED") {
    return NextResponse.json({ error: "Invalid or not approved" }, { status: 404 });
  }

  return NextResponse.json({ data: { url: request.photo.url, filename: request.photo.filename } });
}
