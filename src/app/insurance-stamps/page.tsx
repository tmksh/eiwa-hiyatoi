"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Stamp,
  ArrowRightLeft,
  Info,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Banknote,
  CalendarDays,
  TrendingUp,
  ClipboardList,
  Building2,
  Users,
  FileText,
  Calculator,
  TrendingDown,
  Landmark,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Plus,
  Truck,
  Calendar,
  Upload,
  Table2,
  Shield,
  Heart,
  Briefcase,
  Building,
  Clock,
  Train,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

const stampsData = [
  { id: 1, name: "山田 太郎", grade: "1級", method: "印紙", days: 22, amount: 7128, month: "2024/01" },
  { id: 2, name: "鈴木 一郎", grade: "2級", method: "印紙", days: 20, amount: 5880, month: "2024/01" },
  { id: 3, name: "佐藤 花子", grade: "3級", method: "現金", days: 18, amount: 4536, month: "2024/01" },
  { id: 4, name: "高橋 健二", grade: "1級", method: "印紙", days: 21, amount: 6804, month: "2024/01" },
  { id: 5, name: "田中 美咲", grade: "2級", method: "現金", days: 19, amount: 5586, month: "2024/01" },
];

const ledgerData = [
  { id: 1, date: "2024/01/04", type: "受入", grade1: 10, grade2: 10, grade3: 5, note: "月初受入" },
  { id: 2, date: "2024/01/05", type: "払出", grade1: 3, grade2: 2, grade3: 1, note: "日雇保険貼付" },
  { id: 3, date: "2024/01/10", type: "払出", grade1: 5, grade2: 4, grade3: 2, note: "日雇保険貼付" },
  { id: 4, date: "2024/01/15", type: "受入", grade1: 20, grade2: 15, grade3: 10, note: "追加購入" },
  { id: 5, date: "2024/01/20", type: "払出", grade1: 4, grade2: 3, grade3: 2, note: "日雇保険貼付" },
  { id: 6, date: "2024/01/25", type: "払出", grade1: 6, grade2: 5, grade3: 3, note: "日雇保険貼付" },
];

const balance = { g1: 12, g2: 11, g3: 7 };

const cashPaymentData = [
  { id: 1, name: "佐藤 花子", period: "2024/01", healthIns: 12450, pension: 8900, nursingIns: 1580, total: 22930, paidDate: "2024/02/05", status: "納付済" },
  { id: 2, name: "田中 美咲", period: "2024/01", healthIns: 10200, pension: 7300, nursingIns: 1290, total: 18790, paidDate: "2024/02/05", status: "納付済" },
  { id: 3, name: "渡辺 剛", period: "2024/01", healthIns: 14100, pension: 10100, nursingIns: 1780, total: 25980, paidDate: null, status: "未納付" },
  { id: 4, name: "伊藤 直樹", period: "2024/01", healthIns: 11800, pension: 8450, nursingIns: 1490, total: 21740, paidDate: "2024/02/10", status: "納付済" },
];

const collectionLedgerData = [
  { id: 1, name: "山田 太郎", healthIns: 15400, pension: 27450, nursingIns: 2780, empIns: 1830, residentTax: 8500, total: 55960, updatedAt: "2024/01/28 14:32" },
  { id: 2, name: "鈴木 一郎", healthIns: 12800, pension: 22800, nursingIns: 2310, empIns: 1520, residentTax: 6300, total: 45730, updatedAt: "2024/01/28 15:10" },
  { id: 3, name: "佐藤 花子", healthIns: 18200, pension: 32400, nursingIns: 3280, empIns: 2160, residentTax: 12000, total: 68040, updatedAt: "2024/01/27 09:45" },
  { id: 4, name: "高橋 健二", healthIns: 14600, pension: 26000, nursingIns: 2640, empIns: 1740, residentTax: 7800, total: 52780, updatedAt: "2024/01/26 11:20" },
  { id: 5, name: "田中 美咲", healthIns: 11200, pension: 19950, nursingIns: 2020, empIns: 1330, residentTax: 5200, total: 39700, updatedAt: "2024/01/25 16:55" },
];

const TABS = ["印紙管理", "受払簿", "現金納付", "徴収台帳", "源泉税", "住民税", "人員管理", "車両・賃金", "各種設定"] as const;
type Tab = (typeof TABS)[number];

// --- Workers ---
const mockWorkers = [
  { id: "1", employeeCode: "E001", name: "山田 太郎", nameKana: "ヤマダ タロウ", defaultCompany: "A運輸株式会社", phone: "090-1234-5678", isActive: true },
  { id: "2", employeeCode: "E002", name: "鈴木 一郎", nameKana: "スズキ イチロウ", defaultCompany: "A運輸株式会社", phone: "090-2345-6789", isActive: true },
  { id: "3", employeeCode: "E003", name: "佐藤 花子", nameKana: "サトウ ハナコ", defaultCompany: "B物流株式会社", phone: "090-3456-7890", isActive: true },
  { id: "4", employeeCode: "E004", name: "高橋 健二", nameKana: "タカハシ ケンジ", defaultCompany: "A運輸株式会社", phone: "090-4567-8901", isActive: true },
  { id: "5", employeeCode: "E005", name: "田中 美咲", nameKana: "タナカ ミサキ", defaultCompany: "C配送センター", phone: "090-5678-9012", isActive: false },
];

// --- Companies ---
const mockCompanies = [
  { id: "1", code: "A001", name: "A運輸株式会社", overtimeUnit: 15, roundingMethod: "floor", isActive: true },
  { id: "2", code: "B001", name: "B物流株式会社", overtimeUnit: 10, roundingMethod: "round", isActive: true },
  { id: "3", code: "C001", name: "C配送センター", overtimeUnit: 5, roundingMethod: "ceil", isActive: true },
  { id: "4", code: "D001", name: "D輸送株式会社", overtimeUnit: 15, roundingMethod: "floor", isActive: false },
];
const roundingMethodLabels: Record<string, string> = { floor: "切り捨て", ceil: "切り上げ", round: "四捨五入" };

// --- Vehicles ---
const mockVehicleTypes = [
  { id: "1", code: "2T", name: "2tトラック", companyId: "1", companyName: "A運輸株式会社", displayOrder: 1, isActive: true },
  { id: "2", code: "4T", name: "4tトラック", companyId: "1", companyName: "A運輸株式会社", displayOrder: 2, isActive: true },
  { id: "3", code: "10T", name: "10tトラック", companyId: "1", companyName: "A運輸株式会社", displayOrder: 3, isActive: true },
  { id: "4", code: "2T", name: "2tトラック", companyId: "2", companyName: "B物流株式会社", displayOrder: 1, isActive: true },
  { id: "5", code: "4T", name: "4tトラック", companyId: "2", companyName: "B物流株式会社", displayOrder: 2, isActive: true },
  { id: "6", code: "10T", name: "10tトラック", companyId: "2", companyName: "B物流株式会社", displayOrder: 3, isActive: true },
  { id: "7", code: "2T", name: "2tトラック", companyId: "3", companyName: "C配送センター", displayOrder: 1, isActive: true },
  { id: "8", code: "4T", name: "4tトラック", companyId: "3", companyName: "C配送センター", displayOrder: 2, isActive: false },
];

// --- Wage Rules ---
const mockWageRules = [
  { id: "1", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "2tトラック", baseDailyWage: 10000, baseHours: 8, overtimeRateNormal: 1400, overtimeRateLate: 1750, overtimeRateHoliday: 1750, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "2", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "4tトラック", baseDailyWage: 11000, baseHours: 8, overtimeRateNormal: 1500, overtimeRateLate: 1875, overtimeRateHoliday: 1875, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "3", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "10tトラック", baseDailyWage: 13000, baseHours: 8, overtimeRateNormal: 1800, overtimeRateLate: 2250, overtimeRateHoliday: 2250, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "4", companyId: "2", companyName: "B物流株式会社", vehicleTypeName: "2tトラック", baseDailyWage: 9500, baseHours: 8, overtimeRateNormal: 1300, overtimeRateLate: 1625, overtimeRateHoliday: 1625, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "5", companyId: "2", companyName: "B物流株式会社", vehicleTypeName: "4tトラック", baseDailyWage: 10500, baseHours: 8, overtimeRateNormal: 1450, overtimeRateLate: 1815, overtimeRateHoliday: 1815, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "6", companyId: "3", companyName: "C配送センター", vehicleTypeName: "2tトラック", baseDailyWage: 9000, baseHours: 8, overtimeRateNormal: 1250, overtimeRateLate: 1565, overtimeRateHoliday: 1565, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
];
function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
}

// --- Rate Tables ---
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

// --- General Masters ---
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

const withholdingData = [
  { id: 1, name: "山田 太郎", grossPay: 285000, deduction: 6800, netTax: 6800, month: "2024/01", status: "計算済" },
  { id: 2, name: "鈴木 一郎", grossPay: 245000, deduction: 5200, netTax: 5200, month: "2024/01", status: "計算済" },
  { id: 3, name: "佐藤 花子", grossPay: 320000, deduction: 8900, netTax: 8900, month: "2024/01", status: "計算済" },
  { id: 4, name: "高橋 健二", grossPay: 268000, deduction: 6100, netTax: 6100, month: "2024/01", status: "未計算" },
  { id: 5, name: "田中 美咲", grossPay: 198000, deduction: 3800, netTax: 3800, month: "2024/01", status: "計算済" },
];

const residentData = [
  { id: 1, name: "山田 太郎", municipality: "世田谷区", annualAmount: 102000, monthlyAmount: 8500, collected: 8500, balance: 93500, month: "2024/01", status: "徴収済" },
  { id: 2, name: "鈴木 一郎", municipality: "杉並区", annualAmount: 75600, monthlyAmount: 6300, collected: 6300, balance: 69300, month: "2024/01", status: "徴収済" },
  { id: 3, name: "佐藤 花子", municipality: "練馬区", annualAmount: 144000, monthlyAmount: 12000, collected: 0, balance: 144000, month: "2024/01", status: "未徴収" },
  { id: 4, name: "高橋 健二", municipality: "板橋区", annualAmount: 93600, monthlyAmount: 7800, collected: 7800, balance: 85800, month: "2024/01", status: "徴収済" },
  { id: 5, name: "田中 美咲", municipality: "豊島区", annualAmount: 62400, monthlyAmount: 5200, collected: 5200, balance: 57200, month: "2024/01", status: "徴収済" },
];

export default function InsuranceStampsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("印紙管理");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  // Master management states
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [workerSearch, setWorkerSearch] = useState("");
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleCompanyFilter, setVehicleCompanyFilter] = useState("all");
  const [wageDialogOpen, setWageDialogOpen] = useState(false);
  const [wageSearch, setWageSearch] = useState("");
  const [wageCompanyFilter, setWageCompanyFilter] = useState("all");
  const [activeTable, setActiveTable] = useState<TableType>("health");
  const [rateSearch, setRateSearch] = useState("");
  const [activeMaster, setActiveMaster] = useState<MasterType>("supplier");
  const [masterSearch, setMasterSearch] = useState("");
  const [personnelSubTab, setPersonnelSubTab] = useState<"workers" | "companies">("workers");
  const [vehicleWageSubTab, setVehicleWageSubTab] = useState<"vehicles" | "wage-rules">("vehicles");
  const [settingsSubTab, setSettingsSubTab] = useState<"rate-tables" | "general">("rate-tables");

  const filteredStamps = stampsData.filter((d) => {
    const matchesSearch = d.name.includes(searchQuery);
    const matchesMethod = methodFilter === "all" || d.method === (methodFilter === "stamp" ? "印紙" : "現金");
    return matchesSearch && matchesMethod;
  });

  const filteredWorkers = mockWorkers.filter(
    (w) => w.name.includes(workerSearch) || w.nameKana.includes(workerSearch) || w.employeeCode.includes(workerSearch)
  );
  const filteredCompanies = mockCompanies.filter(
    (c) => c.name.includes(companySearch) || c.code.includes(companySearch)
  );
  const filteredVehicles = mockVehicleTypes.filter((v) => {
    const matchSearch = v.name.includes(vehicleSearch) || v.code.includes(vehicleSearch);
    const matchCompany = vehicleCompanyFilter === "all" || v.companyId === vehicleCompanyFilter;
    return matchSearch && matchCompany;
  });
  const filteredWageRules = mockWageRules.filter((r) => {
    const matchSearch = r.companyName.includes(wageSearch) || r.vehicleTypeName.includes(wageSearch);
    const matchCompany = wageCompanyFilter === "all" || r.companyId === wageCompanyFilter;
    return matchSearch && matchCompany;
  });

  const filteredLedger = ledgerData.filter((d) =>
    d.note.includes(searchQuery) || d.date.includes(searchQuery)
  );

  const filteredCashPayments = cashPaymentData.filter((p) => p.name.includes(searchQuery));

  const filteredCollectionLedger = collectionLedgerData.filter((d) => d.name.includes(searchQuery));
  const collectionGrandTotal = filteredCollectionLedger.reduce((acc, d) => acc + d.total, 0);

  const filteredWithholding = withholdingData.filter((d) => d.name.includes(searchQuery));
  const filteredResident = residentData.filter(
    (d) => d.name.includes(searchQuery) || d.municipality.includes(searchQuery)
  );
  const totalTax = filteredWithholding.reduce((acc, d) => acc + d.netTax, 0);
  const totalBalance = filteredResident.reduce((acc, d) => acc + d.balance, 0);

  return (
    <MainLayout title="マスタ設定">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(""); setMethodFilter("all"); }}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "印紙管理" && (
          <>
            <p className="text-sm text-slate-500">40テーブル正規化統合・印紙方式/現金納付切替対応</p>
            <div className="flex items-start gap-3 rounded-xl border border-blue-200/60 bg-blue-50/50 p-4">
              <Info className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">正規化統合モード</p>
                <p className="mt-1 text-blue-600">
                  旧40テーブル（印紙台帳01〜40）を統合テーブルに正規化済み。印紙方式と現金納付の切替が可能です。
                </p>
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
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">全方式</option>
                  <option value="stamp">印紙方式</option>
                  <option value="cash">現金納付</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <ArrowRightLeft className="h-4 w-4" />
                方式切替
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Stamp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">印紙方式</p>
                    <p className="text-2xl font-semibold text-slate-900">3名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <RefreshCw className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">現金納付</p>
                    <p className="text-2xl font-semibold text-slate-900">2名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Stamp className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">当月合計額</p>
                    <p className="text-2xl font-semibold text-slate-900">¥29,934</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ID</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">等級</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">方式</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStamps.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.id}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.grade}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.method === "印紙" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {row.method}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.days}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">¥{row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredStamps.length} 件</div>
          </>
        )}

        {activeTab === "受払簿" && (
          <>
            <p className="text-sm text-slate-500">雇用保険印紙受払記録</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <ArrowDownRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">受入合計</p>
                    <p className="text-2xl font-semibold text-slate-900">70枚</p>
                    <p className="text-xs text-slate-400 mt-1">1級:30 / 2級:25 / 3級:15</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <ArrowUpRight className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">払出合計</p>
                    <p className="text-2xl font-semibold text-slate-900">40枚</p>
                    <p className="text-xs text-slate-400 mt-1">1級:18 / 2級:14 / 3級:8</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Package className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">現在残高</p>
                    <p className="text-2xl font-semibold text-slate-900">30枚</p>
                    <p className="text-xs text-slate-400 mt-1">
                      1級:{balance.g1} / 2級:{balance.g2} / 3級:{balance.g3}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="日付・摘要で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <BookOpen className="h-4 w-4" />
                月別表示
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">区分</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">1級(枚)</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">2級(枚)</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">3級(枚)</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">摘要</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.type === "受入" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.grade1}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.grade2}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.grade3}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredLedger.length} 件</div>
          </>
        )}

        {activeTab === "現金納付" && (
          <>
            <p className="text-sm text-slate-500">社保現金納付実績管理</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Banknote className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">当月納付額合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥89,440</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <CalendarDays className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">納付済</p>
                    <p className="text-2xl font-semibold text-slate-900">3件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">未納付</p>
                    <p className="text-2xl font-semibold text-slate-900">1件</p>
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象期間</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">健康保険</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">厚生年金</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">介護保険</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">納付日</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCashPayments.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.healthIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.pension.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.nursingIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.paidDate ?? "—"}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === "納付済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
            <div className="text-sm text-slate-500">全 {filteredCashPayments.length} 件</div>
          </>
        )}

        {activeTab === "徴収台帳" && (
          <>
            <p className="text-sm text-slate-500">社会保険・住民税徴収台帳</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">対象人数</p>
                    <p className="text-2xl font-semibold text-slate-900">{filteredCollectionLedger.length}名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <ClipboardList className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">徴収合計額</p>
                    <p className="text-2xl font-semibold text-slate-900">¥{collectionGrandTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">対象期間</p>
                    <p className="text-2xl font-semibold text-slate-900">2024/01</p>
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
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                期間選択
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">更新日時</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">健康保険</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">厚生年金</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">介護保険</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">雇用保険</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">住民税</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCollectionLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{row.updatedAt}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.healthIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.pension.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.nursingIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.empIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.residentTax.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                          <button className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            <Pencil className="h-3 w-3" />
                            編集
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-semibold whitespace-nowrap" colSpan={7}>合計</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-bold tabular-nums whitespace-nowrap">¥{collectionGrandTotal.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "源泉税" && (
          <>
            <p className="text-sm text-slate-500">源泉徴収票・納付テーブル管理</p>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <TrendingDown className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">当月源泉税合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥{totalTax.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calculator className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">計算済</p>
                    <p className="text-2xl font-semibold text-slate-900">4件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">未計算</p>
                    <p className="text-2xl font-semibold text-slate-900">1件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <CalendarDays className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">納付期限</p>
                    <p className="text-lg font-semibold text-slate-900">2024/02/10</p>
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
                <Calculator className="h-4 w-4" />
                一括計算
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <FileText className="h-4 w-4" />
                源泉徴収票出力
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">支給額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">控除額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">源泉税額</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWithholding.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.deduction.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.netTax.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === "計算済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
            <div className="text-sm text-slate-500">全 {filteredWithholding.length} 件</div>
          </>
        )}

        {activeTab === "住民税" && (
          <>
            <p className="text-sm text-slate-500">住民税徴収台帳・残高管理</p>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Landmark className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">年間総額</p>
                    <p className="text-2xl font-semibold text-slate-900">¥477,600</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <CheckCircle2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">当月徴収済</p>
                    <p className="text-2xl font-semibold text-slate-900">4件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">未徴収</p>
                    <p className="text-2xl font-semibold text-slate-900">1件</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Wallet className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">残高合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥{totalBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="氏名・市区町村で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">市区町村</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">年間額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">月額</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">徴収済</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残高</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResident.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.municipality}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.annualAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.monthlyAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.collected.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.balance.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === "徴収済" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
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
            <div className="text-sm text-slate-500">全 {filteredResident.length} 件</div>
          </>
        )}

        {/* ===== 人員管理 ===== */}
        {activeTab === "人員管理" && (
          <div className="space-y-4">
            <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
              {([["workers", "作業員"], ["companies", "会社"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setPersonnelSubTab(val)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    personnelSubTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {personnelSubTab === "workers" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>作業員一覧</CardTitle>
                      <CardDescription>日雇い作業員の情報を管理します</CardDescription>
                    </div>
                    <Dialog open={workerDialogOpen} onOpenChange={setWorkerDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />新規登録</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>作業員を新規登録</DialogTitle>
                          <DialogDescription>作業員の情報を入力してください</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="employeeCode">従業員番号</Label>
                            <Input id="employeeCode" placeholder="例: E001" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="wname">氏名</Label>
                              <Input id="wname" placeholder="例: 山田 太郎" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="nameKana">フリガナ</Label>
                              <Input id="nameKana" placeholder="例: ヤマダ タロウ" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>主な派遣先</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                              <SelectContent>
                                {mockCompanies.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">電話番号</Label>
                            <Input id="phone" placeholder="例: 090-1234-5678" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setWorkerDialogOpen(false)}>キャンセル</Button>
                          <Button onClick={() => setWorkerDialogOpen(false)}>登録する</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="氏名・従業員番号で検索..." value={workerSearch} onChange={(e) => setWorkerSearch(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">従業員番号</TableHead>
                          <TableHead className="whitespace-nowrap">氏名</TableHead>
                          <TableHead className="whitespace-nowrap">フリガナ</TableHead>
                          <TableHead className="whitespace-nowrap">主な派遣先</TableHead>
                          <TableHead className="whitespace-nowrap">電話番号</TableHead>
                          <TableHead className="whitespace-nowrap">状態</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWorkers.map((w) => (
                          <TableRow key={w.id}>
                            <TableCell className="font-mono whitespace-nowrap tabular-nums">{w.employeeCode}</TableCell>
                            <TableCell className="font-medium whitespace-nowrap">{w.name}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">{w.nameKana}</TableCell>
                            <TableCell className="whitespace-nowrap">{w.defaultCompany}</TableCell>
                            <TableCell className="whitespace-nowrap">{w.phone}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={w.isActive ? "default" : "secondary"}>{w.isActive ? "有効" : "無効"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">全 {filteredWorkers.length} 件</div>
                </CardContent>
              </Card>
            )}

            {personnelSubTab === "companies" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>会社一覧</CardTitle>
                      <CardDescription>派遣先会社の情報と残業計算ルールを管理します</CardDescription>
                    </div>
                    <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />新規登録</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>会社を新規登録</DialogTitle>
                          <DialogDescription>派遣先会社の情報を入力してください</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="ccode">会社コード</Label>
                            <Input id="ccode" placeholder="例: A001" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cname">会社名</Label>
                            <Input id="cname" placeholder="例: A運輸株式会社" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>残業計算単位（分）</Label>
                              <Select defaultValue="15">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5分</SelectItem>
                                  <SelectItem value="10">10分</SelectItem>
                                  <SelectItem value="15">15分</SelectItem>
                                  <SelectItem value="30">30分</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>端数処理</Label>
                              <Select defaultValue="floor">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="floor">切り捨て</SelectItem>
                                  <SelectItem value="ceil">切り上げ</SelectItem>
                                  <SelectItem value="round">四捨五入</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>キャンセル</Button>
                          <Button onClick={() => setCompanyDialogOpen(false)}>登録する</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="会社名・コードで検索..." value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">コード</TableHead>
                          <TableHead className="whitespace-nowrap">会社名</TableHead>
                          <TableHead className="whitespace-nowrap">残業単位</TableHead>
                          <TableHead className="whitespace-nowrap">端数処理</TableHead>
                          <TableHead className="whitespace-nowrap">状態</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompanies.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-mono whitespace-nowrap">{c.code}</TableCell>
                            <TableCell className="font-medium whitespace-nowrap">{c.name}</TableCell>
                            <TableCell className="whitespace-nowrap tabular-nums">{c.overtimeUnit}分</TableCell>
                            <TableCell className="whitespace-nowrap">{roundingMethodLabels[c.roundingMethod]}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "有効" : "無効"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ===== 車両・賃金 ===== */}
        {activeTab === "車両・賃金" && (
          <div className="space-y-4">
            <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
              {([["vehicles", "車両"], ["wage-rules", "賃金ルール"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setVehicleWageSubTab(val)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    vehicleWageSubTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {vehicleWageSubTab === "vehicles" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>車種一覧</CardTitle>
                      <CardDescription>会社ごとの車種と表示順を管理します</CardDescription>
                    </div>
                    <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />新規登録</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>車種を新規登録</DialogTitle>
                          <DialogDescription>車種の情報を入力してください</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>会社</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="会社を選択" /></SelectTrigger>
                              <SelectContent>
                                {mockCompanies.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="vcode">車種コード</Label>
                              <Input id="vcode" placeholder="例: 4T" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="vname">車種名</Label>
                              <Input id="vname" placeholder="例: 4tトラック" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="displayOrder">表示順</Label>
                            <Input id="displayOrder" type="number" placeholder="1" defaultValue={1} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setVehicleDialogOpen(false)}>キャンセル</Button>
                          <Button onClick={() => setVehicleDialogOpen(false)}>登録する</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="車種名・コードで検索..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={vehicleCompanyFilter} onValueChange={setVehicleCompanyFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="会社で絞り込み" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての会社</SelectItem>
                        {mockCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">順序</TableHead>
                          <TableHead className="whitespace-nowrap">コード</TableHead>
                          <TableHead className="whitespace-nowrap">車種名</TableHead>
                          <TableHead className="whitespace-nowrap">会社</TableHead>
                          <TableHead className="whitespace-nowrap">状態</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVehicles.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell className="text-center whitespace-nowrap tabular-nums">{v.displayOrder}</TableCell>
                            <TableCell className="font-mono whitespace-nowrap">{v.code}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{v.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">{v.companyName}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "有効" : "無効"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">全 {filteredVehicles.length} 件</div>
                </CardContent>
              </Card>
            )}

            {vehicleWageSubTab === "wage-rules" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>賃金ルール一覧</CardTitle>
                      <CardDescription>会社・車種ごとの基本給・残業単価を管理します</CardDescription>
                    </div>
                    <Dialog open={wageDialogOpen} onOpenChange={setWageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />新規登録</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>賃金ルールを新規登録</DialogTitle>
                          <DialogDescription>会社・車種の組み合わせに対する賃金ルールを設定します</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>会社</Label>
                              <Select>
                                <SelectTrigger><SelectValue placeholder="会社を選択" /></SelectTrigger>
                                <SelectContent>
                                  {mockCompanies.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>車種</Label>
                              <Select>
                                <SelectTrigger><SelectValue placeholder="車種を選択" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2t">2tトラック</SelectItem>
                                  <SelectItem value="4t">4tトラック</SelectItem>
                                  <SelectItem value="10t">10tトラック</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>適用開始日</Label>
                              <Input type="date" defaultValue="2024-01-01" />
                            </div>
                            <div className="grid gap-2">
                              <Label>適用終了日（任意）</Label>
                              <Input type="date" />
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">基本給</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>日給（円）</Label>
                                <Input type="number" placeholder="11000" />
                              </div>
                              <div className="grid gap-2">
                                <Label>基本労働時間</Label>
                                <Input type="number" placeholder="8" step="0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">残業単価（円/時間）</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="grid gap-2">
                                <Label>通常</Label>
                                <Input type="number" placeholder="1500" />
                              </div>
                              <div className="grid gap-2">
                                <Label>深夜（22-5時）</Label>
                                <Input type="number" placeholder="1875" />
                              </div>
                              <div className="grid gap-2">
                                <Label>休日</Label>
                                <Input type="number" placeholder="1875" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setWageDialogOpen(false)}>キャンセル</Button>
                          <Button onClick={() => setWageDialogOpen(false)}>登録する</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="会社名・車種で検索..." value={wageSearch} onChange={(e) => setWageSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={wageCompanyFilter} onValueChange={setWageCompanyFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="会社で絞り込み" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての会社</SelectItem>
                        {mockCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">会社</TableHead>
                          <TableHead className="whitespace-nowrap">車種</TableHead>
                          <TableHead className="text-right whitespace-nowrap">基本日給</TableHead>
                          <TableHead className="text-right whitespace-nowrap">残業単価</TableHead>
                          <TableHead className="whitespace-nowrap">適用期間</TableHead>
                          <TableHead className="whitespace-nowrap">状態</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWageRules.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium whitespace-nowrap">{r.companyName}</TableCell>
                            <TableCell className="whitespace-nowrap">{r.vehicleTypeName}</TableCell>
                            <TableCell className="text-right font-mono whitespace-nowrap tabular-nums">{formatCurrency(r.baseDailyWage)}</TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <span className="font-mono tabular-nums">{formatCurrency(r.overtimeRateNormal)}</span>
                              <span className="text-muted-foreground">/h</span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(r.effectiveFrom, "yyyy/MM/dd")}〜{r.effectiveTo ? format(r.effectiveTo, "yyyy/MM/dd") : ""}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={r.isActive ? "default" : "secondary"}>{r.isActive ? "有効" : "無効"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">全 {filteredWageRules.length} 件</div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ===== 各種設定 ===== */}
        {activeTab === "各種設定" && (
          <div className="space-y-4">
            <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
              {([["rate-tables", "運賃表"], ["general", "各種マスタ"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSettingsSubTab(val)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    settingsSubTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {settingsSubTab === "rate-tables" && (
              <div className="space-y-6">
                <p className="text-sm text-slate-500">健康保険・介護保険・雇用保険・厚生年金料額表</p>
                <div className="grid gap-4 sm:grid-cols-4">
                  {(Object.entries(tableConfig) as [TableType, typeof tableConfig[TableType]][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = activeTable === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTable(key)}
                        className={`rounded-xl border p-5 text-left transition-all ${isActive ? "border-blue-300 bg-white shadow-sm ring-1 ring-blue-100" : "border-slate-200/60 bg-white hover:border-slate-300"}`}
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
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="等級・報酬月額で検索..."
                      value={rateSearch}
                      onChange={(e) => setRateSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                    <Upload className="h-4 w-4" />料額表更新
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download className="h-4 w-4" />エクスポート
                  </button>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <Table2 className="h-4 w-4 text-slate-400" />
                  <span>{tableConfig[activeTable].label}料額表（令和6年3月分〜適用）</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">等級</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">報酬月額</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">標準報酬月額</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">被保険者負担</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">事業主負担</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {healthInsuranceRates.filter((r) => !rateSearch || r.monthly.includes(rateSearch) || String(r.grade).includes(rateSearch)).map((row) => (
                        <tr key={row.grade} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap tabular-nums">{row.grade}</td>
                          <td className="px-4 py-3 text-slate-700 text-xs whitespace-nowrap">{row.monthly}</td>
                          <td className="px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.standard.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.insured.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-700 font-mono whitespace-nowrap tabular-nums">¥{row.employer.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium whitespace-nowrap tabular-nums">¥{(row.insured + row.employer).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {settingsSubTab === "general" && (
              <div className="space-y-6">
                <p className="text-sm text-slate-500">供給先・早出・交通費・作業区分等のマスタ一括管理</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(Object.entries(masterConfig) as [MasterType, typeof masterConfig[MasterType]][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = activeMaster === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setActiveMaster(key); setMasterSearch(""); }}
                        className={`rounded-xl border p-5 text-left transition-all ${isActive ? "border-blue-300 bg-white shadow-sm ring-1 ring-blue-100" : "border-slate-200/60 bg-white hover:border-slate-300"}`}
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
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="コード・名称で検索..."
                      value={masterSearch}
                      onChange={(e) => setMasterSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <Button><Plus className="mr-2 h-4 w-4" />新規追加</Button>
                </div>
                {activeMaster === "supplier" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">コード</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">名称</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">住所</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">担当者</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">電話番号</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">状態</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {supplierData.filter((d) => d.name.includes(masterSearch) || d.code.includes(masterSearch)).map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.code}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                            <td className="px-4 py-3 text-slate-700 text-xs">{row.address}</td>
                            <td className="px-4 py-3 text-slate-700">{row.contactPerson}</td>
                            <td className="px-4 py-3 text-slate-700 font-mono text-xs">{row.phone}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "有効" ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500"}`}>{row.status}</span>
                            </td>
                            <td className="px-4 py-3">
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
                {activeMaster === "earlyShift" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">コード</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">時間帯</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">手当額</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">備考</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {earlyShiftData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.code}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{row.timeRange}</td>
                            <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums">¥{row.allowance.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                            <td className="px-4 py-3">
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
                {activeMaster === "transport" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">コード</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">路線/方面</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">交通費</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">備考</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transportData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.code}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{row.route}</td>
                            <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums">¥{row.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                            <td className="px-4 py-3">
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
                {activeMaster === "workType" && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">コード</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">区分名</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">カテゴリ</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">備考</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {workTypeData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.code}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{row.name}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{row.category}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-xs">{row.note}</td>
                            <td className="px-4 py-3">
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
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
