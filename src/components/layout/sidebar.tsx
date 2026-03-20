"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calculator,
  Truck,
  Users,
  Settings,
  ChevronRight,
  ClipboardList,
  Banknote,
  FileBarChart,
  CalendarCheck,
  Stamp,
  Landmark,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  matchPrefixes?: string[];
}

const navigation: NavItem[] = [
  { name: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { name: "勤怠・日報", href: "/daily-reports", icon: ClipboardList, matchPrefixes: ["/daily-reports", "/work-logs", "/roll-calls", "/operation-records", "/weekly-schedule"] },
  { name: "賃金計算", href: "/calculations", icon: Calculator, matchPrefixes: ["/calculations", "/results", "/wage-ledger", "/overtime", "/weekly-overtime"] },
  { name: "支払・振込", href: "/payment-details", icon: Banknote, matchPrefixes: ["/payment-details", "/transfers", "/denomination", "/period-payment"] },
  { name: "社保・印紙", href: "/insurance-stamps", icon: Stamp, matchPrefixes: ["/insurance-stamps", "/cash-payment", "/stamp-ledger", "/collection-ledger"] },
  { name: "税務", href: "/withholding-tax", icon: Landmark, matchPrefixes: ["/withholding-tax", "/resident-tax"] },
  { name: "有給・労務", href: "/paid-leave", icon: CalendarCheck, matchPrefixes: ["/paid-leave", "/part-time", "/journal"] },
  { name: "帳票・出力", href: "/aggregation", icon: FileBarChart, matchPrefixes: ["/reports", "/export", "/dispatch", "/aggregation", "/fuel-consumption", "/utilization-analysis"] },
  { name: "設定", href: "/settings", icon: Settings, matchPrefixes: ["/settings", "/data-management", "/data-migration", "/master"] },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    if (item.matchPrefixes) {
      return item.matchPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col glass-sidebar transition-all duration-300",
        collapsed ? "w-14" : "w-64",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        "flex items-center border-b border-white/30 transition-all duration-300",
        collapsed ? "justify-center px-0 py-5" : "justify-between px-5 py-5"
      )}>
        {collapsed ? (
          <button
            onClick={onToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700/90 hover:bg-slate-600/90 transition-colors shadow-lg shadow-slate-400/20"
            title="メニューを展開"
          >
            <Truck className="h-5 w-5 text-white" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700/90 shadow-lg shadow-slate-400/20">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">日雇い管理</h1>
                <p className="text-[11px] text-slate-400">栄和清運株式会社</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 hidden lg:block"
              title="メニューを閉じる"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              title="メニューを閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 py-3">
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={!collapsed ? onClose : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-xl py-2.5 text-[15px] font-medium transition-all duration-200",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  active
                    ? "bg-slate-700/90 text-white shadow-md shadow-slate-400/20"
                    : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-white" : "text-slate-400"
                )} />
                {!collapsed && (
                  <>
                    <span>{item.name}</span>
                    {active && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/70" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/30 px-2 py-3">
        <div className={cn(
          "flex items-center rounded-xl py-2 text-[13px] text-slate-500",
          collapsed ? "justify-center px-0" : "gap-2.5 px-3"
        )}>
          <div className="h-7 w-7 shrink-0 rounded-full bg-slate-600/10 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-slate-500" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-slate-700 truncate">管理者</p>
              <p className="text-[11px] text-slate-400 truncate">admin@eiwa.co.jp</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
