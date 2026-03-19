"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, ClipboardCheck, Clock } from "lucide-react";

const mockData = [
  { id: 1, date: "2024-01-28", worker: "山田 太郎", checkTime: "17:15", alcohol: "0.00", health: "良好", inspector: "管理者A", status: "完了" },
  { id: 2, date: "2024-01-28", worker: "鈴木 一郎", checkTime: "16:45", alcohol: "0.00", health: "良好", inspector: "管理者A", status: "完了" },
  { id: 3, date: "2024-01-28", worker: "佐藤 花子", checkTime: "18:10", alcohol: "0.00", health: "良好", inspector: "管理者B", status: "完了" },
  { id: 4, date: "2024-01-29", worker: "高橋 健二", checkTime: "—", alcohol: "—", health: "—", inspector: "—", status: "未実施" },
  { id: 5, date: "2024-01-29", worker: "田中 美咲", checkTime: "16:20", alcohol: "0.00", health: "経過観察", inspector: "管理者A", status: "完了" },
];

export default function RollCallsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.worker.includes(searchQuery);
    const matchesDate = !dateFilter || row.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  return (
    <MainLayout title="点呼簿管理" subtitle="終業点呼時刻管理">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <ClipboardCheck className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">点呼完了</p>
                <p className="text-xl font-semibold text-slate-900">4件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">未実施</p>
                <p className="text-xl font-semibold text-slate-900">1件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">実施率</p>
                <p className="text-xl font-semibold text-slate-900">80%</p>
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
                placeholder="作業者名で検索..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">日付</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業者名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">終業点呼時刻</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">アルコール検知</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">健康状態</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">点呼者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-mono">{row.date}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.worker}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.checkTime}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.alcohol}</td>
                  <td className="px-4 py-3 text-slate-700">{row.health}</td>
                  <td className="px-4 py-3 text-slate-700">{row.inspector}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "完了"
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
