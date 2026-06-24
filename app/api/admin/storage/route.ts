import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCloudinaryUsage } from "@/lib/cloudinary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await getCloudinaryUsage();
    return NextResponse.json({ data: usage });
  } catch {
    return NextResponse.json({ error: "Failed to fetch storage data" }, { status: 500 });
  }
}
