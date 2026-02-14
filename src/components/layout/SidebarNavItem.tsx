"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavItemProps {
  href: string;
  icon: string;
  label: string;
}

export default function SidebarNavItem({
  href,
  icon,
  label,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all group ${
        isActive
          ? "text-primary sidebar-item-active"
          : "text-slate-500 hover:text-primary hover:bg-primary/10"
      }`}
    >
      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span
        className={`text-sm tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </span>
    </Link>
  );
}
