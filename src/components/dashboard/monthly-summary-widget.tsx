"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Users, Clock } from "lucide-react";

// Mock data
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
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          今月の支給サマリー
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Wage */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
          <p className="text-sm text-emerald-600 font-medium mb-1">総支給額</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">¥{formatCurrency(monthlySummary.totalWage)}</span>
            <div className={`flex items-center gap-0.5 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
              <TrendingUp className="h-4 w-4" />
              {isPositive ? '+' : ''}{percentChange}%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">前月比 ¥{formatCurrency(monthlySummary.totalWage - monthlySummary.lastMonth)}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">出勤者数</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{monthlySummary.totalWorkers}<span className="text-sm text-gray-400 ml-0.5">名</span></p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">総労働時間</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(monthlySummary.totalHours)}<span className="text-sm text-gray-400 ml-0.5">h</span></p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs">平均支給</span>
            </div>
            <p className="text-xl font-bold text-gray-900">¥{formatCurrency(monthlySummary.avgWagePerPerson)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

