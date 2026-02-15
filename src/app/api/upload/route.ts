import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";

const MAX_FILES = 3;

type UploadFileInput = {
  filename: string;
  contentType: string;
};


export async function POST(request: Request) {
  console.log("Upload API called");
  console.log("R2 Config Check:", {
    accountId: process.env.R2_ACCOUNT_ID ? "Set" : "Missing",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ? "Set" : "Missing",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? "Set" : "Missing",
    bucketName: process.env.R2_BUCKET_NAME ? "Set" : "Missing",
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ? "Set" : "Missing",
  });

  try {

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("Upload request rejected: unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requiredR2Env = {
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    };

    const missingEnv = Object.entries(requiredR2Env)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingEnv.length > 0) {
      console.error("Upload request rejected: missing R2 env vars", missingEnv);
      return NextResponse.json(
        { error: "R2 is not fully configured", missingEnv },
        { status: 500 },
      );
    }

    const body = await request.json();
    const files: UploadFileInput[] = Array.isArray(body.files)
      ? body.files
      : body.filename && body.contentType
        ? [{ filename: body.filename, contentType: body.contentType }]
        : [];

    if (!files.length) {
      return NextResponse.json(
        { error: "files or filename/contentType are required" },
        { status: 400 },
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: "Maximum 3 files are allowed" },
        { status: 400 },
      );
    }

    const sanitizedFiles = files
      .filter((file) => typeof file.filename === "string" && file.filename.trim() !== "")
      .map((file) => {
        const original = file.filename.trim();
        const safeFilename = original
          .normalize("NFKD")
          .replace(/[^\w.-]/g, "_")
          .replace(/_+/g, "_")
          .slice(0, 120);

        return {
          filename: safeFilename || `image-${Date.now()}`,
          contentType: file.contentType || "image/jpeg",
        };
      });

    if (!sanitizedFiles.length) {
      return NextResponse.json(
        { error: "No valid files found" },
        { status: 400 },
      );
    }

    const now = Date.now();

    // Direct instantiation to ensure config is applied
    const r2 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "NEVER",
      responseChecksumValidation: "NEVER",
    });

    const uploads = await Promise.all(
      sanitizedFiles.map(async (file, index) => {
        const key = `stages/${now}-${index}-${file.filename}`;
        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          ContentType: file.contentType,
        });

        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
        console.log(`Generated uploadUrl for ${key}:`, uploadUrl);
        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        return { uploadUrl, publicUrl, key };
      }),
    );

    return NextResponse.json(
      sanitizedFiles.length === 1 ? uploads[0] : { uploads },
    );
  } catch (error) {
    console.error("Upload presign error:", error);

    const details =
      error instanceof Error
        ? { message: error.message, name: error.name, stack: error.stack }
        : { raw: String(error) };

    return NextResponse.json(
      { error: "Failed to generate upload URL", details },
      { status: 500 },
    );
  }
}
