"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, Upload, Building2, FileOutput } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", bank: "みずほ銀行", branch: "新宿支店", accountType: "普通", accountNo: "1234567", amount: 261800, status: "生成済" },
  { id: 2, name: "鈴木 一郎", bank: "三菱UFJ銀行", branch: "渋谷支店", accountType: "普通", accountNo: "2345678", amount: 221000, status: "生成済" },
  { id: 3, name: "佐藤 花子", bank: "三井住友銀行", branch: "品川支店", accountType: "普通", accountNo: "3456789", amount: 293250, status: "未生成" },
  { id: 4, name: "高橋 健二", bank: "りそな銀行", branch: "池袋支店", accountType: "普通", accountNo: "4567890", amount: 198900, status: "未生成" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockData.filter((row) => row.name.includes(searchQuery) || row.bank.includes(searchQuery));

  const totalAmount = filtered.reduce((sum, row) => sum + row.amount, 0);

  return (
    <MainLayout
      title="振込データ管理"
      subtitle="全銀協FBデータ自動生成・金種計算"
      actions={
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <FileOutput className="h-4 w-4" />
            FBデータ出力
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Upload className="h-4 w-4" />
            一括生成
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">振込件数</p>
                <p className="text-xl font-semibold text-slate-900">{filtered.length}件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">振込総額</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(totalAmount)}円</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <FileOutput className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">FB生成済</p>
                <p className="text-xl font-semibold text-slate-900">{mockData.filter((r) => r.status === "生成済").length}件</p>
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
                placeholder="氏名・銀行名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="month"
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">氏名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">銀行名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">支店名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">口座種別</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">口座番号</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">振込金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-700">{row.bank}</td>
                  <td className="px-4 py-3 text-slate-700">{row.branch}</td>
                  <td className="px-4 py-3 text-slate-500">{row.accountType}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{row.accountNo}</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">{formatCurrency(row.amount)}円</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "生成済"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-slate-100 text-slate-600"
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
