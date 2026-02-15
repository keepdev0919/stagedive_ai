export type Locale = "ko" | "en";

export type TranslationKey = keyof typeof translations["ko"];

const translations = {
  ko: {
    "app.title": "Stage-Dive | 가상 연습 플랫폼",
    "app.description":
      "가상 관객을 바라보며 연습하고 AI가 제작한 무대 연습 영상을 통해 스테이지 공포증을 극복해 보세요.",

    "nav.home": "홈",
    "nav.create": "무대 만들기",
    "nav.history": "연습 기록",
    "nav.profile": "프로필",

    "sidebar.categories": "카테고리",
    "sidebar.category.auditoriums": "강당",
    "sidebar.category.meetingRooms": "회의실",
    "sidebar.category.concertHalls": "콘서트홀",

    "topbar.searchPlaceholder": "무대, 위치, 분위기를 검색하세요...",
    "topbar.quickStart": "빠른 시작",
    "brand.tagline": "가상 발표 연습",

    "dashboard.title": "인기 무대",
    "dashboard.subtitle":
      "실전 발표 연습을 위한 검증된 무대와 커뮤니티 무대 셀렉션입니다.",
    "dashboard.view.grid": "격자",
    "dashboard.view.list": "목록",
    "dashboard.loadingCommunity": "커뮤니티 무대를 불러오는 중...",
    "dashboard.loadCommunityFailed": "커뮤니티 무대를 불러오지 못했어요. 기본 무대만 표시됩니다.",
    "dashboard.communityCapacity": "커뮤니티 무대",
    "dashboard.communityFeature": "커뮤니티 업로드",

    "history.title": "연습 기록",
    "history.subtitle": "진행했던 연습 과정을 확인하고 개선 포인트를 추적하세요.",
    "history.loading": "기록 불러오는 중...",
    "history.loadError": "연습 기록을 불러오지 못했습니다.",
    "history.emptyTitle": "아직 기록이 없어요",
    "history.emptyDescription": "무대를 선택해 연습하면 기록이 여기에 표시됩니다. 매 연습이 자신감을 키웁니다.",
    "history.unknownStage": "알 수 없는 무대",
    "history.durationLabel": "진행 시간",

    "profile.title": "프로필",
    "profile.subtitle": "계정 및 이용 현황을 관리하세요.",
    "profile.signInPrompt": "진행 상황을 저장하려면 로그인하세요",
    "profile.stats.sessions": "세션",
    "profile.stats.stages": "무대",
    "profile.stats.totalPractice": "총 연습 시간",
    "profile.stats.totalPracticeValue": "{minutes}분",

    "practice.defaultStageName": "연습 세션",
    "practice.loading": "무대를 불러오는 중...",
    "practice.unavailableTitle": "무대 정보를 찾을 수 없습니다",
    "practice.unavailableDescription":
      "이 연습 세션에 필요한 무대 미디어를 불러오지 못했습니다.",
    "practice.controls.exit": "나가기",
    "practice.controls.toggleHint": "화면을 클릭해 컨트롤 표시/숨기기",
    "practice.controls.endSession": "연습 종료",

    "complete.title": "연습 완료!",
    "complete.subtitle": "잘했어요. 관객 앞에서의 자신감이 자라납니다.",
    "complete.duration": "진행 시간",
    "complete.stageLabel": "무대",
    "complete.noValidDuration": "연습 시간이 유효하지 않습니다.",
    "complete.status.saving": "기록 저장 중...",
    "complete.status.saved": "기록이 연습 기록에 저장되었습니다.",
    "complete.status.failed": "기록 저장에 실패했어요 (데모 모드 또는 인증 이슈).",
    "complete.status.notSaved": "기록이 저장되지 않았습니다.",
    "complete.actions.home": "홈으로 돌아가기",
    "complete.actions.history": "연습 기록 보기",

    "waiting.tip":
      "마음 다잡기 시간입니다. 호흡을 가다듬고 성공적인 발표를 상상해보세요.",

    "breathing.phase.in": "들숨...",
    "breathing.phase.hold": "잠시 멈춤...",
    "breathing.phase.out": "날숨...",
    "breathing.technique": "4-7-8 호흡법",

    "progress.analyzing": "무대 환경 분석 중...",
    "progress.generateAudience": "관객 뷰 생성 중...",
    "progress.createVideo": "무대 영상 시뮬레이션 생성 중...",
    "progress.finalizing": "무대 설정 최종화 중...",

    "stage.category.hackathon": "해커톤 무대",
    "stage.category.concert_hall": "콘서트 홀",
    "stage.category.ted_stage": "TED 무대",
    "stage.category.meeting_room": "회의실",
    "stage.category.auditorium": "강당",
    "stage.category.tech_hub": "테크 허브",
    "stage.card.capacityLabel": "수용 인원",
    "stage.card.startPractice": "연습 시작",

    "auth.welcomeTitle": "환영합니다",
    "auth.welcomeDescription": "무대 연습을 시작하려면 로그인하세요.",
    "auth.brandTagline": "가상 연습 플랫폼",
    "auth.continueWithGoogle": "Google로 계속하기",
    "auth.terms": "계속 진행하면 이용약관에 동의한 것으로 간주됩니다.",
    "user.guest": "게스트 사용자",

    "create.page.title": "무대 만들기",
    "create.page.exitWizard": "마법사 나가기",
    "create.page.headerDescription":
      "무대를 설정하고 관중의 규모를 조정해 원하는 연습용 장면을 생성하세요.",

    "create.step.background": "배경",
    "create.step.audience": "관중",
    "create.step.persona": "이벤트/무드",

    "create.environment.title": "환경 설정",
    "create.environment.uploadTitle": "무대 배경 이미지 업로드",
    "create.environment.uploadHint":
      "고화질 가로형 또는 360° 파노라마 이미지를 드래그 앤 드롭하세요 (JPG, PNG, WEBP - 최대 50MB)",
    "create.environment.uploadLimit": "최대 {count}장까지 업로드할 수 있어요.",
    "create.environment.browseFiles": "파일 선택",
    "create.environment.addAnother": "사진 추가 ({current}/{max})",
    "create.environment.imagesSelected": "{current}/{max}장 선택됨",
    "create.environment.remove": "삭제",
    "create.environment.uploadedAlt": "업로드된 무대 이미지 {index}",

    "create.audience.title": "관객 밀도",
    "create.audience.description":
      "무대에서 보이는 관중의 밀도와 반응 강도를 조절합니다.",
    "create.audience.option.40.label": "40%",
    "create.audience.option.40.sublabel": "편안한 무대",
    "create.audience.option.80.label": "80%",
    "create.audience.option.80.sublabel": "활동적인 관중",
    "create.audience.option.120.label": "120%",
    "create.audience.option.120.sublabel": "만석 상태",

    "create.persona.title": "상황 설정",
    "create.customContext.label": "기타 상황 직접 입력",
    "create.customContext.placeholder":
      "예: 결혼식 사회처럼 조용하고 단정한 톤으로, 관객은 잔잔하게 반응했으면 좋아요",
    "create.eventType.presentation.title": "발표",
    "create.eventType.presentation.description": "일반 발표, 데모, 브리핑에 맞는 기본 톤입니다.",
    "create.eventType.performance.title": "공연",
    "create.eventType.performance.description":
      "공연형 무대의 조명감과 동적 반응을 강조합니다.",
    "create.eventType.lecture.title": "강의",
    "create.eventType.lecture.description":
      "지식 전달형 강의 장면을 위한 진지한 톤입니다.",
    "create.eventType.interview.title": "인터뷰",
    "create.eventType.interview.description":
      "질의응답 중심 흐름에서 쓰기 좋은 몰입형 연출입니다.",
    "create.eventType.event.title": "이벤트",
    "create.eventType.event.description":
      "행사 개회, 시상식, 공개 발표에서 활용하기 좋은 분위기입니다.",
    "create.eventType.other.title": "기타",
    "create.eventType.other.description": "목록에 없는 무대 상황을 직접 입력해 주세요.",
    "create.audienceMood.sectionTitle": "관객 분위기",
    "create.audienceMood.auto": "자동",
    "create.audienceMood.calm_attention": "차분한 집중",
    "create.audienceMood.warm_support": "따뜻한 응원",
    "create.audienceMood.formal_event": "포멀 톤",
    "create.audienceMood.high_energy": "고에너지",

    "create.stepper.title.background": "무대 배경",
    "create.stepper.title.audience": "관객 설정",
    "create.stepper.title.persona": "이벤트/무드",

    "create.action.back": "스테이지 목록으로",
    "create.action.saveDraft": "임시 저장",
    "create.action.initialize": "스테이지 초기화",
    "create.action.initializing": "초기화 중...",
    "create.action.defaultStageName": "커스텀 스테이지",
    "create.action.initFailed": "스테이지 초기화에 실패했습니다. 다시 시도해주세요.",
  },
  en: {
    "app.title": "Stage-Dive | Virtual Practice Platform",
    "app.description":
      "Practice facing virtual audiences to overcome stage fright. Upload a photo, AI generates a POV audience video for immersive training.",

    "nav.home": "Home",
    "nav.create": "Create Stage",
    "nav.history": "Practice History",
    "nav.profile": "Profile",

    "sidebar.categories": "Categories",
    "sidebar.category.auditoriums": "Auditoriums",
    "sidebar.category.meetingRooms": "Meeting Rooms",
    "sidebar.category.concertHalls": "Concert Halls",

    "topbar.searchPlaceholder": "Search venues, locations or styles...",
    "topbar.quickStart": "Quick Start",
    "brand.tagline": "Virtual Practice",

    "dashboard.title": "Popular Stages",
    "dashboard.subtitle":
      "Hand-picked venues and community stages to sharpen your public speaking performance.",
    "dashboard.view.grid": "Grid",
    "dashboard.view.list": "List",
    "dashboard.loadingCommunity": "Loading community stages...",
    "dashboard.loadCommunityFailed": "Could not load community stages. Showing presets only.",
    "dashboard.communityCapacity": "Community Stage",
    "dashboard.communityFeature": "Community Upload",

    "history.title": "Practice History",
    "history.subtitle": "Track your progress and review past sessions.",
    "history.loading": "Loading history...",
    "history.loadError": "Unable to load practice history.",
    "history.emptyTitle": "No sessions yet",
    "history.emptyDescription":
      "Start practicing with a stage to see your history here. Every session builds confidence.",
    "history.unknownStage": "Unknown Stage",
    "history.durationLabel": "Duration",

    "profile.title": "Profile",
    "profile.subtitle": "Manage your account and preferences.",
    "profile.signInPrompt": "Sign in to save your progress",
    "profile.stats.sessions": "Sessions",
    "profile.stats.stages": "Stages",
    "profile.stats.totalPractice": "Total Practice",
    "profile.stats.totalPracticeValue": "{minutes} min",

    "practice.defaultStageName": "Practice Session",
    "practice.loading": "Loading stage...",
    "practice.unavailableTitle": "Stage unavailable",
    "practice.unavailableDescription":
      "Could not load stage media for this practice session.",
    "practice.controls.exit": "Exit",
    "practice.controls.toggleHint": "Click anywhere to toggle controls",
    "practice.controls.endSession": "End Session",

    "complete.title": "Session Complete!",
    "complete.subtitle": "Great work facing your audience.",
    "complete.duration": "Duration",
    "complete.stageLabel": "Stage",
    "complete.noValidDuration": "Session did not have a valid duration.",
    "complete.status.saving": "Saving session...",
    "complete.status.saved": "Session has been saved to history.",
    "complete.status.failed": "Could not save this session (demo mode or auth issue).",
    "complete.status.notSaved": "Session was not saved.",
    "complete.actions.home": "Back to Home",
    "complete.actions.history": "View History",

    "waiting.tip":
      "Take this moment to center yourself. Focus on your breathing and visualize a successful performance.",

    "breathing.phase.in": "Breathe In...",
    "breathing.phase.hold": "Hold...",
    "breathing.phase.out": "Breathe Out...",
    "breathing.technique": "4-7-8 Breathing Technique",

    "progress.analyzing": "Analyzing your environment...",
    "progress.generateAudience": "Generating audience view...",
    "progress.createVideo": "Creating video simulation...",
    "progress.finalizing": "Finalizing your stage...",

    "stage.category.hackathon": "Hackathon Venue",
    "stage.category.concert_hall": "Concert Hall",
    "stage.category.ted_stage": "TED Stage",
    "stage.category.meeting_room": "Meeting Room",
    "stage.category.auditorium": "Auditorium",
    "stage.category.tech_hub": "Tech Hub",
    "stage.card.capacityLabel": "Capacity",
    "stage.card.startPractice": "START PRACTICE",

    "auth.welcomeTitle": "Welcome Back",
    "auth.welcomeDescription": "Sign in to access your stages and practice sessions",
    "auth.brandTagline": "Virtual Practice Platform",
    "auth.continueWithGoogle": "Continue with Google",
    "auth.terms": "By continuing, you agree to our Terms of Service",
    "user.guest": "Guest User",

    "create.page.title": "Create Stage",
    "create.page.exitWizard": "Exit Wizard",
    "create.page.headerDescription":
      "Set up your stage and audience level to generate your practice scene.",

    "create.step.background": "Background",
    "create.step.audience": "Audience",
    "create.step.persona": "Event/Mood",

    "create.environment.title": "Environment Setup",
    "create.environment.uploadTitle": "Upload Stage Background Image",
    "create.environment.uploadHint":
      "Drag and drop high-resolution landscape or 360° panorama images (JPG, PNG, WEBP - max 50MB)",
    "create.environment.uploadLimit": "You can upload up to {count} images.",
    "create.environment.browseFiles": "Browse Files",
    "create.environment.addAnother": "Add another photo ({current}/{max})",
    "create.environment.imagesSelected": "{current}/{max} images selected",
    "create.environment.remove": "Remove",
    "create.environment.uploadedAlt": "Uploaded stage image {index}",

    "create.audience.title": "Audience Density",
    "create.audience.description":
      "Control crowd simulation intensity and response level for your stage.",
    "create.audience.option.40.label": "40%",
    "create.audience.option.40.sublabel": "Cozy",
    "create.audience.option.80.label": "80%",
    "create.audience.option.80.sublabel": "Active",
    "create.audience.option.120.label": "120%",
    "create.audience.option.120.sublabel": "Sold Out",

    "create.persona.title": "Scene Setup",
    "create.customContext.label": "Custom scenario details",
    "create.customContext.placeholder":
      "e.g., Keep applause minimal, audience is quietly attentive for a solemn event.",
    "create.eventType.presentation.title": "Presentation",
    "create.eventType.presentation.description":
      "Default setup for talks, demos, and briefings.",
    "create.eventType.performance.title": "Performance",
    "create.eventType.performance.description":
      "Emphasizes expression, rhythm and active audience reactions.",
    "create.eventType.lecture.title": "Lecture",
    "create.eventType.lecture.description":
      "Knowledge-sharing or training sessions with focused attention.",
    "create.eventType.interview.title": "Interview",
    "create.eventType.interview.description":
      "Question-response scenarios with camera-facing presentation.",
    "create.eventType.event.title": "Event",
    "create.eventType.event.description":
      "Ceremonies, opening remarks, and announcements.",
    "create.eventType.other.title": "Other",
    "create.eventType.other.description":
      "Use this when your scenario is not listed above.",
    "create.audienceMood.sectionTitle": "Audience Mood",
    "create.audienceMood.auto": "Auto",
    "create.audienceMood.calm_attention": "Calm Focus",
    "create.audienceMood.warm_support": "Supportive",
    "create.audienceMood.formal_event": "Formal",
    "create.audienceMood.high_energy": "High Energy",

    "create.stepper.title.background": "Background",
    "create.stepper.title.audience": "Audience",
    "create.stepper.title.persona": "Event/Mood",

    "create.action.back": "Back to Stages",
    "create.action.saveDraft": "Save as Draft",
    "create.action.initialize": "Initialize Stage",
    "create.action.initializing": "Initializing...",
    "create.action.defaultStageName": "Custom Stage",
    "create.action.initFailed": "Stage initialization failed. Please try again.",
  },
} as const;

type InterpolationParams = Record<string, string | number>;

export function interpolate(
  template: string,
  params?: InterpolationParams,
): string {
  if (!params) return template;
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function t(
  key: TranslationKey,
  locale: Locale = "ko",
  params?: InterpolationParams,
): string {
  const localeMap = translations[locale] ?? translations.ko;
  const template = localeMap[key] ?? translations.ko[key] ?? String(key);
  return interpolate(template, params);
}

export { translations };
