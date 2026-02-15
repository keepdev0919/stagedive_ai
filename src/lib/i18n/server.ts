import { cookies, headers } from "next/headers";
import { t, type Locale, type TranslationKey } from "./translations";

const LOCALE_COOKIE_KEY = "stagedive_locale";

function parseLocale(value: string | undefined | null): Locale | null {
  if (!value) return null;

  const lowered = value.toLowerCase();
  return lowered.startsWith("ko") ? "ko" : "en";
}

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  const cookieValue = parseLocale(cookieLocale);
  if (cookieValue) return cookieValue;

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  if (!acceptLanguage) return "ko";

  const languageList = acceptLanguage.split(",");
  for (const item of languageList) {
    const locale = parseLocale(item.trim());
    if (!locale) continue;
    return locale;
  }

  return "ko";
}

export function tServer(
  key: TranslationKey,
  locale: Locale,
  params?: Record<string, string | number>,
): string {
  return t(key, locale, params);
}
