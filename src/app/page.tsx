import { MainLayout } from "@/components/layout";
import {
  StatCard,
  RecentReports,
  PendingApprovalsWidget,
  MonthlySummaryWidget,
  CalendarWidget,
  CompanyBreakdownWidget,
} from "@/components/dashboard";
import { FileText, Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const stats = {
  draft: 23,
  total: 200,
  pending: 45,
  completed: 132,
  warnings: 5,
};

const quickActions = [
  { name: "日報入力", href: "/daily-reports/new", icon: FileText, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { name: "一括計算", href: "/calculations", icon: Calculator, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
  { name: "計算結果", href: "/results", icon: CheckCircle, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { name: "賃金台帳", href: "/wage-ledger", icon: FileText, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
];

export default function DashboardPage() {
  return (
    <MainLayout title="ダッシュボード" subtitle="日雇い賃金管理システム">
      <div className="space-y-5">
        {/* Quick Actions */}
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${action.color}`}
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.name}
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="未入力"
            value={stats.draft}
            subValue={`${stats.total}名`}
            icon={FileText}
            variant="warning"
            trend={{ value: 12, isPositive: true }}
            progress={{ current: stats.draft, total: stats.total }}
          />
          <StatCard
            title="計算待ち"
            value={stats.pending}
            unit="件"
            icon={Calculator}
            variant="primary"
            trend={{ value: 8, isPositive: true }}
            progress={{ current: stats.pending, total: stats.total }}
          />
          <StatCard
            title="計算完了"
            value={stats.completed}
            unit="件"
            icon={CheckCircle}
            variant="success"
            trend={{ value: 5, isPositive: false }}
            tags={[
              { label: "確定済", value: "98件", color: "bg-blue-50 text-blue-700" },
              { label: "未確定", value: "34件", color: "bg-slate-100 text-slate-600" },
            ]}
          />
          <StatCard
            title="要確認"
            value={stats.warnings}
            unit="件"
            icon={AlertTriangle}
            variant="error"
            badge={{ text: "要対応", variant: "error" }}
            tags={[
              { label: "承認待ち", value: "3件", color: "bg-blue-50 text-blue-700" },
              { label: "却下", value: "2件", color: "bg-slate-200 text-slate-700" },
            ]}
          />
        </div>

        {/* Widgets Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <PendingApprovalsWidget />
            <RecentReports />
          </div>

          <div className="space-y-4">
            <MonthlySummaryWidget />
            <CalendarWidget />
            <CompanyBreakdownWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
