"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Users, Clock } from "lucide-react";

const monthlySummary = {
  totalWage: 4850000,
  totalWorkers: 187,
  totalHours: 3420,
  avgWagePerPerson: 25936,
  lastMonth: 4620000,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function MonthlySummaryWidget() {
  const percentChange = ((monthlySummary.totalWage - monthlySummary.lastMonth) / monthlySummary.lastMonth * 100).toFixed(1);
  const isPositive = monthlySummary.totalWage >= monthlySummary.lastMonth;

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
            <Wallet className="h-3.5 w-3.5 text-blue-600" />
          </div>
          今月の支給サマリー
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Total Wage */}
        <div className="p-3 rounded-xl bg-white/40 border border-white/30">
          <p className="text-[11px] text-slate-500 font-medium mb-0.5">総支給額</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">¥{formatCurrency(monthlySummary.totalWage)}</span>
            <div className={`flex items-center gap-0.5 text-[11px] font-medium ${isPositive ? 'text-blue-600' : 'text-slate-500'}`}>
              <TrendingUp className="h-3 w-3" />
              {isPositive ? '+' : ''}{percentChange}%
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-white/30 border border-white/30">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Users className="h-3 w-3" />
              <span className="text-[10px]">出勤者</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{monthlySummary.totalWorkers}<span className="text-[11px] text-slate-400 ml-0.5">名</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/30 border border-white/30">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Clock className="h-3 w-3" />
              <span className="text-[10px]">総時間</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(monthlySummary.totalHours)}<span className="text-[11px] text-slate-400 ml-0.5">h</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/30 border border-white/30">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Wallet className="h-3 w-3" />
              <span className="text-[10px]">平均</span>
            </div>
            <p className="text-lg font-bold text-slate-900">¥{formatCurrency(monthlySummary.avgWagePerPerson)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
