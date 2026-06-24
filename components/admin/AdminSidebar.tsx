"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Calendar, HardDrive, LogOut, Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getInitials, cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard",  marathi: "डॅशबोर्ड" },
  { href: "/admin/events",    icon: Calendar,        label: "Events",      marathi: "कार्यक्रम" },
  { href: "/admin/requests",  icon: Download,        label: "Requests",    marathi: "विनंत्या"  },
  { href: "/admin/storage",   icon: HardDrive,       label: "Storage",     marathi: "स्टोरेज"  },
];

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full bg-maroon-800 dark:bg-maroon-950">
      {/* Gold top stripe */}
      <div className="h-1 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500" />

      {/* Logo */}
      <div className="px-5 py-5 border-b border-maroon-700 dark:border-maroon-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="text-2xl">🪷</span>
          <div>
            <div className="font-cinzel text-gold-400 text-base font-bold leading-tight">WeddingSnaps</div>
            <div className="font-script text-gold-600 text-xs leading-tight">शुभ विवाह</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label, marathi }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                  : "text-maroon-200 hover:bg-maroon-700 hover:text-gold-400"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {active && <span className="ml-auto text-xs text-gold-500 font-script">{marathi}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-maroon-700">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-saffron-500 flex items-center justify-center text-maroon-900 text-sm font-bold shadow-gold flex-shrink-0">
            {getInitials(user.name || "A")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gold-300 truncate">{user.name}</p>
            <p className="text-xs text-maroon-400 truncate">{user.email}</p>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-maroon-300 hover:bg-red-900/30 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 shadow-maroon-lg">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-maroon-800 dark:bg-maroon-950 border-b border-maroon-700 px-4 py-3 flex items-center justify-between shadow-maroon">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪷</span>
          <span className="font-cinzel text-gold-400 text-base font-bold">WeddingSnaps</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg bg-maroon-700 flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 shadow-maroon-lg">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg bg-maroon-700 flex items-center justify-center">
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
