"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Plus, Search, Calendar, FileText } from "lucide-react";

const mockData = [
  { id: 1, date: "2024-01-28", worker: "山田 太郎", category: "運搬", start: "08:00", end: "17:00", day: "月" },
  { id: 2, date: "2024-01-28", worker: "鈴木 一郎", category: "荷揚げ", start: "07:30", end: "16:30", day: "月" },
  { id: 3, date: "2024-01-28", worker: "佐藤 花子", category: "仕分け", start: "09:00", end: "18:00", day: "月" },
  { id: 4, date: "2024-01-29", worker: "高橋 健二", category: "運搬", start: "08:00", end: "19:30", day: "火" },
  { id: 5, date: "2024-01-29", worker: "田中 美咲", category: "検品", start: "07:00", end: "16:00", day: "火" },
];

export default function WorkLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = mockData.filter((row) => {
    const matchesSearch = row.worker.includes(searchQuery) || row.category.includes(searchQuery);
    const matchesDate = !dateFilter || row.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  return (
    <MainLayout
      title="作業日誌管理"
      subtitle="OCR読取り機能対応"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          <Plus className="h-4 w-4" />
          新規作成
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
                placeholder="作業者名・作業区分で検索..."
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
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              <span>全 {filtered.length} 件</span>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">作業区分</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">始業</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">終業</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">曜日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-mono">{row.date}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.worker}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.start}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.end}</td>
                  <td className="px-4 py-3 text-slate-500">{row.day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
