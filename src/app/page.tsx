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

const stats = {
  draft: 23,
  total: 200,
  pending: 45,
  completed: 132,
  warnings: 5,
};

export default function DashboardPage() {
  return (
    <MainLayout title="ダッシュボード" subtitle="日雇い賃金管理システム">
      <div className="space-y-5">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="日報 未提出"
            description="本日分の日報をまだ提出していない作業員数"
            value={stats.draft}
            subValue={`${stats.total}名`}
            icon={FileText}
            variant="warning"
            trend={{ value: 12, isPositive: true }}
            progress={{ current: stats.draft, total: stats.total }}
          />
          <StatCard
            title="賃金 計算待ち"
            description="日報承認済みで賃金計算がまだ実行されていない件数"
            value={stats.pending}
            unit="件"
            icon={Calculator}
            variant="primary"
            trend={{ value: 8, isPositive: true }}
            progress={{ current: stats.pending, total: stats.total }}
          />
          <StatCard
            title="賃金 計算完了"
            description="当月の賃金計算処理が完了した件数"
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
            title="エラー・要確認"
            description="承認待ち・却下・警告など対応が必要な件数"
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
