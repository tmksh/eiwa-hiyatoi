"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, Download, Calculator } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", workDate: "2024-01-28", base: 12000, early: 1500, overtime: 3750, holiday: 0, deduction: 2850, net: 14400 },
  { id: 2, name: "鈴木 一郎", workDate: "2024-01-28", base: 11000, early: 1375, overtime: 0, holiday: 0, deduction: 2475, net: 9900 },
  { id: 3, name: "佐藤 花子", workDate: "2024-01-28", base: 13000, early: 0, overtime: 6500, holiday: 0, deduction: 3900, net: 15600 },
  { id: 4, name: "高橋 健二", workDate: "2024-01-29", base: 12000, early: 0, overtime: 4500, holiday: 0, deduction: 3300, net: 13200 },
  { id: 5, name: "田中 美咲", workDate: "2024-01-29", base: 10000, early: 0, overtime: 0, holiday: 0, deduction: 2000, net: 8000 },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function WageLedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesMonth = !monthFilter || row.workDate.startsWith(monthFilter);
    return matchesSearch && matchesMonth;
  });

  const totals = filtered.reduce(
    (acc, row) => ({
      base: acc.base + row.base,
      early: acc.early + row.early,
      overtime: acc.overtime + row.overtime,
      holiday: acc.holiday + row.holiday,
      deduction: acc.deduction + row.deduction,
      net: acc.net + row.net,
    }),
    { base: 0, early: 0, overtime: 0, holiday: 0, deduction: 0, net: 0 }
  );

  return (
    <MainLayout
      title="賃金台帳"
      subtitle="さかのぼり再計算エンジン対応"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          <Download className="h-4 w-4" />
          CSV出力
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
              <Calculator className="h-4 w-4" />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業日</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">基本給</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">早出手当</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残業手当</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">休日手当</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">控除合計</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">差引支給額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.workDate}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono">{formatCurrency(row.base)}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{formatCurrency(row.early)}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{formatCurrency(row.overtime)}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{formatCurrency(row.holiday)}</td>
                  <td className="px-4 py-3 text-right text-slate-600 font-mono">-{formatCurrency(row.deduction)}</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-semibold font-mono">{formatCurrency(row.net)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                <td className="px-4 py-3 text-slate-900 font-semibold" colSpan={2}>合計</td>
                <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">{formatCurrency(totals.base)}</td>
                <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">{formatCurrency(totals.early)}</td>
                <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">{formatCurrency(totals.overtime)}</td>
                <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">{formatCurrency(totals.holiday)}</td>
                <td className="px-4 py-3 text-right text-slate-600 font-mono font-semibold">-{formatCurrency(totals.deduction)}</td>
                <td className="px-4 py-3 text-right text-blue-700 font-mono font-bold">{formatCurrency(totals.net)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
