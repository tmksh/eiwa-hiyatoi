"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Download,
  BarChart3,
  Users,
  Calendar,
  TruckIcon,
  Filter,
  Building2,
  Banknote,
  Fuel,
  Truck,
  TrendingUp,
  Plus,
  Clock,
  FileText,
  FileDown,
} from "lucide-react";

const TABS = ["集計", "派遣先別", "帳票出力", "CSV出力", "燃費集計", "稼働分析"] as const;
type Tab = (typeof TABS)[number];

type AggView = "personal" | "period" | "vehicle";

const personalData = [
  { name: "山田 太郎", jan: 285000, feb: 292000, mar: 278000, total: 855000 },
  { name: "鈴木 一郎", jan: 245000, feb: 251000, mar: 240000, total: 736000 },
  { name: "佐藤 花子", jan: 320000, feb: 318000, mar: 325000, total: 963000 },
  { name: "高橋 健二", jan: 268000, feb: 275000, mar: 262000, total: 805000 },
  { name: "田中 美咲", jan: 198000, feb: 205000, mar: 195000, total: 598000 },
];

const vehicleData = [
  { type: "2t", count: 8, days: 168, revenue: 2352000, avgDaily: 14000 },
  { type: "4t", count: 12, days: 252, revenue: 4032000, avgDaily: 16000 },
  { type: "10t", count: 5, days: 105, revenue: 1785000, avgDaily: 17000 },
  { type: "トレーラー", count: 3, days: 63, revenue: 1197000, avgDaily: 19000 },
];

const mockDispatchData = [
  { id: 1, destination: "一産廃", workerCount: 8, workDays: 176, totalWage: 2816000, avgDailyRate: 16000, month: "2024/01" },
  { id: 2, destination: "区有施設", workerCount: 5, workDays: 105, totalWage: 1522500, avgDailyRate: 14500, month: "2024/01" },
  { id: 3, destination: "局集", workerCount: 12, workDays: 252, totalWage: 3780000, avgDailyRate: 15000, month: "2024/01" },
  { id: 4, destination: "民間A社", workerCount: 3, workDays: 63, totalWage: 882000, avgDailyRate: 14000, month: "2024/01" },
  { id: 5, destination: "民間B社", workerCount: 4, workDays: 84, totalWage: 1260000, avgDailyRate: 15000, month: "2024/01" },
];

const mockWorkerDetail = [
  { name: "山田 太郎", destination: "一産廃", vehicleType: "4t", days: 22, dailyRate: 16000, total: 352000 },
  { name: "鈴木 一郎", destination: "一産廃", vehicleType: "2t", days: 22, dailyRate: 15000, total: 330000 },
  { name: "佐藤 花子", destination: "局集", vehicleType: "10t", days: 21, dailyRate: 17000, total: 357000 },
  { name: "高橋 健二", destination: "区有施設", vehicleType: "4t", days: 21, dailyRate: 14500, total: 304500 },
  { name: "田中 美咲", destination: "局集", vehicleType: "2t", days: 20, dailyRate: 14000, total: 280000 },
];

const fuelRecords = [
  { id: "1", date: "2026-03-19", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 128.5, fuelAmount: 32.1, fuelEfficiency: 4.0, cost: 5136, station: "出光 川崎SS" },
  { id: "2", date: "2026-03-19", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 186.3, fuelAmount: 62.1, fuelEfficiency: 3.0, cost: 9936, station: "ENEOS 品川SS" },
  { id: "3", date: "2026-03-18", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "佐藤 花子", distance: 85.2, fuelAmount: 14.2, fuelEfficiency: 6.0, cost: 2272, station: "出光 川崎SS" },
  { id: "4", date: "2026-03-18", vehicleNumber: "品川 100 え 3456", vehicleType: "4t", driver: "高橋 健二", distance: 145.0, fuelAmount: 36.3, fuelEfficiency: 4.0, cost: 5808, station: "ENEOS 横浜SS" },
  { id: "5", date: "2026-03-17", vehicleNumber: "品川 200 お 7890", vehicleType: "10t", driver: "田中 次郎", distance: 210.5, fuelAmount: 70.2, fuelEfficiency: 3.0, cost: 11232, station: "コスモ 東京SS" },
  { id: "6", date: "2026-03-17", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 98.3, fuelAmount: 24.6, fuelEfficiency: 4.0, cost: 3936, station: "出光 川崎SS" },
  { id: "7", date: "2026-03-16", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "渡辺 三郎", distance: 72.1, fuelAmount: 12.0, fuelEfficiency: 6.0, cost: 1920, station: "ENEOS 品川SS" },
  { id: "8", date: "2026-03-16", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 195.8, fuelAmount: 65.3, fuelEfficiency: 3.0, cost: 10448, station: "コスモ 東京SS" },
];

const vehicleSummary = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", totalDistance: 1850.2, totalFuel: 462.6, avgEfficiency: 4.0, totalCost: 74016 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", totalDistance: 3120.5, totalFuel: 1040.2, avgEfficiency: 3.0, totalCost: 166432 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t", totalDistance: 1280.0, totalFuel: 213.3, avgEfficiency: 6.0, totalCost: 34128 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t", totalDistance: 1920.8, totalFuel: 480.2, avgEfficiency: 4.0, totalCost: 76832 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", totalDistance: 2850.3, totalFuel: 950.1, avgEfficiency: 3.0, totalCost: 152016 },
];

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
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(value);
}

export default function AggregationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("集計");

  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<AggView>("personal");

  const [dispatchSearch, setDispatchSearch] = useState("");
  const [dispatchView, setDispatchView] = useState<"summary" | "detail">("summary");

  const [fuelSubTab, setFuelSubTab] = useState<"records" | "vehicles">("records");
  const [analysisSub, setAnalysisSub] = useState<"vehicles" | "drivers" | "trend">("vehicles");

  const filteredDispatchSummary = mockDispatchData.filter((d) => d.destination.includes(dispatchSearch));
  const filteredDispatchDetail = mockWorkerDetail.filter((d) => d.name.includes(dispatchSearch) || d.destination.includes(dispatchSearch));
  const dispatchTotalWage = mockDispatchData.reduce((acc, d) => acc + d.totalWage, 0);
  const dispatchTotalWorkers = mockDispatchData.reduce((acc, d) => acc + d.workerCount, 0);

  const totalFuel = fuelRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
  const totalCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalDistance = fuelRecords.reduce((sum, r) => sum + r.distance, 0);
  const avgEfficiency = totalDistance / totalFuel;

  const avgVehicleRate = vehicleUtilization.reduce((sum, v) => sum + (v.workDays / v.totalDays) * 100, 0) / vehicleUtilization.length;
  const avgDriverRate = driverUtilization.reduce((sum, d) => sum + (d.workDays / d.totalDays) * 100, 0) / driverUtilization.length;
  const totalTrips = driverUtilization.reduce((sum, d) => sum + d.trips, 0);
  const totalOvertime = driverUtilization.reduce((sum, d) => sum + d.overtime, 0);

  return (
    <MainLayout title="帳票・出力">
      <div className="space-y-6">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 集計 Tab */}
        {activeTab === "集計" && (
          <>
            <div>
              <p className="text-sm text-slate-500">個人別月別・指定期間別・車種別集計</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">対象人数</p>
                    <p className="text-2xl font-semibold text-slate-900">5名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">期間合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥3,957,000</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calendar className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">集計期間</p>
                    <p className="text-lg font-semibold text-slate-900">2024/01〜03</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setView("personal")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "personal" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Users className="h-3.5 w-3.5" />
                  個人別月別
                </button>
                <button
                  onClick={() => setView("period")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "period" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  期間別
                </button>
                <button
                  onClick={() => setView("vehicle")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "vehicle" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <TruckIcon className="h-3.5 w-3.5" />
                  車種別
                </button>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                期間指定
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>

            {view === "personal" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">1月</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">2月</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">3月</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {personalData.filter((d) => d.name.includes(searchQuery)).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.jan.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.feb.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.mar.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === "period" && (
              <div className="rounded-xl border border-slate-200/60 bg-white p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-lg bg-blue-50 p-3 mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900">指定期間別集計</h3>
                  <p className="mt-2 text-sm text-slate-500 max-w-md">
                    開始日と終了日を指定して、期間内の賃金・保険料を集計します。上部の「期間指定」ボタンから期間を選択してください。
                  </p>
                </div>
              </div>
            )}

            {view === "vehicle" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">車種</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">配置人数</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">延べ日数</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">平均日当</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">売上合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vehicleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.type}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.count}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.days}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.avgDaily.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* 派遣先別 Tab */}
        {activeTab === "派遣先別" && (
          <>
            <div>
              <p className="text-sm text-slate-500">一産廃・区有施設・局集等の派遣先別賃金処理</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">派遣先数</p>
                    <p className="text-2xl font-semibold text-slate-900">{mockDispatchData.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">配置人数</p>
                    <p className="text-2xl font-semibold text-slate-900">{dispatchTotalWorkers}名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">総稼働日数</p>
                    <p className="text-2xl font-semibold text-slate-900">680日</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Banknote className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">賃金総額</p>
                    <p className="text-2xl font-semibold text-slate-900">¥{(dispatchTotalWage / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="派遣先・氏名で検索..."
                  value={dispatchSearch}
                  onChange={(e) => setDispatchSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setDispatchView("summary")}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView === "summary" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  派遣先別
                </button>
                <button
                  onClick={() => setDispatchView("detail")}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView === "detail" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  個人別
                </button>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                期間選択
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>

            {dispatchView === "summary" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">派遣先</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">人数</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">延べ日数</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">平均日当</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">賃金合計</th>
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDispatchSummary.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.destination}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workerCount}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.avgDailyRate.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.totalWage.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dispatchView === "detail" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">派遣先</th>
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">車種</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日数</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日当</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDispatchDetail.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.destination}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.vehicleType}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.days}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.dailyRate.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="text-sm text-slate-500">
              全 {dispatchView === "summary" ? filteredDispatchSummary.length : filteredDispatchDetail.length} 件
            </div>
          </>
        )}

        {/* 帳票出力 Tab */}
        {activeTab === "帳票出力" && (
          <>
            <div className="rounded-xl border border-slate-200/60 bg-white p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-lg bg-blue-50 p-3 mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">帳票出力</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                  帳票テンプレートから各種帳票を出力します
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    PDF出力
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Excel出力
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CSV出力 Tab */}
        {activeTab === "CSV出力" && (
          <>
            <div className="rounded-xl border border-slate-200/60 bg-white p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-lg bg-slate-100 p-3 mb-4">
                  <FileDown className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">CSV出力</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                  各種データをCSV形式で出力します
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" />
                    賃金データ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" />
                    勤怠データ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" />
                    派遣先別データ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" />
                    車両データ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" />
                    燃費データ
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 燃費集計 Tab */}
        {activeTab === "燃費集計" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><Fuel className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">今月の燃料使用量</p><p className="text-2xl font-bold text-slate-900">{totalFuel.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">L</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">平均燃費</p><p className="text-2xl font-bold text-slate-900">{avgEfficiency.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">km/L</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><Truck className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">総走行距離</p><p className="text-2xl font-bold text-slate-900">{formatCurrency(Math.round(totalDistance))}<span className="text-sm text-slate-400 ml-0.5">km</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><Fuel className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">燃料費合計</p><p className="text-2xl font-bold text-slate-900">¥{formatCurrency(totalCost)}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {(["records", "vehicles"] as const).map((t) => (
                  <button key={t} onClick={() => setFuelSubTab(t)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", fuelSubTab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                    {t === "records" ? "給油記録" : "車両別集計"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200"><Download className="h-3.5 w-3.5" />CSV出力</Button>
                <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white"><Plus className="h-3.5 w-3.5" />給油記録追加</Button>
              </div>
            </div>

            {fuelSubTab === "records" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["日付","車両番号","車種","ドライバー","走行距離","給油量","燃費","金額","給油所"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fuelRecords.map((record) => (
                          <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{record.date}</td>
                            <td className="px-3 sm:px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{record.vehicleNumber}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{record.vehicleType}</span></td>
                            <td className="px-3 sm:px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{record.driver}</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{record.distance} km</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{record.fuelAmount} L</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{record.fuelEfficiency.toFixed(1)} km/L</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">¥{formatCurrency(record.cost)}</td>
                            <td className="px-3 sm:px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{record.station}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-slate-200">
                          <td colSpan={4} className="px-3 sm:px-4 py-3 text-sm font-medium text-slate-700">合計</td>
                          <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-bold text-slate-900 whitespace-nowrap">{totalDistance.toFixed(1)} km</td>
                          <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-bold text-slate-900 whitespace-nowrap">{totalFuel.toFixed(1)} L</td>
                          <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-600 whitespace-nowrap">{avgEfficiency.toFixed(1)} km/L</td>
                          <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-bold text-slate-900 whitespace-nowrap">¥{formatCurrency(totalCost)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {fuelSubTab === "vehicles" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">車両別燃費集計（今月）</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["車両番号","車種","総走行距離","総燃料量","平均燃費","燃料費","燃費効率"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleSummary.map((v) => (
                          <tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-3 sm:px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{v.vehicleNumber}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span></td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatCurrency(Math.round(v.totalDistance))} km</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{formatCurrency(Math.round(v.totalFuel))} L</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.avgEfficiency.toFixed(1)} km/L</td>
                            <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">¥{formatCurrency(v.totalCost)}</td>
                            <td className="px-3 sm:px-4 py-3">
                              <div className="flex items-center justify-center">
                                <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min((v.avgEfficiency / 7) * 100, 100)}%` }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* 稼働分析 Tab */}
        {activeTab === "稼働分析" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><Truck className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">車両稼働率</p><p className="text-2xl font-bold text-slate-900">{avgVehicleRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">従業員稼働率</p><p className="text-2xl font-bold text-slate-900">{avgDriverRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><BarChart3 className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">今月の総便数</p><p className="text-2xl font-bold text-slate-900">{totalTrips}<span className="text-sm text-slate-400 ml-0.5">便</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><Clock className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">総残業時間</p><p className="text-2xl font-bold text-slate-900">{formatNumber(totalOvertime)}<span className="text-sm text-slate-400 ml-0.5">h</span></p></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {(["vehicles", "drivers", "trend"] as const).map((t) => (
                  <button key={t} onClick={() => setAnalysisSub(t)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", analysisSub === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                    {t === "vehicles" ? "車両別" : t === "drivers" ? "従業員別" : "月次推移"}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200"><Download className="h-3.5 w-3.5" />CSV出力</Button>
            </div>

            {analysisSub === "vehicles" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">車両別稼働状況（今月）</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["車両番号","車種","稼働日数","稼働率","稼働時間","便数","稼働率バー"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleUtilization.map((v) => {
                          const rate = (v.workDays / v.totalDays) * 100;
                          return (
                            <tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-3 sm:px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{v.vehicleNumber}</td>
                              <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span></td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.workDays} / {v.totalDays}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatNumber(v.hours)} h</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.trips}</td>
                              <td className="px-3 sm:px-4 py-3">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")} style={{ width: `${rate}%` }} />
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

            {analysisSub === "drivers" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">従業員別稼働状況（今月）</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["社員No","氏名","出勤日数","稼働率","労働時間","便数","残業時間","稼働率バー"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {driverUtilization.map((d) => {
                          const rate = (d.workDays / d.totalDays) * 100;
                          return (
                            <tr key={d.employeeNo} className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-3 sm:px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{d.employeeNo}</td>
                              <td className="px-3 sm:px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{d.name}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.workDays} / {d.totalDays}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatNumber(d.hours)} h</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.trips}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{d.overtime > 0 ? `${formatNumber(d.overtime)} h` : "-"}</td>
                              <td className="px-3 sm:px-4 py-3">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")} style={{ width: `${rate}%` }} />
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

            {analysisSub === "trend" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                    <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-slate-600" /></div>
                    月次稼働率推移
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrend.map((m) => (
                      <div key={m.month} className="rounded-lg border border-slate-100 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
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
          </>
        )}
      </div>
    </MainLayout>
  );
}
