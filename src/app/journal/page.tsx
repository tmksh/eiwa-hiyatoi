"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Plus,
  BookOpen,
  ArrowRight,
  Calculator,
  Filter,
} from "lucide-react";

const mockJournals = [
  { id: 1, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（源泉）", creditAmount: 6800, description: "1月分給与 山田太郎", category: "給与" },
  { id: 2, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（社保）", creditAmount: 42180, description: "1月分給与 山田太郎", category: "給与" },
  { id: 3, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（住民税）", creditAmount: 8500, description: "1月分給与 山田太郎", category: "給与" },
  { id: 4, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "普通預金", creditAmount: 227520, description: "1月分給与 山田太郎", category: "給与" },
  { id: 5, date: "2024/02/10", debitAccount: "預り金（源泉）", debitAmount: 30800, creditAccount: "普通預金", creditAmount: 30800, description: "1月分源泉所得税納付", category: "納付" },
  { id: 6, date: "2024/02/28", debitAccount: "預り金（社保）", debitAmount: 210900, creditAccount: "普通預金", creditAmount: 210900, description: "1月分社会保険料納付", category: "納付" },
];

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = mockJournals.filter((j) => {
    const matchesSearch = j.description.includes(searchQuery) || j.debitAccount.includes(searchQuery) || j.creditAccount.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || j.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="仕訳データ">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">仕訳・預り金テーブル管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">仕訳件数</p>
                <p className="text-2xl font-semibold text-slate-900">{mockJournals.length}件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Calculator className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">借方合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥1,381,700</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <ArrowRight className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">貸方合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥526,700</p>
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
              placeholder="勘定科目・摘要で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">全カテゴリ</option>
              <option value="給与">給与</option>
              <option value="納付">納付</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Plus className="h-4 w-4" />
            仕訳追加
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">日付</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">借方科目</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">借方金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">貸方科目</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">貸方金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">摘要</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{row.date}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.debitAccount}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.debitAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.creditAccount}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.creditAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{row.description}</td>
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
