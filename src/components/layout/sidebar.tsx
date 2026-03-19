"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  ChevronDown,
  ClipboardList,
  Shield,
  Banknote,
  FileBarChart,
  CalendarCheck,
  Clock,
  Briefcase,
  Receipt,
  BookOpen,
  Stamp,
  Landmark,
  UserCheck,
  Database,
  Route,
  Fuel,
  BarChart3,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  items: NavItem[];
}

const mainNavigation: NavItem[] = [
  {
    name: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
];

const navGroups: NavGroup[] = [
  {
    name: "勤怠・日報",
    icon: ClipboardList,
    items: [
      { name: "日報管理", href: "/daily-reports", icon: FileText },
      { name: "作業日誌", href: "/work-logs", icon: BookOpen },
      { name: "点呼簿", href: "/roll-calls", icon: UserCheck },
      { name: "運行実績", href: "/operation-records", icon: Route },
      { name: "週休スケジュール", href: "/weekly-schedule", icon: CalendarDays },
    ],
  },
  {
    name: "賃金計算",
    icon: Calculator,
    items: [
      { name: "一括計算", href: "/calculations", icon: Calculator },
      { name: "計算結果", href: "/results", icon: DollarSign },
      { name: "賃金台帳", href: "/wage-ledger", icon: BookOpen },
      { name: "残業計算", href: "/overtime", icon: Clock },
      { name: "週40h割増", href: "/weekly-overtime", icon: Clock },
    ],
  },
  {
    name: "支払・振込",
    icon: Banknote,
    items: [
      { name: "支払明細", href: "/payment-details", icon: Receipt },
      { name: "振込データ", href: "/transfers", icon: Banknote },
      { name: "金種表", href: "/denomination", icon: DollarSign },
      { name: "期間払い", href: "/period-payment", icon: CalendarCheck },
    ],
  },
  {
    name: "社保・印紙",
    icon: Stamp,
    items: [
      { name: "社保印紙管理", href: "/insurance-stamps", icon: Stamp },
      { name: "現金納付", href: "/cash-payment", icon: Banknote },
      { name: "印紙受払簿", href: "/stamp-ledger", icon: BookOpen },
      { name: "徴収台帳", href: "/collection-ledger", icon: FileBarChart },
    ],
  },
  {
    name: "税務",
    icon: Landmark,
    items: [
      { name: "源泉税", href: "/withholding-tax", icon: Landmark },
      { name: "住民税", href: "/resident-tax", icon: Landmark },
    ],
  },
  {
    name: "有給・労務",
    icon: CalendarCheck,
    items: [
      { name: "有給休暇管理", href: "/paid-leave", icon: CalendarCheck },
      { name: "アルバイト管理", href: "/part-time", icon: Users },
      { name: "仕訳データ", href: "/journal", icon: BookOpen },
    ],
  },
  {
    name: "帳票・出力",
    icon: FileBarChart,
    items: [
      { name: "帳票出力", href: "/reports", icon: FileBarChart },
      { name: "CSV出力", href: "/export", icon: Download },
      { name: "派遣先別処理", href: "/dispatch", icon: Briefcase },
      { name: "集計", href: "/aggregation", icon: FileBarChart },
      { name: "燃費集計", href: "/fuel-consumption", icon: Fuel },
      { name: "稼働状況分析", href: "/utilization-analysis", icon: BarChart3 },
    ],
  },
  {
    name: "マスタ管理",
    icon: Database,
    items: [
      { name: "従業員マスタ", href: "/master/workers", icon: Users },
      { name: "会社マスタ", href: "/master/companies", icon: Building2 },
      { name: "車種マスタ", href: "/master/vehicles", icon: Truck },
      { name: "賃金ルール", href: "/master/wage-rules", icon: DollarSign },
      { name: "料額表", href: "/master/rate-tables", icon: FileText },
      { name: "各種マスタ", href: "/master/general", icon: Database },
    ],
  },
  {
    name: "システム管理",
    icon: Shield,
    items: [
      { name: "設定", href: "/settings", icon: Settings },
      { name: "データ管理", href: "/data-management", icon: Database },
      { name: "データ移行", href: "/data-migration", icon: Download },
    ],
  },
];

function NavGroupItem({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const isGroupActive = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const [isOpen, setIsOpen] = useState(isGroupActive);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
          isGroupActive
            ? "text-slate-900"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-2.5">
          <group.icon className={cn(
            "h-4 w-4",
            isGroupActive ? "text-blue-600" : "text-slate-400"
          )} />
          <span>{group.name}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3">
          {group.items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                  isActive
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <item.icon className={cn(
                  "h-3.5 w-3.5",
                  isActive ? "text-blue-600" : "text-slate-400"
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/60 bg-white">
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">日雇い管理</h1>
          <p className="text-[11px] text-slate-400">栄和清運株式会社</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
        {/* Main Navigation */}
        <div className="space-y-0.5">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-600" : "text-slate-400"
                )} />
                <span>{item.name}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-blue-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Grouped Navigation */}
        <div className="mt-4 space-y-1">
          {navGroups.map((group) => (
            <NavGroupItem key={group.name} group={group} />
          ))}
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
