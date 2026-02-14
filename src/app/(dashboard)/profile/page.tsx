"use client";

export default function ProfilePage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
          Profile
        </h2>
        <p className="text-slate-400">Manage your account and preferences.</p>
      </div>

      <div className="glass rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-xl bg-slate-700 border-2 border-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              person
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Guest User</h3>
            <p className="text-sm text-slate-400">
              Sign in to save your progress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-slate-400 mt-1">Sessions</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-slate-400 mt-1">Stages</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">0 min</p>
            <p className="text-xs text-slate-400 mt-1">Total Practice</p>
          </div>
        </div>
      </div>
    </>
  );
}
