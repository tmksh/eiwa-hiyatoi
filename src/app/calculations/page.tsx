"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import {
  CalendarIcon,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar as CalendarLucide,
  CalendarRange,
  FileText,
  Upload,
  Building2,
  FileOutput,
  Coins,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockCompanies = [
  { id: "all", name: "すべての会社" },
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

interface CalculationResult {
  total: number;
  success: number;
  failed: number;
  errors: { workerName: string; reason: string }[];
}

const mockResults = [
  { id: "1", workDate: new Date("2024-01-28"), workerName: "山田 太郎", company: "A運輸", vehicleType: "4t", startTime: "08:00", endTime: "19:30", workHours: 10.5, overtimeHours: 2.5, baseWage: 11000, overtimeWage: 3750, totalWage: 14750, status: "confirmed" as Status, hasWarning: false },
  { id: "2", workDate: new Date("2024-01-28"), workerName: "鈴木 一郎", company: "A運輸", vehicleType: "2t", startTime: "07:00", endTime: "18:00", workHours: 10, overtimeHours: 2, baseWage: 10000, overtimeWage: 2800, totalWage: 12800, status: "confirmed" as Status, hasWarning: false },
  { id: "3", workDate: new Date("2024-01-28"), workerName: "佐藤 花子", company: "B物流", vehicleType: "10t", startTime: "06:00", endTime: "20:00", workHours: 12.5, overtimeHours: 4.5, baseWage: 13000, overtimeWage: 6750, totalWage: 19750, status: "calculated" as Status, hasWarning: true, warningMessage: "拘束14時間超" },
  { id: "4", workDate: new Date("2024-01-28"), workerName: "高橋 健二", company: "A運輸", vehicleType: "4t", startTime: "08:30", endTime: "17:30", workHours: 8, overtimeHours: 0, baseWage: 11000, overtimeWage: 0, totalWage: 11000, status: "confirmed" as Status, hasWarning: false },
  { id: "5", workDate: new Date("2024-01-28"), workerName: "田中 美咲", company: "C配送", vehicleType: "2t", startTime: "09:00", endTime: "21:00", workHours: 11, overtimeHours: 3, baseWage: 10000, overtimeWage: 4200, totalWage: 14200, status: "calculated" as Status, hasWarning: true, warningMessage: "手動調整あり" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function formatAmount(value: number): string {
  return value.toLocaleString("ja-JP");
}

const wageLedgerData = [
  { id: 1, name: "山田 太郎", workDate: "2024-01-28", base: 12000, early: 1500, overtime: 3750, holiday: 0, deduction: 2850, net: 14400 },
  { id: 2, name: "鈴木 一郎", workDate: "2024-01-28", base: 11000, early: 1375, overtime: 0, holiday: 0, deduction: 2475, net: 9900 },
  { id: 3, name: "佐藤 花子", workDate: "2024-01-28", base: 13000, early: 0, overtime: 6500, holiday: 0, deduction: 3900, net: 15600 },
  { id: 4, name: "高橋 健二", workDate: "2024-01-29", base: 12000, early: 0, overtime: 4500, holiday: 0, deduction: 3300, net: 13200 },
  { id: 5, name: "田中 美咲", workDate: "2024-01-29", base: 10000, early: 0, overtime: 0, holiday: 0, deduction: 2000, net: 8000 },
];

const overtimeData = [
  { id: 1, name: "山田 太郎", date: "2024-01-28", normalHours: 8.0, overtimeHours: 2.5, rate: 1500, overtimePay: 4688, diffPay: 0 },
  { id: 2, name: "鈴木 一郎", date: "2024-01-28", normalHours: 8.0, overtimeHours: 1.0, rate: 1375, overtimePay: 1719, diffPay: 200 },
  { id: 3, name: "佐藤 花子", date: "2024-01-28", normalHours: 8.0, overtimeHours: 4.0, rate: 1625, overtimePay: 8125, diffPay: 0 },
  { id: 4, name: "高橋 健二", date: "2024-01-29", normalHours: 8.0, overtimeHours: 3.0, rate: 1500, overtimePay: 5625, diffPay: 500 },
];

const weeklyOvertimeData = [
  { id: 1, name: "山田 太郎", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 48.5, overHours: 8.5, rate: 1500, premium: 15938, status: "超過" },
  { id: 2, name: "鈴木 一郎", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 38.0, overHours: 0, rate: 1375, premium: 0, status: "範囲内" },
  { id: 3, name: "佐藤 花子", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 52.0, overHours: 12.0, rate: 1625, premium: 24375, status: "超過" },
  { id: 4, name: "高橋 健二", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 40.0, overHours: 0, rate: 1500, premium: 0, status: "範囲内" },
  { id: 5, name: "田中 美咲", weekStart: "2024-01-22", weekEnd: "2024-01-28", totalHours: 42.5, overHours: 2.5, rate: 1250, premium: 3906, status: "超過" },
];

const TABS = ["計算処理", "計算結果", "支払処理"] as const;
type Tab = (typeof TABS)[number];

const TAB_META: Record<Tab, { icon: React.ElementType; description: string; color: string; iconBg: string }> = {
  "計算処理": { icon: Calculator,   description: "一括計算・残業・週40h割増",  color: "text-blue-600",   iconBg: "bg-blue-50" },
  "計算結果": { icon: CheckCircle2, description: "計算結果の確認・賃金台帳",   color: "text-emerald-600", iconBg: "bg-emerald-50" },
  "支払処理": { icon: Coins,        description: "支払明細・振込・金種・期間払い", color: "text-amber-600",  iconBg: "bg-amber-50" },
};

const CALC_SUBTABS = ["一括計算", "残業計算", "週40h割増"] as const;
type CalcSubTab = (typeof CALC_SUBTABS)[number];

const RESULT_SUBTABS = ["計算結果", "賃金台帳"] as const;
type ResultSubTab = (typeof RESULT_SUBTABS)[number];

const PAYMENT_SUBTABS = ["支払明細", "振込データ", "金種表", "期間払い"] as const;
type PaymentSubTab = (typeof PAYMENT_SUBTABS)[number];

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

export default function CalculationsPage() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [calcSubTab, setCalcSubTab] = useState<CalcSubTab>("一括計算");
  const [resultSubTab, setResultSubTab] = useState<ResultSubTab>("計算結果");
  const [paymentSubTab, setPaymentSubTab] = useState<PaymentSubTab>("支払明細");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wageLedgerSearch, setWageLedgerSearch] = useState("");
  const [wageLedgerMonth, setWageLedgerMonth] = useState("");
  const [overtimeSearch, setOvertimeSearch] = useState("");
  const [overtimeDateFilter, setOvertimeDateFilter] = useState("");
  const [weeklySearch, setWeeklySearch] = useState("");
  const [weeklyWeekFilter, setWeeklyWeekFilter] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [denomSearch, setDenomSearch] = useState("");
  const [periodSearch, setPeriodSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  const previewData = { total: 187, calculable: 182, errors: 5 };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setProgress(0);
    setCalcResult(null);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress(i);
    }
    setCalcResult({
      total: 182, success: 177, failed: 5,
      errors: [
        { workerName: "佐藤 花子", reason: "賃金ルール未設定（C社・10t）" },
        { workerName: "高橋 健二", reason: "退勤時間が出勤より前" },
        { workerName: "渡辺 裕子", reason: "車種未設定" },
        { workerName: "中村 達也", reason: "会社情報なし" },
        { workerName: "小林 誠", reason: "賃金ルール期限切れ" },
      ],
    });
    setIsCalculating(false);
    toast.success("一括計算が完了しました");
  };

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = result.workerName.includes(searchQuery) || result.company.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredResults.reduce((sum, r) => sum + r.totalWage, 0);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredResults.map((r) => r.id) : []);
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
  };

  const handleConfirmSelected = () => {
    if (selectedIds.length === 0) { toast.error("確定する項目を選択してください"); return; }
    toast.success(`${selectedIds.length}件を確定しました`);
    setSelectedIds([]);
  };

  const handleRecalculateSelected = () => {
    if (selectedIds.length === 0) { toast.error("再計算する項目を選択してください"); return; }
    toast.success(`${selectedIds.length}件を再計算しました`);
    setSelectedIds([]);
  };

  const filteredWageLedger = wageLedgerData.filter((row) => {
    const matchesSearch = row.name.includes(wageLedgerSearch);
    const matchesMonth = !wageLedgerMonth || row.workDate.startsWith(wageLedgerMonth);
    return matchesSearch && matchesMonth;
  });

  const wageLedgerTotals = filteredWageLedger.reduce(
    (acc, row) => ({
      base: acc.base + row.base,
      early: acc.early + row.early,
      overtime: acc.overtime + row.overtime,
      holiday: acc.holiday + row.holiday,
      deduction: acc.deduction + row.deduction,
      net: acc.net + row.net,
    }),
    { base: 0, early: 0, overtime: 0, holiday: 0, deduction: 0, net: 0 }
  );

  const filteredOvertime = overtimeData.filter((row) => {
    const matchesSearch = row.name.includes(overtimeSearch);
    const matchesDate = !overtimeDateFilter || row.date === overtimeDateFilter;
    return matchesSearch && matchesDate;
  });

  const filteredWeekly = weeklyOvertimeData.filter((row) => {
    const matchesSearch = row.name.includes(weeklySearch);
    const matchesWeek = !weeklyWeekFilter || row.weekStart <= weeklyWeekFilter;
    return matchesSearch && matchesWeek;
  });

  const filteredPayment = paymentData.filter((row) => {
    const matchesSearch = row.name.includes(paymentSearch);
    const matchesMonth = !monthFilter || row.period.includes(monthFilter.replace("-", "年").replace(/(\d{2})$/, "$1月"));
    return matchesSearch && (monthFilter ? matchesMonth : true);
  });
  const filteredTransfers = transfersData.filter((row) => row.name.includes(transferSearch) || row.bank.includes(transferSearch));
  const filteredDenomination = denominationData.filter((row) => row.name.includes(denomSearch));
  const totalTransferAmount = filteredTransfers.reduce((sum, row) => sum + row.amount, 0);
  const filteredPeriodPayment = periodPaymentData.filter((row) => {
    const matchesSearch = row.name.includes(periodSearch);
    const matchesFilter = !periodFilter || row.status === periodFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout title="賃金・支払">
      <div className="space-y-6">
        {/* Card navigation */}
        {!activeTab && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TABS.map((tab) => {
              const meta = TAB_META[tab];
              const Icon = meta.icon;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.iconBg}`}>
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 mt-1 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{tab}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{meta.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab && (
          <button
            onClick={() => setActiveTab(null)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            一覧に戻る
          </button>
        )}

        {/* Sub Tabs */}
        {activeTab === "計算処理" && (
          <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
            {CALC_SUBTABS.map((sub) => (
              <button
                key={sub}
                onClick={() => setCalcSubTab(sub)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  calcSubTab === sub ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
        {activeTab === "計算結果" && (
          <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
            {RESULT_SUBTABS.map((sub) => (
              <button
                key={sub}
                onClick={() => setResultSubTab(sub)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  resultSubTab === sub ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
        {activeTab === "支払処理" && (
          <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
            {PAYMENT_SUBTABS.map((sub) => (
              <button
                key={sub}
                onClick={() => setPaymentSubTab(sub)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  paymentSubTab === sub ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {activeTab === "計算処理" && calcSubTab === "一括計算" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>計算対象を選択</CardTitle>
                <CardDescription>計算する日報の日付と対象会社を選択してください</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">対象日</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full sm:w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "yyyy年M月d日", { locale: ja }) : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">対象会社</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {mockCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>対象データ</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">対象件数</p>
                    <p className="text-3xl font-bold">{previewData.total}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
                    <p className="text-sm text-slate-600">計算可能</p>
                    <p className="text-3xl font-bold text-slate-700">{previewData.calculable}</p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-600">エラー（要確認）</p>
                    <p className="text-3xl font-bold text-blue-700">{previewData.errors}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button size="lg" onClick={handleCalculate} disabled={isCalculating} className="w-full sm:w-auto">
                    {isCalculating ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />計算中... {progress}%</>
                    ) : (
                      <><Calculator className="mr-2 h-5 w-5" />一括計算を実行</>
                    )}
                  </Button>
                </div>
                {isCalculating && (
                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{Math.floor((progress / 100) * previewData.calculable)} / {previewData.calculable} 件処理中</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {calcResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-slate-500" />計算完了
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Badge variant="secondary" className="text-base px-4 py-2">処理件数: {calcResult.total}</Badge>
                    <Badge variant="default" className="text-base px-4 py-2 bg-slate-900">成功: {calcResult.success}</Badge>
                    {calcResult.failed > 0 && <Badge variant="destructive" className="text-base px-4 py-2">失敗: {calcResult.failed}</Badge>}
                  </div>
                  {calcResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>エラー一覧</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1">
                          {calcResult.errors.map((error, index) => (
                            <li key={index} className="text-sm"><span className="font-medium">{error.workerName}</span>: {error.reason}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setCalcResult(null)}>閉じる</Button>
                    <Button onClick={() => { setActiveTab("計算結果"); setResultSubTab("計算結果"); }}>計算結果を確認</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "計算結果" && resultSubTab === "計算結果" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>計算結果一覧</CardTitle>
                  <CardDescription>計算結果の確認・確定・修正を行います</CardDescription>
                </div>
                <Button variant="outline" onClick={() => toast.success("CSVファイルをダウンロードしました")} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />CSV出力
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full sm:w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy年M月d日", { locale: ja }) : "日付を選択"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
                <div className="relative flex-1 min-w-0 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="作業員名・会社名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="ステータス" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="calculated">計算済</SelectItem>
                    <SelectItem value="confirmed">確定</SelectItem>
                    <SelectItem value="paid">支払済</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedIds.length > 0 && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-3">
                  <span className="text-sm font-medium">{selectedIds.length}件選択中</span>
                  <Button size="sm" onClick={handleConfirmSelected}><CheckCircle className="mr-2 h-4 w-4" />一括確定</Button>
                  <Button size="sm" variant="outline" onClick={handleRecalculateSelected}><RefreshCw className="mr-2 h-4 w-4" />再計算</Button>
                </div>
              )}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox checked={selectedIds.length === filteredResults.length && filteredResults.length > 0} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead className="whitespace-nowrap">氏名</TableHead>
                      <TableHead className="whitespace-nowrap">会社</TableHead>
                      <TableHead className="whitespace-nowrap">車種</TableHead>
                      <TableHead className="text-right whitespace-nowrap">出勤</TableHead>
                      <TableHead className="text-right whitespace-nowrap">退勤</TableHead>
                      <TableHead className="text-right whitespace-nowrap">残業</TableHead>
                      <TableHead className="text-right whitespace-nowrap">合計</TableHead>
                      <TableHead className="whitespace-nowrap">状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id} className={cn(result.hasWarning && "bg-blue-50")}>
                        <TableCell>
                          <Checkbox checked={selectedIds.includes(result.id)} onCheckedChange={(checked) => handleSelect(result.id, checked as boolean)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.workerName}</span>
                            {result.hasWarning && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                          </div>
                          {result.hasWarning && <p className="text-xs text-blue-600">{result.warningMessage}</p>}
                        </TableCell>
                        <TableCell>{result.company}</TableCell>
                        <TableCell>{result.vehicleType}</TableCell>
                        <TableCell className="text-right font-mono whitespace-nowrap">{result.startTime}</TableCell>
                        <TableCell className="text-right font-mono whitespace-nowrap">{result.endTime}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{result.overtimeHours.toFixed(1)}h</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{formatCurrency(result.totalWage)}</TableCell>
                        <TableCell><StatusBadge status={result.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-muted/50 p-4">
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm">
                  <span>全 {filteredResults.length} 件</span>
                  <span>確定: {filteredResults.filter((r) => r.status === "confirmed").length}件</span>
                  <span>未確定: {filteredResults.filter((r) => r.status === "calculated").length}件</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">合計金額</p>
                  <p className="text-xl sm:text-2xl font-bold whitespace-nowrap">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "計算結果" && resultSubTab === "賃金台帳" && (
          <>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="氏名で検索..."
                    value={wageLedgerSearch}
                    onChange={(e) => setWageLedgerSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="month"
                    value={wageLedgerMonth}
                    onChange={(e) => setWageLedgerMonth(e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calculator className="h-4 w-4" />
                  <span>{filteredWageLedger.length} 件</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業日</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">基本給</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">早出手当</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業手当</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">休日手当</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">控除合計</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWageLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono whitespace-nowrap">{row.workDate}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono whitespace-nowrap tabular-nums">{formatNumber(row.base)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">{formatNumber(row.early)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">{formatNumber(row.overtime)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">{formatNumber(row.holiday)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono whitespace-nowrap tabular-nums">-{formatNumber(row.deduction)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-semibold font-mono whitespace-nowrap tabular-nums">{formatNumber(row.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-semibold whitespace-nowrap" colSpan={2}>合計</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold whitespace-nowrap tabular-nums">{formatNumber(wageLedgerTotals.base)}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold whitespace-nowrap tabular-nums">{formatNumber(wageLedgerTotals.early)}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold whitespace-nowrap tabular-nums">{formatNumber(wageLedgerTotals.overtime)}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold whitespace-nowrap tabular-nums">{formatNumber(wageLedgerTotals.holiday)}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono font-semibold whitespace-nowrap tabular-nums">-{formatNumber(wageLedgerTotals.deduction)}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-bold whitespace-nowrap tabular-nums">{formatNumber(wageLedgerTotals.net)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "計算処理" && calcSubTab === "残業計算" && (
          <>
            <p className="text-sm text-slate-500">残業差額支給・単価算出</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">残業合計時間</p>
                    <p className="text-xl font-semibold text-slate-900">10.5h</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calculator className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">残業手当合計</p>
                    <p className="text-xl font-semibold text-slate-900">{formatNumber(20157)}円</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">差額支給対象</p>
                    <p className="text-xl font-semibold text-slate-900">2件</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="氏名で検索..."
                    value={overtimeSearch}
                    onChange={(e) => setOvertimeSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={overtimeDateFilter}
                    onChange={(e) => setOvertimeDateFilter(e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">日付</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">通常時間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業時間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">時間単価</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業手当</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差額支給</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOvertime.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.normalHours.toFixed(1)}h</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">{row.overtimeHours.toFixed(1)}h</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{formatNumber(row.rate)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatNumber(row.overtimePay)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                          {row.diffPay > 0 ? (
                            <span className="text-blue-600 font-medium">{formatNumber(row.diffPay)}円</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "計算処理" && calcSubTab === "週40h割増" && (
          <>
            <p className="text-sm text-slate-500">週40時間超過の割増計算</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Clock className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">40h超過者数</p>
                    <p className="text-xl font-semibold text-slate-900">3名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">超過時間合計</p>
                    <p className="text-xl font-semibold text-slate-900">23.0h</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">割増手当合計</p>
                    <p className="text-xl font-semibold text-slate-900">{formatNumber(44219)}円</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="氏名で検索..."
                    value={weeklySearch}
                    onChange={(e) => setWeeklySearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="week"
                    value={weeklyWeekFilter}
                    onChange={(e) => setWeeklyWeekFilter(e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">氏名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">週期間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">週合計時間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">40h超過分</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">時間単価</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">割増手当</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWeekly.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono text-xs whitespace-nowrap">{row.weekStart} ~ {row.weekEnd}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}h</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                          {row.overHours > 0 ? (
                            <span className="text-slate-600 font-medium">{row.overHours.toFixed(1)}h</span>
                          ) : (
                            <span className="text-slate-400">0.0h</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{formatNumber(row.rate)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">
                          {row.premium > 0 ? `${formatNumber(row.premium)}円` : "—"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "支払処理" && paymentSubTab === "支払明細" && (
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
                  <input type="text" placeholder="氏名で検索..." value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <CalendarLucide className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                      {["氏名","対象期間","稼働日数","総支給額","控除合計","差引支給額","ステータス"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["稼働日数","総支給額","控除合計","差引支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayment.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalWork}日</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">{formatAmount(row.grossPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono tabular-nums whitespace-nowrap">-{formatAmount(row.deductions)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatAmount(row.netPay)}円</td>
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

        {activeTab === "支払処理" && paymentSubTab === "振込データ" && (
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
              {[
                { label: "振込件数", value: `${filteredTransfers.length}件`, icon: Building2, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "振込総額", value: `${formatAmount(totalTransferAmount)}円`, icon: Building2, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "FB生成済", value: `${transfersData.filter((r) => r.status === "生成済").length}件`, icon: FileOutput, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-xs text-slate-500">{label}</p><p className="text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="氏名・銀行名で検索..." value={transferSearch} onChange={(e) => setTransferSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <CalendarLucide className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="month" className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["氏名","銀行名","支店名","口座種別","口座番号","振込金額","ステータス"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${h === "振込金額" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
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
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold whitespace-nowrap tabular-nums">{formatAmount(row.amount)}円</td>
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

        {activeTab === "支払処理" && paymentSubTab === "金種表" && (
          <>
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Download className="h-4 w-4" />印刷 / PDF出力
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "現金支給総額", value: `${formatAmount(denomTotals.netPay)}円`, icon: Coins, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "対象人数", value: `${filteredDenomination.length}名`, icon: FileText, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="氏名で検索..." value={denomSearch} onChange={(e) => setDenomSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
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
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatAmount(row.netPay)}</td>
                        {[row.man, row.gosen, row.sen, row.gohyaku, row.hyaku, row.goju, row.ju, row.go, row.ichi].map((v, i) => (
                          <td key={i} className="px-3 py-3 text-center text-slate-700 font-mono tabular-nums whitespace-nowrap">{v || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-semibold whitespace-nowrap">合計</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-bold tabular-nums whitespace-nowrap">{formatAmount(denomTotals.netPay)}</td>
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

        {activeTab === "支払処理" && paymentSubTab === "期間払い" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "支給済", value: `${periodPaymentData.filter((r) => r.status === "支給済").length}件`, icon: CheckCircle2, bg: "bg-emerald-50", ic: "text-emerald-600" },
                { label: "計算済", value: `${periodPaymentData.filter((r) => r.status === "計算済").length}件`, icon: Clock, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "未計算", value: `${periodPaymentData.filter((r) => r.status === "未計算").length}件`, icon: AlertCircle, bg: "bg-amber-50", ic: "text-amber-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-xs text-slate-500">{label}</p><p className="text-lg sm:text-xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
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
                      {["氏名","対象期間","稼働日数","合計時間","総支給額","控除合計","差引支給額","ステータス"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["稼働日数","合計時間","総支給額","控除合計","差引支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPeriodPayment.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}日</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}h</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">{formatAmount(row.grossPay)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-600 font-mono tabular-nums whitespace-nowrap">-{formatAmount(row.deductions)}円</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">{formatAmount(row.netPay)}円</td>
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
