"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, FileText, Download } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", period: "2024年1月", totalWork: 22, grossPay: 308000, deductions: 46200, netPay: 261800, status: "確定" },
  { id: 2, name: "鈴木 一郎", period: "2024年1月", totalWork: 20, grossPay: 260000, deductions: 39000, netPay: 221000, status: "確定" },
  { id: 3, name: "佐藤 花子", period: "2024年1月", totalWork: 23, grossPay: 345000, deductions: 51750, netPay: 293250, status: "確認中" },
  { id: 4, name: "高橋 健二", period: "2024年1月", totalWork: 18, grossPay: 234000, deductions: 35100, netPay: 198900, status: "確認中" },
  { id: 5, name: "田中 美咲", period: "2024年1月", totalWork: 21, grossPay: 252000, deductions: 37800, netPay: 214200, status: "確定" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function PaymentDetailsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesMonth = !monthFilter || row.period.includes(monthFilter.replace("-", "年").replace(/(\d{2})$/, "$1月"));
    return matchesSearch && (monthFilter ? matchesMonth : true);
  });

  return (
    <MainLayout
      title="支払明細"
      subtitle="支払明細テーブル管理"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          <Download className="h-4 w-4" />
          PDF出力
        </button>
      }
    >
      <div className="space-y-6">
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
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              <span>{filtered.length} 件</span>
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
                  <td className="px-4 py-3 text-slate-700">{row.period}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.totalWork}日</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono">{formatCurrency(row.grossPay)}円</td>
                  <td className="px-4 py-3 text-right text-slate-600 font-mono">-{formatCurrency(row.deductions)}円</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">{formatCurrency(row.netPay)}円</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "確定"
                          ? "bg-slate-100 text-slate-700"
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
