import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSupabaseAdminClient, isSupabaseConfigured, SUPABASE_STORAGE_BUCKET } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TO_EXT: Record<string, "jpg" | "png" | "webp" | "gif"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function detectMimeFromMagic(buffer: Buffer): keyof typeof ALLOWED_MIME_TO_EXT | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Dosya bulunamadı" }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ message: "Dosya boyutu en fazla 5 MB olabilir." }, { status: 400 });
  }

  if (!(file.type in ALLOWED_MIME_TO_EXT)) {
    return NextResponse.json({ message: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectMimeFromMagic(buffer);
  if (!detectedMime || detectedMime !== file.type) {
    return NextResponse.json({ message: "Dosya içeriği doğrulanamadı." }, { status: 400 });
  }

  const extension = ALLOWED_MIME_TO_EXT[detectedMime];
  const safeName = `${Date.now()}-${randomUUID()}.${extension}`;

  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdminClient();
      const objectPath = `products/${safeName}`;
      const { error: uploadError } = await client.storage.from(SUPABASE_STORAGE_BUCKET).upload(objectPath, buffer, {
        contentType: detectedMime,
        upsert: false,
      });

      if (uploadError) {
        return NextResponse.json({ message: `Görsel depoya yüklenemedi: ${uploadError.message}` }, { status: 500 });
      }

      const { data } = client.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(objectPath);
      return NextResponse.json({ url: data.publicUrl });
    } catch {
      return NextResponse.json({ message: "Supabase yapılandırması eksik veya hatalı." }, { status: 500 });
    }
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        message:
          "Kalıcı görsel depolama yapılandırılmadı. SUPABASE değişkenlerini ekleyip storage bucket kurmalısınız.",
      },
      { status: 500 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, safeName);
  await fs.writeFile(filePath, buffer);
  return NextResponse.json({ url: `/uploads/${safeName}` });
}
