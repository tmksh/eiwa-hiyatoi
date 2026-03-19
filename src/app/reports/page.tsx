"use client";

import { MainLayout } from "@/components/layout";
import {
  FileText,
  Download,
  Printer,
  Mail,
  FileSpreadsheet,
  Receipt,
  ClipboardList,
  Users,
  Building2,
  Calendar,
} from "lucide-react";

const reportCategories = [
  {
    title: "給与関連帳票",
    reports: [
      { name: "給与明細書", description: "個人別月次給与明細のPDF出力", icon: Receipt, status: "対応済" },
      { name: "賃金台帳", description: "法定賃金台帳の出力", icon: ClipboardList, status: "対応済" },
      { name: "給与一覧表", description: "全作業員の給与一覧", icon: FileSpreadsheet, status: "対応済" },
    ],
  },
  {
    title: "社会保険帳票",
    reports: [
      { name: "社保印紙台帳", description: "印紙貼付実績一覧", icon: FileText, status: "対応済" },
      { name: "印紙受払簿", description: "印紙受払記録の出力", icon: FileText, status: "対応済" },
      { name: "徴収台帳", description: "社保・住民税徴収記録", icon: ClipboardList, status: "準備中" },
    ],
  },
  {
    title: "税務帳票",
    reports: [
      { name: "源泉徴収票", description: "年末調整後の源泉徴収票", icon: Receipt, status: "対応済" },
      { name: "源泉税納付書", description: "源泉所得税の納付書出力", icon: FileText, status: "準備中" },
      { name: "住民税通知書", description: "特別徴収税額通知書", icon: Building2, status: "準備中" },
    ],
  },
  {
    title: "集計帳票",
    reports: [
      { name: "個人別月別集計", description: "個人ごとの月別実績集計", icon: Users, status: "対応済" },
      { name: "派遣先別集計", description: "派遣先ごとの賃金集計", icon: Building2, status: "対応済" },
      { name: "年間集計表", description: "年間賃金・保険料集計", icon: Calendar, status: "準備中" },
    ],
  },
];

export default function ReportsPage() {
  return (
    <MainLayout title="帳票出力">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">PDF自動生成・電子配布対応</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
            <Printer className="h-4 w-4" />
            一括印刷
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Mail className="h-4 w-4" />
            電子配布
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            一括ダウンロード
          </button>
        </div>

        {/* Report Categories */}
        {reportCategories.map((category) => (
          <div key={category.title} className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">{category.title}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.reports.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.name}
                    className="group rounded-xl border border-slate-200/60 bg-white p-5 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 group-hover:bg-blue-100 transition-colors">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-medium text-slate-900">{report.name}</h4>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            report.status === "対応済" ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{report.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            <FileText className="h-3 w-3" />
                            PDF
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            <FileSpreadsheet className="h-3 w-3" />
                            Excel
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            <Printer className="h-3 w-3" />
                            印刷
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
