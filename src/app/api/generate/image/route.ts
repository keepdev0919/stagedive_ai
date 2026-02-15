import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/lib/supabase/server";
import { createR2Client } from "@/lib/r2/client";
import { generateAudienceImage } from "@/lib/ai/image-generator";

function getR2Config() {
  const missing: string[] = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "NEXT_PUBLIC_R2_PUBLIC_URL",
  ]
    .filter((key) => !(process.env[key] && process.env[key]!.length > 0));

  if (missing.length > 0) {
    throw new Error(`R2 is not fully configured: ${missing.join(", ")}`);
  }

  return {
    bucketName: process.env.R2_BUCKET_NAME!,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL!,
  };
}

function getGeneratedImageKey(stageId: string, mimeType: string) {
  const extension = mimeType.includes("png")
    ? "png"
    : mimeType.includes("webp")
      ? "webp"
      : "jpg";

  const safeSuffix =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}`;

  const safeStageId = stageId.replace(/[^a-zA-Z0-9_-]/g, "_");

  return `generated/${safeStageId}/${Date.now()}-${safeSuffix}.${extension}`;
}

function decodeBase64Image(imageBase64: string): Buffer {
  const prefixRemoved = imageBase64.includes(",")
    ? imageBase64.split(",").pop() || imageBase64
    : imageBase64;
  const normalizedBase64 = prefixRemoved.trim();

  if (!normalizedBase64) {
    throw new Error("Generated image payload is empty");
  }

  return Buffer.from(normalizedBase64, "base64");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      stageId,
      sourceImageUrl,
      sourceImageUrls,
      audienceDensity,
      imagePerspective,
      eventType,
      persona,
      customContext,
    } = body;

    const normalizedImageUrls = (Array.isArray(sourceImageUrls)
      ? sourceImageUrls.filter(
          (url: unknown) => typeof url === "string" && Boolean(url),
        )
      : []
    ).slice(0, 3);
    const resolvedImageUrl = sourceImageUrl || normalizedImageUrls[0] || undefined;

    if (!stageId || !resolvedImageUrl) {
      return NextResponse.json(
        { error: "stageId and source image URL(s) are required" },
        { status: 400 },
      );
    }

    const safeAudienceDensity = Number(audienceDensity);
    const normalizedDensity = [40, 80, 120].includes(safeAudienceDensity)
      ? safeAudienceDensity
      : 80;

    const result = await generateAudienceImage({
      sourceImageUrl: String(resolvedImageUrl),
      sourceImageUrls: normalizedImageUrls,
        audienceDensity: normalizedDensity,
      eventType: eventType || body.event_type || persona || "presentation",
      imagePerspective: imagePerspective || body.image_perspective,
      customContext: customContext || body.custom_context || undefined,
    });

    const { bucketName, publicUrl } = getR2Config();
    const imageBytes = decodeBase64Image(result.imageBase64);
    const key = getGeneratedImageKey(stageId, result.mimeType);
    const r2 = createR2Client();

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: imageBytes,
        ContentType: result.mimeType,
      }),
    );

    const generatedImageUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({
      stageId,
      imageUrl: generatedImageUrl,
      status: "completed",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Image generation failed: ${message}` },
      { status: 500 },
    );
  }
}
