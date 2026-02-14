import { NextResponse } from "next/server";
import { generateAudienceImage } from "@/lib/ai/image-generator";

export async function POST(request: Request) {
  try {
    const { stageId, sourceImageUrl, audienceDensity, persona } =
      await request.json();

    if (!stageId || !sourceImageUrl) {
      return NextResponse.json(
        { error: "stageId and sourceImageUrl are required" },
        { status: 400 },
      );
    }

    const result = await generateAudienceImage({
      sourceImageUrl,
      audienceDensity: audienceDensity || 80,
      persona: persona || "presenter",
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
