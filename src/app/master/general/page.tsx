"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Search,
  Plus,
  Pencil,
  Building2,
  Clock,
  Train,
  Wrench,
  Package,
  Settings,
} from "lucide-react";

type MasterType = "supplier" | "earlyShift" | "transport" | "workType";

const masterConfig: Record<MasterType, { label: string; icon: typeof Building2; description: string }> = {
  supplier: { label: "供給先マスタ", icon: Building2, description: "派遣先・供給先の登録管理" },
  earlyShift: { label: "早出マスタ", icon: Clock, description: "早出時間帯・手当の設定" },
  transport: { label: "交通費マスタ", icon: Train, description: "路線別交通費の登録" },
  workType: { label: "作業区分マスタ", icon: Wrench, description: "作業種別・区分の管理" },
};

const supplierData = [
  { id: 1, code: "SUP001", name: "一産廃", address: "東京都世田谷区", contactPerson: "佐藤", phone: "03-1234-5678", status: "有効" },
  { id: 2, code: "SUP002", name: "区有施設", address: "東京都世田谷区", contactPerson: "田中", phone: "03-2345-6789", status: "有効" },
  { id: 3, code: "SUP003", name: "局集", address: "東京都新宿区", contactPerson: "鈴木", phone: "03-3456-7890", status: "有効" },
  { id: 4, code: "SUP004", name: "民間A社", address: "東京都渋谷区", contactPerson: "高橋", phone: "03-4567-8901", status: "有効" },
  { id: 5, code: "SUP005", name: "民間B社", address: "東京都中野区", contactPerson: "山田", phone: "03-5678-9012", status: "無効" },
];

const earlyShiftData = [
  { id: 1, code: "ES01", timeRange: "05:00〜06:00", allowance: 1500, note: "深夜帯割増" },
  { id: 2, code: "ES02", timeRange: "06:00〜07:00", allowance: 1000, note: "早朝割増" },
  { id: 3, code: "ES03", timeRange: "07:00〜08:00", allowance: 500, note: "早出手当" },
];

const transportData = [
  { id: 1, code: "TR01", route: "世田谷区内", amount: 500, note: "バス利用" },
  { id: 2, code: "TR02", route: "新宿方面", amount: 800, note: "電車利用" },
  { id: 3, code: "TR03", route: "渋谷方面", amount: 700, note: "電車利用" },
  { id: 4, code: "TR04", route: "品川方面", amount: 1000, note: "電車利用" },
];

const workTypeData = [
  { id: 1, code: "WT01", name: "収集運搬", category: "一般", note: "一般廃棄物収集" },
  { id: 2, code: "WT02", name: "施設管理", category: "施設", note: "区有施設清掃" },
  { id: 3, code: "WT03", name: "特殊作業", category: "特殊", note: "産業廃棄物処理" },
  { id: 4, code: "WT04", name: "運転業務", category: "運転", note: "長距離運搬" },
];

export default function GeneralMasterPage() {
  const [activeMaster, setActiveMaster] = useState<MasterType>("supplier");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <MainLayout title="各種マスタ管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">供給先・早出・交通費・作業区分等のマスタ一括管理</p>
        </div>

        {/* Master Type Selector */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.entries(masterConfig) as [MasterType, (typeof masterConfig)[MasterType]][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = activeMaster === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveMaster(key); setSearchQuery(""); }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-blue-300 bg-white shadow-sm ring-1 ring-blue-100"
                    : "border-slate-200/60 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${isActive ? "bg-blue-50" : "bg-slate-100"}`}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cfg.label}</p>
                    <p className="text-xs text-slate-500">{cfg.description}</p>
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
              placeholder="コード・名称で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Plus className="h-4 w-4" />
            新規追加
          </button>
        </div>

        {/* Supplier Table */}
        {activeMaster === "supplier" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">コード</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">名称</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">住所</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">担当者</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">電話番号</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">状態</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierData.filter((d) => d.name.includes(searchQuery) || d.code.includes(searchQuery)).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.code}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-700 text-xs whitespace-nowrap">{row.address}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.contactPerson}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono text-xs whitespace-nowrap">{row.phone}</td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.status === "有効" ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <button className="rounded-md p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Early Shift Table */}
        {activeMaster === "earlyShift" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">コード</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">時間帯</th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">手当額</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">備考</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {earlyShiftData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.code}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.timeRange}</td>
                    <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.allowance.toLocaleString()}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <button className="rounded-md p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transport Table */}
        {activeMaster === "transport" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">コード</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">路線/方面</th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">交通費</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">備考</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transportData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.code}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.route}</td>
                    <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.amount.toLocaleString()}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <button className="rounded-md p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Work Type Table */}
        {activeMaster === "workType" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">コード</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">区分名</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">カテゴリ</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">備考</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workTypeData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.code}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <button className="rounded-md p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
