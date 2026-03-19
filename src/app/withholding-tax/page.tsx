"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  FileText,
  Calculator,
  CalendarDays,
  TrendingDown,
} from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", grossPay: 285000, deduction: 6800, netTax: 6800, month: "2024/01", status: "計算済" },
  { id: 2, name: "鈴木 一郎", grossPay: 245000, deduction: 5200, netTax: 5200, month: "2024/01", status: "計算済" },
  { id: 3, name: "佐藤 花子", grossPay: 320000, deduction: 8900, netTax: 8900, month: "2024/01", status: "計算済" },
  { id: 4, name: "高橋 健二", grossPay: 268000, deduction: 6100, netTax: 6100, month: "2024/01", status: "未計算" },
  { id: 5, name: "田中 美咲", grossPay: 198000, deduction: 3800, netTax: 3800, month: "2024/01", status: "計算済" },
];

export default function WithholdingTaxPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockData.filter((d) => d.name.includes(searchQuery));
  const totalTax = filtered.reduce((acc, d) => acc + d.netTax, 0);

  return (
    <MainLayout title="源泉税管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">源泉徴収票・納付テーブル管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">当月源泉税合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥{totalTax.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Calculator className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">計算済</p>
                <p className="text-2xl font-semibold text-slate-900">4件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">未計算</p>
                <p className="text-2xl font-semibold text-slate-900">1件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CalendarDays className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">納付期限</p>
                <p className="text-lg font-semibold text-slate-900">2024/02/10</p>
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
            <Calculator className="h-4 w-4" />
            一括計算
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <FileText className="h-4 w-4" />
            源泉徴収票出力
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象月</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">支給額</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">控除額</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">源泉税額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.month}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.grossPay.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.deduction.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.netTax.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "計算済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
