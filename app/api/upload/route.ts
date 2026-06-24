import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, getThumbnailUrl } from "@/lib/cloudinary";
import type { Category } from "@/types";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session?.user?.id;

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const eventId = formData.get("eventId") as string;
  const category = (formData.get("category") as Category) || "WEDDING";
  const isGuestUpload = formData.get("isGuestUpload") === "true";

  if (!eventId || files.length === 0) {
    return NextResponse.json({ error: "Missing files or eventId" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (!isAdmin && !event.guestUploadEnabled) {
    return NextResponse.json({ error: "Guest uploads not allowed" }, { status: 403 });
  }

  if (!isAdmin && event.adminId !== session?.user?.id) {
    // guest upload - allowed
  } else if (isAdmin && event.adminId !== session?.user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const uploadedPhotos = [];
  const errors = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      errors.push({ filename: file.name, error: "File too large (max 20MB)" });
      continue;
    }

    if (!file.type.startsWith("image/")) {
      errors.push({ filename: file.name, error: "Not an image file" });
      continue;
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToCloudinary(buffer, {
        folder: `wedding-snaps/${event.code}`,
        watermark: event.watermarkEnabled,
        watermarkText: event.watermarkText || event.name,
      });

      const photo = await prisma.photo.create({
        data: {
          url: result.secure_url,
          thumbnailUrl: getThumbnailUrl(result.secure_url),
          publicId: result.public_id,
          filename: file.name,
          size: result.bytes,
          width: result.width,
          height: result.height,
          category,
          isGuestUpload,
          isApproved: isAdmin ? true : false,
          eventId,
        },
      });

      uploadedPhotos.push(photo);
    } catch (err) {
      errors.push({ filename: file.name, error: "Upload failed" });
    }
  }

  return NextResponse.json({
    data: uploadedPhotos,
    errors,
    message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
  });
}
