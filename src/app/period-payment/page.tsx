"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, CalendarRange, Calculator } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", period: "2024/01/01 ~ 01/15", workDays: 10, totalHours: 85.0, grossPay: 150000, deductions: 22500, netPay: 127500, status: "支給済" },
  { id: 2, name: "鈴木 一郎", period: "2024/01/01 ~ 01/15", workDays: 9, totalHours: 72.0, grossPay: 126000, deductions: 18900, netPay: 107100, status: "支給済" },
  { id: 3, name: "佐藤 花子", period: "2024/01/01 ~ 01/15", workDays: 11, totalHours: 93.5, grossPay: 175500, deductions: 26325, netPay: 149175, status: "計算済" },
  { id: 4, name: "高橋 健二", period: "2024/01/16 ~ 01/31", workDays: 8, totalHours: 64.0, grossPay: 108000, deductions: 16200, netPay: 91800, status: "未計算" },
  { id: 5, name: "田中 美咲", period: "2024/01/16 ~ 01/31", workDays: 12, totalHours: 96.0, grossPay: 144000, deductions: 21600, netPay: 122400, status: "未計算" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function PeriodPaymentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesPeriod = periodFilter === "all" || row.period.includes(periodFilter === "first" ? "01/15" : "01/31");
    return matchesSearch && matchesPeriod;
  });

  return (
    <MainLayout
      title="期間払い処理"
      subtitle="半月等の期間払い管理"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          <Calculator className="h-4 w-4" />
          一括計算
        </button>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CalendarRange className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">支給済</p>
                <p className="text-xl font-semibold text-slate-900">2件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <CalendarRange className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">計算済</p>
                <p className="text-xl font-semibold text-slate-900">1件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <CalendarRange className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">未計算</p>
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
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">全期間</option>
              <option value="first">前半（1日〜15日）</option>
              <option value="second">後半（16日〜末日）</option>
            </select>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="month"
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象期間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">稼働日数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">合計時間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">総支給額</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">控除合計</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">差引支給額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-xs">{row.period}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.workDays}日</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.totalHours.toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono">{formatCurrency(row.grossPay)}円</td>
                  <td className="px-4 py-3 text-right text-slate-600 font-mono">-{formatCurrency(row.deductions)}円</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">{formatCurrency(row.netPay)}円</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "支給済"
                          ? "bg-slate-100 text-slate-700"
                          : row.status === "計算済"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-blue-50 text-blue-700"
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
