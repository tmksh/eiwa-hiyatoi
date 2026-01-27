"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Building2,
  Truck,
  DollarSign,
  Users,
  Download,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "日報入力",
    href: "/daily-reports",
    icon: FileText,
  },
  {
    name: "一括計算",
    href: "/calculations",
    icon: Calculator,
  },
  {
    name: "計算結果",
    href: "/results",
    icon: DollarSign,
  },
  {
    name: "CSV出力",
    href: "/export",
    icon: Download,
  },
];

const masterNavigation = [
  {
    name: "会社マスタ",
    href: "/master/companies",
    icon: Building2,
  },
  {
    name: "車種マスタ",
    href: "/master/vehicles",
    icon: Truck,
  },
  {
    name: "賃金ルール",
    href: "/master/wage-rules",
    icon: DollarSign,
  },
  {
    name: "作業員マスタ",
    href: "/master/workers",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          永
        </div>
        <span className="font-semibold text-lg">日雇い管理</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="pt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            マスタ管理
          </p>
          <div className="space-y-1">
            {masterNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          設定
        </Link>
      </div>
    </aside>
  );
}
