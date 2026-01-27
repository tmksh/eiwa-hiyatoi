"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { AlertTriangle, ArrowRight } from "lucide-react";

// Mock data - will be replaced with actual data
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
    status: "draft" as Status,
    hasWarning: false,
  },
  {
    id: "5",
    workerName: "田中 美咲",
    company: "C配送",
    vehicleType: "2t",
    totalWage: 13600,
    status: "confirmed" as Status,
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">最近の計算結果</CardTitle>
        <Link href="/results">
          <Button variant="ghost" size="sm" className="gap-1">
            すべて表示
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <Link
              key={report.id}
              href={`/results/${report.id}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{report.workerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.company} / {report.vehicleType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.hasWarning && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">{report.warningMessage}</span>
                  </div>
                )}
                <p className="font-semibold tabular-nums">
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
