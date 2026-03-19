"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from "lucide-react";

const mockLedger = [
  { id: 1, date: "2024/01/04", type: "受入", grade1: 10, grade2: 10, grade3: 5, note: "月初受入" },
  { id: 2, date: "2024/01/05", type: "払出", grade1: 3, grade2: 2, grade3: 1, note: "日雇保険貼付" },
  { id: 3, date: "2024/01/10", type: "払出", grade1: 5, grade2: 4, grade3: 2, note: "日雇保険貼付" },
  { id: 4, date: "2024/01/15", type: "受入", grade1: 20, grade2: 15, grade3: 10, note: "追加購入" },
  { id: 5, date: "2024/01/20", type: "払出", grade1: 4, grade2: 3, grade3: 2, note: "日雇保険貼付" },
  { id: 6, date: "2024/01/25", type: "払出", grade1: 6, grade2: 5, grade3: 3, note: "日雇保険貼付" },
];

export default function StampLedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockLedger.filter((d) =>
    d.note.includes(searchQuery) || d.date.includes(searchQuery)
  );

  const totalReceived = { g1: 30, g2: 25, g3: 15 };
  const totalIssued = { g1: 18, g2: 14, g3: 8 };
  const balance = {
    g1: totalReceived.g1 - totalIssued.g1,
    g2: totalReceived.g2 - totalIssued.g2,
    g3: totalReceived.g3 - totalIssued.g3,
  };

  return (
    <MainLayout title="印紙受払簿">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">雇用保険印紙受払記録</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <ArrowDownRight className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">受入合計</p>
                <p className="text-2xl font-semibold text-slate-900">70枚</p>
                <p className="text-xs text-slate-400 mt-1">1級:30 / 2級:25 / 3級:15</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <ArrowUpRight className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">払出合計</p>
                <p className="text-2xl font-semibold text-slate-900">40枚</p>
                <p className="text-xs text-slate-400 mt-1">1級:18 / 2級:14 / 3級:8</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Package className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">現在残高</p>
                <p className="text-2xl font-semibold text-slate-900">30枚</p>
                <p className="text-xs text-slate-400 mt-1">
                  1級:{balance.g1} / 2級:{balance.g2} / 3級:{balance.g3}
                </p>
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
              placeholder="日付・摘要で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <BookOpen className="h-4 w-4" />
            月別表示
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">区分</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">1級(枚)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">2級(枚)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">3級(枚)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">摘要</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.type === "受入" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.grade1}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.grade2}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.grade3}</td>
                  <td className="px-4 py-3 text-slate-600">{row.note}</td>
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
