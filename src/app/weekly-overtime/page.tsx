"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, Clock, TrendingUp } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 48.5, overHours: 8.5, rate: 1500, premium: 15938, status: "超過" },
  { id: 2, name: "鈴木 一郎", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 38.0, overHours: 0, rate: 1375, premium: 0, status: "範囲内" },
  { id: 3, name: "佐藤 花子", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 52.0, overHours: 12.0, rate: 1625, premium: 24375, status: "超過" },
  { id: 4, name: "高橋 健二", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 40.0, overHours: 0, rate: 1500, premium: 0, status: "範囲内" },
  { id: 5, name: "田中 美咲", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 42.5, overHours: 2.5, rate: 1250, premium: 3906, status: "超過" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function WeeklyOvertimePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesWeek = !weekFilter || row.weekStart <= weekFilter;
    return matchesSearch && matchesWeek;
  });

  return (
    <MainLayout title="週40時間割増計算" subtitle="週40時間超過の割増計算">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">40h超過者数</p>
                <p className="text-xl font-semibold text-slate-900">3名</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">超過時間合計</p>
                <p className="text-xl font-semibold text-slate-900">23.0h</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">割増手当合計</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(44219)}円</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Area */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="氏名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="week"
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">氏名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">週期間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">週合計時間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">40h超過分</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">時間単価</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">割増手当</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-xs">{row.weekStart} ~ {row.weekEnd}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono">{row.totalHours.toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {row.overHours > 0 ? (
                      <span className="text-slate-600 font-medium">{row.overHours.toFixed(1)}h</span>
                    ) : (
                      <span className="text-slate-400">0.0h</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{formatCurrency(row.rate)}円</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">
                    {row.premium > 0 ? `${formatCurrency(row.premium)}円` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "超過"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
