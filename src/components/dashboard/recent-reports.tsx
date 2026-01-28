"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { AlertTriangle, ArrowRight, Calculator } from "lucide-react";

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
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          最近の計算結果
        </CardTitle>
        <Link href="/results">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
            すべて表示
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentReports.map((report) => (
            <Link
              key={report.id}
              href={`/results/${report.id}`}
              className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200">
                  <AvatarFallback className="text-gray-600 font-medium">
                    {report.workerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{report.workerName}</p>
                  <p className="text-xs text-gray-500">
                    {report.company} / {report.vehicleType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.hasWarning && (
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-xs font-medium">{report.warningMessage}</span>
                  </div>
                )}
                <p className="font-bold tabular-nums text-gray-900">
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
