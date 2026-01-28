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

// Mock data - will be replaced with actual data from DB
const stats = {
  draft: 23,
  total: 200,
  pending: 45,
  completed: 132,
  warnings: 5,
};

export default function DashboardPage() {
  return (
    <MainLayout title="ダッシュボード">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              { label: "確定済", value: "98件", color: "bg-emerald-100 text-emerald-700" },
              { label: "未確定", value: "34件", color: "bg-gray-100 text-gray-600" },
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
              { label: "承認待ち", value: "3件", color: "bg-amber-100 text-amber-700" },
              { label: "却下", value: "2件", color: "bg-rose-100 text-rose-700" },
            ]}
          />
        </div>

        {/* Widgets Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-5">
            {/* Pending Approvals */}
            <PendingApprovalsWidget />
            
            {/* Recent Reports */}
            <RecentReports />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-5">
            {/* Monthly Summary */}
            <MonthlySummaryWidget />
            
            {/* Calendar */}
            <CalendarWidget />
            
            {/* Company Breakdown */}
            <CompanyBreakdownWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
