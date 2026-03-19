"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  BarChart3,
  Users,
  Calendar,
  TruckIcon,
  Filter,
} from "lucide-react";

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

export default function AggregationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<AggView>("personal");

  return (
    <MainLayout title="集計">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">個人別月別・指定期間別・車種別集計</p>
        </div>

        {/* Summary Cards */}
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

        {/* View Toggle & Filters */}
        <div className="flex flex-wrap items-center gap-3">
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

        {/* Personal Monthly View */}
        {view === "personal" && (
          <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業員名</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">1月</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">2月</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">3月</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">合計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {personalData.filter((d) => d.name.includes(searchQuery)).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.jan.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.feb.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.mar.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">¥{row.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Period View */}
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

        {/* Vehicle View */}
        {view === "vehicle" && (
          <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">車種</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">配置人数</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">延べ日数</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">平均日当</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">売上合計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.type}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.count}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.days}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.avgDaily.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">¥{row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
