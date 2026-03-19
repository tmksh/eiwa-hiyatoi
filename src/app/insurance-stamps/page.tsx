"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Stamp,
  ArrowRightLeft,
  Info,
} from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", grade: "1級", method: "印紙", days: 22, amount: 7128, month: "2024/01" },
  { id: 2, name: "鈴木 一郎", grade: "2級", method: "印紙", days: 20, amount: 5880, month: "2024/01" },
  { id: 3, name: "佐藤 花子", grade: "3級", method: "現金", days: 18, amount: 4536, month: "2024/01" },
  { id: 4, name: "高橋 健二", grade: "1級", method: "印紙", days: 21, amount: 6804, month: "2024/01" },
  { id: 5, name: "田中 美咲", grade: "2級", method: "現金", days: 19, amount: 5586, month: "2024/01" },
];

export default function InsuranceStampsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filtered = mockData.filter((d) => {
    const matchesSearch = d.name.includes(searchQuery);
    const matchesMethod = methodFilter === "all" || d.method === (methodFilter === "stamp" ? "印紙" : "現金");
    return matchesSearch && matchesMethod;
  });

  return (
    <MainLayout title="社保印紙管理">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm text-slate-500">
            40テーブル正規化統合・印紙方式/現金納付切替対応
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200/60 bg-blue-50/50 p-4">
          <Info className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">正規化統合モード</p>
            <p className="mt-1 text-blue-600">
              旧40テーブル（印紙台帳01〜40）を統合テーブルに正規化済み。印紙方式と現金納付の切替が可能です。
            </p>
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
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">全方式</option>
              <option value="stamp">印紙方式</option>
              <option value="cash">現金納付</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowRightLeft className="h-4 w-4" />
            方式切替
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            エクスポート
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Stamp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">印紙方式</p>
                <p className="text-2xl font-semibold text-slate-900">3名</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <RefreshCw className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">現金納付</p>
                <p className="text-2xl font-semibold text-slate-900">2名</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Stamp className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">当月合計額</p>
                <p className="text-2xl font-semibold text-slate-900">¥29,934</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業員名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">等級</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象月</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">日数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.id}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.grade}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.method === "印紙"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.month}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.days}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono">
                    ¥{row.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-slate-500">
          全 {filtered.length} 件
        </div>
      </div>
    </MainLayout>
  );
}
