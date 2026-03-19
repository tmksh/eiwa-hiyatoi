"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Building2,
  Users,
  Banknote,
  TruckIcon,
  Filter,
} from "lucide-react";

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

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"summary" | "detail">("summary");

  const filteredSummary = mockDispatchData.filter((d) => d.destination.includes(searchQuery));
  const filteredDetail = mockWorkerDetail.filter((d) => d.name.includes(searchQuery) || d.destination.includes(searchQuery));

  const totalWage = mockDispatchData.reduce((acc, d) => acc + d.totalWage, 0);
  const totalWorkers = mockDispatchData.reduce((acc, d) => acc + d.workerCount, 0);

  return (
    <MainLayout title="派遣先別処理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">一産廃・区有施設・局集等の派遣先別賃金処理</p>
        </div>

        {/* Summary Cards */}
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
                <p className="text-2xl font-semibold text-slate-900">{totalWorkers}名</p>
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
                <p className="text-2xl font-semibold text-slate-900">¥{(totalWage / 10000).toFixed(0)}万</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="派遣先・氏名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
            <button
              onClick={() => setView("summary")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${view === "summary" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
            >
              派遣先別
            </button>
            <button
              onClick={() => setView("detail")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${view === "detail" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
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

        {/* Table - Summary View */}
        {view === "summary" && (
          <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">派遣先</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">人数</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">延べ日数</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">平均日当</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">賃金合計</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象月</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSummary.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.destination}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.workerCount}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.workDays}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.avgDailyRate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.totalWage.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-700">{row.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table - Detail View */}
        {view === "detail" && (
          <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業員名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">派遣先</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">車種</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">日数</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">日当</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">合計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDetail.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.destination}</td>
                    <td className="px-4 py-3 text-slate-700">{row.vehicleType}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.days}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.dailyRate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-sm text-slate-500">
          全 {view === "summary" ? filteredSummary.length : filteredDetail.length} 件
        </div>
      </div>
    </MainLayout>
  );
}
