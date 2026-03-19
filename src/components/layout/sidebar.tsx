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
  ClipboardList,
  Shield,
  Banknote,
  FileBarChart,
  CalendarCheck,
  Briefcase,
  Stamp,
  Landmark,
  Database,
  BarChart3,
  X,
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
  { name: "設定", href: "/master/workers", icon: Settings, matchPrefixes: ["/master", "/settings", "/data-management", "/data-migration"] },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
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
        "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-slate-200/60 bg-white transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">日雇い管理</h1>
            <p className="text-[11px] text-slate-400">栄和清運株式会社</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-blue-600" : "text-slate-400"
                )} />
                <span>{item.name}</span>
                {active && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-blue-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-slate-500">
          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-700 truncate">管理者</p>
            <p className="text-[11px] text-slate-400 truncate">admin@eiwa.co.jp</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
