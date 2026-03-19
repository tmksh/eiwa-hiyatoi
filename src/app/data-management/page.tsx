"use client";

import { MainLayout } from "@/components/layout";
import {
  Lock,
  Unlock,
  Trash2,
  Settings,
  ShieldCheck,
  Database,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Clock,
} from "lucide-react";

const lockableMonths = [
  { month: "2024/01", status: "ロック済", lockedAt: "2024/02/05 10:30", lockedBy: "管理者" },
  { month: "2023/12", status: "ロック済", lockedAt: "2024/01/08 09:15", lockedBy: "管理者" },
  { month: "2023/11", status: "ロック済", lockedAt: "2023/12/05 11:00", lockedBy: "管理者" },
  { month: "2024/02", status: "未ロック", lockedAt: null, lockedBy: null },
];

export default function DataManagementPage() {
  return (
    <MainLayout title="データ管理">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">データ更新ロック・クリア・システム制御</p>
        </div>

        {/* System Status Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <ShieldCheck className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">システム状態</p>
                <p className="text-lg font-semibold text-slate-600">正常稼働中</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">DB使用量</p>
                <p className="text-lg font-semibold text-slate-900">245 MB</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <HardDrive className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">最終バックアップ</p>
                <p className="text-lg font-semibold text-slate-900">03:00</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">ロック済月数</p>
                <p className="text-lg font-semibold text-slate-900">3ヶ月</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lock Management */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">月別データロック</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ロック日時</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">実行者</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lockableMonths.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.month}</td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.status === "ロック済" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {row.status === "ロック済" ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.lockedAt ?? "—"}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.lockedBy ?? "—"}</td>
                    <td className="px-3 sm:px-4 py-3">
                      {row.status === "ロック済" ? (
                        <button className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                          <Unlock className="h-3 w-3" />
                          解除
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors">
                          <Lock className="h-3 w-3" />
                          ロック
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Control */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">システム制御</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">キャッシュクリア</h4>
                  <p className="mt-1 text-xs text-slate-500">計算結果キャッシュを削除し、再計算可能にします。</p>
                  <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    実行
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">整合性チェック</h4>
                  <p className="mt-1 text-xs text-slate-500">テーブル間の整合性を検証し、不整合を検出します。</p>
                  <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    実行
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Trash2 className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">データクリア</h4>
                  <p className="mt-1 text-xs text-slate-500">指定月のデータを全削除します。この操作は取り消せません。</p>
                  <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <AlertTriangle className="h-3 w-3" />
                    実行
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
