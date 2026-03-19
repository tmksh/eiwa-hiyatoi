"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Plus,
  Banknote,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const mockPayments = [
  { id: 1, name: "佐藤 花子", period: "2024/01", healthIns: 12450, pension: 8900, nursingIns: 1580, total: 22930, paidDate: "2024/02/05", status: "納付済" },
  { id: 2, name: "田中 美咲", period: "2024/01", healthIns: 10200, pension: 7300, nursingIns: 1290, total: 18790, paidDate: "2024/02/05", status: "納付済" },
  { id: 3, name: "渡辺 剛", period: "2024/01", healthIns: 14100, pension: 10100, nursingIns: 1780, total: 25980, paidDate: null, status: "未納付" },
  { id: 4, name: "伊藤 直樹", period: "2024/01", healthIns: 11800, pension: 8450, nursingIns: 1490, total: 21740, paidDate: "2024/02/10", status: "納付済" },
];

export default function CashPaymentPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockPayments.filter((p) => p.name.includes(searchQuery));

  return (
    <MainLayout title="現金納付管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">社保現金納付実績管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Banknote className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">当月納付額合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥89,440</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CalendarDays className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">納付済</p>
                <p className="text-2xl font-semibold text-slate-900">3件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">未納付</p>
                <p className="text-2xl font-semibold text-slate-900">1件</p>
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
              placeholder="作業員名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Plus className="h-4 w-4" />
            新規登録
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            エクスポート
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業員名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象期間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">健康保険</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">厚生年金</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">介護保険</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">合計</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">納付日</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.period}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.healthIns.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.pension.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.nursingIns.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{row.paidDate ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "納付済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-slate-500">全 {filtered.length} 件</div>
      </div>
    </MainLayout>
  );
}
