interface GenerationRequestBody {
  prompt?: string;
  sourceImageUrl?: string;
  sourceImageUrls?: string[];
  audienceDensity?: number;
  eventType?: string;
  imagePerspective?: string;
  customContext?: string;
}

const DENSITY_LABEL_BY_PERCENT: Record<number, string> = {
  40: "편안한 관중(40%)",
  80: "활발한 관중(80%)",
  120: "만석에 가까운 관중(120%)",
};

const EVENT_CONTEXT_BY_TYPE: Record<string, string> = {
  presentation:
    "무대 발표/피칭 환경, 발표자가 중심이 되는 구조",
  performance: "공연 무대 환경, 동작/표현이 강조되는 장면",
  lecture: "강의/강연 환경, 전달이 선명한 학습형 무대",
  interview: "인터뷰형 진행, 질문과 응답이 함께 느껴지는 긴장감 있는 장면",
  event: "행사 진행/개회사 중심의 공식적인 무대",
  other: "사용자가 지정한 상황을 우선 반영하는 맞춤형 무대",
};

const PERSPECTIVE_CONTEXT_BY_TYPE: Record<string, string> = {
  stage_to_audience:
    "이미지는 이미 무대에서 객석을 바라보는 구도로 이해한다. 구도 보존이 기본이다.",
  audience_to_stage:
    "이미지는 관객석에서 무대를 바라보는 구도일 수 있으므로, 먼저 무대에서 관객을 바라보는 1인칭 시점으로 재구성한 뒤 관객을 추가한다.",
};

const SYSTEM_PROMPT = `
역할:
- 너는 무대 연출에 특화된 이미지 생성 도우미이다.
- 사용자 업로드 이미지의 구도를 유지하면서 관객이 있는 무대 장면으로 확장해서 생성한다.
- 카메라는 무조건 1인칭 시점이며, 무대 위 발표자/진행자가 객석을 바라보는 구도다.
- 생성 이미지는 사실적인 조명, 피부톤, 공간감, 원근을 유지해야 하며 과장된 만화풍은 금지한다.
- 로고, 자막, 워터마크, 텍스트 오버레이는 출력하지 않는다.
- 관객은 장면 뒤쪽·중간·앞쪽 레이어로 자연스럽게 배치하고 인원이 과하게 빽빽하지 않게 구성한다.
`;

const STYLE_GUIDELINES = `
출력 규격:
- 해상도는 입력 이미지와 어색하지 않게 맞춤.
- 원본 조명/컬러 톤과 조합이 자연스러워야 함.
- 관객의 반응은 아래 입력값의 맥락에 맞춰 조정.
`;

interface OpenAIImageResponse {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
  };
}

function unauthorized(message = "Unauthorized") {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    },
  );
}

function badRequest(message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    },
  );
}

function internalError(message: string, status = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}

function normalizeAudienceDensity(value: number): number {
  return value === 120 ? 120 : value === 80 ? 80 : 40;
}

function buildAudiencePromptFromInputs(body: GenerationRequestBody): string {
  const density = normalizeAudienceDensity(
    typeof body.audienceDensity === "number" ? body.audienceDensity : 80,
  );
  const eventType = body.eventType || "presentation";
  const eventContext =
    EVENT_CONTEXT_BY_TYPE[eventType] ?? EVENT_CONTEXT_BY_TYPE.presentation;
  const imagePerspective =
    body.imagePerspective || "stage_to_audience";
  const perspectiveContext =
    PERSPECTIVE_CONTEXT_BY_TYPE[imagePerspective] ??
    PERSPECTIVE_CONTEXT_BY_TYPE.stage_to_audience;
  const customContext = (body.customContext || "").trim();
  const customPart = customContext ? `추가 맥락: ${customContext}` : "";

  const inputSlots = [
    "[User Input]",
    `- audience_density=${DENSITY_LABEL_BY_PERCENT[density]}`,
    `- event_type=${eventType}`,
    `- image_perspective=${imagePerspective}`,
    eventContext ? `- event_context=${eventContext}` : null,
    customPart ? `- custom_context=${customContext}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "SYSTEM PROMPT:",
    SYSTEM_PROMPT.trim(),
    "",
    "STYLE:",
    STYLE_GUIDELINES.trim(),
    "",
    inputSlots,
    "",
    "TASK:",
    "- Create a photorealistic cinematic image.",
    "- Keep the original stage composition from the uploaded image as the base and add audience naturally in front of it.",
    `- Perspective handling: ${perspectiveContext}`,
    "- Use a wide-angle first-person perspective from a speaker on stage looking at the audience.",
    `- audience density: ${DENSITY_LABEL_BY_PERCENT[density]}`,
    customContext ? `- additional context to include: ${customContext}` : "",
    "- Do not include text, logos, captions, or watermarks.",
  ]
    .filter(Boolean)
    .join("\n");
}

function assertAuthorized(req: Request): Response | null {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const functionInvokeToken =
    Deno.env.get("FUNCTION_INVOKE_TOKEN") ||
    serviceRoleKey;

  if (!functionInvokeToken) {
    return internalError("FUNCTION_INVOKE_TOKEN is missing", 500);
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return unauthorized("Missing Authorization header");
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token || token !== functionInvokeToken) {
    return unauthorized("Invalid invocation token");
  }

  return null;
}

function resolveInputImageUrls(body: GenerationRequestBody): string[] {
  const sourceImageUrls = body.sourceImageUrls?.filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );

  const hasSourceImageUrl =
    typeof body.sourceImageUrl === "string" && body.sourceImageUrl.length > 0;

  const collected = [
    ...(hasSourceImageUrl ? [body.sourceImageUrl!] : []),
    ...(sourceImageUrls ?? []),
  ];

  return collected
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, 3);
}

function makeOpenAIPayload(
  prompt: string,
  inputImageUrls: string[],
): Record<string, unknown> {
  const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1";
  const size = Deno.env.get("OPENAI_IMAGE_SIZE") || "1024x1024";
  const quality = Deno.env.get("OPENAI_IMAGE_QUALITY") || "auto";
  const background = Deno.env.get("OPENAI_IMAGE_BACKGROUND") || "auto";

  return {
    model,
    prompt,
    images: inputImageUrls.map((image_url) => ({ image_url })),
    n: 1,
    size,
    quality,
    background,
  };
}

async function fetchUrlAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download generated image from OpenAI URL: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

async function getResponseImageBase64(
  openAIData: OpenAIImageResponse,
): Promise<string | undefined> {
  const item = openAIData.data?.[0];
  if (!item) {
    return undefined;
  }

  if (typeof item.b64_json === "string" && item.b64_json.length > 0) {
    return item.b64_json;
  }

  if (typeof item.url === "string" && item.url.length > 0) {
    return fetchUrlAsBase64(item.url);
  }

  return undefined;
}

Deno.serve(async (req: Request) => {
  const authError = assertAuthorized(req);
  if (authError) return authError;

  let body: GenerationRequestBody;
  try {
    body = (await req.json()) as GenerationRequestBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const inputImageUrls = resolveInputImageUrls(body);
  if (!inputImageUrls.length) {
    return badRequest("sourceImageUrl or sourceImageUrls is required");
  }

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    return internalError("OPENAI_API_KEY is missing", 500);
  }

  try {
    const finalPrompt =
      typeof body.prompt === "string" && body.prompt.trim().length > 0
        ? body.prompt
        : buildAudiencePromptFromInputs(body);

    const openAIResponse = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(makeOpenAIPayload(finalPrompt, inputImageUrls)),
    });

    const openAIText = await openAIResponse.text();
  if (!openAIResponse.ok) {
      return internalError(
        `OpenAI images/edits failed: ${openAIResponse.status} ${openAIResponse.statusText} ${openAIText}`,
        502,
      );
    }

    const parsedBody = JSON.parse(openAIText) as OpenAIImageResponse;
    const imageBase64 = await getResponseImageBase64(parsedBody);

    if (typeof imageBase64 !== "string") {
      return internalError(
        parsedBody.error?.message ||
          "OpenAI response did not include image data",
        502,
      );
    }

    return new Response(
      JSON.stringify({
        imageBase64,
        mimeType: "image/png",
        prompt: finalPrompt,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return internalError(`OpenAI request failed: ${message}`, 502);
  }
});
