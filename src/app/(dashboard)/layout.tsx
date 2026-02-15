import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { getServerLocale, tServer } from "@/lib/i18n/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <AppShell
      user={{
        displayName,
        email: user?.email || "",
        avatarUrl,
      }}
    >
      {children}
    </AppShell>
  );
}
