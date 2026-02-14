"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-white/5">
      {/* Search */}
      <div className="relative w-full max-w-lg">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          type="text"
          placeholder="Search venues, locations or styles..."
          className="w-full bg-slate-panel border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-lg bg-slate-panel flex items-center justify-center text-slate-500 hover:text-primary transition-colors border border-white/5 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>
        <button className="w-10 h-10 rounded-lg bg-slate-panel flex items-center justify-center text-slate-500 hover:text-primary transition-colors border border-white/5">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-px bg-white/10 mx-2" />
        <Link
          href="/create"
          className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-base">
            rocket_launch
          </span>
          QUICK START
        </Link>
      </div>
    </header>
  );
}
