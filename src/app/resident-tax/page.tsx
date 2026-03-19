"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Download,
  Landmark,
  Wallet,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", municipality: "世田谷区", annualAmount: 102000, monthlyAmount: 8500, collected: 8500, balance: 93500, month: "2024/01", status: "徴収済" },
  { id: 2, name: "鈴木 一郎", municipality: "杉並区", annualAmount: 75600, monthlyAmount: 6300, collected: 6300, balance: 69300, month: "2024/01", status: "徴収済" },
  { id: 3, name: "佐藤 花子", municipality: "練馬区", annualAmount: 144000, monthlyAmount: 12000, collected: 0, balance: 144000, month: "2024/01", status: "未徴収" },
  { id: 4, name: "高橋 健二", municipality: "板橋区", annualAmount: 93600, monthlyAmount: 7800, collected: 7800, balance: 85800, month: "2024/01", status: "徴収済" },
  { id: 5, name: "田中 美咲", municipality: "豊島区", annualAmount: 62400, monthlyAmount: 5200, collected: 5200, balance: 57200, month: "2024/01", status: "徴収済" },
];

export default function ResidentTaxPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockData.filter((d) => d.name.includes(searchQuery) || d.municipality.includes(searchQuery));
  const totalBalance = filtered.reduce((acc, d) => acc + d.balance, 0);

  return (
    <MainLayout title="住民税管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">住民税徴収台帳・残高管理</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Landmark className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">年間総額</p>
                <p className="text-2xl font-semibold text-slate-900">¥477,600</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">当月徴収済</p>
                <p className="text-2xl font-semibold text-slate-900">4件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">未徴収</p>
                <p className="text-2xl font-semibold text-slate-900">1件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Wallet className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">残高合計</p>
                <p className="text-2xl font-semibold text-slate-900">¥{totalBalance.toLocaleString()}</p>
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
              placeholder="氏名・市区町村で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">市区町村</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">年間額</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">月額</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">徴収済</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">残高</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.municipality}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.annualAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.monthlyAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-mono">¥{row.collected.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium">¥{row.balance.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "徴収済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
