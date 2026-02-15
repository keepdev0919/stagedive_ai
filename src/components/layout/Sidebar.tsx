"use client";

import { useLocale } from "@/lib/i18n/useLocale";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarUserProps {
  displayName: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarProps {
  user: SidebarUserProps;
}

const NAV_ITEMS: ReadonlyArray<{
  href: string;
  icon: string;
  labelKey: "nav.home" | "nav.create" | "nav.history" | "nav.profile";
}> = [
  { href: "/", icon: "grid_view", labelKey: "nav.home" },
  { href: "/create", icon: "add_box", labelKey: "nav.create" },
  { href: "/history", icon: "history", labelKey: "nav.history" },
  { href: "/profile", icon: "account_circle", labelKey: "nav.profile" },
];

const CATEGORIES: ReadonlyArray<{
  labelKey:
    | "sidebar.category.auditoriums"
    | "sidebar.category.meetingRooms"
    | "sidebar.category.concertHalls";
  active: boolean;
}> = [
  { labelKey: "sidebar.category.auditoriums", active: true },
  { labelKey: "sidebar.category.meetingRooms", active: false },
  { labelKey: "sidebar.category.concertHalls", active: false },
];

export default function Sidebar({ user }: SidebarProps) {
  const { t } = useLocale();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-panel border-r border-white/5 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              layers
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
              Stage-Dive
            </h1>
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase mt-1">
              {t("brand.tagline")}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={t(item.labelKey)}
            />
          ))}
        </nav>

        {/* Categories */}
        <div className="mt-10 px-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
            {t("sidebar.categories")}
          </p>
          <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.labelKey}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary cursor-pointer transition-colors"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${cat.active ? "bg-primary/40" : "bg-slate-400"}`}
                />
                {t(cat.labelKey)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile Widget */}
      <div className="p-6 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-primary bg-slate-700 flex items-center justify-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-slate-300 text-xl">
                person
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">
              {user.displayName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
