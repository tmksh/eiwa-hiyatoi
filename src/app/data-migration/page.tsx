"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import {
  Database,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  FileSearch,
  Server,
  HardDrive,
} from "lucide-react";

type MigrationStatus = "completed" | "pending" | "in_progress" | "error";

const migrationTasks = [
  { id: 1, tableName: "従業員マスタ", sourceTable: "T_従業員", records: 156, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 14:30", errors: 0 },
  { id: 2, tableName: "給与データ", sourceTable: "T_給与01〜T_給与40", records: 18720, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 15:10", errors: 3 },
  { id: 3, tableName: "社保印紙台帳", sourceTable: "T_印紙01〜T_印紙40", records: 9360, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 15:45", errors: 0 },
  { id: 4, tableName: "日報データ", sourceTable: "T_日報", records: 45200, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 16:20", errors: 12 },
  { id: 5, tableName: "徴収台帳", sourceTable: "T_徴収", records: 7800, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 16:35", errors: 0 },
  { id: 6, tableName: "源泉税テーブル", sourceTable: "T_源泉", records: 1560, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 16:40", errors: 0 },
  { id: 7, tableName: "住民税テーブル", sourceTable: "T_住民税", records: 1560, status: "completed" as MigrationStatus, migratedAt: "2024/01/15 16:42", errors: 1 },
  { id: 8, tableName: "仕訳データ", sourceTable: "T_仕訳", records: 32400, status: "pending" as MigrationStatus, migratedAt: null, errors: 0 },
  { id: 9, tableName: "マスタテーブル群", sourceTable: "M_*（15テーブル）", records: 2340, status: "pending" as MigrationStatus, migratedAt: null, errors: 0 },
  { id: 10, tableName: "料額表", sourceTable: "T_料額表", records: 620, status: "pending" as MigrationStatus, migratedAt: null, errors: 0 },
];

const statusConfig: Record<MigrationStatus, { label: string; class: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "完了", class: "bg-slate-100 text-slate-700", icon: CheckCircle2 },
  pending: { label: "未実行", class: "bg-slate-100 text-slate-500", icon: Clock },
  in_progress: { label: "実行中", class: "bg-blue-50 text-blue-700", icon: Play },
  error: { label: "エラー", class: "bg-slate-100 text-slate-700", icon: AlertTriangle },
};

export default function DataMigrationPage() {
  const [tasks] = useState(migrationTasks);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalRecords = tasks.reduce((acc, t) => acc + t.records, 0);
  const totalErrors = tasks.reduce((acc, t) => acc + t.errors, 0);
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <MainLayout title="データ移行">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">既存AccessDB 196テーブルからの全データ移行・整合性検証</p>
        </div>

        {/* Progress Banner */}
        <div className="rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">移行進捗</h3>
                <p className="text-xs text-slate-500">AccessDB 196テーブル → PostgreSQL 正規化テーブル</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{progress}%</p>
              <p className="text-xs text-slate-500">{completedCount}/{tasks.length} テーブル完了</p>
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-blue-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">総レコード</p>
                <p className="text-2xl font-semibold text-slate-900">{totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">移行完了</p>
                <p className="text-2xl font-semibold text-slate-900">{completedCount}件</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">エラー件数</p>
                <p className="text-2xl font-semibold text-slate-900">{totalErrors}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <HardDrive className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">元テーブル数</p>
                <p className="text-2xl font-semibold text-slate-900">196</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Play className="h-4 w-4" />
            未実行分を開始
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <FileSearch className="h-4 w-4" />
            整合性検証
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <RotateCcw className="h-4 w-4" />
            エラー分再実行
          </button>
        </div>

        {/* Migration Table */}
        <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">移行先テーブル</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">元テーブル</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">レコード数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ステータス</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">実行日時</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">エラー</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((row) => {
                const sc = statusConfig[row.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-medium">{row.tableName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                      <div className="flex items-center gap-1">
                        {row.sourceTable}
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 font-mono">{row.records.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sc.class}`}>
                        <StatusIcon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{row.migratedAt ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      {row.errors > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {row.errors}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
