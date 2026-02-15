import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

interface SidebarUserProps {
  displayName: string;
  email: string;
  avatarUrl?: string;
}

interface AppShellComponentProps extends AppShellProps {
  user: SidebarUserProps;
}

export default function AppShell({
  children,
  user,
}: AppShellComponentProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col bg-bg-dark overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
