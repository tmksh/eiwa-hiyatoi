"use client";

import { useState } from "react";
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
  ChevronRight,
  ChevronLeft,
  Banknote,
  BarChart2,
} from "lucide-react";

const reportCategories = [
  {
    title: "給与関連帳票",
    icon: Banknote,
    description: "給与明細・賃金台帳・一覧表",
    color: "text-slate-600",
    iconBg: "bg-slate-100",
    reports: [
      { name: "給与明細書", description: "個人別月次給与明細のPDF出力", icon: Receipt, status: "対応済" },
      { name: "賃金台帳", description: "法定賃金台帳の出力", icon: ClipboardList, status: "対応済" },
      { name: "給与一覧表", description: "全作業員の給与一覧", icon: FileSpreadsheet, status: "対応済" },
    ],
  },
  {
    title: "社会保険帳票",
    icon: ClipboardList,
    description: "社保印紙台帳・受払簿・徴収台帳",
    color: "text-slate-600",
    iconBg: "bg-slate-100",
    reports: [
      { name: "社保印紙台帳", description: "印紙貼付実績一覧", icon: FileText, status: "対応済" },
      { name: "印紙受払簿", description: "印紙受払記録の出力", icon: FileText, status: "対応済" },
      { name: "徴収台帳", description: "社保・住民税徴収記録", icon: ClipboardList, status: "準備中" },
    ],
  },
  {
    title: "税務帳票",
    icon: FileText,
    description: "源泉徴収票・納付書・住民税通知",
    color: "text-slate-600",
    iconBg: "bg-slate-100",
    reports: [
      { name: "源泉徴収票", description: "年末調整後の源泉徴収票", icon: Receipt, status: "対応済" },
      { name: "源泉税納付書", description: "源泉所得税の納付書出力", icon: FileText, status: "準備中" },
      { name: "住民税通知書", description: "特別徴収税額通知書", icon: Building2, status: "準備中" },
    ],
  },
  {
    title: "集計帳票",
    icon: BarChart2,
    description: "個人別・派遣先別・年間集計",
    color: "text-slate-600",
    iconBg: "bg-slate-100",
    reports: [
      { name: "個人別月別集計", description: "個人ごとの月別実績集計", icon: Users, status: "対応済" },
      { name: "派遣先別集計", description: "派遣先ごとの賃金集計", icon: Building2, status: "対応済" },
      { name: "年間集計表", description: "年間賃金・保険料集計", icon: Calendar, status: "準備中" },
    ],
  },
];

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const selected = reportCategories.find((c) => c.title === activeCategory);

  return (
    <MainLayout title="帳票出力">
      <div className="space-y-6">
        {/* Card navigation */}
        {!activeCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(cat.title)}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}>
                      <Icon className={`h-6 w-6 ${cat.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 mt-1 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{cat.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeCategory && (
          <>
            <button
              onClick={() => setActiveCategory(null)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              一覧に戻る
            </button>

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

            {selected && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">{selected.title}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selected.reports.map((report) => {
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
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
