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
  AlertCircle,
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
  Route,
  MapPin,
  Weight,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  CalendarPlus,
  CalendarMinus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type StampEntry = {
  id: number; name: string; gradeNum: number; grade: string;
  empGrade: string; // 雇用保険印紙種別: "第1種(176円)" | "第2種(146円)" | "第3種(96円)"
  method: string; days: number; amount: number; month: string;
  stampType: "ledger-general" | "ledger-nursing" | "no-ledger"; stampsIssued: number;
};
const stampsData: StampEntry[] = [
  { id: 1, name: "山田 太郎", gradeNum: 1, grade: "1級",  empGrade: "第1種(176円)", method: "印紙", days: 22, amount: 7128, month: "2026/03", stampType: "ledger-general", stampsIssued: 22 },
  { id: 2, name: "鈴木 一郎", gradeNum: 2, grade: "2級",  empGrade: "第2種(146円)", method: "印紙", days: 20, amount: 5880, month: "2026/03", stampType: "ledger-nursing", stampsIssued: 20 },
  { id: 3, name: "佐藤 花子", gradeNum: 3, grade: "3級",  empGrade: "第3種(96円)",  method: "現金", days: 18, amount: 4536, month: "2026/03", stampType: "no-ledger",       stampsIssued: 0  },
  { id: 4, name: "高橋 健二", gradeNum: 1, grade: "1級",  empGrade: "第1種(176円)", method: "印紙", days: 21, amount: 6804, month: "2026/03", stampType: "ledger-general", stampsIssued: 21 },
  { id: 5, name: "田中 美咲", gradeNum: 2, grade: "2級",  empGrade: "第3種(96円)",  method: "現金", days: 19, amount: 5586, month: "2026/02", stampType: "no-ledger",       stampsIssued: 0  },
  { id: 6, name: "渡辺 剛",   gradeNum: 3, grade: "3級",  empGrade: "第2種(146円)", method: "印紙", days: 25, amount: 7500, month: "2026/02", stampType: "ledger-nursing", stampsIssued: 25 },
  { id: 7, name: "伊藤 直樹", gradeNum: 1, grade: "1級",  empGrade: "第1種(176円)", method: "印紙", days: 23, amount: 7452, month: "2026/02", stampType: "ledger-general", stampsIssued: 23 },
  { id: 8, name: "田中 美咲", gradeNum: 4, grade: "4級",  empGrade: "第2種(146円)", method: "印紙", days: 18, amount: 6156, month: "2026/03", stampType: "ledger-nursing", stampsIssued: 18 },
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

type MainTab = "人材系" | "車両系" | "運行系";
const MAIN_TABS: MainTab[] = ["人材系", "車両系", "運行系"];
const SUB_TABS: Record<MainTab, string[]> = {
  "人材系": ["印紙管理", "契約社員", "アルバイト", "会社", "仕訳"],
  "車両系":        ["日当設定"],
  "運行系":        ["運行実績", "各種設定"],
};

// --- Workers ---
const mockWorkers = [
  { id: "1", employeeCode: "E001", name: "山田 太郎", nameKana: "ヤマダ タロウ", defaultCompany: "A運輸株式会社", phone: "090-1234-5678", isActive: true, paymentMethod: "キャッシュマシン", employeeType: "hiyatoi" },
  { id: "2", employeeCode: "E002", name: "鈴木 一郎", nameKana: "スズキ イチロウ", defaultCompany: "A運輸株式会社", phone: "090-2345-6789", isActive: true, paymentMethod: "キャッシュマシン", employeeType: "hiyatoi" },
  { id: "3", employeeCode: "E003", name: "佐藤 花子", nameKana: "サトウ ハナコ", defaultCompany: "B物流株式会社", phone: "090-3456-7890", isActive: true, paymentMethod: "振り込み", employeeType: "furikomi" },
  { id: "4", employeeCode: "E004", name: "高橋 健二", nameKana: "タカハシ ケンジ", defaultCompany: "A運輸株式会社", phone: "090-4567-8901", isActive: true, paymentMethod: "振り込み", employeeType: "furikomi" },
  { id: "5", employeeCode: "E005", name: "田中 美咲", nameKana: "タナカ ミサキ", defaultCompany: "C配送センター", phone: "090-5678-9012", isActive: false, paymentMethod: "キャッシュマシン", employeeType: "hiyatoi" },
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
// 日雇特例被保険者 健康保険印紙 等級表（11級）
const healthInsuranceRates = [
  { grade: 1,  daily: "3,500円未満",           standard: 3000,  insured: 64,  employer: 64  },
  { grade: 2,  daily: "3,500〜5,000円未満",     standard: 4000,  insured: 84,  employer: 84  },
  { grade: 3,  daily: "5,000〜6,000円未満",     standard: 5500,  insured: 115, employer: 115 },
  { grade: 4,  daily: "6,000〜7,000円未満",     standard: 6500,  insured: 136, employer: 136 },
  { grade: 5,  daily: "7,000〜8,000円未満",     standard: 7500,  insured: 157, employer: 157 },
  { grade: 6,  daily: "8,000〜9,000円未満",     standard: 8500,  insured: 178, employer: 178 },
  { grade: 7,  daily: "9,000〜10,000円未満",    standard: 9500,  insured: 199, employer: 199 },
  { grade: 8,  daily: "10,000〜11,000円未満",   standard: 10500, insured: 220, employer: 220 },
  { grade: 9,  daily: "11,000〜13,000円未満",   standard: 12000, insured: 251, employer: 251 },
  { grade: 10, daily: "13,000〜17,000円未満",   standard: 15000, insured: 314, employer: 314 },
  { grade: 11, daily: "17,000円以上",           standard: 21000, insured: 440, employer: 440 },
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

// --- 運行実績 ---
const operationData = [
  { id: "1", date: "2026-03-19", driverName: "山田 太郎", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t",  routes: [{ destination: "川崎市処理施設", wasteType: "一般廃棄物", weight: 3.2, distance: 28.5 }, { destination: "横浜市リサイクルセンター", wasteType: "産業廃棄物", weight: 2.8, distance: 35.2 }], totalDistance: 63.7,  totalWeight: 6.0,  trips: 2, startTime: "06:00", endTime: "17:30" },
  { id: "2", date: "2026-03-19", driverName: "鈴木 一郎", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", routes: [{ destination: "東京都中央処理場", wasteType: "一般廃棄物", weight: 8.5, distance: 42.0 }, { destination: "千葉市最終処分場", wasteType: "産業廃棄物", weight: 7.2, distance: 55.8 }], totalDistance: 126.3, totalWeight: 21.7, trips: 3, startTime: "05:30", endTime: "18:00" },
  { id: "3", date: "2026-03-18", driverName: "佐藤 花子", vehicleNumber: "品川 300 う 9012", vehicleType: "2t",  routes: [{ destination: "品川区集積所", wasteType: "資源ごみ", weight: 1.5, distance: 12.3 }], totalDistance: 12.3, totalWeight: 1.5, trips: 1, startTime: "07:00", endTime: "15:00" },
];

// --- 週休 ---
type DayType = "work" | "off" | "half" | "paid";
const weekDays = ["月", "火", "水", "木", "金", "土", "日"];
const dayTypeConfig: Record<DayType, { label: string; className: string }> = {
  work: { label: "出", className: "bg-blue-50 text-blue-700 font-medium" },
  off:  { label: "休", className: "bg-slate-100 text-slate-400" },
  half: { label: "半", className: "bg-slate-200 text-slate-600" },
  paid: { label: "有", className: "bg-blue-100 text-blue-700" },
};
const scheduleData = [
  { id: "1", name: "山田 太郎", employeeNo: "E001", schedule: { "月": "work", "火": "work", "水": "work", "木": "work", "金": "work", "土": "off",  "日": "off" } as Record<string, DayType>, workDays: 22, offDays: 9 },
  { id: "2", name: "鈴木 一郎", employeeNo: "E002", schedule: { "月": "work", "火": "work", "水": "off",  "木": "work", "金": "work", "土": "work", "日": "off" } as Record<string, DayType>, workDays: 21, offDays: 10 },
  { id: "3", name: "佐藤 花子", employeeNo: "E003", schedule: { "月": "work", "火": "work", "水": "work", "木": "off",  "金": "work", "土": "half", "日": "off" } as Record<string, DayType>, workDays: 20, offDays: 11 },
  { id: "4", name: "高橋 健二", employeeNo: "E004", schedule: { "月": "work", "火": "off",  "水": "work", "木": "work", "金": "work", "土": "work", "日": "off" } as Record<string, DayType>, workDays: 21, offDays: 10 },
  { id: "5", name: "田中 次郎", employeeNo: "E005", schedule: { "月": "work", "火": "work", "水": "work", "木": "work", "金": "off",  "土": "off",  "日": "off" } as Record<string, DayType>, workDays: 18, offDays: 13 },
];

// --- 有給休暇 ---
const mockPaidLeave = [
  { id: 1, name: "山田 太郎", grantDate: "2023/04/01", granted: 20, used: 8,  remaining: 12, expiry: "2025/03/31" },
  { id: 2, name: "鈴木 一郎", grantDate: "2023/10/01", granted: 10, used: 3,  remaining: 7,  expiry: "2025/09/30" },
  { id: 3, name: "佐藤 花子", grantDate: "2023/04/01", granted: 20, used: 18, remaining: 2,  expiry: "2025/03/31" },
  { id: 4, name: "高橋 健二", grantDate: "2023/07/01", granted: 11, used: 5,  remaining: 6,  expiry: "2025/06/30" },
  { id: 5, name: "田中 美咲", grantDate: "2024/01/01", granted: 10, used: 0,  remaining: 10, expiry: "2025/12/31" },
];

// --- アルバイト ---
const mockPartTimeWorkers = [
  { id: 1, name: "木村 翔太",   hourlyRate: 1200, workDays: 15, totalHours: 90.0,  overtime: 5.0,  grossPay: 114000, month: "2024/01", status: "確定" },
  { id: 2, name: "松本 さくら", hourlyRate: 1150, workDays: 12, totalHours: 72.0,  overtime: 0,    grossPay: 82800,  month: "2024/01", status: "確定" },
  { id: 3, name: "小林 大輝",   hourlyRate: 1300, workDays: 18, totalHours: 108.0, overtime: 8.0,  grossPay: 153400, month: "2024/01", status: "未確定" },
  { id: 4, name: "中村 愛",     hourlyRate: 1200, workDays: 10, totalHours: 60.0,  overtime: 2.0,  grossPay: 75000,  month: "2024/01", status: "確定" },
  { id: 5, name: "加藤 隆",     hourlyRate: 1100, workDays: 20, totalHours: 120.0, overtime: 10.0, grossPay: 145750, month: "2024/01", status: "未確定" },
];

// --- 仕訳 ---
const mockJournals = [
  { id: 1, date: "2024/01/25", debitAccount: "給料手当",       debitAmount: 285000, creditAccount: "預り金（源泉）",  creditAmount: 6800,   description: "1月分給与 山田太郎",   category: "給与" },
  { id: 2, date: "2024/01/25", debitAccount: "給料手当",       debitAmount: 285000, creditAccount: "預り金（社保）",  creditAmount: 42180,  description: "1月分給与 山田太郎",   category: "給与" },
  { id: 3, date: "2024/01/25", debitAccount: "給料手当",       debitAmount: 285000, creditAccount: "預り金（住民税）", creditAmount: 8500,  description: "1月分給与 山田太郎",   category: "給与" },
  { id: 4, date: "2024/01/25", debitAccount: "給料手当",       debitAmount: 285000, creditAccount: "普通預金",       creditAmount: 227520, description: "1月分給与 山田太郎",   category: "給与" },
  { id: 5, date: "2024/02/10", debitAccount: "預り金（源泉）", debitAmount: 30800,  creditAccount: "普通預金",       creditAmount: 30800,  description: "1月分源泉所得税納付", category: "納付" },
  { id: 6, date: "2024/02/28", debitAccount: "預り金（社保）", debitAmount: 210900, creditAccount: "普通預金",       creditAmount: 210900, description: "1月分社会保険料納付", category: "納付" },
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
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("人材系");
  const [activeSubTab, setActiveSubTab] = useState<string>("印紙管理");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  // Master management states
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);
  const [ledgerDetailTab, setLedgerDetailTab] = useState<"social" | "withholding" | "resident" | "schedule" | "paidleave">("social");
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
  const [editingWageRule, setEditingWageRule] = useState<typeof mockWageRules[0] | null>(null);
  const [unitPriceEditId, setUnitPriceEditId] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<TableType>("health");
  const [rateSearch, setRateSearch] = useState("");
  const [activeMaster, setActiveMaster] = useState<MasterType>("supplier");
  const [masterSearch, setMasterSearch] = useState("");
  const [personnelSubTab, setPersonnelSubTab] = useState<"all" | "hiyatoi" | "furikomi">("all");
  const [editingWorker, setEditingWorker] = useState<typeof mockWorkers[0] | null>(null);
  const [stampTypeFilter, setStampTypeFilter] = useState<"all" | "ledger-general" | "ledger-nursing" | "no-ledger">("all");
  const [stampPeriodMonth, setStampPeriodMonth] = useState("2026/03");
  const [selectedStampRow, setSelectedStampRow] = useState<StampEntry | null>(null);
  const [stampDetailTab, setStampDetailTab] = useState<"stamp" | "worker" | "schedule" | "paidleave">("stamp");
  const [selectedPartTime, setSelectedPartTime] = useState<typeof mockPartTimeWorkers[0] | null>(null);
  const [partTimeDetailTab, setPartTimeDetailTab] = useState<"basic" | "schedule" | "paidleave">("basic");
  const [vehicleWageSubTab, setVehicleWageSubTab] = useState<"vehicles" | "wage-rules">("vehicles");
  const [selectedVehicleRule, setSelectedVehicleRule] = useState<typeof mockVehicleTypes[0] | null>(null);
  const [vehicleRuleDetailTab, setVehicleRuleDetailTab] = useState<"vehicle" | "wage">("vehicle");
  const [editingVehicleRule, setEditingVehicleRule] = useState<typeof mockVehicleTypes[0] | null>(null);
  const [editingWageRule2, setEditingWageRule2] = useState<typeof mockWageRules[0] | null>(null);
  const [settingsSubTab, setSettingsSubTab] = useState<"rate-tables" | "general">("rate-tables");

  // 移動タブ states
  const [operationDate, setOperationDate] = useState("2026-03-19");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState("2026年3月");
  const [paidLeaveSearch, setPaidLeaveSearch] = useState("");
  const [partTimeSearch, setPartTimeSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredStamps = stampsData.filter((d) => {
    const matchesSearch = d.name.includes(searchQuery);
    const matchesMethod = methodFilter === "all" || d.method === (methodFilter === "stamp" ? "印紙" : "現金");
    const matchesType = stampTypeFilter === "all" || d.stampType === stampTypeFilter;
    const matchesPeriod = !stampPeriodMonth || d.month === stampPeriodMonth;
    return matchesSearch && matchesMethod && matchesType && matchesPeriod;
  });

  const filteredWorkers = mockWorkers.filter((w) => {
    const matchSearch = w.name.includes(workerSearch) || w.nameKana.includes(workerSearch) || w.employeeCode.includes(workerSearch);
    const matchType = personnelSubTab === "all" || w.employeeType === personnelSubTab;
    return matchSearch && matchType;
  });
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

  const filteredPaidLeave = mockPaidLeave.filter((d) => d.name.includes(paidLeaveSearch));
  const filteredPartTimeWorkers = mockPartTimeWorkers.filter((w) => w.name.includes(partTimeSearch));
  const filteredJournals = mockJournals.filter((j) => {
    const matchesSearch = j.description.includes(journalSearch) || j.debitAccount.includes(journalSearch) || j.creditAccount.includes(journalSearch);
    const matchesCategory = categoryFilter === "all" || j.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
    <MainLayout title="全社共通マスター">
      <div className="space-y-6">
        {/* メインタブ */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveMainTab(tab); setActiveSubTab(SUB_TABS[tab][0]); setSearchQuery(""); setMethodFilter("all"); }}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                activeMainTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* サブタブ */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
          {SUB_TABS[activeMainTab].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveSubTab(tab); setSearchQuery(""); setMethodFilter("all"); }}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeSubTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeSubTab === "印紙管理" && (
          <>
            <p className="text-sm text-slate-500">健康保険印紙の種別管理・受払実績（行クリックで等級詳細）</p>
            {/* 台帳種別フィルタ */}
            <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit flex-wrap">
              {([
                ["all",            "全種別"],
                ["ledger-general", "台帳あり(一般)"],
                ["ledger-nursing", "台帳あり(介護含)"],
                ["no-ledger",      "台帳なし"],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStampTypeFilter(val)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    stampTypeFilter === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* 期間・検索・方式フィルタ */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 whitespace-nowrap">期間</span>
                <input
                  type="month"
                  value={stampPeriodMonth ? stampPeriodMonth.replace("/", "-") : ""}
                  onChange={(e) => setStampPeriodMonth(e.target.value ? e.target.value.replace("-", "/") : "")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {stampPeriodMonth && (
                  <button
                    onClick={() => setStampPeriodMonth("")}
                    className="text-xs px-2 py-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    全期間
                  </button>
                )}
              </div>
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
            {/* サマリカード（期間フィルタ連動） */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Stamp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">印紙方式</p>
                    <p className="text-2xl font-semibold text-slate-900">{filteredStamps.filter(d => d.method === "印紙").length}名</p>
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
                    <p className="text-2xl font-semibold text-slate-900">{filteredStamps.filter(d => d.method === "現金").length}名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Stamp className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">合計金額 / 配付枚数</p>
                    <p className="text-xl font-semibold text-slate-900">¥{filteredStamps.reduce((s, d) => s + d.amount, 0).toLocaleString()}</p>
                    <p className="text-sm text-slate-500">{filteredStamps.reduce((s, d) => s + d.stampsIssued, 0)}枚配付</p>
                  </div>
                </div>
              </div>
            </div>
            {/* 一覧テーブル */}
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ID</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">健保等級</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">雇保種別</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">方式</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">配付枚数</th>
                      <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStamps.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedStampRow(row)}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                      >
                        <td className="px-3 sm:px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{row.id}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{row.grade}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          {row.stampType !== "no-ledger" ? (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.empGrade === "第1種(176円)" ? "bg-emerald-50 text-emerald-700"
                              : row.empGrade === "第2種(146円)" ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                            }`}>{row.empGrade}</span>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.method === "印紙" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {row.method}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.days}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                          {row.stampsIssued > 0
                            ? <span className="font-medium text-blue-700">{row.stampsIssued}枚</span>
                            : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">¥{row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredStamps.length} 件</div>
            {/* 等級詳細ポップアップ */}
            <Dialog open={!!selectedStampRow} onOpenChange={(open) => { if (!open) { setSelectedStampRow(null); setStampDetailTab("stamp"); } }}>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedStampRow?.name} — 詳細</DialogTitle>
                </DialogHeader>
                {selectedStampRow && (() => {
                  const worker = mockWorkers.find(w => w.name === selectedStampRow.name);
                  const schedule = scheduleData.find(s => s.name === selectedStampRow.name);
                  const paidLeave = mockPaidLeave.find(p => p.name === selectedStampRow.name);
                  return (
                    <div className="space-y-4">
                      {/* タブ */}
                      <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-wrap">
                        {([["stamp","印紙情報"],["worker","作業員情報"],["schedule","週休"],["paidleave","有給休暇"]] as const).map(([val, label]) => (
                          <button key={val} onClick={() => setStampDetailTab(val)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${stampDetailTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* 印紙情報 */}
                      {stampDetailTab === "stamp" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                              <p className="text-[10px] text-slate-500">方式</p>
                              <p className="text-sm font-medium text-slate-900">{selectedStampRow.method}</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 px-3 py-2.5">
                              <p className="text-[10px] text-blue-500">健保等級（現在）</p>
                              <p className="text-sm font-bold text-blue-700">{selectedStampRow.grade}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                              <p className="text-[10px] text-slate-500">雇保種別</p>
                              <p className="text-xs font-medium text-slate-900">{selectedStampRow.stampType !== "no-ledger" ? selectedStampRow.empGrade : "—"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-2">健康保険等級一覧（★ が現在の等級）</p>
                            <div className="rounded-lg border border-slate-200 overflow-clip">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">等級</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">賃金日額区分</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">標準賃金日額</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">被保険者負担</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {healthInsuranceRates.map((r) => {
                                    const isCurrent = r.grade === selectedStampRow.gradeNum;
                                    return (
                                      <tr key={r.grade} className={isCurrent ? "bg-blue-50" : ""}>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isCurrent ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                            {isCurrent && "★ "}{r.grade}級
                                          </span>
                                        </td>
                                        <td className={`px-3 py-2 text-xs whitespace-nowrap ${isCurrent ? "text-blue-800 font-semibold" : "text-slate-600"}`}>{r.daily}</td>
                                        <td className={`px-3 py-2 text-right text-xs font-mono whitespace-nowrap ${isCurrent ? "text-blue-800 font-semibold" : "text-slate-700"}`}>¥{r.standard.toLocaleString()}</td>
                                        <td className={`px-3 py-2 text-right text-xs font-mono whitespace-nowrap ${isCurrent ? "text-blue-800 font-semibold" : "text-slate-700"}`}>¥{r.insured.toLocaleString()}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            {selectedStampRow.stampType !== "no-ledger" && (
                              <div className="mt-4">
                                <p className="text-xs font-medium text-slate-500 mb-2">雇用保険印紙種別（★ が現在の種別）</p>
                                <div className="rounded-lg border border-slate-200 overflow-clip">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">種別</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">賃金日額</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">印紙額面</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {[
                                        { label: "第1種", range: "11,300円以上", price: 176 },
                                        { label: "第2種", range: "9,300〜11,300円未満", price: 146 },
                                        { label: "第3種", range: "9,300円未満", price: 96 },
                                      ].map((t) => {
                                        const tag = `${t.label}(${t.price}円)`;
                                        const isCurrent = selectedStampRow.empGrade === tag;
                                        return (
                                          <tr key={t.label} className={isCurrent ? "bg-emerald-50" : ""}>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isCurrent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                                {isCurrent && "★ "}{t.label}
                                              </span>
                                            </td>
                                            <td className={`px-3 py-2 text-xs whitespace-nowrap ${isCurrent ? "text-emerald-800 font-semibold" : "text-slate-600"}`}>{t.range}</td>
                                            <td className={`px-3 py-2 text-right text-xs font-mono whitespace-nowrap ${isCurrent ? "text-emerald-800 font-semibold" : "text-slate-700"}`}>¥{t.price}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 作業員情報 */}
                      {stampDetailTab === "worker" && (
                        <div className="space-y-3">
                          {worker ? (
                            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                              <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs w-32">従業員番号</td><td className="px-4 py-2.5 text-slate-900 font-mono text-xs">{worker.employeeCode}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">氏名</td><td className="px-4 py-2.5 text-slate-900 font-medium">{worker.name}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">フリガナ</td><td className="px-4 py-2.5 text-slate-700 text-xs">{worker.nameKana}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">所属先</td><td className="px-4 py-2.5 text-slate-900">{worker.defaultCompany}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">電話番号</td><td className="px-4 py-2.5 text-slate-700">{worker.phone}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">支払い方法</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${worker.paymentMethod === "振り込み" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{worker.paymentMethod}</span></td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">状態</td><td className="px-4 py-2.5"><Badge variant={worker.isActive ? "default" : "secondary"}>{worker.isActive ? "有効" : "無効"}</Badge></td></tr>
                              </tbody></table>
                            </div>
                          ) : <p className="text-sm text-slate-400">作業員情報が見つかりません</p>}
                        </div>
                      )}

                      {/* 週休スケジュール */}
                      {stampDetailTab === "schedule" && (
                        <div className="space-y-3">
                          {schedule ? (
                            <>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">社員No</p><p className="text-xs font-medium text-slate-900">{schedule.employeeNo}</p></div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">出勤日数</p><p className="text-xs font-medium text-slate-900">{schedule.workDays}日</p></div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">休日数</p><p className="text-xs font-medium text-slate-900">{schedule.offDays}日</p></div>
                              </div>
                              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500">今月の週休スケジュール</div>
                                <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                                  {weekDays.map((day, i) => {
                                    const type = schedule.schedule[day];
                                    const cfg = dayTypeConfig[type];
                                    return (
                                      <div key={day} className="flex flex-col items-center gap-1">
                                        <span className={`text-[10px] ${i >= 5 ? "text-blue-500" : "text-slate-400"}`}>{day}</span>
                                        <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded text-xs", cfg.className)}>{cfg.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                                {Object.entries(dayTypeConfig).map(([key, cfg]) => (
                                  <div key={key} className="flex items-center gap-1.5">
                                    <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded text-[10px]", cfg.className)}>{cfg.label}</span>
                                    <span>{key === "work" ? "出勤" : key === "off" ? "休日" : key === "half" ? "半休" : "有給"}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : <p className="text-sm text-slate-400">スケジュール情報が見つかりません</p>}
                        </div>
                      )}

                      {/* 有給休暇 */}
                      {stampDetailTab === "paidleave" && (
                        <div className="space-y-3">
                          {paidLeave ? (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-blue-50 px-3 py-2.5"><p className="text-[10px] text-blue-500">付与日数</p><p className="text-lg font-bold text-blue-700">{paidLeave.granted}日</p></div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">残日数</p><p className={`text-lg font-bold ${paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}`}>{paidLeave.remaining}日</p></div>
                              </div>
                              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日</td><td className="px-4 py-2.5 text-slate-900 text-xs">{paidLeave.grantDate}</td></tr>
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日数</td><td className="px-4 py-2.5 text-slate-900 font-mono">{paidLeave.granted}日</td></tr>
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">取得日数</td><td className="px-4 py-2.5 text-slate-900 font-mono">{paidLeave.used}日</td></tr>
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残日数</td><td className="px-4 py-2.5 font-mono font-semibold"><span className={paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>{paidLeave.remaining}日</span></td></tr>
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">有効期限</td><td className="px-4 py-2.5 text-slate-700 text-xs">{paidLeave.expiry}</td></tr>
                                  <tr><td className="px-4 py-2.5 text-slate-500 text-xs">消化率</td><td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${Math.round(paidLeave.used/paidLeave.granted*100)>=80?"bg-slate-900":Math.round(paidLeave.used/paidLeave.granted*100)>=50?"bg-blue-500":"bg-slate-300"}`} style={{width:`${Math.round(paidLeave.used/paidLeave.granted*100)}%`}} />
                                      </div>
                                      <span className="text-xs text-slate-500">{Math.round(paidLeave.used/paidLeave.granted*100)}%</span>
                                    </div>
                                  </td></tr>
                                </tbody></table>
                              </div>
                            </>
                          ) : <p className="text-sm text-slate-400">有給休暇情報が見つかりません</p>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeSubTab === "会社" && (
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

        {activeSubTab === "現金納付" && (
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

        {activeSubTab === "契約社員" && (
          <>
            <p className="text-sm text-slate-500">社会保険・住民税・源泉税 契約社員（行クリックで詳細編集）</p>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCollectionLedger.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                        onClick={() => { setSelectedLedgerId(row.id); setLedgerDetailTab("social"); }}
                      >
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{row.updatedAt}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.healthIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.pension.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.nursingIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.empIns.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.residentTax.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-semibold whitespace-nowrap" colSpan={7}>合計</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-bold tabular-nums whitespace-nowrap">¥{collectionGrandTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 詳細編集ダイアログ */}
            {selectedLedgerId !== null && (() => {
              const ledger = collectionLedgerData.find((d) => d.id === selectedLedgerId);
              const wh = withholdingData.find((d) => d.name === ledger?.name);
              const res = residentData.find((d) => d.name === ledger?.name);
              if (!ledger) return null;
              return (
                <Dialog open={true} onOpenChange={(open) => { if (!open) { setSelectedLedgerId(null); setLedgerDetailTab("social"); } }}>
                  <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span>{ledger.name}</span>
                        <span className="text-sm font-normal text-slate-500">— 契約社員詳細</span>
                      </DialogTitle>
                      <DialogDescription>各種控除額を確認・編集できます</DialogDescription>
                    </DialogHeader>

                    {/* 内部タブ */}
                    <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit mt-1 flex-wrap">
                      {([["social", "社会保険"], ["withholding", "源泉税"], ["resident", "住民税"], ["schedule", "週休"], ["paidleave", "有給休暇"]] as const).map(([val, label]) => (
                        <button key={val} onClick={() => setLedgerDetailTab(val)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${ledgerDetailTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{label}</button>
                      ))}
                    </div>

                    {/* 社会保険 */}
                    {ledgerDetailTab === "social" && (
                      <div className="grid grid-cols-2 gap-4 py-2">
                        {[
                          ["健康保険", ledger.healthIns],
                          ["厚生年金", ledger.pension],
                          ["介護保険", ledger.nursingIns],
                          ["雇用保険", ledger.empIns],
                          ["住民税控除", ledger.residentTax],
                        ].map(([label, val]) => (
                          <div key={label as string} className="grid gap-1.5">
                            <Label className="text-xs text-slate-500">{label as string}</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                              <Input defaultValue={(val as number).toLocaleString()} className="pl-7 h-9 text-sm font-mono" />
                            </div>
                          </div>
                        ))}
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">合計</Label>
                          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-mono font-semibold text-slate-900">
                            ¥{ledger.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 源泉税 */}
                    {ledgerDetailTab === "withholding" && wh && (
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">対象月</Label>
                          <Input defaultValue={wh.month} className="h-9 text-sm" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">ステータス</Label>
                          <div className={`flex items-center rounded-lg border px-3 py-2 text-xs font-medium ${wh.status === "計算済" ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>{wh.status}</div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">支給額</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                            <Input defaultValue={wh.grossPay.toLocaleString()} className="pl-7 h-9 text-sm font-mono" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">源泉税額</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                            <Input defaultValue={wh.netTax.toLocaleString()} className="pl-7 h-9 text-sm font-mono" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 住民税 */}
                    {ledgerDetailTab === "resident" && res && (
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">市区町村</Label>
                          <Input defaultValue={res.municipality} className="h-9 text-sm" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">ステータス</Label>
                          <div className={`flex items-center rounded-lg border px-3 py-2 text-xs font-medium ${res.status === "徴収済" ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>{res.status}</div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">月額</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                            <Input defaultValue={res.monthlyAmount.toLocaleString()} className="pl-7 h-9 text-sm font-mono" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">年間額</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                            <Input defaultValue={res.annualAmount.toLocaleString()} className="pl-7 h-9 text-sm font-mono" />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">徴収済</Label>
                          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-mono text-slate-700">¥{res.collected.toLocaleString()}</div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs text-slate-500">残高</Label>
                          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-mono font-semibold text-slate-900">¥{res.balance.toLocaleString()}</div>
                        </div>
                      </div>
                    )}

                    {/* 週休スケジュール（契約社員） */}
                    {ledgerDetailTab === "schedule" && (() => {
                      const schedule = scheduleData.find(s => s.name === ledger.name);
                      return schedule ? (
                        <div className="space-y-3 py-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">社員No</p><p className="text-xs font-medium text-slate-900">{schedule.employeeNo}</p></div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">出勤日数</p><p className="text-xs font-medium text-slate-900">{schedule.workDays}日</p></div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">休日数</p><p className="text-xs font-medium text-slate-900">{schedule.offDays}日</p></div>
                          </div>
                          <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500">今月の週休スケジュール</div>
                            <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                              {weekDays.map((day, i) => {
                                const type = schedule.schedule[day];
                                const cfg = dayTypeConfig[type];
                                return (
                                  <div key={day} className="flex flex-col items-center gap-1">
                                    <span className={`text-[10px] ${i >= 5 ? "text-blue-500" : "text-slate-400"}`}>{day}</span>
                                    <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded text-xs", cfg.className)}>{cfg.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : <p className="text-sm text-slate-400 py-2">スケジュール情報が見つかりません</p>;
                    })()}

                    {/* 有給休暇（契約社員） */}
                    {ledgerDetailTab === "paidleave" && (() => {
                      const paidLeave = mockPaidLeave.find(p => p.name === ledger.name);
                      return paidLeave ? (
                        <div className="space-y-3 py-2">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-blue-50 px-3 py-2.5"><p className="text-[10px] text-blue-500">付与日数</p><p className="text-lg font-bold text-blue-700">{paidLeave.granted}日</p></div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">残日数</p><p className={`text-lg font-bold ${paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}`}>{paidLeave.remaining}日</p></div>
                          </div>
                          <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                            <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                              <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日</td><td className="px-4 py-2.5 text-slate-900 text-xs">{paidLeave.grantDate}</td></tr>
                              <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日数</td><td className="px-4 py-2.5 font-mono">{paidLeave.granted}日</td></tr>
                              <tr><td className="px-4 py-2.5 text-slate-500 text-xs">取得日数</td><td className="px-4 py-2.5 font-mono">{paidLeave.used}日</td></tr>
                              <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残日数</td><td className="px-4 py-2.5 font-mono font-semibold"><span className={paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>{paidLeave.remaining}日</span></td></tr>
                              <tr><td className="px-4 py-2.5 text-slate-500 text-xs">有効期限</td><td className="px-4 py-2.5 text-slate-700 text-xs">{paidLeave.expiry}</td></tr>
                            </tbody></table>
                          </div>
                        </div>
                      ) : <p className="text-sm text-slate-400 py-2">有給休暇情報が見つかりません</p>;
                    })()}

                    <DialogFooter className="mt-2">
                      <Button variant="outline" onClick={() => setSelectedLedgerId(null)}>閉じる</Button>
                      <Button onClick={() => setSelectedLedgerId(null)}>保存する</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              );
            })()}
          </>
        )}

        {/* ── アルバイト ── */}
        {activeSubTab === "アルバイト" && (
          <>
            <p className="text-sm text-slate-500">時給制アルバイトの勤怠・賃金管理</p>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "登録人数",     value: "5名",       icon: Users,        bg: "bg-blue-50",   ic: "text-blue-600" },
                { label: "総労働時間",   value: "450.0h",   icon: Clock,        bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "残業時間合計", value: "25.0h",    icon: CalendarDays, bg: "bg-blue-50",   ic: "text-blue-600" },
                { label: "賃金合計",     value: "¥570,950", icon: Banknote,     bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="氏名で検索..." value={partTimeSearch} onChange={(e) => setPartTimeSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />新規登録
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["氏名","時給","出勤日数","総時間","残業","支給額","対象月","ステータス"].map((h) => (
                        <th key={h} className={`px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["時給","出勤日数","総時間","残業","支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPartTimeWorkers.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => { setSelectedPartTime(row); setPartTimeDetailTab("basic"); }}>
                        <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.hourlyRate.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.overtime.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "確定" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredPartTimeWorkers.length} 件</div>

            {/* アルバイト詳細ポップアップ */}
            {selectedPartTime && (
              <Dialog open={true} onOpenChange={(open) => { if (!open) { setSelectedPartTime(null); setPartTimeDetailTab("basic"); } }}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedPartTime.name} — アルバイト詳細</DialogTitle>
                  </DialogHeader>
                  {(() => {
                    const schedule = scheduleData.find(s => s.name === selectedPartTime.name);
                    const paidLeave = mockPaidLeave.find(p => p.name === selectedPartTime.name);
                    return (
                      <div className="space-y-4">
                        <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-wrap">
                          {([["basic","勤怠情報"],["schedule","週休"],["paidleave","有給休暇"]] as const).map(([val, label]) => (
                            <button key={val} onClick={() => setPartTimeDetailTab(val)}
                              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${partTimeDetailTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* 勤怠情報 */}
                        {partTimeDetailTab === "basic" && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-lg bg-blue-50 px-3 py-2.5"><p className="text-[10px] text-blue-500">支給額</p><p className="text-lg font-bold text-blue-700">¥{selectedPartTime.grossPay.toLocaleString()}</p></div>
                              <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">ステータス</p><p className={`text-sm font-medium ${selectedPartTime.status === "確定" ? "text-slate-900" : "text-blue-700"}`}>{selectedPartTime.status}</p></div>
                            </div>
                            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                              <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs w-32">対象月</td><td className="px-4 py-2.5 text-slate-900">{selectedPartTime.month}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">時給</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{selectedPartTime.hourlyRate.toLocaleString()}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">出勤日数</td><td className="px-4 py-2.5 text-slate-900 font-mono">{selectedPartTime.workDays}日</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">総労働時間</td><td className="px-4 py-2.5 text-slate-900 font-mono">{selectedPartTime.totalHours.toFixed(1)}h</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残業時間</td><td className="px-4 py-2.5 text-slate-900 font-mono">{selectedPartTime.overtime.toFixed(1)}h</td></tr>
                                <tr className="bg-slate-50"><td className="px-4 py-2.5 text-slate-700 font-medium text-xs">総支給額</td><td className="px-4 py-2.5 text-slate-900 font-mono font-semibold">¥{selectedPartTime.grossPay.toLocaleString()}</td></tr>
                              </tbody></table>
                            </div>
                          </div>
                        )}

                        {/* 週休スケジュール */}
                        {partTimeDetailTab === "schedule" && (
                          <div className="space-y-3">
                            {schedule ? (
                              <>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">社員No</p><p className="text-xs font-medium text-slate-900">{schedule.employeeNo}</p></div>
                                  <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">出勤日数</p><p className="text-xs font-medium text-slate-900">{schedule.workDays}日</p></div>
                                  <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">休日数</p><p className="text-xs font-medium text-slate-900">{schedule.offDays}日</p></div>
                                </div>
                                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500">今月の週休スケジュール</div>
                                  <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                                    {weekDays.map((day, i) => {
                                      const type = schedule.schedule[day];
                                      const cfg = dayTypeConfig[type];
                                      return (
                                        <div key={day} className="flex flex-col items-center gap-1">
                                          <span className={`text-[10px] ${i >= 5 ? "text-blue-500" : "text-slate-400"}`}>{day}</span>
                                          <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded text-xs", cfg.className)}>{cfg.label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                                  {Object.entries(dayTypeConfig).map(([key, cfg]) => (
                                    <div key={key} className="flex items-center gap-1.5">
                                      <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded text-[10px]", cfg.className)}>{cfg.label}</span>
                                      <span>{key === "work" ? "出勤" : key === "off" ? "休日" : key === "half" ? "半休" : "有給"}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : <p className="text-sm text-slate-400">スケジュール情報が見つかりません</p>}
                          </div>
                        )}

                        {/* 有給休暇 */}
                        {partTimeDetailTab === "paidleave" && (
                          <div className="space-y-3">
                            {paidLeave ? (
                              <>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-lg bg-blue-50 px-3 py-2.5"><p className="text-[10px] text-blue-500">付与日数</p><p className="text-lg font-bold text-blue-700">{paidLeave.granted}日</p></div>
                                  <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500">残日数</p><p className={`text-lg font-bold ${paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}`}>{paidLeave.remaining}日</p></div>
                                </div>
                                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日</td><td className="px-4 py-2.5 text-slate-900 text-xs">{paidLeave.grantDate}</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">付与日数</td><td className="px-4 py-2.5 font-mono">{paidLeave.granted}日</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">取得日数</td><td className="px-4 py-2.5 font-mono">{paidLeave.used}日</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残日数</td><td className="px-4 py-2.5 font-mono font-semibold"><span className={paidLeave.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>{paidLeave.remaining}日</span></td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">有効期限</td><td className="px-4 py-2.5 text-slate-700 text-xs">{paidLeave.expiry}</td></tr>
                                  </tbody></table>
                                </div>
                              </>
                            ) : <p className="text-sm text-slate-400">有給休暇情報が見つかりません</p>}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => setSelectedPartTime(null)}>閉じる</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}

        {/* ── 仕訳 ── */}
        {activeSubTab === "仕訳" && (
          <>
            <p className="text-sm text-slate-500">仕訳・預り金テーブル管理</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "仕訳件数", value: `${mockJournals.length}件`, icon: BookOpen,   bg: "bg-blue-50",   ic: "text-blue-600" },
                { label: "借方合計", value: "¥1,381,700",               icon: Calculator, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "貸方合計", value: "¥526,700",                 icon: ArrowRight, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="勘定科目・摘要で検索..." value={journalSearch} onChange={(e) => setJournalSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="all">全カテゴリ</option>
                  <option value="給与">給与</option>
                  <option value="納付">納付</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />仕訳追加
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["日付","借方科目","借方金額","貸方科目","貸方金額","摘要"].map((h) => (
                        <th key={h} className={`px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["借方金額","貸方金額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJournals.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.debitAccount}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.debitAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.creditAccount}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.creditAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredJournals.length} 件</div>
          </>
        )}

        {/* ── 日当設定（車両系） ── */}
        {activeSubTab === "日当設定" && (
          <>
            <p className="text-sm text-slate-500">車種ごとの登録情報と日当設定を管理します（行クリックで詳細）</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "登録車種数", value: `${mockVehicleTypes.length}種`, icon: Truck, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "日当ルール数", value: `${mockWageRules.length}件`, icon: Banknote, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "登録会社数", value: `${mockCompanies.length}社`, icon: Building2, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="車種名・会社名で検索..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={vehicleCompanyFilter} onChange={(e) => setVehicleCompanyFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="all">全会社</option>
                  {mockCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />新規登録
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["会社名", "車種コード", "車種名", "表示順", "状態", "基本日当", "残業単価(通常)", "残業単価(深夜/休日)", "基準時間"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["基本日当","残業単価(通常)","残業単価(深夜/休日)","基準時間"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVehicles.map((v) => {
                      const wage = mockWageRules.find(r => r.companyId === v.companyId && r.vehicleTypeName === v.name);
                      return (
                        <tr key={v.id} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => { setSelectedVehicleRule(v); setVehicleRuleDetailTab("vehicle"); }}>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap text-xs">{v.companyName}</td>
                          <td className="px-3 sm:px-4 py-3 font-mono text-slate-700 whitespace-nowrap">{v.code}</td>
                          <td className="px-3 sm:px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{v.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-500 tabular-nums whitespace-nowrap">{v.displayOrder}</td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "有効" : "無効"}</Badge>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                            {wage ? `¥${wage.baseDailyWage.toLocaleString()}` : <span className="text-slate-300">未設定</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                            {wage ? `¥${wage.overtimeRateNormal.toLocaleString()}` : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                            {wage ? `¥${wage.overtimeRateHoliday.toLocaleString()}` : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                            {wage ? `${wage.baseHours}h` : <span className="text-slate-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredVehicles.length} 件</div>

            {/* 車種×日当 詳細ポップアップ */}
            {selectedVehicleRule && (
              <Dialog open={true} onOpenChange={(open) => { if (!open) { setSelectedVehicleRule(null); setEditingVehicleRule(null); setEditingWageRule2(null); } }}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedVehicleRule.companyName} — {selectedVehicleRule.name}</DialogTitle>
                  </DialogHeader>
                  {(() => {
                    const wage = mockWageRules.find(r => r.companyId === selectedVehicleRule.companyId && r.vehicleTypeName === selectedVehicleRule.name);
                    return (
                      <div className="space-y-4">
                        {/* タブ */}
                        <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
                          {([["vehicle","車両情報"],["wage","日当設定"]] as const).map(([val, label]) => (
                            <button key={val} onClick={() => setVehicleRuleDetailTab(val)}
                              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${vehicleRuleDetailTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* 車両情報 */}
                        {vehicleRuleDetailTab === "vehicle" && (
                          <div className="space-y-3">
                            {editingVehicleRule ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs text-slate-500">車種コード</Label>
                                    <Input defaultValue={editingVehicleRule.code} className="h-9 text-sm font-mono" />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs text-slate-500">車種名</Label>
                                    <Input defaultValue={editingVehicleRule.name} className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="grid gap-1.5">
                                  <Label className="text-xs text-slate-500">会社</Label>
                                  <Select defaultValue={editingVehicleRule.companyId}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>{mockCompanies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs text-slate-500">表示順</Label>
                                    <Input type="number" defaultValue={editingVehicleRule.displayOrder} className="h-9 text-sm" />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs text-slate-500">状態</Label>
                                    <Select defaultValue={editingVehicleRule.isActive ? "active" : "inactive"}>
                                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">有効</SelectItem>
                                        <SelectItem value="inactive">無効</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                  <Button variant="outline" size="sm" onClick={() => setEditingVehicleRule(null)}>キャンセル</Button>
                                  <Button size="sm" onClick={() => setEditingVehicleRule(null)}>保存する</Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-end">
                                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditingVehicleRule(selectedVehicleRule)}>
                                    <Pencil className="h-3.5 w-3.5" />編集
                                  </Button>
                                </div>
                                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs w-28">会社</td><td className="px-4 py-2.5 text-slate-900">{selectedVehicleRule.companyName}</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">車種コード</td><td className="px-4 py-2.5 text-slate-900 font-mono">{selectedVehicleRule.code}</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">車種名</td><td className="px-4 py-2.5 text-slate-900 font-medium">{selectedVehicleRule.name}</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">表示順</td><td className="px-4 py-2.5 text-slate-700 tabular-nums">{selectedVehicleRule.displayOrder}</td></tr>
                                    <tr><td className="px-4 py-2.5 text-slate-500 text-xs">状態</td><td className="px-4 py-2.5"><Badge variant={selectedVehicleRule.isActive ? "default" : "secondary"}>{selectedVehicleRule.isActive ? "有効" : "無効"}</Badge></td></tr>
                                  </tbody></table>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* 日当設定 */}
                        {vehicleRuleDetailTab === "wage" && (
                          <div className="space-y-3">
                            {wage ? (
                              editingWageRule2 ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-1.5">
                                      <Label className="text-xs text-slate-500">基本日当</Label>
                                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><Input type="number" defaultValue={editingWageRule2.baseDailyWage} className="h-9 pl-7 text-sm font-mono" /></div>
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label className="text-xs text-slate-500">基準時間</Label>
                                      <Input type="number" defaultValue={editingWageRule2.baseHours} className="h-9 text-sm" />
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label className="text-xs text-slate-500">残業単価（通常）</Label>
                                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><Input type="number" defaultValue={editingWageRule2.overtimeRateNormal} className="h-9 pl-7 text-sm font-mono" /></div>
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label className="text-xs text-slate-500">残業単価（深夜）</Label>
                                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><Input type="number" defaultValue={editingWageRule2.overtimeRateLate} className="h-9 pl-7 text-sm font-mono" /></div>
                                    </div>
                                    <div className="grid gap-1.5 col-span-2">
                                      <Label className="text-xs text-slate-500">残業単価（休日）</Label>
                                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><Input type="number" defaultValue={editingWageRule2.overtimeRateHoliday} className="h-9 pl-7 text-sm font-mono" /></div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                    <Button variant="outline" size="sm" onClick={() => setEditingWageRule2(null)}>キャンセル</Button>
                                    <Button size="sm" onClick={() => setEditingWageRule2(null)}>保存する</Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-end">
                                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditingWageRule2(wage)}>
                                      <Pencil className="h-3.5 w-3.5" />編集
                                    </Button>
                                  </div>
                                  <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                                    <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                      <tr className="bg-blue-50/30"><td className="px-4 py-2.5 text-slate-500 text-xs w-36">基本日当</td><td className="px-4 py-2.5 text-blue-700 font-mono font-bold">¥{wage.baseDailyWage.toLocaleString()}</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">基準時間</td><td className="px-4 py-2.5 text-slate-900 font-mono">{wage.baseHours}h</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残業単価（通常）</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{wage.overtimeRateNormal.toLocaleString()}/h</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残業単価（深夜）</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{wage.overtimeRateLate.toLocaleString()}/h</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">残業単価（休日）</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{wage.overtimeRateHoliday.toLocaleString()}/h</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">有効開始日</td><td className="px-4 py-2.5 text-slate-700 text-xs">{wage.effectiveFrom.toLocaleDateString("ja-JP")}</td></tr>
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">有効終了日</td><td className="px-4 py-2.5 text-slate-400 text-xs">{wage.effectiveTo ? (wage.effectiveTo as Date).toLocaleDateString("ja-JP") : "無期限"}</td></tr>
                                    </tbody></table>
                                  </div>
                                </>
                              )
                            ) : (
                              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                                <p className="text-sm text-slate-400 mb-3">この車種の日当設定が未登録です</p>
                                <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />日当設定を追加</Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => { setSelectedVehicleRule(null); setEditingVehicleRule(null); setEditingWageRule2(null); }}>閉じる</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
