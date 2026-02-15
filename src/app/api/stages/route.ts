import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const query = supabase
      .from("stages")
      .select("*")
      .eq("status", "ready")
      .not("video_url", "is", null)
      .order("created_at", { ascending: false });

    const { data: stages, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stages });
  } catch (error) {
    console.error("GET /api/stages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
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
    const sourceImageUrls = Array.isArray(body.source_image_urls)
      ? body.source_image_urls
          .filter((url: unknown) => typeof url === "string" && Boolean(url))
          .slice(0, 3)
      : [];
    const eventType = body.event_type || body.eventType || "presentation";
    const audienceMood = body.audience_mood || body.audienceMood || "auto";
    const customContext = body.custom_context || body.customContext || "";
    const payload = {
      user_id: user.id,
      name: body.name || "Untitled Stage",
      category: body.category || "hackathon",
      capacity: body.capacity || "",
      feature: body.feature || "",
      source_image_url: body.source_image_url || sourceImageUrls[0] || null,
      audience_density: body.audience_density || 80,
      event_type: eventType,
      audience_mood: audienceMood,
      custom_context: customContext || null,
      persona: body.persona || null,
      status: "draft",
    } as Record<string, unknown>;

    const buildPayload = (includeImageList: boolean) => {
      const candidate = includeImageList
        ? { ...payload, source_image_urls: sourceImageUrls }
        : payload;
      return Object.fromEntries(
        Object.entries(candidate).filter(([, value]) => value !== undefined),
      );
    };

    const payloadWithArrays = buildPayload(sourceImageUrls.length > 0);

    let data: { [key: string]: unknown } | null = null;
    let error: { message: string } | null = null;

    const primaryResult = await supabase
      .from("stages")
      .insert(payloadWithArrays)
      .select()
      .single();
    data = primaryResult.data as { [key: string]: unknown } | null;
    error = primaryResult.error;

    // Backward compatibility if source_image_urls column is not provisioned yet.
    if (
      error &&
      sourceImageUrls.length > 0 &&
      error.message.includes("source_image_urls")
    ) {
      const fallbackResult = await supabase
        .from("stages")
        .insert(buildPayload(false))
        .select()
        .single();

      data = fallbackResult.data as { [key: string]: unknown } | null;
      error = fallbackResult.error;
    }

    // Backward compatibility if event_type / audience_mood columns are not provisioned yet.
    if (
      error &&
      (error.message.includes("event_type") ||
        error.message.includes("audience_mood") ||
        error.message.includes("custom_context") ||
        error.message.includes("Could not find the"))
    ) {
      const legacyPayload = {
        ...payload,
        event_type: undefined,
        audience_mood: undefined,
        custom_context: undefined,
      };

      const fallbackResult = await supabase
        .from("stages")
        .insert(
          sourceImageUrls.length
            ? {
                ...Object.fromEntries(
                  Object.entries(legacyPayload).filter(([, value]) => value !== undefined),
                ),
                source_image_urls: sourceImageUrls,
              }
            : Object.fromEntries(
                Object.entries(legacyPayload).filter(([, value]) => value !== undefined),
              ),
        )
        .select()
        .single();

      data = fallbackResult.data as { [key: string]: unknown } | null;
      error = fallbackResult.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stage: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
