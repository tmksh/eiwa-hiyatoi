"use client";

import { useState } from "react";
import { MainLayout, MasterSubnav } from "@/components/layout";
import {
  Search,
  Download,
  Upload,
  Table2,
  Shield,
  Heart,
  Briefcase,
  Building,
} from "lucide-react";

type TableType = "health" | "nursing" | "employment" | "pension";

const healthInsuranceRates = [
  { grade: 1, monthly: "63,000未満", standard: 58000, insured: 2871, employer: 2871 },
  { grade: 2, monthly: "63,000〜73,000", standard: 68000, insured: 3366, employer: 3366 },
  { grade: 3, monthly: "73,000〜83,000", standard: 78000, insured: 3861, employer: 3861 },
  { grade: 4, monthly: "83,000〜93,000", standard: 88000, insured: 4356, employer: 4356 },
  { grade: 5, monthly: "93,000〜101,000", standard: 98000, insured: 4851, employer: 4851 },
  { grade: 6, monthly: "101,000〜107,000", standard: 104000, insured: 5148, employer: 5148 },
];

const tableConfig: Record<TableType, { label: string; icon: typeof Shield; color: string }> = {
  health: { label: "健康保険", icon: Heart, color: "text-slate-600 bg-slate-100" },
  nursing: { label: "介護保険", icon: Shield, color: "text-blue-600 bg-blue-50" },
  employment: { label: "雇用保険", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
  pension: { label: "厚生年金", icon: Building, color: "text-slate-600 bg-slate-100" },
};

export default function RateTablesPage() {
  const [activeTable, setActiveTable] = useState<TableType>("health");
  const [searchQuery, setSearchQuery] = useState("");

  const config = tableConfig[activeTable];

  return (
    <MainLayout title="マスタ管理">
      <div className="space-y-6">
        <MasterSubnav />
        <div>
          <p className="text-sm text-slate-500">健康保険・介護保険・雇用保険・厚生年金料額表</p>
        </div>

        {/* Table Type Selector */}
        <div className="grid gap-4 sm:grid-cols-4">
          {(Object.entries(tableConfig) as [TableType, typeof config][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = activeTable === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTable(key)}
                className={`rounded-xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-blue-300 bg-white shadow-sm ring-1 ring-blue-100"
                    : "border-slate-200/60 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${cfg.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cfg.label}</p>
                    <p className="text-xs text-slate-500">料額表</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="等級・報酬月額で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Upload className="h-4 w-4" />
            料額表更新
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            エクスポート
          </button>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Table2 className="h-4 w-4 text-slate-400" />
          <span>{config.label}料額表（令和6年3月分〜適用）</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">等級</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">報酬月額</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">標準報酬月額</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">被保険者負担</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">事業主負担</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {healthInsuranceRates.map((row) => (
                <tr key={row.grade} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap tabular-nums">{row.grade}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-700 text-xs whitespace-nowrap">{row.monthly}</td>
                  <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.standard.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.insured.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.employer.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium whitespace-nowrap tabular-nums">¥{(row.insured + row.employer).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-slate-500">全 {healthInsuranceRates.length} 等級（一部表示）</div>
      </div>
    </MainLayout>
  );
}
