"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, Calculator, AlertTriangle } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", date: "2024-01-28", normalHours: 8.0, overtimeHours: 2.5, rate: 1500, overtimePay: 4688, diffPay: 0 },
  { id: 2, name: "鈴木 一郎", date: "2024-01-28", normalHours: 8.0, overtimeHours: 1.0, rate: 1375, overtimePay: 1719, diffPay: 200 },
  { id: 3, name: "佐藤 花子", date: "2024-01-28", normalHours: 8.0, overtimeHours: 4.0, rate: 1625, overtimePay: 8125, diffPay: 0 },
  { id: 4, name: "高橋 健二", date: "2024-01-29", normalHours: 8.0, overtimeHours: 3.0, rate: 1500, overtimePay: 5625, diffPay: 500 },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function OvertimePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesDate = !dateFilter || row.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  return (
    <MainLayout title="残業計算" subtitle="残業差額支給・単価算出">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">残業合計時間</p>
                <p className="text-xl font-semibold text-slate-900">10.5h</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Calculator className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">残業手当合計</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(20157)}円</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">差額支給対象</p>
                <p className="text-xl font-semibold text-slate-900">2件</p>
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
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">日付</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">通常時間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残業時間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">時間単価</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残業手当</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">差額支給</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.date}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.normalHours.toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">{row.overtimeHours.toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{formatCurrency(row.rate)}円</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">{formatCurrency(row.overtimePay)}円</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {row.diffPay > 0 ? (
                      <span className="text-blue-600 font-medium">{formatCurrency(row.diffPay)}円</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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
