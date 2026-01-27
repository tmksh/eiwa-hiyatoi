import { MainLayout } from "@/components/layout";
import { StatCard, QuickActions, RecentReports } from "@/components/dashboard";
import { FileText, Calculator, CheckCircle, AlertTriangle } from "lucide-react";

// Mock data - will be replaced with actual data from DB
const stats = {
  draft: 23,
  pending: 45,
  completed: 132,
  warnings: 5,
};

export default function DashboardPage() {
  return (
    <MainLayout title="ダッシュボード">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="未入力"
            value={stats.draft}
            icon={FileText}
            description="本日の日報未入力"
            variant="warning"
          />
          <StatCard
            title="計算待ち"
            value={stats.pending}
            icon={Calculator}
            description="計算処理待ち"
            variant="primary"
          />
          <StatCard
            title="完了"
            value={stats.completed}
            icon={CheckCircle}
            description="本日計算完了"
            variant="success"
          />
          <StatCard
            title="要確認"
            value={stats.warnings}
            icon={AlertTriangle}
            description="確認が必要な項目"
            variant="error"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Reports */}
        <RecentReports />
      </div>
    </MainLayout>
  );
}
