"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Plus,
  Clock,
  Users,
  Banknote,
  CalendarDays,
} from "lucide-react";

const mockWorkers = [
  { id: 1, name: "木村 翔太", hourlyRate: 1200, workDays: 15, totalHours: 90.0, overtime: 5.0, grossPay: 114000, month: "2024/01", status: "確定" },
  { id: 2, name: "松本 さくら", hourlyRate: 1150, workDays: 12, totalHours: 72.0, overtime: 0, grossPay: 82800, month: "2024/01", status: "確定" },
  { id: 3, name: "小林 大輝", hourlyRate: 1300, workDays: 18, totalHours: 108.0, overtime: 8.0, grossPay: 153400, month: "2024/01", status: "未確定" },
  { id: 4, name: "中村 愛", hourlyRate: 1200, workDays: 10, totalHours: 60.0, overtime: 2.0, grossPay: 75000, month: "2024/01", status: "確定" },
  { id: 5, name: "加藤 隆", hourlyRate: 1100, workDays: 20, totalHours: 120.0, overtime: 10.0, grossPay: 145750, month: "2024/01", status: "未確定" },
];

export default function PartTimePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockWorkers.filter((w) => w.name.includes(searchQuery));

  return (
    <MainLayout title="アルバイト管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">時給制アルバイトの勤怠・賃金管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">登録人数</p>
                <p className="text-2xl font-semibold text-slate-900">5名</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">総労働時間</p>
                <p className="text-2xl font-semibold text-slate-900">450.0h</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">残業時間合計</p>
                <p className="text-2xl font-semibold text-slate-900">25.0h</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Banknote className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">賃金合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥570,950</p>
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
              placeholder="氏名で検索..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">氏名</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">時給</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">出勤日数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">総時間</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残業</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">支給額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">対象月</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.hourlyRate.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.workDays}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.totalHours.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.overtime.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.grossPay.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{row.month}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "確定" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
