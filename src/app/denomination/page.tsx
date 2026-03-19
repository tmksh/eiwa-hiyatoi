"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Download, Coins, FileText } from "lucide-react";

const mockData = [
  { id: 1, name: "山田 太郎", netPay: 261800, man: 26, gosen: 0, sen: 1, gohyaku: 1, hyaku: 3, goju: 0, ju: 0, go: 0, ichi: 0 },
  { id: 2, name: "鈴木 一郎", netPay: 221000, man: 22, gosen: 0, sen: 1, gohyaku: 0, hyaku: 0, goju: 0, ju: 0, go: 0, ichi: 0 },
  { id: 3, name: "佐藤 花子", netPay: 293250, man: 29, gosen: 0, sen: 3, gohyaku: 0, hyaku: 2, goju: 1, ju: 0, go: 0, ichi: 0 },
  { id: 4, name: "高橋 健二", netPay: 198900, man: 19, gosen: 1, sen: 3, gohyaku: 1, hyaku: 4, goju: 0, ju: 0, go: 0, ichi: 0 },
];

const totals = {
  netPay: 974950,
  man: 96, gosen: 1, sen: 8, gohyaku: 2, hyaku: 9, goju: 1, ju: 0, go: 0, ichi: 0,
};

function formatCurrency(value: number) {
  return value.toLocaleString("ja-JP");
}

export default function DenominationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockData.filter((row) => row.name.includes(searchQuery));

  return (
    <MainLayout
      title="金種表"
      subtitle="金種支払明細・総括表"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          <Download className="h-4 w-4" />
          印刷 / PDF出力
        </button>
      }
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Coins className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">現金支給総額</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(totals.netPay)}円</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">対象人数</p>
                <p className="text-xl font-semibold text-slate-900">{filtered.length}名</p>
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
                placeholder="氏名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">氏名</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">差引支給額</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">1万</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">5千</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">1千</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">500</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">100</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">50</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">10</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">5</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-slate-500">1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold">{formatCurrency(row.netPay)}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.man || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.gosen || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.sen || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.gohyaku || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.hyaku || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.goju || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.ju || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.go || "—"}</td>
                    <td className="px-3 py-3 text-center text-slate-700 font-mono">{row.ichi || "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-900 font-semibold">合計</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-mono font-bold">{formatCurrency(totals.netPay)}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.man}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.gosen}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.sen}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.gohyaku}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.hyaku}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.goju}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.ju}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.go}</td>
                  <td className="px-3 py-3 text-center text-slate-900 font-mono font-semibold">{totals.ichi}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
