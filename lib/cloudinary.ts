import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export type UploadResult = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir(dir: string) {
  if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true });
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; watermark?: boolean; watermarkText?: string }
): Promise<UploadResult> {
  const folderPath = path.join(UPLOAD_DIR, options.folder);
  await ensureDir(folderPath);

  const id = crypto.randomUUID();
  const ext = "jpg";
  const filename = `${id}.${ext}`;
  const filePath = path.join(folderPath, filename);

  await fs.writeFile(filePath, buffer);

  const publicId = `${options.folder}/${filename}`;
  const url = `/uploads/${options.folder}/${filename}`;

  return {
    public_id: publicId,
    secure_url: url,
    width: 0,
    height: 0,
    bytes: buffer.length,
    format: ext,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, publicId.replace(/^uploads\//, ""));
  await fs.unlink(filePath).catch(() => {});
}

export function getThumbnailUrl(url: string): string {
  return url;
}

export function getLowQualityUrl(url: string): string {
  return url;
}

export async function getCloudinaryUsage() {
  const walkDir = async (dir: string): Promise<number> => {
    if (!existsSync(dir)) return 0;
    let total = 0;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) total += await walkDir(full);
      else { const stat = await fs.stat(full); total += stat.size; }
    }
    return total;
  };

  const usedBytes = await walkDir(UPLOAD_DIR);
  const limitBytes = 5 * 1024 * 1024 * 1024; // 5 GB

  return {
    plan: "Local Storage",
    last_updated: new Date().toISOString(),
    storage: { usage: usedBytes, limit: limitBytes },
    bandwidth: { usage: 0, limit: limitBytes },
    objects: { usage: 0, limit: 100000 },
    transformations: { usage: 0, limit: 500000 },
  };
}
