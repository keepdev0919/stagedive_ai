import { createClient } from "@/lib/supabase/server";
import { getServerLocale, tServer } from "@/lib/i18n/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const locale = await getServerLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    tServer("user.guest", locale);
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
          {tServer("profile.title", locale)}
        </h2>
        <p className="text-slate-400">
          {tServer("profile.subtitle", locale)}
        </p>
      </div>

      <div className="glass rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-xl bg-slate-700 border-2 border-primary flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-4xl text-slate-300">
                person
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{displayName}</h3>
            <p className="text-sm text-slate-400">
              {user?.email || tServer("profile.signInPrompt", locale)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-slate-400 mt-1">
              {tServer("profile.stats.sessions", locale)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-slate-400 mt-1">
              {tServer("profile.stats.stages", locale)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {tServer("profile.stats.totalPracticeValue", locale, { minutes: 0 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {tServer("profile.stats.totalPractice", locale)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
