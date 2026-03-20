"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { AlertTriangle, ArrowRight, Calculator } from "lucide-react";

const recentReports = [
  {
    id: "1",
    workerName: "山田 太郎",
    company: "A運輸",
    vehicleType: "4t",
    totalWage: 15400,
    status: "calculated" as Status,
    hasWarning: true,
    warningMessage: "残業14時間超",
  },
  {
    id: "2",
    workerName: "鈴木 一郎",
    company: "A運輸",
    vehicleType: "2t",
    totalWage: 12800,
    status: "confirmed" as Status,
    hasWarning: false,
  },
  {
    id: "3",
    workerName: "佐藤 花子",
    company: "B物流",
    vehicleType: "10t",
    totalWage: 18500,
    status: "calculated" as Status,
    hasWarning: true,
    warningMessage: "手動調整あり",
  },
  {
    id: "4",
    workerName: "高橋 健二",
    company: "A運輸",
    vehicleType: "4t",
    totalWage: 11000,
    status: "approved" as Status,
    hasWarning: false,
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentReports() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
            <Calculator className="h-3.5 w-3.5 text-slate-600" />
          </div>
          最近の計算結果
        </CardTitle>
        <Link href="/results">
          <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 gap-1 h-7">
            すべて表示
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {recentReports.map((report) => (
            <Link
              key={report.id}
              href={`/results/${report.id}`}
              className="flex items-center justify-between rounded-xl p-2.5 transition-all duration-200 hover:bg-white/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                  {report.workerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.workerName}</p>
                  <p className="text-[11px] text-slate-400">
                    {report.company} / {report.vehicleType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {report.hasWarning && (
                  <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-[11px] font-medium">{report.warningMessage}</span>
                  </div>
                )}
                <p className="text-sm font-semibold tabular-nums text-slate-900">
                  {formatCurrency(report.totalWage)}
                </p>
                <StatusBadge status={report.status} />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
