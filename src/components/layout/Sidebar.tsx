"use client";

import SidebarNavItem from "./SidebarNavItem";

const NAV_ITEMS = [
  { href: "/", icon: "grid_view", label: "Home" },
  { href: "/create", icon: "add_box", label: "Create Stage" },
  { href: "/history", icon: "history", label: "Practice History" },
  { href: "/profile", icon: "account_circle", label: "Profile" },
];

const CATEGORIES = [
  { label: "Auditoriums", active: true },
  { label: "Meeting Rooms", active: false },
  { label: "Concert Halls", active: false },
];

export default function Sidebar() {
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
              Virtual Practice
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Categories */}
        <div className="mt-10 px-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
            Categories
          </p>
          <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.label}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary cursor-pointer transition-colors"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${cat.active ? "bg-primary/40" : "bg-slate-400"}`}
                />
                {cat.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile Widget */}
      <div className="p-6 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-primary bg-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-300 text-xl">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">Guest User</p>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-sm">
                local_fire_department
              </span>
              <p className="text-[10px] font-bold text-slate-400">
                0 DAY STREAK
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
