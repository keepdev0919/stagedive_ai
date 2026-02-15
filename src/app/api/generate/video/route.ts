import { NextResponse } from "next/server";
import { generateAudienceVideo } from "@/lib/ai/video-generator";
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
