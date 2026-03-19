"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Truck, Users, Clock, Download, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const vehicleUtilization = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", workDays: 20, totalDays: 22, hours: 185.5, maxHours: 220, trips: 42 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", workDays: 22, totalDays: 22, hours: 220.0, maxHours: 220, trips: 65 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t", workDays: 18, totalDays: 22, hours: 144.0, maxHours: 220, trips: 25 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t", workDays: 19, totalDays: 22, hours: 171.0, maxHours: 220, trips: 38 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", workDays: 21, totalDays: 22, hours: 210.0, maxHours: 220, trips: 60 },
  { vehicleNumber: "品川 400 か 1111", vehicleType: "4t", workDays: 15, totalDays: 22, hours: 120.0, maxHours: 220, trips: 28 },
  { vehicleNumber: "品川 500 き 2222", vehicleType: "2t", workDays: 10, totalDays: 22, hours: 80.0, maxHours: 220, trips: 15 },
];

const driverUtilization = [
  { name: "山田 太郎", employeeNo: "E001", workDays: 22, totalDays: 22, hours: 198.0, trips: 45, overtime: 18.0 },
  { name: "鈴木 一郎", employeeNo: "E002", workDays: 21, totalDays: 22, hours: 195.5, trips: 63, overtime: 15.5 },
  { name: "佐藤 花子", employeeNo: "E003", workDays: 20, totalDays: 22, hours: 160.0, trips: 25, overtime: 0 },
  { name: "高橋 健二", employeeNo: "E004", workDays: 21, totalDays: 22, hours: 189.0, trips: 42, overtime: 9.0 },
  { name: "田中 次郎", employeeNo: "E005", workDays: 18, totalDays: 22, hours: 162.0, trips: 36, overtime: 12.0 },
  { name: "渡辺 三郎", employeeNo: "E006", workDays: 22, totalDays: 22, hours: 215.5, trips: 55, overtime: 35.5 },
  { name: "伊藤 四郎", employeeNo: "E007", workDays: 17, totalDays: 22, hours: 136.0, trips: 20, overtime: 0 },
  { name: "中村 五郎", employeeNo: "E008", workDays: 19, totalDays: 22, hours: 171.0, trips: 30, overtime: 11.0 },
];

const monthlyTrend = [
  { month: "2025年10月", vehicleRate: 82, driverRate: 88, avgTrips: 38 },
  { month: "2025年11月", vehicleRate: 85, driverRate: 90, avgTrips: 40 },
  { month: "2025年12月", vehicleRate: 78, driverRate: 82, avgTrips: 35 },
  { month: "2026年01月", vehicleRate: 80, driverRate: 85, avgTrips: 36 },
  { month: "2026年02月", vehicleRate: 88, driverRate: 92, avgTrips: 42 },
  { month: "2026年03月", vehicleRate: 84, driverRate: 89, avgTrips: 39 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value);
}

export default function UtilizationAnalysisPage() {
  const [tab, setTab] = useState<"vehicles" | "drivers" | "trend">("vehicles");

  const avgVehicleRate = vehicleUtilization.reduce((sum, v) => sum + (v.workDays / v.totalDays) * 100, 0) / vehicleUtilization.length;
  const avgDriverRate = driverUtilization.reduce((sum, d) => sum + (d.workDays / d.totalDays) * 100, 0) / driverUtilization.length;
  const totalTrips = driverUtilization.reduce((sum, d) => sum + d.trips, 0);
  const totalOvertime = driverUtilization.reduce((sum, d) => sum + d.overtime, 0);

  return (
    <MainLayout title="稼働状況分析" subtitle="車両・従業員の稼働率分析・月次トレンド">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Truck className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">車両稼働率</p>
                  <p className="text-2xl font-bold text-slate-900">{avgVehicleRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">従業員稼働率</p>
                  <p className="text-2xl font-bold text-slate-900">{avgDriverRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">今月の総便数</p>
                  <p className="text-2xl font-bold text-slate-900">{totalTrips}<span className="text-sm text-slate-400 ml-0.5">便</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">総残業時間</p>
                  <p className="text-2xl font-bold text-slate-900">{formatNumber(totalOvertime)}<span className="text-sm text-slate-400 ml-0.5">h</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setTab("vehicles")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "vehicles" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              車両別
            </button>
            <button
              onClick={() => setTab("drivers")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "drivers" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              従業員別
            </button>
            <button
              onClick={() => setTab("trend")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "trend" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              月次推移
            </button>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
            <Download className="h-3.5 w-3.5" />
            CSV出力
          </Button>
        </div>

        {/* Vehicle Utilization */}
        {tab === "vehicles" && (
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">車両別稼働状況（今月）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車両番号</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車種</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">稼働日数</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">稼働率</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">稼働時間</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">便数</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs w-32">稼働率バー</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleUtilization.map((v) => {
                      const rate = (v.workDays / v.totalDays) * 100;
                      return (
                        <tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 text-xs font-medium text-slate-700">{v.vehicleNumber}</td>
                          <td className="py-3">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span>
                          </td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{v.workDays} / {v.totalDays}</td>
                          <td className="py-3 text-right tabular-nums font-medium text-slate-900">{rate.toFixed(1)}%</td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{formatNumber(v.hours)} h</td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{v.trips}</td>
                          <td className="py-3">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Driver Utilization */}
        {tab === "drivers" && (
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">従業員別稼働状況（今月）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">社員No</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">氏名</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">出勤日数</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">稼働率</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">労働時間</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">便数</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">残業時間</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs w-32">稼働率バー</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverUtilization.map((d) => {
                      const rate = (d.workDays / d.totalDays) * 100;
                      return (
                        <tr key={d.employeeNo} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 text-xs text-slate-400">{d.employeeNo}</td>
                          <td className="py-3 font-medium text-slate-900">{d.name}</td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{d.workDays} / {d.totalDays}</td>
                          <td className="py-3 text-right tabular-nums font-medium text-slate-900">{rate.toFixed(1)}%</td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{formatNumber(d.hours)} h</td>
                          <td className="py-3 text-right tabular-nums text-slate-700">{d.trips}</td>
                          <td className="py-3 text-right tabular-nums text-slate-600">
                            {d.overtime > 0 ? `${formatNumber(d.overtime)} h` : "-"}
                          </td>
                          <td className="py-3">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Trend */}
        {tab === "trend" && (
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                </div>
                月次稼働率推移
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrend.map((m) => (
                  <div key={m.month} className="rounded-lg border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-900">{m.month}</span>
                      <span className="text-xs text-slate-400">平均{m.avgTrips}便/人</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20">車両稼働率</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-slate-400" style={{ width: `${m.vehicleRate}%` }} />
                        </div>
                        <span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.vehicleRate}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20">従業員稼働率</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-400" style={{ width: `${m.driverRate}%` }} />
                        </div>
                        <span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.driverRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
