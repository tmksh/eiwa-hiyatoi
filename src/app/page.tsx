"use client";

import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layout";
import {
  StatCard,
  RecentReports,
  PendingApprovalsWidget,
  MonthlySummaryWidget,
  CalendarWidget,
  MonthlyWageChartWidget,
  CompanyDonutChartWidget,
  DailyReportChartWidget,
} from "@/components/dashboard";
import {
  FileText,
  Calculator,
  CheckCircle,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const stats = {
  draft: 23,
  total: 200,
  pending: 45,
  completed: 132,
  warnings: 5,
};

type WidgetId =
  | "statCards"
  | "monthlyWageChart"
  | "pendingApprovals"
  | "recentReports"
  | "monthlySummary"
  | "companyDonut"
  | "dailyReportChart"
  | "calendar";

const WIDGET_DEFS: { id: WidgetId; label: string }[] = [
  { id: "statCards",        label: "統計カード（4枚）" },
  { id: "monthlyWageChart", label: "月別総支給額の推移" },
  { id: "pendingApprovals", label: "承認待ち日報" },
  { id: "recentReports",    label: "最近の計算結果" },
  { id: "monthlySummary",   label: "今月の支給サマリー" },
  { id: "companyDonut",     label: "会社別支給割合" },
  { id: "dailyReportChart", label: "今月の日別稼働件数" },
  { id: "calendar",         label: "カレンダー" },
];

const DEFAULT_VISIBILITY: Record<WidgetId, boolean> = {
  statCards: true,
  monthlyWageChart: true,
  pendingApprovals: true,
  recentReports: true,
  monthlySummary: true,
  companyDonut: true,
  dailyReportChart: true,
  calendar: true,
};

const STORAGE_KEY = "dashboard-widget-visibility";

function loadVisibility(): Record<WidgetId, boolean> {
  if (typeof window === "undefined") return { ...DEFAULT_VISIBILITY };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_VISIBILITY, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_VISIBILITY };
}

export default function DashboardPage() {
  const [visibility, setVisibility] = useState<Record<WidgetId, boolean>>(DEFAULT_VISIBILITY);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<Record<WidgetId, boolean>>(DEFAULT_VISIBILITY);

  useEffect(() => {
    const saved = loadVisibility();
    setVisibility(saved);
    setDraft(saved);
  }, []);

  const openDialog = useCallback(() => {
    setDraft({ ...visibility });
    setDialogOpen(true);
  }, [visibility]);

  const handleApply = useCallback(() => {
    setVisibility({ ...draft });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setDialogOpen(false);
  }, [draft]);

  const handleReset = useCallback(() => {
    setDraft({ ...DEFAULT_VISIBILITY });
  }, []);

  const show = (id: WidgetId) => visibility[id];

  const leftHasContent =
    show("monthlyWageChart") || show("pendingApprovals") || show("recentReports");
  const rightHasContent =
    show("monthlySummary") || show("companyDonut") || show("dailyReportChart") || show("calendar");

  return (
    <MainLayout
      title="ダッシュボード"
      subtitle="日雇い賃金管理システム"
    >
      <div className="space-y-4">
        {/* ウィジェット設定ボタン */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={openDialog}
            className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            ウィジェット設定
          </Button>
        </div>
        {/* Row 1: Stats */}
        {show("statCards") && (
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
        )}

        {/* Row 2+3: 統合グリッド */}
        {(leftHasContent || rightHasContent) && (
          <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
            {leftHasContent && (
              <div className="lg:col-span-2 flex flex-col gap-4">
                {show("monthlyWageChart") && <MonthlyWageChartWidget />}
                {show("pendingApprovals") && <PendingApprovalsWidget />}
                {show("recentReports") && <RecentReports />}
              </div>
            )}
            {rightHasContent && (
              <div className="flex flex-col gap-4">
                {show("monthlySummary") && <MonthlySummaryWidget />}
                {show("companyDonut") && <CompanyDonutChartWidget />}
                {show("dailyReportChart") && <DailyReportChartWidget />}
                {show("calendar") && <CalendarWidget />}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Widget Settings Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 shrink-0">
                  <SlidersHorizontal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-slate-900">
                    ウィジェット設定
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    表示するウィジェットを選択
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Widget list */}
          <div className="px-6 pb-4 space-y-2 max-h-[400px] overflow-y-auto">
            {WIDGET_DEFS.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 hover:bg-slate-100/60 hover:border-slate-200 transition-colors cursor-pointer"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, [widget.id]: !prev[widget.id] }))
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 shrink-0">
                    <Eye className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{widget.label}</span>
                </div>
                <Switch
                  checked={draft[widget.id]}
                  onCheckedChange={(checked) =>
                    setDraft((prev) => ({ ...prev, [widget.id]: checked }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              初期状態に戻す
            </button>
            <Button
              onClick={handleApply}
              className="bg-slate-800 hover:bg-slate-900 text-white gap-2 px-5"
            >
              <CheckCircle className="h-4 w-4" />
              完了
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
