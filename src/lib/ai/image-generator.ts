export type AudienceImageParams = {
  sourceImageUrl: string;
  sourceImageUrls?: string[];
  audienceDensity: number;
  eventType: string;
  imagePerspective?: string;
  customContext?: string;
};

const DENSITY_LABEL_BY_PERCENT: Record<number, string> = {
  40: "편안한 관중(40%)",
  80: "활발한 관중(80%)",
  120: "만석에 가까운 관중(120%)",
};

const EVENT_CONTEXT_BY_TYPE: Record<string, string> = {
  presentation: "무대 발표/피칭 환경, 발표자가 중심이 되는 구조",
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
- 사용자가 업로드한 무대 사진의 공간 구성과 조명을 유지하면서 관객이 있는 무대 장면으로 확장해서 생성한다.
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

function normalizeAudienceDensity(value: number): number {
  return value === 120 ? 120 : value === 80 ? 80 : 40;
}

export function buildAudiencePrompt(params: AudienceImageParams): string {
  const density = normalizeAudienceDensity(params.audienceDensity);
  const eventContext =
    EVENT_CONTEXT_BY_TYPE[params.eventType] ?? EVENT_CONTEXT_BY_TYPE.presentation;
  const imagePerspective =
    params.imagePerspective || "stage_to_audience";
  const perspectiveContext =
    PERSPECTIVE_CONTEXT_BY_TYPE[imagePerspective] ??
    PERSPECTIVE_CONTEXT_BY_TYPE.stage_to_audience;

  const customContext = params.customContext?.trim();
  const customPart = customContext ? `추가 맥락: ${customContext}` : "";

  const normalizedUser = {
    eventType: params.eventType || "presentation",
    audienceDensityLabel: DENSITY_LABEL_BY_PERCENT[density],
    eventContext,
  };

  const inputSlots = [
    "[User Input]",
    `- source_image_role=stage_background_reference`,
    `- event_type=${normalizedUser.eventType}`,
    `- audience_density=${normalizedUser.audienceDensityLabel}`,
    `- image_perspective=${imagePerspective}`,
    eventContext ? `- event_context=${eventContext}` : null,
    customPart ? `- custom_context=${customPart}` : null,
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
    "- Apply the following audience settings naturally:",
    `  - density: ${normalizedUser.audienceDensityLabel}`,
    customContext
      ? `- Additional context to include: ${customContext}`
      : "",
    "- Do not include text, logos, captions, or watermarks.",
  ]
    .filter(Boolean)
    .join("\n");
}

function getEdgeFunctionUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const trimmedUrl = supabaseUrl?.replace(/\/$/, "") || "";

  if (!trimmedUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  }

  return `${trimmedUrl}/functions/v1/generate-image`;
}

function getEdgeFunctionKey(): string {
  const functionKey =
    process.env.FUNCTION_INVOKE_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!functionKey) {
    throw new Error(
      "FUNCTION_INVOKE_TOKEN (or SUPABASE_SERVICE_ROLE_KEY) is missing",
    );
  }

  return functionKey;
}

export async function generateAudienceImage(
  params: AudienceImageParams,
): Promise<{ imageBase64: string; mimeType: string; prompt: string }> {
  const sourceImageUrl = params.sourceImageUrl?.trim();

  if (!sourceImageUrl) {
    throw new Error("No source image URL provided");
  }

  const prompt = buildAudiencePrompt(params);
  const functionUrl = getEdgeFunctionUrl();

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEdgeFunctionKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      sourceImageUrl,
      sourceImageUrls: params.sourceImageUrls,
      audienceDensity: params.audienceDensity,
      eventType: params.eventType,
      imagePerspective: params.imagePerspective,
      customContext: params.customContext,
    }),
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Edge function image generation failed: ${response.status} ${response.statusText} ${bodyText}`,
    );
  }

  const parsedBody = JSON.parse(bodyText) as {
    imageBase64?: string;
    mimeType?: string;
    error?: string;
  };

  if (!parsedBody.imageBase64 || typeof parsedBody.imageBase64 !== "string") {
    throw new Error(parsedBody.error || "Edge function did not return image data");
  }

  return {
    imageBase64: parsedBody.imageBase64,
    mimeType: parsedBody.mimeType || "image/png",
    prompt,
  };
}
