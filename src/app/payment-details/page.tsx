"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Search, Calendar, CalendarRange, FileText, Download, Upload, Building2, FileOutput, Coins, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const paymentData = [
  { id: 1, name: "山田 太郎", period: "2024年1月", totalWork: 22, grossPay: 308000, deductions: 46200, netPay: 261800, status: "確定" },
  { id: 2, name: "鈴木 一郎", period: "2024年1月", totalWork: 20, grossPay: 260000, deductions: 39000, netPay: 221000, status: "確定" },
  { id: 3, name: "佐藤 花子", period: "2024年1月", totalWork: 23, grossPay: 345000, deductions: 51750, netPay: 293250, status: "確認中" },
  { id: 4, name: "高橋 健二", period: "2024年1月", totalWork: 18, grossPay: 234000, deductions: 35100, netPay: 198900, status: "確認中" },
  { id: 5, name: "田中 美咲", period: "2024年1月", totalWork: 21, grossPay: 252000, deductions: 37800, netPay: 214200, status: "確定" },
];

const transfersData = [
  { id: 1, name: "山田 太郎", bank: "みずほ銀行", branch: "新宿支店", accountType: "普通", accountNo: "1234567", amount: 261800, status: "生成済" },
  { id: 2, name: "鈴木 一郎", bank: "三菱UFJ銀行", branch: "渋谷支店", accountType: "普通", accountNo: "2345678", amount: 221000, status: "生成済" },
  { id: 3, name: "佐藤 花子", bank: "三井住友銀行", branch: "品川支店", accountType: "普通", accountNo: "3456789", amount: 293250, status: "未生成" },
  { id: 4, name: "高橋 健二", bank: "りそな銀行", branch: "池袋支店", accountType: "普通", accountNo: "4567890", amount: 198900, status: "未生成" },
];

const denominationData = [
  { id: 1, name: "山田 太郎", netPay: 261800, man: 26, gosen: 0, sen: 1, gohyaku: 1, hyaku: 3, goju: 0, ju: 0, go: 0, ichi: 0 },
  { id: 2, name: "鈴木 一郎", netPay: 221000, man: 22, gosen: 0, sen: 1, gohyaku: 0, hyaku: 0, goju: 0, ju: 0, go: 0, ichi: 0 },
  { id: 3, name: "佐藤 花子", netPay: 293250, man: 29, gosen: 0, sen: 3, gohyaku: 0, hyaku: 2, goju: 1, ju: 0, go: 0, ichi: 0 },
  { id: 4, name: "高橋 健二", netPay: 198900, man: 19, gosen: 1, sen: 3, gohyaku: 1, hyaku: 4, goju: 0, ju: 0, go: 0, ichi: 0 },
];

const denomTotals = { netPay: 974950, man: 96, gosen: 1, sen: 8, gohyaku: 2, hyaku: 9, goju: 1, ju: 0, go: 0, ichi: 0 };

const periodPaymentData = [
  { id: 1, name: "山田 太郎", period: "2024/01/01 ~ 01/15", workDays: 10, totalHours: 85.0, grossPay: 150000, deductions: 22500, netPay: 127500, status: "支給済" },
  { id: 2, name: "鈴木 一郎", period: "2024/01/01 ~ 01/15", workDays: 9, totalHours: 72.0, grossPay: 126000, deductions: 18900, netPay: 107100, status: "支給済" },
  { id: 3, name: "佐藤 花子", period: "2024/01/01 ~ 01/15", workDays: 11, totalHours: 93.5, grossPay: 175500, deductions: 26325, netPay: 149175, status: "計算済" },
  { id: 4, name: "高橋 健二", period: "2024/01/16 ~ 01/31", workDays: 8, totalHours: 64.0, grossPay: 108000, deductions: 16200, netPay: 91800, status: "未計算" },
  { id: 5, name: "田中 美咲", period: "2024/01/16 ~ 01/31", workDays: 12, totalHours: 96.0, grossPay: 144000, deductions: 21600, netPay: 122400, status: "未計算" },
];

function formatCurrency(value: number) { return value.toLocaleString("ja-JP"); }

const TABS = ["支払明細", "振込データ", "金種表", "期間払い"] as const;
type Tab = (typeof TABS)[number];

export default function PaymentDetailsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("支払明細");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [periodSearch, setPeriodSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  const filteredPayment = paymentData.filter((row) => {
    const matchesSearch = row.name.includes(searchQuery);
    const matchesMonth = !monthFilter || row.period.includes(monthFilter.replace("-", "年").replace(/(\d{2})$/, "$1月"));
    return matchesSearch && (monthFilter ? matchesMonth : true);
  });

  const filteredTransfers = transfersData.filter((row) => row.name.includes(searchQuery) || row.bank.includes(searchQuery));
  const filteredDenomination = denominationData.filter((row) => row.name.includes(searchQuery));
  const totalTransferAmount = filteredTransfers.reduce((sum, row) => sum + row.amount, 0);

  const filteredPeriodPayment = periodPaymentData.filter((row) => {
    const matchesSearch = row.name.includes(periodSearch);
    const matchesFilter = !periodFilter || row.status === periodFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout title="支払・振込">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(""); setMonthFilter(""); setPeriodSearch(""); setPeriodFilter(""); }}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "支払明細" && (
          <>
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Download className="h-4 w-4" />PDF出力
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="氏名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500"><FileText className="h-4 w-4" /><span>{filteredPayment.length} 件</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象期間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">稼働日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">控除合計</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayment.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalWork}日</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">{formatCurrency(row.grossPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono tabular-nums whitespace-nowrap">-{formatCurrency(row.deductions)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatCurrency(row.netPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "確定" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "振込データ" && (
          <>
            <div className="flex justify-end gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <FileOutput className="h-4 w-4" />FBデータ出力
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Upload className="h-4 w-4" />一括生成
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2"><Building2 className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xs text-slate-500">振込件数</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{filteredTransfers.length}件</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2"><Building2 className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-xs text-slate-500">振込総額</p><p className="text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">{formatCurrency(totalTransferAmount)}円</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2"><FileOutput className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-xs text-slate-500">FB生成済</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{transfersData.filter((r) => r.status === "生成済").length}件</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="氏名・銀行名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="month" className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">銀行名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">支店名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">口座種別</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">口座番号</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">振込金額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransfers.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.bank}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.branch}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-500 whitespace-nowrap">{row.accountType}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono whitespace-nowrap">{row.accountNo}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold whitespace-nowrap tabular-nums">{formatCurrency(row.amount)}円</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "金種表" && (
          <>
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Download className="h-4 w-4" />印刷 / PDF出力
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2"><Coins className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xs text-slate-500">現金支給総額</p><p className="text-xl font-semibold text-slate-900">{formatCurrency(denomTotals.netPay)}円</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2"><FileText className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-xs text-slate-500">対象人数</p><p className="text-xl font-semibold text-slate-900">{filteredDenomination.length}名</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="氏名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                      {["1万","5千","1千","500","100","50","10","5","1"].map((d) => (
                        <th key={d} className="px-3 py-3 text-center text-xs font-medium text-slate-500 whitespace-nowrap">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDenomination.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatCurrency(row.netPay)}</td>
                        {[row.man, row.gosen, row.sen, row.gohyaku, row.hyaku, row.goju, row.ju, row.go, row.ichi].map((v, i) => (
                          <td key={i} className="px-3 py-3 text-center text-slate-700 font-mono tabular-nums whitespace-nowrap">{v || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-semibold whitespace-nowrap">合計</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-bold tabular-nums whitespace-nowrap">{formatCurrency(denomTotals.netPay)}</td>
                      {[denomTotals.man, denomTotals.gosen, denomTotals.sen, denomTotals.gohyaku, denomTotals.hyaku, denomTotals.goju, denomTotals.ju, denomTotals.go, denomTotals.ichi].map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">{v}</td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "期間払い" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
                  <div><p className="text-xs text-slate-500">支給済</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{periodPaymentData.filter((r) => r.status === "支給済").length}件</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2"><Clock className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xs text-slate-500">計算済</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{periodPaymentData.filter((r) => r.status === "計算済").length}件</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-50 p-2"><AlertCircle className="h-5 w-5 text-amber-600" /></div>
                  <div><p className="text-xs text-slate-500">未計算</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{periodPaymentData.filter((r) => r.status === "未計算").length}件</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="氏名で検索..." value={periodSearch} onChange={(e) => setPeriodSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <CalendarRange className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                    <option value="">すべてのステータス</option>
                    <option value="支給済">支給済</option>
                    <option value="計算済">計算済</option>
                    <option value="未計算">未計算</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500"><FileText className="h-4 w-4" /><span>{filteredPeriodPayment.length} 件</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象期間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">稼働日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計時間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">控除合計</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPeriodPayment.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}日</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}h</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">{formatCurrency(row.grossPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono tabular-nums whitespace-nowrap">-{formatCurrency(row.deductions)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatCurrency(row.netPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.status === "支給済" ? "bg-emerald-50 text-emerald-700" : row.status === "計算済" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                          }`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
