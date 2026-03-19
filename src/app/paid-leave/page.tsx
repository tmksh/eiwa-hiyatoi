"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  Search,
  Download,
  CalendarCheck,
  CalendarPlus,
  CalendarMinus,
  AlertCircle,
  Plus,
  Clock,
  Users,
  Banknote,
  CalendarDays,
  BookOpen,
  ArrowRight,
  Calculator,
  Filter,
} from "lucide-react";

const TABS = ["有給休暇", "アルバイト", "仕訳"] as const;
type Tab = (typeof TABS)[number];

const mockPaidLeave = [
  { id: 1, name: "山田 太郎", grantDate: "2023/04/01", granted: 20, used: 8, remaining: 12, expiry: "2025/03/31" },
  { id: 2, name: "鈴木 一郎", grantDate: "2023/10/01", granted: 10, used: 3, remaining: 7, expiry: "2025/09/30" },
  { id: 3, name: "佐藤 花子", grantDate: "2023/04/01", granted: 20, used: 18, remaining: 2, expiry: "2025/03/31" },
  { id: 4, name: "高橋 健二", grantDate: "2023/07/01", granted: 11, used: 5, remaining: 6, expiry: "2025/06/30" },
  { id: 5, name: "田中 美咲", grantDate: "2024/01/01", granted: 10, used: 0, remaining: 10, expiry: "2025/12/31" },
];

const mockWorkers = [
  { id: 1, name: "木村 翔太", hourlyRate: 1200, workDays: 15, totalHours: 90.0, overtime: 5.0, grossPay: 114000, month: "2024/01", status: "確定" },
  { id: 2, name: "松本 さくら", hourlyRate: 1150, workDays: 12, totalHours: 72.0, overtime: 0, grossPay: 82800, month: "2024/01", status: "確定" },
  { id: 3, name: "小林 大輝", hourlyRate: 1300, workDays: 18, totalHours: 108.0, overtime: 8.0, grossPay: 153400, month: "2024/01", status: "未確定" },
  { id: 4, name: "中村 愛", hourlyRate: 1200, workDays: 10, totalHours: 60.0, overtime: 2.0, grossPay: 75000, month: "2024/01", status: "確定" },
  { id: 5, name: "加藤 隆", hourlyRate: 1100, workDays: 20, totalHours: 120.0, overtime: 10.0, grossPay: 145750, month: "2024/01", status: "未確定" },
];

const mockJournals = [
  { id: 1, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（源泉）", creditAmount: 6800, description: "1月分給与 山田太郎", category: "給与" },
  { id: 2, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（社保）", creditAmount: 42180, description: "1月分給与 山田太郎", category: "給与" },
  { id: 3, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（住民税）", creditAmount: 8500, description: "1月分給与 山田太郎", category: "給与" },
  { id: 4, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "普通預金", creditAmount: 227520, description: "1月分給与 山田太郎", category: "給与" },
  { id: 5, date: "2024/02/10", debitAccount: "預り金（源泉）", debitAmount: 30800, creditAccount: "普通預金", creditAmount: 30800, description: "1月分源泉所得税納付", category: "納付" },
  { id: 6, date: "2024/02/28", debitAccount: "預り金（社保）", debitAmount: 210900, creditAccount: "普通預金", creditAmount: 210900, description: "1月分社会保険料納付", category: "納付" },
];

export default function PaidLeavePage() {
  const [activeTab, setActiveTab] = useState<Tab>("有給休暇");
  const [searchQuery, setSearchQuery] = useState("");
  const [partTimeSearch, setPartTimeSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredPaidLeave = mockPaidLeave.filter((d) => d.name.includes(searchQuery));
  const filteredWorkers = mockWorkers.filter((w) => w.name.includes(partTimeSearch));
  const filteredJournals = mockJournals.filter((j) => {
    const matchesSearch = j.description.includes(journalSearch) || j.debitAccount.includes(journalSearch) || j.creditAccount.includes(journalSearch);
    const matchesCategory = categoryFilter === "all" || j.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="有給・労務">
      <div className="space-y-6">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "有給休暇" && (
          <>
            <div>
              <p className="text-sm text-slate-500">付与・取得・残日数管理</p>
            </div>

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

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
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

            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">付与日</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">付与日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">取得日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残日数</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">有効期限</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">消化率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPaidLeave.map((row) => {
                      const rate = Math.round((row.used / row.granted) * 100);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.grantDate}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.granted}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.used}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono font-medium tabular-nums whitespace-nowrap">
                            <span className={row.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>
                              {row.remaining}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.expiry}</td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rate >= 80 ? "bg-slate-900" : rate >= 50 ? "bg-blue-500" : "bg-slate-300"}`}
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
            </div>

            <div className="text-sm text-slate-500">全 {filteredPaidLeave.length} 件</div>
          </>
        )}

        {activeTab === "アルバイト" && (
          <>
            <div>
              <p className="text-sm text-slate-500">時給制アルバイトの勤怠・賃金管理</p>
            </div>

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

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="氏名で検索..."
                  value={partTimeSearch}
                  onChange={(e) => setPartTimeSearch(e.target.value)}
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

            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">時給</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">出勤日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総時間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWorkers.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.hourlyRate.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.overtime.toFixed(1)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
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
            </div>

            <div className="text-sm text-slate-500">全 {filteredWorkers.length} 件</div>
          </>
        )}

        {activeTab === "仕訳" && (
          <>
            <div>
              <p className="text-sm text-slate-500">仕訳・預り金テーブル管理</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">仕訳件数</p>
                    <p className="text-2xl font-semibold text-slate-900">{mockJournals.length}件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calculator className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">借方合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥1,381,700</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">貸方合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥526,700</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="勘定科目・摘要で検索..."
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">全カテゴリ</option>
                  <option value="給与">給与</option>
                  <option value="納付">納付</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />
                仕訳追加
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">日付</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">借方科目</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">借方金額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">貸方科目</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">貸方金額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">摘要</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJournals.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.debitAccount}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.debitAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.creditAccount}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.creditAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm text-slate-500">全 {filteredJournals.length} 件</div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
