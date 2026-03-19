"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  CalendarCheck,
  CalendarPlus,
  CalendarMinus,
  AlertCircle,
} from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", grantDate: "2023/04/01", granted: 20, used: 8, remaining: 12, expiry: "2025/03/31" },
  { id: 2, name: "鈴木 一郎", grantDate: "2023/10/01", granted: 10, used: 3, remaining: 7, expiry: "2025/09/30" },
  { id: 3, name: "佐藤 花子", grantDate: "2023/04/01", granted: 20, used: 18, remaining: 2, expiry: "2025/03/31" },
  { id: 4, name: "高橋 健二", grantDate: "2023/07/01", granted: 11, used: 5, remaining: 6, expiry: "2025/06/30" },
  { id: 5, name: "田中 美咲", grantDate: "2024/01/01", granted: 10, used: 0, remaining: 10, expiry: "2025/12/31" },
];

export default function PaidLeavePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockData.filter((d) => d.name.includes(searchQuery));

  return (
    <MainLayout title="有給休暇管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">付与・取得・残日数管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <CalendarPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">付与合計</p>
                <p className="text-2xl font-semibold text-slate-900">71日</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CalendarMinus className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">取得合計</p>
                <p className="text-2xl font-semibold text-slate-900">34日</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CalendarCheck className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">残日数合計</p>
                <p className="text-2xl font-semibold text-slate-900">37日</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">残2日以下</p>
                <p className="text-2xl font-semibold text-slate-900">1名</p>
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
            <CalendarPlus className="h-4 w-4" />
            一括付与
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">付与日</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">付与日数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">取得日数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残日数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">有効期限</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">消化率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => {
                const rate = Math.round((row.used / row.granted) * 100);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.grantDate}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.granted}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.used}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      <span className={row.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>
                        {row.remaining}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.expiry}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rate >= 80 ? "bg-slate-1000" : rate >= 50 ? "bg-blue-500" : "bg-slate-300"}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-slate-500">全 {filtered.length} 件</div>
      </div>
    </MainLayout>
  );
}
