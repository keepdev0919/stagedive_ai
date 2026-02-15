"use client";

import { useEffect, useMemo, useState } from "react";
import { t, type Locale, type TranslationKey } from "./translations";

const LOCALE_STORAGE_KEY = "stagedive_locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return raw === "en" || raw === "ko" ? raw : null;
}

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "ko";
  }

  const candidates = [
    navigator.language,
    ...(window.navigator.languages || []),
  ].filter(Boolean);

  return candidates.some((lang) => lang.toLowerCase().startsWith("ko"))
    ? "ko"
    : "en";
}

function getInitialLocale(): Locale {
  return readStoredLocale() ?? detectBrowserLocale();
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    const browser = detectBrowserLocale();

    if (stored) {
      setLocale(stored);
      return;
    }

    if (locale !== browser) {
      setLocale(browser);
    }
  }, []);

  const translate = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, string | number>) =>
      t(key, locale, params);
  }, [locale]);

  const setLocaleAndPersist = (next: Locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
    setLocale(next);
  };

  return { locale, setLocale: setLocaleAndPersist, t: translate };
}
