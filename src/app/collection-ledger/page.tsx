"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Filter,
  ClipboardList,
  Building2,
  Users,
} from "lucide-react";

const mockLedger = [
  { id: 1, name: "山田 太郎", healthIns: 15400, pension: 27450, nursingIns: 2780, empIns: 1830, residentTax: 8500, total: 55960, month: "2024/01" },
  { id: 2, name: "鈴木 一郎", healthIns: 12800, pension: 22800, nursingIns: 2310, empIns: 1520, residentTax: 6300, total: 45730, month: "2024/01" },
  { id: 3, name: "佐藤 花子", healthIns: 18200, pension: 32400, nursingIns: 3280, empIns: 2160, residentTax: 12000, total: 68040, month: "2024/01" },
  { id: 4, name: "高橋 健二", healthIns: 14600, pension: 26000, nursingIns: 2640, empIns: 1740, residentTax: 7800, total: 52780, month: "2024/01" },
  { id: 5, name: "田中 美咲", healthIns: 11200, pension: 19950, nursingIns: 2020, empIns: 1330, residentTax: 5200, total: 39700, month: "2024/01" },
];

export default function CollectionLedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockLedger.filter((d) => d.name.includes(searchQuery));
  const grandTotal = filtered.reduce((acc, d) => acc + d.total, 0);

  return (
    <MainLayout title="徴収台帳">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">社会保険・住民税徴収台帳</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">対象人数</p>
                <p className="text-2xl font-semibold text-slate-900">{filtered.length}名</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <ClipboardList className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">徴収合計額</p>
                <p className="text-2xl font-semibold text-slate-900">¥{grandTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">対象期間</p>
                <p className="text-2xl font-semibold text-slate-900">2024/01</p>
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
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            期間選択
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">月</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">健康保険</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">厚生年金</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">介護保険</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">雇用保険</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">住民税</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">合計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.month}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.healthIns.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.pension.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.nursingIns.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.empIns.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.residentTax.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-semibold">¥{row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                <td className="px-4 py-3 text-slate-900 font-semibold" colSpan={7}>合計</td>
                <td className="px-4 py-3 text-right text-slate-900 font-mono font-bold">¥{grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
