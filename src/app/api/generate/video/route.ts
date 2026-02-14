import { NextResponse } from "next/server";
import { generateAudienceVideo } from "@/lib/ai/video-generator";

export async function POST(request: Request) {
  try {
    const { stageId, generatedImageUrl } = await request.json();

    if (!stageId || !generatedImageUrl) {
      return NextResponse.json(
        { error: "stageId and generatedImageUrl are required" },
        { status: 400 },
      );
    }

    const result = await generateAudienceVideo({
      imageUrl: generatedImageUrl,
    });

    return NextResponse.json({
      stageId,
      videoUrl: result.videoUrl,
      status: "completed",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Video generation failed" },
      { status: 500 },
    );
  }
}
