"use client";

import React, { useState, useEffect } from "react";
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
  CalendarIcon,
  Trash2,
  Coins,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

type EmpGradeDetail = { ukeire: number; haraidashi: number; zan: number; workers: number; stamps: number; wages: number; note: string };
type HealthGradeDetail = {
  // 左側: 適用
  tekiyoMonth: number;     // 本月中の延べ人員
  tekiyoCumul: number;     // 4月から本月まで延べ人員
  // 左側: 除外
  jokaiMonth: number;      // 本月中の延べ人員（除外）
  jokaiCumul: number;      // 4月から本月まで延べ人員（除外）
  // 右側: 印紙受払状況
  prevBalance: number;     // 前月末の健保印紙保有枚数
  ukeire: number;          // 本月中に購入した枚数
  harifu: number;          // 本月中に貼り付けた枚数
  monthEndBalance: number; // 本月末の健保印紙保有枚数
  cumulative: number;      // 4月から本月までの累計枚数
  cashPayment: number;     // 現金納付保険料（特別保険料を除く）
  personDays: number;      // 人日
};
type LedgerRow = {
  id: number; date: string; type: string; note: string;
  emp1: EmpGradeDetail; emp2: EmpGradeDetail; emp3: EmpGradeDetail;
  grade1: number; grade2: number; grade3: number;
  hg1: number; hg2: number; hg3: number; hg4: number; hg5: number; hg6: number; hg7: number; hg8: number; hg9: number; hg10: number; hg11: number;
  health: Record<string, HealthGradeDetail>;
};
const mkEmp = (u: number, h: number, z: number, w: number, s: number, wages: number): EmpGradeDetail => ({ ukeire: u, haraidashi: h, zan: z, workers: w, stamps: s, wages, note: "" });
// [tekiyoMonth, tekiyoCumul, jokaiMonth, jokaiCumul, prevBalance, ukeire, harifu, monthEndBalance, cumulative, cashPayment, personDays]
const mkH = (tm: number, tc: number, jm: number, jc: number, prev: number, u: number, har: number, end: number, cum: number, cash: number, pd: number): HealthGradeDetail =>
  ({ tekiyoMonth: tm, tekiyoCumul: tc, jokaiMonth: jm, jokaiCumul: jc, prevBalance: prev, ukeire: u, harifu: har, monthEndBalance: end, cumulative: cum, cashPayment: cash, personDays: pd });
const mkHealthGrades = (vals: [number,number,number,number,number,number,number,number,number,number,number][]): Record<string, HealthGradeDetail> => {
  const keys = ["hg1","hg2","hg3","hg4","hg5","hg6","hg7","hg8","hg9","hg10","hg11"];
  return Object.fromEntries(keys.map((k, i) => [k, mkH(...(vals[i] ?? [0,0,0,0,0,0,0,0,0,0,0] as [number,number,number,number,number,number,number,number,number,number,number]))]));
};
const ledgerData: LedgerRow[] = [
  // [tekiyoMonth, tekiyoCumul, jokaiMonth, jokaiCumul, prevBalance, ukeire, harifu, monthEndBalance, cumulative, cashPayment, personDays]
  { id: 1, date: "2024/01/04", type: "受入", note: "月初受入",    emp1: mkEmp(10,0,670,0,0,0), emp2: mkEmp(10,0,629,0,0,0), emp3: mkEmp(5,0,200,0,0,0), grade1:10, grade2:10, grade3:5,  hg1:8,  hg2:6,  hg3:10, hg4:4, hg5:2, hg6:3, hg7:2, hg8:1, hg9:1, hg10:0, hg11:0, health: mkHealthGrades([[0,0,0,0,0,8,0,8,8,0,0],[0,0,0,0,0,6,0,6,6,0,0],[0,0,0,0,0,10,0,10,10,0,0],[0,0,0,0,0,4,0,4,4,0,0],[0,0,0,0,0,2,0,2,2,0,0],[0,0,0,0,0,3,0,3,3,0,0],[0,0,0,0,0,2,0,2,2,0,0],[0,0,0,0,0,1,0,1,1,0,0],[0,0,0,0,0,1,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]]) },
  { id: 2, date: "2024/01/05", type: "払出", note: "日雇保険貼付", emp1: mkEmp(0,3,667,7,7,120855), emp2: mkEmp(0,2,627,0,0,0), emp3: mkEmp(0,1,199,0,0,0), grade1:3, grade2:2, grade3:1, hg1:2, hg2:1, hg3:3, hg4:1, hg5:0, hg6:1, hg7:0, hg8:0, hg9:0, hg10:0, hg11:0, health: mkHealthGrades([[7,7,0,0,8,0,2,6,6,0,7],[0,0,0,0,6,0,1,5,5,0,0],[0,0,0,0,10,0,3,7,7,0,0],[0,0,0,0,4,0,1,3,3,0,0],[0,0,0,0,2,0,0,2,2,0,0],[0,0,0,0,3,0,1,2,2,0,0],[0,0,0,0,2,0,0,2,2,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]]) },
  { id: 3, date: "2024/01/10", type: "払出", note: "日雇保険貼付", emp1: mkEmp(0,5,662,20,20,308286), emp2: mkEmp(0,4,623,0,0,0), emp3: mkEmp(0,2,197,0,0,0), grade1:5, grade2:4, grade3:2, hg1:1, hg2:2, hg3:4, hg4:2, hg5:1, hg6:1, hg7:1, hg8:0, hg9:0, hg10:0, hg11:0, health: mkHealthGrades([[20,27,0,0,6,0,1,5,5,0,20],[0,0,0,0,5,0,2,3,3,0,0],[0,0,0,0,7,0,4,3,3,0,0],[0,0,0,0,3,0,2,1,1,0,0],[0,0,0,0,2,0,1,1,1,0,0],[0,0,0,0,2,0,1,1,1,0,0],[0,0,0,0,2,0,1,1,1,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]]) },
  { id: 4, date: "2024/01/15", type: "受入", note: "追加購入",    emp1: mkEmp(20,0,682,0,0,0), emp2: mkEmp(15,0,638,0,0,0), emp3: mkEmp(10,0,207,0,0,0), grade1:20, grade2:15, grade3:10, hg1:15, hg2:12, hg3:18, hg4:8, hg5:5, hg6:6, hg7:4, hg8:3, hg9:2, hg10:1, hg11:1, health: mkHealthGrades([[0,27,0,0,5,15,0,20,20,0,0],[0,0,0,0,3,12,0,15,15,0,0],[0,0,0,0,3,18,0,21,21,0,0],[0,0,0,0,1,8,0,9,9,0,0],[0,0,0,0,1,5,0,6,6,0,0],[0,0,0,0,1,6,0,7,7,0,0],[0,0,0,0,1,4,0,5,5,0,0],[0,0,0,0,1,3,0,4,4,0,0],[0,0,0,0,1,2,0,3,3,0,0],[0,0,0,0,0,1,0,1,1,0,0],[0,0,0,0,0,1,0,1,1,0,0]]) },
  { id: 5, date: "2024/01/20", type: "払出", note: "日雇保険貼付", emp1: mkEmp(0,4,678,29,29,441486), emp2: mkEmp(0,3,635,0,0,0), emp3: mkEmp(0,2,205,0,0,0), grade1:4, grade2:3, grade3:2, hg1:2, hg2:1, hg3:3, hg4:1, hg5:0, hg6:1, hg7:0, hg8:0, hg9:0, hg10:0, hg11:0, health: mkHealthGrades([[29,56,0,0,20,0,2,18,18,0,29],[0,0,0,0,15,0,1,14,14,0,0],[0,0,0,0,21,0,3,18,18,0,0],[0,0,0,0,9,0,1,8,8,0,0],[0,0,0,0,6,0,0,6,6,0,0],[0,0,0,0,7,0,1,6,6,0,0],[0,0,0,0,5,0,0,5,5,0,0],[0,0,0,0,4,0,0,4,4,0,0],[0,0,0,0,3,0,0,3,3,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,1,0,0,1,1,0,0]]) },
  { id: 6, date: "2024/01/25", type: "払出", note: "日雇保険貼付", emp1: mkEmp(0,6,672,28,28,425843), emp2: mkEmp(0,5,630,0,0,0), emp3: mkEmp(0,3,202,0,0,0), grade1:6, grade2:5, grade3:3, hg1:3, hg2:2, hg3:5, hg4:2, hg5:1, hg6:2, hg7:1, hg8:1, hg9:0, hg10:0, hg11:0, health: mkHealthGrades([[28,84,0,0,18,0,3,15,15,0,28],[0,0,0,0,14,0,2,12,12,0,0],[0,0,0,0,18,0,5,13,13,0,0],[0,0,0,0,8,0,2,6,6,0,0],[0,0,0,0,6,0,1,5,5,0,0],[0,0,0,0,6,0,2,4,4,0,0],[0,0,0,0,5,0,1,4,4,0,0],[0,0,0,0,4,0,1,3,3,0,0],[0,0,0,0,3,0,0,3,3,0,0],[0,0,0,0,1,0,0,1,1,0,0],[0,0,0,0,1,0,0,1,1,0,0]]) },
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

type MainTab = "人" | "車" | "場";
const MAIN_TABS: MainTab[] = ["人", "車", "場"];
const SUB_TABS: Record<MainTab, string[]> = {
  "人": ["印紙管理", "契約社員", "アルバイト", "会社", "仕訳"],
  "車": ["日当設定"],
  "場": ["運行実績", "各種設定"],
};

// --- Workers ---
interface WorkerAllowance { id: string; name: string; amount: number; isContinuous: boolean; }

const mockWorkers = [
  { id: 1, employeeCode: "E001", name: "山田 太郎", nameKana: "ヤマダ タロウ", defaultCompany: "A運輸株式会社", affiliation: "新運転", phone: "090-1234-5678", isActive: true, paymentMethod: "キャッシュマシン", paymentCycle: "day" as "day" | "3day" | "week" | "month", workHours: 8, employeeType: "hiyatoi", socialInsuranceGrade: "6等級(介護なし)", employmentInsuranceGrade: "4等級", allowances: [{ id: "a1", name: "皆勤手当", amount: 5000, isContinuous: true }, { id: "a2", name: "リーダー手当", amount: 3000, isContinuous: true }] as WorkerAllowance[] },
  { id: "2", employeeCode: "E002", name: "鈴木 一郎", nameKana: "スズキ イチロウ", defaultCompany: "A運輸株式会社", affiliation: "クリーン労働組合", phone: "090-2345-6789", isActive: true, paymentMethod: "キャッシュマシン", paymentCycle: "week" as "day" | "3day" | "week" | "month", workHours: 7, employeeType: "hiyatoi", socialInsuranceGrade: "3等級(介護なし)", employmentInsuranceGrade: "2等級", allowances: [{ id: "a3", name: "資格手当", amount: 2000, isContinuous: true }] as WorkerAllowance[] },
  { id: "3", employeeCode: "E003", name: "佐藤 花子", nameKana: "サトウ ハナコ", defaultCompany: "B物流株式会社", affiliation: "直雇用", phone: "090-3456-7890", isActive: true, paymentMethod: "振り込み", paymentCycle: "month" as "day" | "3day" | "week" | "month", workHours: 8, employeeType: "furikomi", socialInsuranceGrade: "10等級(介護あり)", employmentInsuranceGrade: "7等級", allowances: [] as WorkerAllowance[] },
  { id: "4", employeeCode: "E004", name: "高橋 健二", nameKana: "タカハシ ケンジ", defaultCompany: "A運輸株式会社", affiliation: "クリーン労働組合", phone: "090-4567-8901", isActive: true, paymentMethod: "振り込み", paymentCycle: "month" as "day" | "3day" | "week" | "month", workHours: 8, employeeType: "furikomi", socialInsuranceGrade: "6等級(介護あり)", employmentInsuranceGrade: "5等級", allowances: [{ id: "a4", name: "早出手当(固定)", amount: 1500, isContinuous: false }] as WorkerAllowance[] },
  { id: "5", employeeCode: "E005", name: "田中 美咲", nameKana: "タナカ ミサキ", defaultCompany: "C配送センター", affiliation: "新運転", phone: "090-5678-9012", isActive: false, paymentMethod: "キャッシュマシン", paymentCycle: "day" as "day" | "3day" | "week" | "month", workHours: 7, employeeType: "hiyatoi", socialInsuranceGrade: "3等級(介護なし)", employmentInsuranceGrade: "2等級", allowances: [] as WorkerAllowance[] },
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
  { id: "1", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "2tトラック", baseDailyWage: 10000, vehicleAllowance: 500, baseHours: 8, overtimeRateNormal: 1400, overtimeRateLate: 1750, overtimeRateHoliday: 1750, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "2", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "4tトラック", baseDailyWage: 11000, vehicleAllowance: 800, baseHours: 8, overtimeRateNormal: 1500, overtimeRateLate: 1875, overtimeRateHoliday: 1875, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "3", companyId: "1", companyName: "A運輸株式会社", vehicleTypeName: "10tトラック", baseDailyWage: 13000, vehicleAllowance: 1200, baseHours: 8, overtimeRateNormal: 1800, overtimeRateLate: 2250, overtimeRateHoliday: 2250, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "4", companyId: "2", companyName: "B物流株式会社", vehicleTypeName: "2tトラック", baseDailyWage: 9500, vehicleAllowance: 400, baseHours: 8, overtimeRateNormal: 1300, overtimeRateLate: 1625, overtimeRateHoliday: 1625, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "5", companyId: "2", companyName: "B物流株式会社", vehicleTypeName: "4tトラック", baseDailyWage: 10500, vehicleAllowance: 600, baseHours: 8, overtimeRateNormal: 1450, overtimeRateLate: 1815, overtimeRateHoliday: 1815, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
  { id: "6", companyId: "3", companyName: "C配送センター", vehicleTypeName: "2tトラック", baseDailyWage: 9000, vehicleAllowance: 300, baseHours: 8, overtimeRateNormal: 1250, overtimeRateLate: 1565, overtimeRateHoliday: 1565, effectiveFrom: new Date("2024-01-01"), effectiveTo: null, isActive: true },
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
const PART_TIME_TAX_RATES = { incomeTaxRate: 0.03063, employmentInsuranceRate: 0.006 };
const mockPartTimeWorkers = [
  { id: 1, name: "木村 翔太",   dailyAllowance: 10000, paymentMethod: "現金", workDays: 15, totalHours: 90.0,  overtime: 5.0,  grossPay: 150000, incomeTax: 4595, employmentInsurance: 900, netPay: 144505, month: "2024/01", status: "確定" },
  { id: 2, name: "松本 さくら", dailyAllowance: 9500,  paymentMethod: "振込", workDays: 12, totalHours: 72.0,  overtime: 0,    grossPay: 114000, incomeTax: 3492, employmentInsurance: 684, netPay: 109824, month: "2024/01", status: "確定" },
  { id: 3, name: "小林 大輝",   dailyAllowance: 11000, paymentMethod: "現金", workDays: 18, totalHours: 108.0, overtime: 8.0,  grossPay: 198000, incomeTax: 6065, employmentInsurance: 1188, netPay: 190747, month: "2024/01", status: "未確定" },
  { id: 4, name: "中村 愛",     dailyAllowance: 10000, paymentMethod: "振込", workDays: 10, totalHours: 60.0,  overtime: 2.0,  grossPay: 100000, incomeTax: 3063, employmentInsurance: 600, netPay: 96337, month: "2024/01", status: "確定" },
  { id: 5, name: "加藤 隆",     dailyAllowance: 9000,  paymentMethod: "現金", workDays: 20, totalHours: 120.0, overtime: 10.0, grossPay: 180000, incomeTax: 5513, employmentInsurance: 1080, netPay: 173407, month: "2024/01", status: "未確定" },
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
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("人");
  const [activeSubTab, setActiveSubTab] = useState<string>("印紙管理");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [ledgerYearMonth, setLedgerYearMonth] = useState<{ year: number; month: number }>({ year: 2024, month: 1 });
  const [ledgerYMOpen, setLedgerYMOpen] = useState(false);

  // 受払簿 row detail
  const [selectedLedgerRow, setSelectedLedgerRow] = useState<typeof ledgerData[0] | null>(null);
  const [editLedgerRow, setEditLedgerRow] = useState<typeof ledgerData[0] | null>(null);

  // Master management states
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);
  const [ledgerDetailTab, setLedgerDetailTab] = useState<"schedule" | "paidleave">("schedule");
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
  const [stampPeriodMonth, setStampPeriodMonth] = useState<Date | undefined>(new Date("2026-03-01"));
  const [stampPeriodOpen, setStampPeriodOpen] = useState(false);
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

  // 供給先別早出時間マスタ（unitPrice: 早出単価 円）
  const mkSup = (id: number, sc: number, sn: string, oc: number, on: string, em: number, up: number) =>
    ({ id, supplierCode: sc, supplierName: sn, subOfficeCode: oc, subOfficeName: on, earlyMinutes: em, unitPrice: up, isActive: true, memo: "" });
  const [supplierEarlyData, setSupplierEarlyData] = useState([
    mkSup( 1,   1, "千代田清掃事務所",              999, "本所",            60, 2000),
    mkSup( 2,   5, "みなと清掃事務所",              999, "本所",            40, 1500),
    mkSup( 3,   7, "新宿清掃事務所",                999, "本所",            20,  800),
    mkSup( 4,   8, "新宿清掃事務所新宿東SS",        999, "本所",            10,  500),
    mkSup( 5,   9, "文京清掃事務所",                 91, "小石川リサイクル", 20,  800),
    mkSup( 6,   9, "文京清掃事務所",                999, "本所",            20,  800),
    mkSup( 7,  14, "本所清掃事務所",                999, "本所",            60, 2000),
    mkSup( 8,  17, "品川清掃事務所",                999, "本所",            40, 1500),
    mkSup( 9,  18, "品川区清掃事務所 荏原庁舎",     999, "本所",            40, 1500),
    mkSup(10,  20, "蒲田清掃事務所(調布地区)",      999, "本所",            40, 1500),
    mkSup(11,  24, "目黒区清掃事務所",              999, "本所",            20,  800),
    mkSup(12,  25, "世田谷清掃事務所",              251, "弦巻第一分室",    20,  800),
    mkSup(13,  25, "世田谷清掃事務所",              252, "弦巻第二分室",    20,  800),
    mkSup(14,  25, "世田谷清掃事務所",              253, "世田谷リサイクル", 40, 1500),
    mkSup(15,  25, "世田谷清掃事務所",              999, "本所",            20,  800),
    mkSup(16,  27, "玉川清掃事務所",                999, "本所",            30, 1200),
    mkSup(17,  28, "渋谷清掃事務所",                281, "宇田川分室",      20,  800),
    mkSup(18,  28, "渋谷清掃事務所",                282, "代々木分室",      10,  500),
    mkSup(19,  28, "渋谷清掃事務所",                999, "本所",            20,  800),
    mkSup(20,  32, "豊島清掃事務所",                999, "本所",            20,  800),
    mkSup(21,  34, "板橋東清掃事務所",              999, "本所",            30, 1200),
    mkSup(22,  35, "板橋西清掃事務所",              999, "本所",            30, 1200),
    mkSup(23,  37, "石神井清掃事務所",              999, "本所",            20,  800),
    mkSup(24,  38, "蒲田清掃事務所(蒲田地区)",      999, "本所",            40, 1500),
    mkSup(25,  39, "足立西清掃事務所",              999, "本所",            50, 1800),
    mkSup(26,  45, "中防処理施設管理事務所",        999, "本所",            60, 2000),
    mkSup(27,  46, "品川清掃工場",                  999, "本所",            40, 1500),
    mkSup(28,  47, "中防処理施設管理事務所(溶融）", 999, "本所",            60, 2000),
    mkSup(29,  49, "大田清掃工場",                  999, "本所",            60, 2000),
    mkSup(30,  51, "練馬清掃工場",                  999, "本所",            30, 1200),
    mkSup(31,  52, "板橋清掃工場",                  999, "本所",            30, 1200),
    mkSup(32,  53, "足立清掃工場",                  999, "本所",            60, 2000),
    mkSup(33,  54, "葛飾清掃工場",                  999, "本所",            60, 2000),
    mkSup(34,  56, "北清掃工場",                    999, "本所",            30, 1200),
    mkSup(35,  57, "世田谷清掃工場",                999, "本所",            20,  800),
    mkSup(36,  58, "千歳清掃工場",                  999, "本所",            60, 2000),
    mkSup(37,  59, "多摩川清掃工場",                999, "本所",            40, 1500),
    mkSup(38,  60, "大井清掃工場",                  999, "本所",            40, 1500),
    mkSup(39,  61, "新江東清掃工場",                999, "本所",            60, 2000),
    mkSup(40,  63, "大田清掃工場第一工場",          999, "本所",            60, 2000),
    mkSup(41,  64, "目黒清掃工場",                  999, "本所",            20,  800),
    mkSup(42,  65, "光が丘清掃工場",                999, "本所",            30, 1200),
    mkSup(43,  66, "有明清掃工場",                  999, "本所",            60, 2000),
    mkSup(44,  67, "墨田清掃工場",                  999, "本所",            60, 2000),
    mkSup(45,  68, "港清掃工場",                    999, "本所",            40, 1500),
    mkSup(46,  69, "豊島清掃工場",                  999, "本所",            30, 1200),
    mkSup(47,  70, "中央清掃工場",                  999, "本所",            60, 2000),
    mkSup(48,  71, "渋谷清掃工場",                  999, "本所",            20,  800),
    mkSup(49,  87, "世田谷清掃事務所（資源）",      999, "本所",            20,  800),
    mkSup(50,  89, "玉川清掃事務所",                999, "本所",            30, 1200),
    mkSup(51,  91, "渋谷清掃事務所",                282, "代々木分室",      10,  500),
    mkSup(52,  91, "渋谷清掃事務所",                999, "本所",            20,  800),
    mkSup(53, 460, "杉並東破砕作業",                999, "本所",            10,  500),
  ]);
  const [supplierEarlySearch, setSupplierEarlySearch] = useState("");
  const [supplierEarlySortKey, setSupplierEarlySortKey] = useState<"supplierCode" | "earlyMinutes">("supplierCode");
  const [supplierEarlySortAsc, setSupplierEarlySortAsc] = useState(true);
  const [editingSupplierEarly, setEditingSupplierEarly] = useState<typeof supplierEarlyData[0] | null>(null);
  const [isNewSupplierEarlyOpen, setIsNewSupplierEarlyOpen] = useState(false);
  const [newSupplierEarly, setNewSupplierEarly] = useState({ supplierCode: 0, supplierName: "", subOfficeCode: 999, subOfficeName: "本所", earlyMinutes: 20, isActive: true, memo: "" });

  const filteredSupplierEarly = supplierEarlyData
    .filter(s => s.supplierName.includes(supplierEarlySearch) || s.subOfficeName.includes(supplierEarlySearch) || String(s.supplierCode).includes(supplierEarlySearch))
    .sort((a, b) => {
      const v = supplierEarlySortAsc ? 1 : -1;
      return (a[supplierEarlySortKey] > b[supplierEarlySortKey] ? 1 : -1) * v;
    });

  function toggleSupplierEarlySort(key: "supplierCode" | "earlyMinutes") {
    if (supplierEarlySortKey === key) setSupplierEarlySortAsc(p => !p);
    else { setSupplierEarlySortKey(key); setSupplierEarlySortAsc(true); }
  }

  function earlyMinBadgeCls(min: number) {
    if (min >= 60) return "bg-red-100 text-red-700 border-red-200";
    if (min >= 40) return "bg-orange-100 text-orange-700 border-orange-200";
    if (min >= 20) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  // 移動タブ states
  const [operationDate, setOperationDate] = useState("2026-03-19");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState("2026年3月");
  const [paidLeaveSearch, setPaidLeaveSearch] = useState("");
  const [partTimeSearch, setPartTimeSearch] = useState("");
  const [partTimeNewOpen, setPartTimeNewOpen] = useState(false);
  const [vehicleRuleNewOpen, setVehicleRuleNewOpen] = useState(false);
  const [editingWorkerAllowances, setEditingWorkerAllowances] = useState<WorkerAllowance[]>([]);
  const [isEditingAllowances, setIsEditingAllowances] = useState(false);
  const [journalSearch, setJournalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [journals, setJournals] = useState(mockJournals);
  const [journalLastRefreshed, setJournalLastRefreshed] = useState<string>("");
  const [journalExportDate, setJournalExportDate] = useState<Date | undefined>(new Date());

  // 仕訳タブ再表示時に最新データを反映
  useEffect(() => {
    if (activeSubTab === "仕訳") {
      setJournals([...mockJournals]);
      setJournalLastRefreshed(new Date().toLocaleString("ja-JP"));
    }
  }, [activeSubTab, activeMainTab]);

  const filteredStamps = stampsData.filter((d) => {
    const matchesSearch = d.name.includes(searchQuery);
    const matchesMethod = methodFilter === "all" || d.method === (methodFilter === "stamp" ? "印紙" : "現金");
    const matchesType = stampTypeFilter === "all" || d.stampType === stampTypeFilter;
    const matchesPeriod = !stampPeriodMonth || d.month === format(stampPeriodMonth, "yyyy/MM");
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
  const filteredJournals = journals.filter((j) => {
    const matchesSearch = j.description.includes(journalSearch) || j.debitAccount.includes(journalSearch) || j.creditAccount.includes(journalSearch);
    const matchesCategory = categoryFilter === "all" || j.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const ledgerYMPrefix = `${ledgerYearMonth.year}/${String(ledgerYearMonth.month).padStart(2, "0")}`;
  const filteredLedger = ledgerData.filter((d) =>
    d.date.startsWith(ledgerYMPrefix) &&
    (d.note.includes(searchQuery) || d.date.includes(searchQuery))
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
                ["ledger-general", "手帳あり(一般)"],
                ["ledger-nursing", "手帳あり(介護含)"],
                ["no-ledger",      "手帳なし"],
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
                <Popover open={stampPeriodOpen} onOpenChange={setStampPeriodOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !stampPeriodMonth && "text-muted-foreground")}>
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      {stampPeriodMonth ? format(stampPeriodMonth, "yyyy年M月") : "月を選択"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="single" selected={stampPeriodMonth} onSelect={(d) => { setStampPeriodMonth(d); setStampPeriodOpen(false); }} initialFocus />
                  </PopoverContent>
                </Popover>
                {stampPeriodMonth && (
                  <button
                    onClick={() => setStampPeriodMonth(undefined)}
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
                        {([["stamp","印紙情報"],["worker","作業員情報"]] as const).map(([val, label]) => (
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
                            <>
                            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                              <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs w-32">従業員番号</td><td className="px-4 py-2.5 text-slate-900 font-mono text-xs">{worker.employeeCode}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">氏名</td><td className="px-4 py-2.5 text-slate-900 font-medium">{worker.name}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">フリガナ</td><td className="px-4 py-2.5 text-slate-700 text-xs">{worker.nameKana}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">所属先</td><td className="px-4 py-2.5 text-slate-900">{worker.defaultCompany}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">所属区分</td><td className="px-4 py-2.5"><span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{worker.affiliation ?? "—"}</span></td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">支払サイクル</td><td className="px-4 py-2.5 text-slate-900 text-xs">{worker.paymentCycle === "day" ? "日払い" : worker.paymentCycle === "3day" ? "3日払い" : worker.paymentCycle === "week" ? "週払い" : "月払い"}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">所定労働時間</td><td className="px-4 py-2.5 text-slate-900 font-mono">{worker.workHours ?? 8}h</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">電話番号</td><td className="px-4 py-2.5 text-slate-700">{worker.phone}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">支払い方法</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${worker.paymentMethod === "振り込み" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{worker.paymentMethod}</span></td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">社会保険等級</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${worker.socialInsuranceGrade.includes("介護あり") ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600"}`}>{worker.socialInsuranceGrade}</span></td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">雇用保険等級</td><td className="px-4 py-2.5"><span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">{worker.employmentInsuranceGrade}</span></td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">状態</td><td className="px-4 py-2.5"><Badge variant={worker.isActive ? "default" : "secondary"}>{worker.isActive ? "有効" : "無効"}</Badge></td></tr>
                              </tbody></table>
                            </div>
                            {/* 手当セクション */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Coins className="h-3 w-3" />手当設定</p>
                                {!isEditingAllowances && (
                                  <button onClick={() => { setEditingWorkerAllowances([...worker.allowances]); setIsEditingAllowances(true); }} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Pencil className="h-3 w-3" />編集</button>
                                )}
                              </div>
                              {isEditingAllowances ? (
                                <div className="space-y-2">
                                  {editingWorkerAllowances.map((a, idx) => (
                                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1.5">
                                      <Input value={a.name} onChange={(e) => setEditingWorkerAllowances(editingWorkerAllowances.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder="手当名" className="h-7 text-xs flex-1 min-w-[80px]" />
                                      <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">¥</span>
                                        <Input type="number" value={a.amount || ""} onChange={(e) => setEditingWorkerAllowances(editingWorkerAllowances.map((x, i) => i === idx ? { ...x, amount: Number(e.target.value) } : x))} className="h-7 text-xs w-[90px] pl-5" />
                                      </div>
                                      <label className="flex items-center gap-1 cursor-pointer shrink-0">
                                        <Checkbox checked={a.isContinuous} onCheckedChange={(v) => setEditingWorkerAllowances(editingWorkerAllowances.map((x, i) => i === idx ? { ...x, isContinuous: !!v } : x))} className="h-3.5 w-3.5" />
                                        <span className="text-[10px] text-slate-500">継続</span>
                                      </label>
                                      <button onClick={() => setEditingWorkerAllowances(editingWorkerAllowances.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><Trash2 className="h-3 w-3" /></button>
                                    </div>
                                  ))}
                                  <button onClick={() => setEditingWorkerAllowances([...editingWorkerAllowances, { id: `new-${Date.now()}`, name: "", amount: 0, isContinuous: false }])} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 rounded-md px-2.5 py-1.5">
                                    <Plus className="h-3 w-3" />手当を追加
                                  </button>
                                  <div className="flex justify-end gap-2 pt-1">
                                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditingAllowances(false)}>キャンセル</Button>
                                    <Button size="sm" className="h-7 text-xs" onClick={() => setIsEditingAllowances(false)}>保存</Button>
                                  </div>
                                </div>
                              ) : (
                                worker.allowances.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {worker.allowances.map((a) => (
                                      <span key={a.id} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${a.isContinuous ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-slate-100 text-slate-600"}`}>
                                        {a.name} ¥{a.amount.toLocaleString()}{a.isContinuous && <span className="text-[9px]">継続</span>}
                                      </span>
                                    ))}
                                  </div>
                                ) : <p className="text-xs text-slate-300">手当なし</p>
                              )}
                            </div>
                            </>
                          ) : <p className="text-sm text-slate-400">作業員情報が見つかりません</p>}
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
              <Popover open={ledgerYMOpen} onOpenChange={setLedgerYMOpen}>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <CalendarDays className="h-4 w-4" />
                    {ledgerYearMonth.year}年{String(ledgerYearMonth.month).padStart(2,"0")}月
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="start">
                  <p className="text-xs font-medium text-slate-500 mb-3">年月を選択</p>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setLedgerYearMonth(prev => prev.year > 2020 || prev.month > 1
                        ? prev.month === 1 ? { year: prev.year - 1, month: 12 } : { year: prev.year, month: prev.month - 1 }
                        : prev)}
                      className="rounded p-1 hover:bg-slate-100 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-slate-500" />
                    </button>
                    <Select
                      value={String(ledgerYearMonth.year)}
                      onValueChange={(v) => setLedgerYearMonth(prev => ({ ...prev, year: Number(v) }))}
                    >
                      <SelectTrigger className="w-24 h-7 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => 2020 + i).map(y => (
                          <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => setLedgerYearMonth(prev => prev.month === 12 ? { year: prev.year + 1, month: 1 } : { year: prev.year, month: prev.month + 1 })}
                      className="rounded p-1 hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <button
                        key={m}
                        onClick={() => { setLedgerYearMonth(prev => ({ ...prev, month: m })); setLedgerYMOpen(false); }}
                        className={`rounded py-1.5 text-xs font-medium transition-colors ${
                          ledgerYearMonth.month === m
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {m}月
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-0 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-2" rowSpan={2} />
                      <th className="px-3 sm:px-4 py-2" rowSpan={2} />
                      <th colSpan={3} className="px-3 py-1.5 text-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border-b border-emerald-100 whitespace-nowrap">雇用保険</th>
                      <th colSpan={11} className="px-3 py-1.5 text-center text-[10px] font-semibold text-blue-700 bg-blue-50 border-b border-blue-100 whitespace-nowrap">健康保険</th>
                      <th className="px-3 sm:px-4 py-2" rowSpan={2} />
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap" colSpan={2} style={{display:"none"}} />
                      <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 bg-emerald-50/60 whitespace-nowrap">第1種</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 bg-emerald-50/60 whitespace-nowrap">第2種</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-emerald-600 bg-emerald-50/60 whitespace-nowrap">第3種</th>
                      {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                        <th key={n} className="px-3 py-2 text-right text-xs font-medium text-blue-600 bg-blue-50/60 whitespace-nowrap">{n}級</th>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap">日付</th>
                      <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap">区分</th>
                      <th className="px-3 py-2 text-right text-[10px] font-medium text-slate-400 whitespace-nowrap bg-emerald-50/30">(枚)</th>
                      <th className="px-3 py-2 text-right text-[10px] font-medium text-slate-400 whitespace-nowrap bg-emerald-50/30">(枚)</th>
                      <th className="px-3 py-2 text-right text-[10px] font-medium text-slate-400 whitespace-nowrap bg-emerald-50/30">(枚)</th>
                      {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                        <th key={n} className="px-3 py-2 text-right text-[10px] font-medium text-slate-400 whitespace-nowrap bg-blue-50/30">(枚)</th>
                      ))}
                      <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap">摘要</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        onClick={() => { setSelectedLedgerRow(row); setEditLedgerRow({ ...row }); }}>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.type === "受入" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap bg-emerald-50/20"><span className={row.grade1 > 0 ? "text-emerald-700 font-semibold" : "text-slate-300"}>{row.grade1 > 0 ? row.grade1 : "—"}</span></td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap bg-emerald-50/20"><span className={row.grade2 > 0 ? "text-emerald-700 font-semibold" : "text-slate-300"}>{row.grade2 > 0 ? row.grade2 : "—"}</span></td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap bg-emerald-50/20"><span className={row.grade3 > 0 ? "text-emerald-700 font-semibold" : "text-slate-300"}>{row.grade3 > 0 ? row.grade3 : "—"}</span></td>
                        {([row.hg1,row.hg2,row.hg3,row.hg4,row.hg5,row.hg6,row.hg7,row.hg8,row.hg9,row.hg10,row.hg11] as number[]).map((v, i) => (
                          <td key={i} className="px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap bg-blue-50/20">
                            <span className={v > 0 ? "text-blue-700 font-semibold" : "text-slate-300"}>{v > 0 ? v : "—"}</span>
                          </td>
                        ))}
                        <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredLedger.length} 件</div>

            {/* 受払簿 詳細ダイアログ */}
            <Dialog open={!!selectedLedgerRow} onOpenChange={(open) => { if (!open) { setSelectedLedgerRow(null); setEditLedgerRow(null); } }}>
              <DialogContent className="!w-[95vw] !max-w-[1400px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedLedgerRow?.date} — {selectedLedgerRow?.type}詳細</DialogTitle>
                  <DialogDescription>各等級の枚数を確認・編集できます</DialogDescription>
                </DialogHeader>
                {editLedgerRow && (
                  <div className="space-y-5 py-2">
                    {/* 基本情報 */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] text-slate-500 mb-1">日付</p>
                        <p className="text-sm font-medium text-slate-900">{editLedgerRow.date}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] text-slate-500 mb-1">区分</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${editLedgerRow.type === "受入" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{editLedgerRow.type}</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] text-slate-500 mb-1">摘要</p>
                        <p className="text-sm font-medium text-slate-900">{editLedgerRow.note}</p>
                      </div>
                    </div>

                    {/* 雇用保険 */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">雇用保険</span>
                        <span className="text-xs text-slate-500">種別ごとの7項目</span>
                      </div>
                      <div className="space-y-2">
                        {([
                          ["emp1", "第1種（176円）", "border-emerald-200 bg-emerald-50/40", "text-emerald-700", "focus:ring-emerald-300"],
                          ["emp2", "第2種（146円）", "border-amber-200 bg-amber-50/40",     "text-amber-700",   "focus:ring-amber-300"],
                          ["emp3", "第3種（96円）",  "border-slate-200 bg-slate-50/40",     "text-slate-600",   "focus:ring-slate-300"],
                        ] as const).map(([empKey, label, cardCls, titleCls, focusCls]) => {
                          const empData = editLedgerRow[empKey];
                          const setField = (field: keyof EmpGradeDetail, val: string | number) =>
                            setEditLedgerRow(prev => prev ? { ...prev, [empKey]: { ...prev[empKey], [field]: typeof val === "string" ? val : Number(val) || 0 } } : prev);
                          return (
                            <div key={empKey} className={`rounded-lg border p-3 ${cardCls}`}>
                              <p className={`text-xs font-semibold mb-2 ${titleCls}`}>{label}</p>
                              <div className="flex flex-wrap gap-2 items-end">
                                {([
                                  ["ukeire",    "受",       "枚"],
                                  ["haraidashi","払",       "枚"],
                                  ["zan",       "残",       "枚"],
                                  ["workers",   "日雇労働者数","名"],
                                  ["stamps",    "印紙貼付数",  "枚"],
                                ] as const).map(([field, flabel, unit]) => (
                                  <div key={field} className="rounded bg-white border border-slate-200 px-2 py-1.5 min-w-[80px]">
                                    <p className="text-[10px] text-slate-500 mb-1 whitespace-nowrap">{flabel}</p>
                                    <div className="flex items-center gap-0.5">
                                      <input type="number" min="0"
                                        value={empData[field] ?? 0}
                                        onChange={(e) => setField(field, e.target.value)}
                                        className={`w-full rounded border border-slate-200 px-1.5 py-0.5 text-xs font-mono text-right focus:outline-none focus:ring-1 ${focusCls}`}
                                      />
                                      <span className="text-[10px] text-slate-400 shrink-0">{unit}</span>
                                    </div>
                                  </div>
                                ))}
                                <div className="rounded bg-white border border-slate-200 px-2 py-1.5 min-w-[120px]">
                                  <p className="text-[10px] text-slate-500 mb-1 whitespace-nowrap">支払賃金総額</p>
                                  <div className="flex items-center gap-0.5">
                                    <span className="text-[10px] text-slate-400 shrink-0">¥</span>
                                    <input type="number" min="0"
                                      value={empData.wages ?? 0}
                                      onChange={(e) => setField("wages", e.target.value)}
                                      className={`w-full rounded border border-slate-200 px-1.5 py-0.5 text-xs font-mono text-right focus:outline-none focus:ring-1 ${focusCls}`}
                                    />
                                  </div>
                                </div>
                                <div className="rounded bg-white border border-slate-200 px-2 py-1.5 flex-1 min-w-[140px]">
                                  <p className="text-[10px] text-slate-500 mb-1 whitespace-nowrap">備考</p>
                                  <input type="text"
                                    value={empData.note ?? ""}
                                    onChange={(e) => setField("note", e.target.value)}
                                    placeholder="備考を入力"
                                    className={`w-full rounded border border-slate-200 px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 ${focusCls}`}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 健康保険 */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">健康保険</span>
                        <span className="text-xs text-slate-500">日雇特例被保険者 健康保険印紙受払状況等</span>
                      </div>
                      {/* 列ヘッダー */}
                      <div className="mb-2">
                        <table className="w-full text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 px-2 py-1 text-left text-slate-600 whitespace-nowrap w-20">級別</th>
                              {/* 適用 */}
                              <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center text-blue-700 bg-blue-50">適用</th>
                              {/* 除外 */}
                              <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center text-slate-600 bg-slate-50">除外</th>
                              {/* 印紙受払 */}
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">前月末<br/>保有枚数</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">本月<br/>受入枚数</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">本月<br/>貼付枚数</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">本月末<br/>保有枚数</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">4月～本月<br/>累計枚数</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600 whitespace-nowrap">現金納付<br/>保険料</th>
                              <th className="border border-slate-300 px-2 py-1 text-center text-slate-600">人日</th>
                            </tr>
                            <tr className="bg-slate-50 text-[9px] text-slate-500">
                              <th className="border border-slate-300 px-2 py-0.5"></th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center whitespace-nowrap">本月中<br/>延べ人員</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center whitespace-nowrap">4月～本月<br/>延べ人員</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center whitespace-nowrap">本月中<br/>延べ人員</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center whitespace-nowrap">4月～本月<br/>延べ人員</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(枚)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(枚)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(枚)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(枚)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(枚)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center">(円)</th>
                              <th className="border border-slate-300 px-2 py-0.5 text-center"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {([
                              ["hg1","第1級"],["hg2","第2級"],["hg3","第3級"],["hg4","第4級"],
                              ["hg5","第5級"],["hg6","第6級"],["hg7","第7級"],["hg8","第8級"],
                              ["hg9","第9級"],["hg10","第10級"],["hg11","第11級"],
                            ] as const).map(([key, label]) => {
                              const empty: HealthGradeDetail = { tekiyoMonth:0, tekiyoCumul:0, jokaiMonth:0, jokaiCumul:0, prevBalance:0, ukeire:0, harifu:0, monthEndBalance:0, cumulative:0, cashPayment:0, personDays:0 };
                              const hd: HealthGradeDetail = editLedgerRow.health?.[key] ?? empty;
                              const setHField = (field: keyof HealthGradeDetail, val: string) =>
                                setEditLedgerRow(prev => prev ? { ...prev, health: { ...prev.health, [key]: { ...(prev.health?.[key] ?? empty), [field]: Number(val) || 0 } } } : prev);
                              const cellCls = "border border-slate-200";
                              const inputCls = "w-full text-right text-[11px] font-mono bg-transparent focus:bg-blue-50 focus:outline-none px-1 py-0.5";
                              return (
                                <tr key={key} className="hover:bg-blue-50/30 transition-colors">
                                  <td className={`${cellCls} px-2 py-1 text-xs font-medium text-blue-700 whitespace-nowrap bg-blue-50/40`}>{label}</td>
                                  {/* 適用 */}
                                  <td className={`${cellCls} px-1 py-0.5 bg-blue-50/20`}><input type="number" min="0" value={hd.tekiyoMonth} onChange={e=>setHField("tekiyoMonth",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5 bg-blue-50/20`}><input type="number" min="0" value={hd.tekiyoCumul} onChange={e=>setHField("tekiyoCumul",e.target.value)} className={inputCls} /></td>
                                  {/* 除外 */}
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.jokaiMonth} onChange={e=>setHField("jokaiMonth",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.jokaiCumul} onChange={e=>setHField("jokaiCumul",e.target.value)} className={inputCls} /></td>
                                  {/* 印紙受払 */}
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.prevBalance} onChange={e=>setHField("prevBalance",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.ukeire} onChange={e=>setHField("ukeire",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.harifu} onChange={e=>setHField("harifu",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.monthEndBalance} onChange={e=>setHField("monthEndBalance",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.cumulative} onChange={e=>setHField("cumulative",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.cashPayment} onChange={e=>setHField("cashPayment",e.target.value)} className={inputCls} /></td>
                                  <td className={`${cellCls} px-1 py-0.5`}><input type="number" min="0" value={hd.personDays} onChange={e=>setHField("personDays",e.target.value)} className={inputCls} /></td>
                                </tr>
                              );
                            })}
                            {/* 計 行 */}
                            {(() => {
                              const keys = ["hg1","hg2","hg3","hg4","hg5","hg6","hg7","hg8","hg9","hg10","hg11"];
                              const sum = (f: keyof HealthGradeDetail) => keys.reduce((acc, k) => acc + (editLedgerRow.health?.[k]?.[f] ?? 0), 0);
                              return (
                                <tr className="bg-slate-100 font-semibold text-[11px]">
                                  <td className="border border-slate-300 px-2 py-1 text-slate-700">計</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("tekiyoMonth")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("tekiyoCumul")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("jokaiMonth")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("jokaiCumul")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("prevBalance")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("ukeire")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("harifu")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("monthEndBalance")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("cumulative")}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("cashPayment").toLocaleString()}</td>
                                  <td className="border border-slate-300 px-2 py-1 text-right font-mono">{sum("personDays")}</td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setSelectedLedgerRow(null); setEditLedgerRow(null); }}>キャンセル</Button>
                  <Button onClick={() => { setSelectedLedgerRow(null); setEditLedgerRow(null); }}>保存する</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">社保等級</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">雇保等級</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">更新日時</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCollectionLedger.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                        onClick={() => { setSelectedLedgerId(row.id); setLedgerDetailTab("schedule"); }}
                      >
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        {(() => { const w = mockWorkers.find(x => x.name === row.name); return (<>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${w?.socialInsuranceGrade?.includes("介護あり") ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600"}`}>{w?.socialInsuranceGrade ?? "—"}</span></td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">{w?.employmentInsuranceGrade ?? "—"}</span></td>
                        </>); })()}
                        <td className="px-3 sm:px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{row.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 詳細編集ダイアログ */}
            {selectedLedgerId !== null && (() => {
              const ledger = collectionLedgerData.find((d) => d.id === selectedLedgerId);
              if (!ledger) return null;
              return (
                <Dialog open={true} onOpenChange={(open) => { if (!open) { setSelectedLedgerId(null); setLedgerDetailTab("schedule"); } }}>
                  <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span>{ledger.name}</span>
                        <span className="text-sm font-normal text-slate-500">— 契約社員詳細</span>
                      </DialogTitle>
                      <DialogDescription>週休スケジュール・有給休暇を確認できます</DialogDescription>
                    </DialogHeader>

                    {/* 内部タブ */}
                    <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit mt-1 flex-wrap">
                      {([["schedule", "週休"], ["paidleave", "有給休暇"]] as const).map(([val, label]) => (
                        <button key={val} onClick={() => setLedgerDetailTab(val)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${ledgerDetailTab === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{label}</button>
                      ))}
                    </div>

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
            <p className="text-sm text-slate-500">日額ベースのアルバイト賃金管理（印紙非該当・所得税・雇用一般保険のみ控除）</p>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-2.5 text-xs text-blue-800">
              料率（年次更新）: 所得税 {(PART_TIME_TAX_RATES.incomeTaxRate * 100).toFixed(3)}% / 雇用一般保険 {(PART_TIME_TAX_RATES.employmentInsuranceRate * 100).toFixed(1)}%
              — 現金払い→日雇タブ、振込→常勤タブへ自動振分け
            </div>
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
              <button onClick={() => setPartTimeNewOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
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
                      {["氏名","日当","支払方法","出勤日数","総時間","残業","支給額","差引支給額","対象月","ステータス"].map((h) => (
                        <th key={h} className={`px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["日当","出勤日数","総時間","残業","支給額","差引支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPartTimeWorkers.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => { setSelectedPartTime(row); setPartTimeDetailTab("basic"); }}>
                        <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.dailyAllowance.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.paymentMethod === "現金" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{row.paymentMethod}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.overtime.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.netPay.toLocaleString()}</td>
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
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">日当</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{selectedPartTime.dailyAllowance.toLocaleString()}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">支払方法</td><td className="px-4 py-2.5">{selectedPartTime.paymentMethod}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">所得税</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{selectedPartTime.incomeTax.toLocaleString()}</td></tr>
                                <tr><td className="px-4 py-2.5 text-slate-500 text-xs">雇用一般保険</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{selectedPartTime.employmentInsurance.toLocaleString()}</td></tr>
                                <tr className="bg-blue-50"><td className="px-4 py-2.5 text-slate-700 font-medium text-xs">差引支給額</td><td className="px-4 py-2.5 text-blue-700 font-mono font-semibold">¥{selectedPartTime.netPay.toLocaleString()}</td></tr>
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
            <p className="text-sm text-slate-500">仕訳・預り金テーブル管理{journalLastRefreshed && <span className="ml-2 text-xs text-slate-400">最終更新: {journalLastRefreshed}</span>}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "仕訳件数", value: `${journals.length}件`, icon: BookOpen,   bg: "bg-blue-50",   ic: "text-blue-600" },
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
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => {
                  const dateStr = journalExportDate ? format(journalExportDate, "yyyy/MM/dd") : format(new Date(), "yyyy/MM/dd");
                  const dayLaborRows = [
                    ["日付", "氏名", "所属", "健保等級", "印紙代", "日当", "残業", "控除合計", "差引支給額"],
                    ["2024/01/28", "鈴木 一郎", "クリーン労働組合", "3等級(介護なし)", "146", "10000", "1950", "1324", "7367"],
                    ["2024/01/28", "高橋 健二", "クリーン労働組合", "6等級(介護あり)", "176", "11000", "0", "1876", "8724"],
                    ["2024/01/28", "田中 美咲", "新運転", "3等級(介護なし)", "146", "10000", "1950", "1286", "7140"],
                  ];
                  const blob = new Blob([dayLaborRows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `日雇仕訳_${dateStr.replace(/\//g, "")}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(`日雇いメンバーの仕訳CSVを出力しました (${dateStr})`);
                }}
              >
                <Download className="h-4 w-4" />日雇仕訳CSV
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
              <button onClick={() => setVehicleRuleNewOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />新規登録
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["会社名", "車種名", "表示順", "状態", "基本日当", "残業単価(通常)", "残業単価(深夜/休日)", "基準時間"].map((h) => (
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
                                <div className="grid gap-1.5">
                                  <Label className="text-xs text-slate-500">車種名</Label>
                                  <Input defaultValue={editingVehicleRule.name} className="h-9 text-sm" list="vehicle-name-list" />
                                  <datalist id="vehicle-name-list">
                                    {["軽トラック","1tトラック","2tトラック","3tトラック","4tトラック","8tトラック","10tトラック","大型トラック","ウイングトラック","バン"].map(n => <option key={n} value={n} />)}
                                  </datalist>
                                  <p className="text-[10px] text-slate-400">候補から選ぶか直接入力</p>
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
                                      <Label className="text-xs text-slate-500">車両手当</Label>
                                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><Input type="number" defaultValue={editingWageRule2.vehicleAllowance ?? 0} className="h-9 pl-7 text-sm font-mono" /></div>
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
                                      <tr><td className="px-4 py-2.5 text-slate-500 text-xs">車両手当</td><td className="px-4 py-2.5 text-slate-900 font-mono">¥{(wage.vehicleAllowance ?? 0).toLocaleString()}<span className="ml-2 text-[10px] text-slate-400">※計算への反映方法は別途確定</span></td></tr>
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

        {/* ── 運行実績 ── */}
        {activeSubTab === "運行実績" && (
          <>
            <p className="text-sm text-slate-500">日別の運行実績一覧</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="作業員名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["日付","作業員","車種","便数","合計距離","合計重量","出勤","退勤"].map(h => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["便数","合計距離","合計重量"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {operationData.filter(d => d.driverName.includes(searchQuery)).map(row => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 text-xs whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.driverName}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.vehicleType}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">{row.trips}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">{row.totalDistance} km</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">{row.totalWeight} t</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.startTime}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.endTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── 各種設定（供給先別早出時間マスタ） ── */}
        {activeSubTab === "各種設定" && (
          <>
            {/* 供給先別早出時間マスタ */}
            <div className="mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    供給先別早出時間マスタ
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">供給先・分室ごとの早出時間（分）— 全{supplierEarlyData.length}件</p>
                </div>
                <button
                  onClick={() => { setNewSupplierEarly({ supplierCode: 0, supplierName: "", subOfficeCode: 999, subOfficeName: "本所", earlyMinutes: 20, isActive: true, memo: "" }); setIsNewSupplierEarlyOpen(true); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />新規登録
                </button>
              </div>

              {/* 凡例 */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400">早出：</span>
                {[["10〜15分","bg-slate-100 text-slate-600 border-slate-200"],["20〜30分","bg-amber-100 text-amber-700 border-amber-200"],["40〜50分","bg-orange-100 text-orange-700 border-orange-200"],["60分","bg-red-100 text-red-700 border-red-200"]].map(([l,c]) => (
                  <span key={l} className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${c}`}>{l}</span>
                ))}
              </div>

              {/* 検索 */}
              <div className="mb-3 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="供給先名・分室名・コードで検索..."
                  value={supplierEarlySearch}
                  onChange={e => setSupplierEarlySearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl border border-slate-200/60 overflow-clip bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-blue-600 select-none" onClick={() => toggleSupplierEarlySort("supplierCode")}>
                        コード {supplierEarlySortKey==="supplierCode" ? (supplierEarlySortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">供給先名</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">分室名</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-blue-600 select-none" onClick={() => toggleSupplierEarlySort("earlyMinutes")}>
                        早出時間 {supplierEarlySortKey==="earlyMinutes" ? (supplierEarlySortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 whitespace-nowrap">早出単価</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSupplierEarly.map((s, idx) => (
                      <tr
                        key={s.id}
                        className={`border-b border-slate-100 last:border-0 cursor-pointer hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                        onClick={() => setEditingSupplierEarly({ ...s })}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">{String(s.supplierCode).padStart(3,"0")}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">{s.supplierName}</td>
                        <td className="px-4 py-2.5 text-sm text-slate-500 whitespace-nowrap">
                          {s.subOfficeCode === 999
                            ? <span className="text-xs text-slate-400">本所</span>
                            : <span className="inline-flex items-center gap-1.5">
                                <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-500">{s.subOfficeCode}</span>
                                <span className="text-sm">{s.subOfficeName}</span>
                              </span>
                          }
                        </td>
                        <td className="px-4 py-2.5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${earlyMinBadgeCls(s.earlyMinutes)}`}>
                            <Clock className="h-3 w-3" />{s.earlyMinutes}分
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right whitespace-nowrap font-mono font-semibold text-slate-700">
                          ¥{s.unitPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {filteredSupplierEarly.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">該当する供給先が見つかりません</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">{filteredSupplierEarly.length} / {supplierEarlyData.length} 件表示</p>
            </div>
          </>
        )}
      </div>

      {/* ── 供給先別早出時間 編集ダイアログ ── */}
      <Dialog open={!!editingSupplierEarly} onOpenChange={o => !o && setEditingSupplierEarly(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" />供給先を編集</DialogTitle>
            <DialogDescription>早出時間・状態を編集して保存してください</DialogDescription>
          </DialogHeader>
          {editingSupplierEarly && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>供給先コード</Label>
                  <Input type="number" value={editingSupplierEarly.supplierCode} onChange={e => setEditingSupplierEarly(p => p ? { ...p, supplierCode: Number(e.target.value) } : p)} />
                </div>
                <div className="grid gap-2">
                  <Label>供給先名</Label>
                  <Input value={editingSupplierEarly.supplierName} onChange={e => setEditingSupplierEarly(p => p ? { ...p, supplierName: e.target.value } : p)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>分室コード</Label>
                  <Input type="number" value={editingSupplierEarly.subOfficeCode} onChange={e => setEditingSupplierEarly(p => p ? { ...p, subOfficeCode: Number(e.target.value) } : p)} />
                </div>
                <div className="grid gap-2">
                  <Label>分室名称</Label>
                  <Input value={editingSupplierEarly.subOfficeName} onChange={e => setEditingSupplierEarly(p => p ? { ...p, subOfficeName: e.target.value } : p)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" />早出時間（分）</Label>
                <div className="relative">
                  <Input type="number" min={0} step={5} value={editingSupplierEarly.earlyMinutes} onChange={e => setEditingSupplierEarly(p => p ? { ...p, earlyMinutes: Number(e.target.value) } : p)} className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">分</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {[10,20,30,40,50,60].map(m => (
                    <button key={m} type="button" onClick={() => setEditingSupplierEarly(p => p ? { ...p, earlyMinutes: m } : p)}
                      className={`rounded px-2 py-0.5 text-xs border transition-colors ${editingSupplierEarly.earlyMinutes === m ? earlyMinBadgeCls(m) + " font-semibold" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      {m}分
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>早出単価（円）</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={100} value={editingSupplierEarly.unitPrice} onChange={e => setEditingSupplierEarly(p => p ? { ...p, unitPrice: Number(e.target.value) } : p)} className="pl-5" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">¥</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>メモ</Label>
                  <Input value={editingSupplierEarly.memo} onChange={e => setEditingSupplierEarly(p => p ? { ...p, memo: e.target.value } : p)} placeholder="任意" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSupplierEarly(null)}>キャンセル</Button>
            <Button onClick={() => {
              if (!editingSupplierEarly) return;
              setSupplierEarlyData(prev => prev.map(s => s.id === editingSupplierEarly.id ? editingSupplierEarly : s));
              setEditingSupplierEarly(null);
            }}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 供給先別早出時間 新規登録ダイアログ ── */}
      <Dialog open={isNewSupplierEarlyOpen} onOpenChange={o => !o && setIsNewSupplierEarlyOpen(false)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" />供給先を新規登録</DialogTitle>
            <DialogDescription>供給先コード・名称・早出時間を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>供給先コード</Label>
                <Input type="number" value={newSupplierEarly.supplierCode || ""} onChange={e => setNewSupplierEarly(p => ({ ...p, supplierCode: Number(e.target.value) }))} placeholder="例: 100" />
              </div>
              <div className="grid gap-2">
                <Label>供給先名</Label>
                <Input value={newSupplierEarly.supplierName} onChange={e => setNewSupplierEarly(p => ({ ...p, supplierName: e.target.value }))} placeholder="例: ○○清掃事務所" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>分室コード</Label>
                <Input type="number" value={newSupplierEarly.subOfficeCode} onChange={e => setNewSupplierEarly(p => ({ ...p, subOfficeCode: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <Label>分室名称</Label>
                <Input value={newSupplierEarly.subOfficeName} onChange={e => setNewSupplierEarly(p => ({ ...p, subOfficeName: e.target.value }))} placeholder="例: 本所" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" />早出時間（分）</Label>
              <div className="relative">
                <Input type="number" min={0} step={5} value={newSupplierEarly.earlyMinutes} onChange={e => setNewSupplierEarly(p => ({ ...p, earlyMinutes: Number(e.target.value) }))} className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">分</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {[10,20,30,40,50,60].map(m => (
                  <button key={m} type="button" onClick={() => setNewSupplierEarly(p => ({ ...p, earlyMinutes: m }))}
                    className={`rounded px-2 py-0.5 text-xs border transition-colors ${newSupplierEarly.earlyMinutes === m ? earlyMinBadgeCls(m) + " font-semibold" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    {m}分
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>早出単価（円）</Label>
                <div className="relative">
                  <Input type="number" min={0} step={100} value={(newSupplierEarly as {unitPrice?: number}).unitPrice ?? 0} onChange={e => setNewSupplierEarly(p => ({ ...p, unitPrice: Number(e.target.value) }))} className="pl-5" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">¥</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>メモ</Label>
                <Input value={newSupplierEarly.memo} onChange={e => setNewSupplierEarly(p => ({ ...p, memo: e.target.value }))} placeholder="任意" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSupplierEarlyOpen(false)}>キャンセル</Button>
            <Button onClick={() => {
              const newId = Math.max(...supplierEarlyData.map(s => s.id)) + 1;
              setSupplierEarlyData(prev => [...prev, { ...newSupplierEarly, unitPrice: (newSupplierEarly as {unitPrice?: number}).unitPrice ?? 0, id: newId }]);
              setIsNewSupplierEarlyOpen(false);
            }}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── アルバイト新規登録ダイアログ ── */}
      <Dialog open={partTimeNewOpen} onOpenChange={setPartTimeNewOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>アルバイトを新規登録</DialogTitle>
            <DialogDescription>アルバイト作業員の情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>氏名</Label>
                <Input placeholder="例: 田中 花子" />
              </div>
              <div className="grid gap-2">
                <Label>フリガナ</Label>
                <Input placeholder="例: タナカ ハナコ" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>日当</Label>
                <Input type="number" placeholder="10000" />
              </div>
              <div className="grid gap-2">
                <Label>支払方法</Label>
                <Select defaultValue="cash">
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">現金（日雇タブへ振分け）</SelectItem>
                    <SelectItem value="transfer">振込（常勤タブへ振分け）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>所属区分</Label>
                <Select defaultValue="clean">
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">クリーン労働組合</SelectItem>
                    <SelectItem value="shinten">新運転</SelectItem>
                    <SelectItem value="direct">直雇用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>雇用形態</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part-time">アルバイト</SelectItem>
                    <SelectItem value="temp">派遣</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>電話番号</Label>
              <Input placeholder="例: 090-1234-5678" />
            </div>
            <div className="grid gap-2">
              <Label>メモ</Label>
              <Input placeholder="任意メモ" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartTimeNewOpen(false)}>キャンセル</Button>
            <Button onClick={() => setPartTimeNewOpen(false)}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 車種/日当設定 新規登録ダイアログ ── */}
      <Dialog open={vehicleRuleNewOpen} onOpenChange={setVehicleRuleNewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>車種/日当設定を新規登録</DialogTitle>
            <DialogDescription>車種情報と日当設定を入力してください</DialogDescription>
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
                <Label>車種名</Label>
                <Input placeholder="例: 4tトラック" list="vehicle-name-list-new" />
                <datalist id="vehicle-name-list-new">
                  {["軽トラック","1tトラック","2tトラック","3tトラック","4tトラック","8tトラック","10tトラック","大型トラック","ウイングトラック","バン"].map(n => <option key={n} value={n} />)}
                </datalist>
                <p className="text-[10px] text-slate-400">候補から選ぶか直接入力</p>
              </div>
              <div className="grid gap-2">
                <Label>表示順</Label>
                <Input type="number" placeholder="1" defaultValue={1} />
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-1">
              <p className="text-xs font-semibold text-slate-500 mb-3">日当設定</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>基本日当</Label>
                  <Input type="number" placeholder="11000" />
                </div>
                <div className="grid gap-2">
                  <Label>車両手当</Label>
                  <Input type="number" placeholder="500" />
                </div>
                <div className="grid gap-2">
                  <Label>基準時間（h）</Label>
                  <Input type="number" placeholder="8" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="grid gap-2">
                  <Label>残業単価（通常）</Label>
                  <Input type="number" placeholder="1500" />
                </div>
                <div className="grid gap-2">
                  <Label>残業単価（深夜/休日）</Label>
                  <Input type="number" placeholder="1875" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleRuleNewOpen(false)}>キャンセル</Button>
            <Button onClick={() => setVehicleRuleNewOpen(false)}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
