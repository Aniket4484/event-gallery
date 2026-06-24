import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@weddingsnaps.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const name = process.env.ADMIN_NAME || "Administrator";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: { email, password: hashed, name },
  });

  console.log("Created admin:", admin.email);
  console.log("Password:", password);

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      name: "Sample Wedding Gallery",
      coupleNames: "Priya & Rahul",
      date: new Date("2024-12-15"),
      venue: "Grand Palace Hotel, Mumbai",
      description: "A beautiful wedding celebration",
      code: "DEMO1234",
      downloadControl: "VIEW_ONLY",
      watermarkEnabled: false,
      guestUploadEnabled: true,
      adminId: admin.id,
    },
  });

  await prisma.analytics.create({ data: { eventId: event.id } });

  console.log("Created sample event:", event.name, "| Code:", event.code);
  console.log("\nGallery URL: /gallery/DEMO1234");
  console.log("Admin login: /admin/login");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
