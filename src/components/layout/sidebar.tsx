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
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "日報管理",
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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Logo Header */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200/50">
            <Truck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">日雇い管理システム</h1>
            <p className="text-sm text-gray-500">栄和清運株式会社</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-5 py-4 text-base font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200/50"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-amber-600"
                  )} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-5 w-5 text-white/80" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="mb-3 px-5 text-sm font-bold uppercase tracking-wider text-gray-400">
            マスタ管理
          </p>
          <div className="space-y-2">
            {masterNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-5 py-4 text-base font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200/50"
                      : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={cn(
                      "h-6 w-6",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-amber-600"
                    )} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-5 w-5 text-white/80" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center justify-between rounded-2xl px-5 py-4 text-base font-semibold transition-all duration-200",
            pathname === "/settings"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200/50"
              : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
          )}
        >
          <div className="flex items-center gap-4">
            <Settings className={cn(
              "h-6 w-6",
              pathname === "/settings" ? "text-white" : "text-gray-500 group-hover:text-amber-600"
            )} />
            <span>設定</span>
          </div>
          {pathname === "/settings" && (
            <ChevronRight className="h-5 w-5 text-white/80" />
          )}
        </Link>
      </div>
    </aside>
  );
}
