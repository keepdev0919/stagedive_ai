import { NextResponse } from "next/server";
import { generateAudienceImage } from "@/lib/ai/image-generator";
import { createClient } from "@/lib/supabase/server";

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
      eventType,
      audienceMood,
      persona,
      customContext,
    } = body;

    const normalizedImageUrls = Array.isArray(sourceImageUrls)
      ? sourceImageUrls.filter(
          (url: unknown) => typeof url === "string" && Boolean(url),
        )
      : [];
    const resolvedImageUrl =
      sourceImageUrl ||
      normalizedImageUrls[0] ||
      undefined;

    if (!stageId || !resolvedImageUrl) {
      return NextResponse.json(
        { error: "stageId and source image URL(s) are required" },
        { status: 400 },
      );
    }

    const result = await generateAudienceImage({
      sourceImageUrl: resolvedImageUrl,
      sourceImageUrls: normalizedImageUrls,
      audienceDensity: audienceDensity || 80,
      eventType: eventType || body.event_type || persona || "presentation",
      audienceMood:
        audienceMood || body.audience_mood || "auto",
      customContext: customContext || body.custom_context || undefined,
    });

    return NextResponse.json({
      stageId,
      imageUrl: result.imageUrl,
      status: "completed",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 },
    );
  }
}
