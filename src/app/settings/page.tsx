"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Bell,
  Database,
  Users,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Building2,
  Clock,
  Train,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Search,
  Pencil,
  Truck,
  DollarSign,
  Table2,
  Shield,
  Heart,
  Briefcase,
  Calendar,
  Upload,
  Download,
} from "lucide-react";
import { toast } from "sonner";

// --- Admin Users ---
const mockAdminUsers = [
  { id: "1", email: "admin@example.com", name: "管理者", role: "admin", isActive: true },
  { id: "2", email: "operator1@example.com", name: "担当者A", role: "operator", isActive: true },
  { id: "3", email: "operator2@example.com", name: "担当者B", role: "operator", isActive: false },
];

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

export default function SettingsPage() {
  // Settings state
  const [companyName, setCompanyName] = useState("栄和清運株式会社");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  // Worker state
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [workerSearch, setWorkerSearch] = useState("");

  // Company state
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");

  // Vehicle state
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleCompanyFilter, setVehicleCompanyFilter] = useState("all");

  // Wage rules state
  const [wageDialogOpen, setWageDialogOpen] = useState(false);
  const [wageSearch, setWageSearch] = useState("");
  const [wageCompanyFilter, setWageCompanyFilter] = useState("all");

  // Rate tables state
  const [activeTable, setActiveTable] = useState<TableType>("health");
  const [rateSearch, setRateSearch] = useState("");

  // General master state
  const [activeMaster, setActiveMaster] = useState<MasterType>("supplier");
  const [masterSearch, setMasterSearch] = useState("");

  // Master management tab state
  const [masterMainTab, setMasterMainTab] = useState<"人員管理" | "車両・賃金" | "各種設定">("人員管理");
  const [personnelSubTab, setPersonnelSubTab] = useState<"workers" | "companies">("workers");
  const [vehicleWageSubTab, setVehicleWageSubTab] = useState<"vehicles" | "wage-rules">("vehicles");
  const [settingsSubTab, setSettingsSubTab] = useState<"rate-tables" | "general">("rate-tables");

  // Top-level settings nav
  const [activeSettings, setActiveSettings] = useState<string | null>(null);

  const settingsNav = [
    { id: "general",       label: "基本設定",     icon: Building,  description: "会社名・年度・自動計算設定",    color: "text-blue-600",    iconBg: "bg-blue-50" },
    { id: "notifications", label: "通知",         icon: Bell,      description: "メール通知・エラー通知設定",     color: "text-amber-600",   iconBg: "bg-amber-50" },
    { id: "users",         label: "ユーザー管理",  icon: Users,     description: "管理者・オペレーター管理",       color: "text-violet-600",  iconBg: "bg-violet-50" },
    { id: "system",        label: "システム",      icon: Database,  description: "バックアップ・セキュリティ",     color: "text-slate-600",   iconBg: "bg-slate-100" },
    { id: "master",        label: "マスタ管理",    icon: BookOpen,  description: "作業員・会社・車両・賃金ルール", color: "text-emerald-600", iconBg: "bg-emerald-50" },
  ] as const;

  const handleSave = () => {
    toast.success("設定を保存しました");
  };

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

  return (
    <MainLayout title="システム設定">
      <div className="space-y-6">
        {/* Card navigation */}
        {!activeSettings && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSettings(item.id)}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 mt-1 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeSettings && (
          <>
            <button
              onClick={() => setActiveSettings(null)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              一覧に戻る
            </button>

          {/* General Settings */}
          {activeSettings === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>基本設定</CardTitle>
                <CardDescription>システムの基本情報を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="companyName">会社名</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="fiscalYearStart">年度開始月</Label>
                  <Select defaultValue="4">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}月</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="autoCalculate" checked={autoCalculate} onCheckedChange={(c) => setAutoCalculate(c as boolean)} />
                  <Label htmlFor="autoCalculate">日報入力時に自動で計算を実行する</Label>
                </div>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />保存</Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeSettings === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>メールやシステム通知の設定を行います</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">メール通知</p>
                      <p className="text-sm text-muted-foreground">計算完了時などにメールで通知を受け取る</p>
                    </div>
                    <Checkbox checked={emailNotifications} onCheckedChange={(c) => setEmailNotifications(c as boolean)} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">エラー通知</p>
                      <p className="text-sm text-muted-foreground">計算エラー発生時に通知を受け取る</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">日次レポート</p>
                      <p className="text-sm text-muted-foreground">毎日のサマリーをメールで受け取る</p>
                    </div>
                    <Checkbox />
                  </div>
                </div>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />保存</Button>
              </CardContent>
            </Card>
          )}

          {/* User Management */}
          {activeSettings === "users" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ユーザー管理</CardTitle>
                    <CardDescription>管理画面にアクセスできるユーザーを管理します</CardDescription>
                  </div>
                  <Button><Plus className="mr-2 h-4 w-4" />ユーザー追加</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdminUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "管理者" : "オペレーター"}
                        </Badge>
                        <Badge variant={user.isActive ? "outline" : "secondary"}>
                          {user.isActive ? "有効" : "無効"}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Settings */}
          {activeSettings === "system" && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>データベース</CardTitle>
                  <CardDescription>バックアップと復元の設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2 max-w-md">
                    <Label>自動バックアップ頻度</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">毎日</SelectItem>
                        <SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline"><Database className="mr-2 h-4 w-4" />今すぐバックアップ</Button>
                    <Button variant="outline">復元</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>セキュリティ</CardTitle>
                  <CardDescription>セキュリティ関連の設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">2要素認証</p>
                      <p className="text-sm text-muted-foreground">ログイン時に追加の認証を要求する</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">セッションタイムアウト</p>
                      <p className="text-sm text-muted-foreground">非アクティブ時に自動ログアウト（30分）</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>システム情報</CardTitle></CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">バージョン</dt>
                      <dd className="font-mono">1.0.0</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">最終バックアップ</dt>
                      <dd>2024/01/28 03:00</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">データベースサイズ</dt>
                      <dd className="font-mono">245 MB</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Master Management */}
          {activeSettings === "master" && (
            <div className="space-y-4">
              {/* Main group tabs */}
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
                {(["人員管理", "車両・賃金", "各種設定"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMasterMainTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      masterMainTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sub tabs */}
              {masterMainTab === "人員管理" && (
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
              )}
              {masterMainTab === "車両・賃金" && (
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
              )}
              {masterMainTab === "各種設定" && (
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
              )}

              {/* Workers */}
              {masterMainTab === "人員管理" && personnelSubTab === "workers" && (
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

              {/* Companies */}
              {masterMainTab === "人員管理" && personnelSubTab === "companies" && (
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

              {/* Vehicles */}
              {masterMainTab === "車両・賃金" && vehicleWageSubTab === "vehicles" && (
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

              {/* Wage Rules */}
              {masterMainTab === "車両・賃金" && vehicleWageSubTab === "wage-rules" && (
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

              {/* Rate Tables */}
              {masterMainTab === "各種設定" && settingsSubTab === "rate-tables" && (
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

              {/* General Masters */}
              {masterMainTab === "各種設定" && settingsSubTab === "general" && (
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
          </>
        )}
      </div>
    </MainLayout>
  );
}
