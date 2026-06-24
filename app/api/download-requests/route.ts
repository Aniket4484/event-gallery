import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { photoId, eventId, guestName, guestEmail, guestPhone, message } = await req.json();

    if (!photoId || !eventId || !guestName?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.downloadRequest.findFirst({
      where: { photoId, guestName: guestName.trim(), status: { not: "REJECTED" } },
    });
    if (existing) {
      return NextResponse.json({ error: "Request already submitted" }, { status: 409 });
    }

    const request = await prisma.downloadRequest.create({
      data: {
        photoId,
        eventId,
        guestName: guestName.trim(),
        guestEmail: guestEmail?.trim() || null,
        guestPhone: guestPhone?.trim() || null,
        message: message?.trim() || null,
        token: randomBytes(24).toString("hex"),
      },
    });

    return NextResponse.json({ data: request }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
