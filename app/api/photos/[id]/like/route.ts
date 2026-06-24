import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { action } = body;

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });

  const updated = await prisma.photo.update({
    where: { id: params.id },
    data: { likes: { [action === "unlike" ? "decrement" : "increment"]: 1 } },
  });

  return NextResponse.json({ data: { likes: updated.likes } });
}
