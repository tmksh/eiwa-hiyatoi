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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Pencil,
  BarChart3,
  Users,
  TruckIcon,
  Truck,
  Banknote,
  Filter,
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
  { id: "1", workDate: new Date("2024-01-28"), workerName: "山田 太郎", company: "A運輸", vehicleType: "4t", startTime: "08:00", endTime: "19:30", workHours: 10.5, overtimeHours: 2.5, weeklyOvertimeHours: 1.0, baseWage: 11000, overtimeWage: 3750, weeklyOvertimeWage: 1500, adjustment: 0, adjustReason: "", totalWage: 16250, status: "confirmed" as Status, hasWarning: false },
  { id: "2", workDate: new Date("2024-01-28"), workerName: "鈴木 一郎", company: "A運輸", vehicleType: "2t", startTime: "07:00", endTime: "18:00", workHours: 10, overtimeHours: 2, weeklyOvertimeHours: 0, baseWage: 10000, overtimeWage: 2800, weeklyOvertimeWage: 0, adjustment: 0, adjustReason: "", totalWage: 12800, status: "confirmed" as Status, hasWarning: false },
  { id: "3", workDate: new Date("2024-01-28"), workerName: "佐藤 花子", company: "B物流", vehicleType: "10t", startTime: "06:00", endTime: "20:00", workHours: 12.5, overtimeHours: 4.5, weeklyOvertimeHours: 2.5, baseWage: 13000, overtimeWage: 6750, weeklyOvertimeWage: 3750, adjustment: 0, adjustReason: "", totalWage: 23500, status: "calculated" as Status, hasWarning: true, warningMessage: "拘束14時間超" },
  { id: "4", workDate: new Date("2024-01-28"), workerName: "高橋 健二", company: "A運輸", vehicleType: "4t", startTime: "08:30", endTime: "17:30", workHours: 8, overtimeHours: 0, weeklyOvertimeHours: 0, baseWage: 11000, overtimeWage: 0, weeklyOvertimeWage: 0, adjustment: 500, adjustReason: "途中帰宅・特例対応", totalWage: 11500, status: "confirmed" as Status, hasWarning: false },
  { id: "5", workDate: new Date("2024-01-28"), workerName: "田中 美咲", company: "C配送", vehicleType: "2t", startTime: "09:00", endTime: "21:00", workHours: 11, overtimeHours: 3, weeklyOvertimeHours: 1.5, baseWage: 10000, overtimeWage: 4200, weeklyOvertimeWage: 2100, adjustment: 0, adjustReason: "", totalWage: 16300, status: "calculated" as Status, hasWarning: true, warningMessage: "手動調整あり" },
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

const TABS = ["賃金", "集計", "分析"] as const;
type Tab = (typeof TABS)[number];

const CALC_SUBTABS = ["一括計算", "残業計算", "週40h割増"] as const;
type CalcSubTab = (typeof CALC_SUBTABS)[number];

const PAYMENT_SUBTABS = ["計算結果", "キャッシュマシン", "振込"] as const;
type PaymentSubTab = (typeof PAYMENT_SUBTABS)[number];

const paymentData = [
  { id: 1, name: "山田 太郎", period: "2024年1月", totalWork: 22, grossPay: 308000, deductions: 46200, netPay: 261800, status: "確定", paymentMethod: "キャッシュマシン" },
  { id: 2, name: "鈴木 一郎", period: "2024年1月", totalWork: 20, grossPay: 260000, deductions: 39000, netPay: 221000, status: "確定", paymentMethod: "キャッシュマシン" },
  { id: 3, name: "佐藤 花子", period: "2024年1月", totalWork: 23, grossPay: 345000, deductions: 51750, netPay: 293250, status: "確認中", paymentMethod: "振り込み" },
  { id: 4, name: "高橋 健二", period: "2024年1月", totalWork: 18, grossPay: 234000, deductions: 35100, netPay: 198900, status: "確認中", paymentMethod: "振り込み" },
  { id: 5, name: "田中 美咲", period: "2024年1月", totalWork: 21, grossPay: 252000, deductions: 37800, netPay: 214200, status: "確定", paymentMethod: "キャッシュマシン" },
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

function formatDecimal(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value);
}

// --- 集計・分析 types & data ---
type AggView = "personal" | "vehicle" | "dispatch";

type PersonalRow = {
  employeeCode: string; name: string; affiliation: string;
  workDays: number; totalWorkHours: string; overtimeHoursStr: string;
  basePay: number; additionalPay: number; otherLeaveAllowance: number;
  accidentFreeAllowance: number; earlyAllowance: number;
  overtimePay: number; overtimeSettlement: number; transportAllowance: number;
  otherAllowance: number; grossPay: number;
  socialInsuranceTotal: number; healthInsurance: number; pensionInsurance: number;
  employmentInsurance: number; incomeTax: number; residentTax: number;
  deductions: number; netPay: number;
  months: number[]; workDaysNum: number; overtimeHours: number;
};
const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const _rawPersonal = [
  { code:"1004",name:"守屋 繁巳",aff:"新運転東京高円寺支部",base:15360,addPay:1105,accFree:0,early:240,ot:0,otSettle:465,transport:400,otherAllow:0,gross:16465,hi:2244,pen:4026,emp:90,tax:255,res:1410,net:8440,ded:8025 },
  { code:"1109",name:"山口 周郎",aff:"新運転東京高円寺支部",base:15360,addPay:2540,accFree:2140,early:0,ot:0,otSettle:0,transport:400,otherAllow:0,gross:17900,hi:2618,pen:4026,emp:98,tax:310,res:760,net:10088,ded:7812 },
  { code:"1127",name:"奥田 桂一郎",aff:"新運転東京高円寺支部",base:15360,addPay:7490,accFree:1940,early:0,ot:5150,otSettle:0,transport:400,otherAllow:0,gross:22850,hi:3332,pen:5124,emp:125,tax:565,res:2680,net:11024,ded:11826 },
  { code:"1159",name:"岡村 義一",aff:"新運転東京高円寺支部",base:15360,addPay:6460,accFree:1940,early:0,ot:4120,otSettle:0,transport:400,otherAllow:0,gross:21820,hi:3332,pen:5124,emp:120,tax:485,res:2910,net:9849,ded:11971 },
  { code:"1180",name:"伴 悦巳",aff:"新運転東京高円寺支部",base:15360,addPay:2340,accFree:1940,early:0,ot:0,otSettle:0,transport:400,otherAllow:0,gross:17700,hi:3154,pen:4850,emp:97,tax:235,res:2150,net:7214,ded:10486 },
  { code:"1512",name:"寺久保 順一",aff:"クリーン労働組合",base:10900,addPay:6408,accFree:1800,early:0,ot:4108,otSettle:0,transport:500,otherAllow:0,gross:17308,hi:2023,pen:3111,emp:95,tax:375,res:0,net:11704,ded:5604 },
  { code:"1514",name:"金野 拓海",aff:"クリーン労働組合",base:10600,addPay:7400,accFree:500,early:0,ot:0,otSettle:0,transport:500,otherAllow:6400,gross:18000,hi:2559,pen:4575,emp:90,tax:275,res:2110,net:8391,ded:9609 },
  { code:"1526",name:"宮本 幸治",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2281,pen:3457,emp:72,tax:155,res:1550,net:5685,ded:7515 },
  { code:"1527",name:"片岡 廉吉郎",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2142,pen:3294,emp:72,tax:165,res:1390,net:6137,ded:7063 },
  { code:"1534",name:"横山 郁生",aff:"クリーン労働組合",base:10600,addPay:7532,accFree:0,early:0,ot:0,otSettle:632,transport:500,otherAllow:6400,gross:18132,hi:2797,pen:4301,emp:99,tax:285,res:2590,net:8060,ded:10072 },
  { code:"1541",name:"松田 弘",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1380,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:1934,pen:2928,emp:72,tax:185,res:910,net:7171,ded:6029 },
  { code:"1546",name:"宍戸 謙一",aff:"クリーン労働組合",base:10900,addPay:4275,accFree:1800,early:0,ot:975,otSettle:0,transport:500,otherAllow:1000,gross:15175,hi:2449,pen:3752,emp:74,tax:210,res:1700,net:6990,ded:8185 },
  { code:"1547",name:"後藤田 伸志",aff:"クリーン労働組合",base:10600,addPay:3800,accFree:0,early:0,ot:975,otSettle:0,transport:500,otherAllow:3300,gross:14400,hi:2440,pen:3305,emp:72,tax:195,res:1420,net:6968,ded:7432 },
  { code:"1551",name:"山田 裕一",aff:"クリーン労働組合",base:16670,addPay:0,accFree:0,early:0,ot:0,otSettle:0,transport:0,otherAllow:0,gross:16670,hi:2975,pen:4575,emp:91,tax:230,res:600,net:8199,ded:8471 },
  { code:"1557",name:"多胡 弘",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2023,pen:3111,emp:72,tax:175,res:1150,net:6669,ded:6531 },
  { code:"1564",name:"紅粉 浩幸",aff:"クリーン労働組合",base:10900,addPay:4250,accFree:1800,early:0,ot:0,otSettle:1950,transport:500,otherAllow:0,gross:15150,hi:2449,pen:3752,emp:74,tax:205,res:1640,net:7030,ded:8120 },
  { code:"1566",name:"木松 憲義",aff:"クリーン労働組合",base:10600,addPay:5900,accFree:0,early:0,ot:0,otSettle:0,transport:500,otherAllow:5400,gross:16500,hi:2618,pen:4026,emp:90,tax:235,res:1760,net:7771,ded:8729 },
  { code:"1574",name:"實右 健太郎",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2142,pen:3294,emp:72,tax:165,res:1310,net:6217,ded:6983 },
  { code:"1606",name:"松中 義博",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2142,pen:3294,emp:72,tax:165,res:1410,net:6117,ded:7083 },
  { code:"1613",name:"茂木 享夫",aff:"クリーン労働組合",base:10600,addPay:5900,accFree:0,early:0,ot:0,otSettle:0,transport:500,otherAllow:5400,gross:16500,hi:2023,pen:3026,emp:75,tax:400,res:1400,net:9576,ded:6924 },
  { code:"1623",name:"奥村 剛平",aff:"クリーン労働組合",base:10600,addPay:7032,accFree:0,early:0,ot:632,otSettle:0,transport:500,otherAllow:5900,gross:17632,hi:2244,pen:4026,emp:96,tax:310,res:1790,net:9166,ded:8466 },
  { code:"1650",name:"安田 晶平",aff:"クリーン労働組合",base:10600,addPay:6716,accFree:0,early:0,ot:316,otSettle:0,transport:500,otherAllow:5900,gross:17316,hi:2397,pen:4301,emp:95,tax:265,res:2150,net:8108,ded:9208 },
  { code:"1653",name:"矢野 巨介",aff:"クリーン労働組合",base:10600,addPay:7796,accFree:0,early:0,ot:1896,otSettle:0,transport:500,otherAllow:5400,gross:18396,hi:2618,pen:4026,emp:101,tax:340,res:2080,net:9231,ded:9165 },
  { code:"1659",name:"菊池 修平",aff:"クリーン労働組合",base:10900,addPay:2300,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:0,gross:13200,hi:2691,pen:3759,emp:72,tax:150,res:1290,net:5238,ded:7962 },
  { code:"1661",name:"武田 俊也",aff:"クリーン労働組合",base:10600,addPay:5900,accFree:0,early:0,ot:0,otSettle:0,transport:500,otherAllow:5400,gross:16500,hi:2618,pen:4026,emp:90,tax:235,res:1760,net:7771,ded:8729 },
  { code:"1682",name:"松本 好史",aff:"クリーン労働組合",base:10600,addPay:5900,accFree:0,early:0,ot:0,otSettle:0,transport:500,otherAllow:5400,gross:16500,hi:2244,pen:4026,emp:90,tax:250,res:2160,net:7730,ded:8770 },
  { code:"1701",name:"濱口 剛仁",aff:"クリーン労働組合",base:10900,addPay:3920,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:1620,gross:14820,hi:1428,pen:2562,emp:81,tax:390,res:825,net:9534,ded:5286 },
  { code:"1725",name:"三浦 瑞",aff:"クリーン労働組合",base:10900,addPay:2800,accFree:1800,early:0,ot:0,otSettle:0,transport:500,otherAllow:500,gross:13700,hi:2023,pen:3111,emp:75,tax:190,res:1280,net:7021,ded:6679 },
];
const personalData: PersonalRow[] = _rawPersonal.map(r => ({
  employeeCode: r.code, name: r.name, affiliation: r.aff,
  workDays: 1, totalWorkHours: "7:00", overtimeHoursStr: "0:00",
  basePay: r.base, additionalPay: r.addPay, otherLeaveAllowance: 0,
  accidentFreeAllowance: r.accFree, earlyAllowance: r.early,
  overtimePay: r.ot, overtimeSettlement: r.otSettle, transportAllowance: r.transport,
  otherAllowance: r.otherAllow, grossPay: r.gross,
  socialInsuranceTotal: r.hi + r.pen + r.emp,
  healthInsurance: r.hi, pensionInsurance: r.pen, employmentInsurance: r.emp,
  incomeTax: r.tax, residentTax: r.res, deductions: r.ded, netPay: r.net,
  months: [0,0,r.gross,0,0,0,0,0,0,0,0,0], workDaysNum: 1, overtimeHours: 0,
}));
type VehicleRow = {
  type: string; count: number; basicWage: number; holidayPay: number; safetyBonus: number;
  earlyPay: number; overtime: number; unpaidOvertime: number; unpaidOtherPay: number;
  otherDeductions: number; transport: number; grossPay: number; socialInsurance: number;
  incomeTax: number; otherDeduct: number; netPay: number; companyInsurance: number;
};
const vehicleData: VehicleRow[] = [
  { type: "3 小型特殊車",           count: 3,  basicWage: 41320,    holidayPay: 0, safetyBonus: 2180,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 3040,   otherDeductions: 5900,  transport: 1300,  grossPay: 53740,   socialInsurance: 22118,  incomeTax: 830,  otherDeduct: 0, netPay: 25632,   companyInsurance: 22835 },
  { type: "5 小型プレス車",          count: 31, basicWage: 438080,   holidayPay: 0, safetyBonus: 39520,  earlyPay: 0, overtime: 0,    unpaidOvertime: 54816,  unpaidOtherPay: 47456,  otherDeductions: 48200, transport: 13200, grossPay: 586456,  socialInsurance: 209151, incomeTax: 9867, otherDeduct: 0, netPay: 314178,  companyInsurance: 217401 },
  { type: "9 大型特殊車(大コン)",    count: 2,  basicWage: 30720,    holidayPay: 0, safetyBonus: 4680,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 1054,   otherDeductions: 0,     transport: 800,   grossPay: 37254,   socialInsurance: 15758,  incomeTax: 580,  otherDeduct: 0, netPay: 15846,   companyInsurance: 16258 },
  { type: "13 軽小型ダンプ車",       count: 7,  basicWage: 80020,    holidayPay: 0, safetyBonus: 4425,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 0,      otherDeductions: 13200, transport: 3200,  grossPay: 100845,  socialInsurance: 37873,  incomeTax: 1480, otherDeduct: 0, netPay: 53492,   companyInsurance: 39133 },
  { type: "550 第1収集作業員",        count: 82, basicWage: 912610,   holidayPay: 0, safetyBonus: 133740, earlyPay: 0, overtime: 1368, unpaidOvertime: 29709, unpaidOtherPay: 25641,  otherDeductions: 5552,  transport: 37700, grossPay: 1116611, socialInsurance: 350847, incomeTax: 14131,otherDeduct: 0, netPay: 686813,  companyInsurance: 366863 },
  { type: "551 第2収集作業員",        count: 2,  basicWage: 23600,    holidayPay: 0, safetyBonus: 2766,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 0,      otherDeductions: 0,     transport: 800,   grossPay: 27166,   socialInsurance: 1749,   incomeTax: 176,  otherDeduct: 0, netPay: 25241,   companyInsurance: 2725 },
  { type: "555 破砕作業員",           count: 6,  basicWage: 67110,    holidayPay: 0, safetyBonus: 9540,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 0,      otherDeductions: 500,   transport: 2700,  grossPay: 79850,   socialInsurance: 26384,  incomeTax: 998,  otherDeduct: 0, netPay: 44898,   companyInsurance: 27738 },
  { type: "703 資源新小型特殊車",     count: 4,  basicWage: 47800,    holidayPay: 0, safetyBonus: 5000,   earlyPay: 0, overtime: 0,    unpaidOvertime: 0,     unpaidOtherPay: 0,      otherDeductions: 11800, transport: 1800,  grossPay: 66400,   socialInsurance: 14729,  incomeTax: 913,  otherDeduct: 0, netPay: 48248,   companyInsurance: 15792 },
];
const mockDispatchData = [
  { id: 1, destination: "新運転東京高円寺支部", workerCount: 5,  workDays: 5,  totalWage: 96735,  avgDailyRate: 19347, month: "2026/03" },
  { id: 2, destination: "クリーン労働組合",     workerCount: 23, workDays: 23, totalWage: 355099, avgDailyRate: 15439, month: "2026/03" },
];
const mockWorkerDetail = [
  { name: "守屋 繁巳",   destination: "新運転東京高円寺支部", vehicleType: "運転手", days: 1, dailyRate: 16465, total: 16465 },
  { name: "山口 周郎",   destination: "新運転東京高円寺支部", vehicleType: "運転手", days: 1, dailyRate: 17900, total: 17900 },
  { name: "奥田 桂一郎", destination: "新運転東京高円寺支部", vehicleType: "運転手", days: 1, dailyRate: 22850, total: 22850 },
  { name: "岡村 義一",   destination: "新運転東京高円寺支部", vehicleType: "作業員", days: 1, dailyRate: 21820, total: 21820 },
  { name: "伴 悦巳",     destination: "新運転東京高円寺支部", vehicleType: "作業員", days: 1, dailyRate: 17700, total: 17700 },
  { name: "寺久保 順一", destination: "クリーン労働組合",     vehicleType: "運転手", days: 1, dailyRate: 17308, total: 17308 },
  { name: "金野 拓海",   destination: "クリーン労働組合",     vehicleType: "運転手", days: 1, dailyRate: 18000, total: 18000 },
  { name: "宮本 幸治",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "三浦 瑞",     destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13700, total: 13700 },
];
const vehicleUtilization = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t",  workDays: 20, totalDays: 22, hours: 185.5, maxHours: 220, trips: 42 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", workDays: 22, totalDays: 22, hours: 220.0, maxHours: 220, trips: 65 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t",  workDays: 18, totalDays: 22, hours: 144.0, maxHours: 220, trips: 25 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t",  workDays: 19, totalDays: 22, hours: 171.0, maxHours: 220, trips: 38 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", workDays: 21, totalDays: 22, hours: 210.0, maxHours: 220, trips: 60 },
];
const driverUtilization = [
  { name: "山田 太郎", employeeNo: "E001", workDays: 22, totalDays: 22, hours: 198.0, trips: 45, overtime: 18.0 },
  { name: "鈴木 一郎", employeeNo: "E002", workDays: 21, totalDays: 22, hours: 195.5, trips: 63, overtime: 15.5 },
  { name: "佐藤 花子", employeeNo: "E003", workDays: 20, totalDays: 22, hours: 160.0, trips: 25, overtime: 0 },
  { name: "高橋 健二", employeeNo: "E004", workDays: 21, totalDays: 22, hours: 189.0, trips: 42, overtime: 9.0 },
  { name: "田中 次郎", employeeNo: "E005", workDays: 18, totalDays: 22, hours: 162.0, trips: 36, overtime: 12.0 },
];
const monthlyTrend = [
  { month: "2025年10月", vehicleRate: 82, driverRate: 88, avgTrips: 38 },
  { month: "2025年11月", vehicleRate: 85, driverRate: 90, avgTrips: 40 },
  { month: "2025年12月", vehicleRate: 78, driverRate: 82, avgTrips: 35 },
  { month: "2026年01月", vehicleRate: 80, driverRate: 85, avgTrips: 36 },
  { month: "2026年02月", vehicleRate: 88, driverRate: 92, avgTrips: 42 },
  { month: "2026年03月", vehicleRate: 84, driverRate: 89, avgTrips: 39 },
];

export default function CalculationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("賃金");
  const [calcSubTab, setCalcSubTab] = useState<CalcSubTab>("一括計算");
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [editAdjustAmount, setEditAdjustAmount] = useState<string>("");
  const [editAdjustReason, setEditAdjustReason] = useState<string>("");
  const [paymentSubTab, setPaymentSubTab] = useState<PaymentSubTab>("キャッシュマシン");
  const [paymentInnerTab, setPaymentInnerTab] = useState<"支払明細" | "振込データ" | "金種表">("支払明細");
  const [selectedTransferRow, setSelectedTransferRow] = useState<typeof transfersData[0] | null>(null);
  const [selectedPaymentRow, setSelectedPaymentRow] = useState<typeof paymentData[0] | null>(null);
  const [paymentDetailTab, setPaymentDetailTab] = useState<"支払明細" | "振込データ" | "金種表">("支払明細");
  const [date, setDate] = useState<Date>(new Date());
  const [periodFrom, setPeriodFrom] = useState<Date | undefined>(undefined);
  const [periodTo, setPeriodTo] = useState<Date | undefined>(undefined);
  const [periodFromOpen, setPeriodFromOpen] = useState(false);
  const [periodToOpen, setPeriodToOpen] = useState(false);
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
  const [calcPeriodType, setCalcPeriodType] = useState<"day" | "3day" | "week" | "month" | "custom">("month");
  const [calcPeriodFrom, setCalcPeriodFrom] = useState("");
  const [calcPeriodTo, setCalcPeriodTo] = useState("");
  // 期間ごとの選択日
  const [periodDateDay, setPeriodDateDay] = useState<Date | undefined>(new Date());
  const [periodDate3day, setPeriodDate3day] = useState<Date | undefined>(new Date());
  const [periodDateWeek, setPeriodDateWeek] = useState<Date | undefined>(new Date());
  const [periodDateMonth, setPeriodDateMonth] = useState<Date | undefined>(new Date());
  const [periodDateCustomFrom, setPeriodDateCustomFrom] = useState<Date | undefined>(undefined);
  const [periodDateCustomTo, setPeriodDateCustomTo] = useState<Date | undefined>(undefined);
  const [periodCalOpen, setPeriodCalOpen] = useState<Record<string, boolean>>({});
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<number[]>([]);

  // 集計・分析 states
  const [aggSearchQuery, setAggSearchQuery] = useState("");
  const [aggPeriodFrom, setAggPeriodFrom] = useState<Date | undefined>(undefined);
  const [aggPeriodTo, setAggPeriodTo] = useState<Date | undefined>(undefined);
  const [aggFromOpen, setAggFromOpen] = useState(false);
  const [aggToOpen, setAggToOpen] = useState(false);
  const [view, setView] = useState<AggView>("personal");
  const [selectedPerson, setSelectedPerson] = useState<PersonalRow | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleRow | null>(null);
  const [vehicleEdits, setVehicleEdits] = useState<Record<string, VehicleRow>>({});
  const [dispatchSearch, setDispatchSearch] = useState("");
  const [dispatchView, setDispatchView] = useState<"summary" | "detail">("summary");
  const [analysisSub, setAnalysisSub] = useState<"vehicles" | "drivers" | "trend" | "dashboard">("vehicles");

  // 集計 computed
  const filteredDispatchSummary = mockDispatchData.filter((d) => d.destination.includes(dispatchSearch));
  const filteredDispatchDetail = mockWorkerDetail.filter((d) => d.name.includes(dispatchSearch) || d.destination.includes(dispatchSearch));
  const dispatchTotalWage = mockDispatchData.reduce((acc, d) => acc + d.totalWage, 0);
  const dispatchTotalWorkers = mockDispatchData.reduce((acc, d) => acc + d.workerCount, 0);
  const avgVehicleRate = vehicleUtilization.reduce((sum, v) => sum + (v.workDays / v.totalDays) * 100, 0) / vehicleUtilization.length;
  const avgDriverRate = driverUtilization.reduce((sum, d) => sum + (d.workDays / d.totalDays) * 100, 0) / driverUtilization.length;
  const totalTrips = driverUtilization.reduce((sum, d) => sum + d.trips, 0);
  const totalOvertimeHrs = driverUtilization.reduce((sum, d) => sum + d.overtime, 0);
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
    const d = result.workDate;
    const matchesFrom = !periodFrom || d >= periodFrom;
    const matchesTo = !periodTo || d <= new Date(periodTo.getFullYear(), periodTo.getMonth(), periodTo.getDate(), 23, 59, 59);
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
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
    const matchesTab = paymentSubTab === "キャッシュマシン" ? row.paymentMethod === "キャッシュマシン" : paymentSubTab === "振込" ? row.paymentMethod === "振り込み" : true;
    return matchesSearch && (monthFilter ? matchesMonth : true) && matchesTab;
  });

  // 期間タイプに応じて金額・稼働日数を調整した表示用データ
  const periodDays: Record<typeof calcPeriodType, number> = { day: 1, "3day": 3, week: 7, month: 30, custom: 30 };
  const periodLabel: Record<typeof calcPeriodType, string> = { day: "日払い", "3day": "3日払い", week: "週払い", month: "月払い", custom: "任意期間" };
  const adjustedPayment = filteredPayment.map((row) => {
    if (calcPeriodType === "month") return row;
    const days = periodDays[calcPeriodType];
    const ratio = days / 30;
    const workDays = Math.max(1, Math.round(row.totalWork * ratio));
    return {
      ...row,
      totalWork: workDays,
      grossPay: Math.round(row.grossPay * ratio),
      deductions: Math.round(row.deductions * ratio),
      netPay: Math.round(row.netPay * ratio),
      period: `${row.period}（${periodLabel[calcPeriodType]}）`,
    };
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
        {/* Main Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub Tabs */}
        {activeTab === "賃金" && (
          <div className="space-y-2">
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
            {/* 集計期間セレクター */}
            {(paymentSubTab === "キャッシュマシン" || paymentSubTab === "振込") && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">集計期間</span>
                <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit flex-wrap">
                  {([["day","日払い"],["3day","3日払い"],["week","週払い"],["month","月払い"],["custom","任意期間"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setCalcPeriodType(val)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${calcPeriodType === val ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{label}</button>
                  ))}
                </div>
                {/* 日払い：単日選択 */}
                {calcPeriodType === "day" && (
                  <Popover open={periodCalOpen["day"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, day: o}))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDateDay && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {periodDateDay ? format(periodDateDay, "yyyy/MM/dd") : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodDateDay} onSelect={(d) => { setPeriodDateDay(d); setPeriodCalOpen(p => ({...p, day: false})); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
                {/* 3日払い：開始日選択 → 開始〜+2日 */}
                {calcPeriodType === "3day" && (
                  <Popover open={periodCalOpen["3day"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, "3day": o}))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDate3day && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {periodDate3day ? `${format(periodDate3day, "yyyy/MM/dd")} 〜 ${format(new Date(periodDate3day.getTime() + 2*86400000), "MM/dd")}` : "開始日を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodDate3day} onSelect={(d) => { setPeriodDate3day(d); setPeriodCalOpen(p => ({...p, "3day": false})); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
                {/* 週払い：週開始日選択 → 開始〜+6日 */}
                {calcPeriodType === "week" && (
                  <Popover open={periodCalOpen["week"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, week: o}))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDateWeek && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {periodDateWeek ? `${format(periodDateWeek, "yyyy/MM/dd")} 〜 ${format(new Date(periodDateWeek.getTime() + 6*86400000), "MM/dd")}` : "週開始日を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodDateWeek} onSelect={(d) => { setPeriodDateWeek(d); setPeriodCalOpen(p => ({...p, week: false})); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
                {/* 月払い：年月選択 */}
                {calcPeriodType === "month" && (
                  <Popover open={periodCalOpen["month"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, month: o}))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDateMonth && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {periodDateMonth ? format(periodDateMonth, "yyyy年M月") : "月を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodDateMonth} onSelect={(d) => { setPeriodDateMonth(d); setPeriodCalOpen(p => ({...p, month: false})); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
                {/* 任意期間：開始〜終了 */}
                {calcPeriodType === "custom" && (
                  <div className="flex items-center gap-1.5">
                    <Popover open={periodCalOpen["customFrom"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, customFrom: o}))}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDateCustomFrom && "text-muted-foreground")}>
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {periodDateCustomFrom ? format(periodDateCustomFrom, "yyyy/MM/dd") : "開始日"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={periodDateCustomFrom} onSelect={(d) => { setPeriodDateCustomFrom(d); setPeriodCalOpen(p => ({...p, customFrom: false})); }} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <span className="text-xs text-slate-400">〜</span>
                    <Popover open={periodCalOpen["customTo"]} onOpenChange={(o) => setPeriodCalOpen(p => ({...p, customTo: o}))}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs h-8", !periodDateCustomTo && "text-muted-foreground")}>
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {periodDateCustomTo ? format(periodDateCustomTo, "yyyy/MM/dd") : "終了日"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={periodDateCustomTo} onSelect={(d) => { setPeriodDateCustomTo(d); setPeriodCalOpen(p => ({...p, customTo: false})); }} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(activeTab === "賃金" && paymentSubTab === "計算結果") && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>計算結果一覧</CardTitle>
                  <CardDescription>各行の編集ボタンから賃金調整・理由記録が可能です</CardDescription>
                </div>
                <Button variant="outline" onClick={async () => {
                  const { default: jsPDF } = await import("jspdf");
                  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
                  doc.setFontSize(14); doc.text("計算結果一覧", 148, 15, { align: "center" });
                  doc.setFontSize(9);
                  const headers = ["氏名", "会社", "車種", "基本日当", "残業", "週40h割増", "プラス手当", "合計", "状態"];
                  headers.forEach((h, i) => doc.text(h, 10 + i * 30, 25));
                  filteredResults.forEach((r, j) => {
                    const y = 32 + j * 7;
                    if (y > 195) return;
                    [r.workerName, r.company, r.vehicleType, `¥${r.baseWage.toLocaleString()}`, `¥${r.overtimeWage.toLocaleString()}`, `¥${r.weeklyOvertimeWage.toLocaleString()}`, r.adjustment ? `¥${r.adjustment.toLocaleString()}` : "—", `¥${r.totalWage.toLocaleString()}`, r.status === "confirmed" ? "暫定" : "計算済み"].forEach((v, i) => doc.text(String(v), 10 + i * 30, y));
                  });
                  doc.save("計算結果一覧.pdf");
                }} className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />PDF出力
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
                <div className="flex items-center gap-1.5">
                  <Popover open={periodFromOpen} onOpenChange={setPeriodFromOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal text-sm", !periodFrom && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {periodFrom ? format(periodFrom, "yyyy/MM/dd") : "開始日"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodFrom} onSelect={(d) => { setPeriodFrom(d); setPeriodFromOpen(false); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-slate-400">〜</span>
                  <Popover open={periodToOpen} onOpenChange={setPeriodToOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal text-sm", !periodTo && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {periodTo ? format(periodTo, "yyyy/MM/dd") : "終了日"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={periodTo} onSelect={(d) => { setPeriodTo(d); setPeriodToOpen(false); }} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {(periodFrom || periodTo) && (
                    <Button variant="ghost" size="sm" className="text-xs text-slate-400 px-2" onClick={() => { setPeriodFrom(undefined); setPeriodTo(undefined); }}>
                      解除
                    </Button>
                  )}
                </div>
                <div className="relative flex-1 min-w-0 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="作業員名・会社名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="ステータス" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="confirmed">暫定</SelectItem>
                    <SelectItem value="calculated">計算済み</SelectItem>
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
                      <TableHead className="text-right whitespace-nowrap">基本日当</TableHead>
                      <TableHead className="text-right whitespace-nowrap">残業</TableHead>
                      <TableHead className="text-right whitespace-nowrap">週40h割増</TableHead>
                      <TableHead className="text-right whitespace-nowrap">プラス手当</TableHead>
                      <TableHead className="text-right whitespace-nowrap">合計</TableHead>
                      <TableHead className="whitespace-nowrap">状態</TableHead>
                      <TableHead className="whitespace-nowrap"></TableHead>
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
                        <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">{formatCurrency(result.baseWage)}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                          {result.overtimeWage > 0 ? <span className="text-blue-700">{formatCurrency(result.overtimeWage)}</span> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                          {result.weeklyOvertimeWage > 0 ? <span className="text-amber-700">{formatCurrency(result.weeklyOvertimeWage)}</span> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                          {result.adjustment > 0 ? <span className="text-slate-600">+{formatCurrency(result.adjustment)}</span> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{formatCurrency(result.totalWage)}</TableCell>
                        <TableCell><StatusBadge status={result.status} /></TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700"
                            onClick={() => {
                              setSelectedEditId(result.id);
                              setEditAdjustAmount(result.adjustment > 0 ? String(result.adjustment) : "");
                              setEditAdjustReason(result.adjustReason || "");
                            }}
                          >
                            <Pencil className="mr-1 h-3 w-3" />編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-muted/50 p-4">
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm">
                  <span>全 {filteredResults.length} 件</span>
                  <span>暫定: {filteredResults.filter((r) => r.status === "confirmed").length}件</span>
                  <span>計算済み: {filteredResults.filter((r) => r.status === "calculated").length}件</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">合計金額</p>
                  <p className="text-xl sm:text-2xl font-bold whitespace-nowrap">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 編集ダイアログ */}
        {selectedEditId !== null && (() => {
          const result = mockResults.find((r) => r.id === selectedEditId);
          if (!result) return null;
          return (
            <Dialog open={true} onOpenChange={(open) => { if (!open) setSelectedEditId(null); }}>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>{result.workerName} — 賃金調整</DialogTitle>
                  <DialogDescription>
                    {format(result.workDate, "yyyy/MM/dd")} · {result.company} · {result.vehicleType}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>基本日当</span><span className="font-mono tabular-nums">{formatCurrency(result.baseWage)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>残業手当</span>
                      <span className="font-mono tabular-nums text-blue-700">{result.overtimeWage > 0 ? formatCurrency(result.overtimeWage) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>週40h割増（{result.weeklyOvertimeHours}h）</span>
                      <span className="font-mono tabular-nums text-amber-700">{result.weeklyOvertimeWage > 0 ? formatCurrency(result.weeklyOvertimeWage) : "—"}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1.5 flex justify-between font-semibold text-slate-900">
                      <span>計算合計</span>
                      <span className="font-mono tabular-nums">{formatCurrency(result.baseWage + result.overtimeWage + result.weeklyOvertimeWage)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-1.5">
                      <Label>調整額（＋加算）</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={editAdjustAmount}
                          onChange={(e) => setEditAdjustAmount(e.target.value)}
                          className="pl-7 font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>調整理由</Label>
                      <Input
                        placeholder="例: 途中帰宅・特例対応、負傷帰宅補償など"
                        value={editAdjustReason}
                        onChange={(e) => setEditAdjustReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-800 text-white px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-medium">調整後合計</span>
                    <span className="text-lg font-bold font-mono tabular-nums">
                      {formatCurrency(result.baseWage + result.overtimeWage + result.weeklyOvertimeWage + (parseInt(editAdjustAmount || "0") || 0))}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedEditId(null)}>キャンセル</Button>
                  <Button onClick={() => { toast.success(`${result.workerName}の賃金調整を保存しました`); setSelectedEditId(null); }}>保存する</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })()}


        {activeTab === "賃金" && (paymentSubTab === "キャッシュマシン" || paymentSubTab === "振込") && (
          <>
            {/* ── ツールバー ── */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{adjustedPayment.length} 件</p>
              <div className="flex items-center gap-2">
                {selectedPaymentIds.length > 0 && (
                  <span className="text-xs text-slate-500">{selectedPaymentIds.length}件選択中</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toast.success("FBデータを出力しました")}
                >
                  <Download className="h-4 w-4" />
                  FBデータ出力
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
                  disabled={selectedPaymentIds.length === 0}
                  onClick={async () => {
                    const { default: jsPDF } = await import("jspdf");
                    const rows = adjustedPayment.filter(r => selectedPaymentIds.includes(r.id));
                    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
                    rows.forEach((row, i) => {
                      if (i > 0) doc.addPage();
                      doc.setFontSize(16); doc.text("支払明細書", 105, 20, { align: "center" });
                      doc.setFontSize(10);
                      const lines = [
                        ["氏名", row.name],
                        ["対象期間", row.period],
                        ["稼働日数", `${row.totalWork}日`],
                        ["支払方法", row.paymentMethod],
                        ["総支給額", `¥${row.grossPay.toLocaleString()}`],
                        ["控除合計", `-¥${row.deductions.toLocaleString()}`],
                        ["差引支給額", `¥${row.netPay.toLocaleString()}`],
                        ["ステータス", row.status === "確定" ? "支払済み" : "未払い"],
                      ];
                      lines.forEach(([label, value], j) => {
                        doc.text(`${label}：${value}`, 20, 40 + j * 10);
                      });
                    });
                    doc.save(`支払明細_${rows.map(r => r.name).join("_")}.pdf`);
                  }}
                >
                  <Upload className="h-4 w-4" />
                  一括生成 {selectedPaymentIds.length > 0 ? `(${selectedPaymentIds.length})` : ""}
                </Button>
              </div>
            </div>
            {/* ── 統合一覧テーブル ── */}
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-3 py-3 text-left w-10">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                          checked={selectedPaymentIds.length === adjustedPayment.length && adjustedPayment.length > 0}
                          onChange={(e) => setSelectedPaymentIds(e.target.checked ? adjustedPayment.map(r => r.id) : [])}
                        />
                      </th>
                      {["氏名","対象期間","稼働日数","支払方法","総支給額","控除合計","差引支給額","支払ステータス","振込ステータス","FB"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["稼働日数","総支給額","控除合計","差引支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adjustedPayment.map((row) => (
                      <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedPaymentIds.includes(row.id) ? "bg-blue-50/60" : ""}`} onClick={() => setSelectedPaymentRow(row)}>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                            checked={selectedPaymentIds.includes(row.id)}
                            onChange={(e) => setSelectedPaymentIds(prev => e.target.checked ? [...prev, row.id] : prev.filter(id => id !== row.id))}
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap">{row.period}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 whitespace-nowrap tabular-nums">{row.totalWork}日</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.paymentMethod === "振り込み" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{row.paymentMethod}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-red-600 font-mono tabular-nums whitespace-nowrap">−¥{row.deductions.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">¥{row.netPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "確定" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{row.status === "確定" ? "支払済み" : "未払い"}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          {(() => { const t = transfersData.find(t => t.name === row.name); return t ? <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t.status === "生成済" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{t.status}</span> : <span className="text-xs text-slate-300">—</span>; })()}
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                            onClick={() => toast.success(`${row.name}のFBデータを出力しました`)}
                          >
                            <Download className="h-3 w-3" />
                            FB
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}



      {/* ===== 集計 Tab ===== */}
      {activeTab === "集計" && (
        <>
          {/* ビュー切り替えタブ（メインタブ直下） */}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
            {(["personal","dispatch","vehicle"] as AggView[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {v === "personal" ? "個人別月別" : v === "dispatch" ? "供給元別" : "車種別"}
              </button>
            ))}
          </div>
          <div>
            <p className="text-sm text-slate-500">個人別月別・指定期間別・車種別集計</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-sm text-slate-500">対象人数</p><p className="text-2xl font-semibold text-slate-900">{personalData.length}名</p></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2"><BarChart3 className="h-5 w-5 text-slate-600" /></div>
                <div><p className="text-sm text-slate-500">期間合計</p><p className="text-2xl font-semibold text-slate-900">¥{personalData.reduce((s,r)=>s+r.grossPay,0).toLocaleString()}</p></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2"><CalendarLucide className="h-5 w-5 text-slate-600" /></div>
                <div><p className="text-sm text-slate-500">集計期間</p><p className="text-lg font-semibold text-slate-900">2026/03</p></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="作業員の名前で検索..." value={aggSearchQuery} onChange={(e) => setAggSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex items-center gap-1.5">
              <Popover open={aggFromOpen} onOpenChange={setAggFromOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !aggPeriodFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {aggPeriodFrom ? format(aggPeriodFrom, "yyyy年M月") : "開始月"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={aggPeriodFrom} onSelect={(d) => { setAggPeriodFrom(d); setAggFromOpen(false); }} initialFocus />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-slate-400">〜</span>
              <Popover open={aggToOpen} onOpenChange={setAggToOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !aggPeriodTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {aggPeriodTo ? format(aggPeriodTo, "yyyy年M月") : "終了月"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={aggPeriodTo} onSelect={(d) => { setAggPeriodTo(d); setAggToOpen(false); }} initialFocus />
                </PopoverContent>
              </Popover>
              {(aggPeriodFrom || aggPeriodTo) && (
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 px-2" onClick={() => { setAggPeriodFrom(undefined); setAggPeriodTo(undefined); }}>解除</Button>
              )}
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><Download className="h-4 w-4" />エクスポート</button>
          </div>

          {view === "personal" && (
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100 bg-slate-50/50">{["従業員CD","名前","所属元","本給","付加給","残業手当","交通費","総支給額","社保計","所得税","住民税","差引支給額"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["従業員CD","名前","所属元"].includes(h)?"text-left":"text-right"}`}>{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {personalData.filter(d=>d.name.includes(aggSearchQuery)).map((row,idx)=>(
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={()=>setSelectedPerson(row)}>
                        <td className="px-3 sm:px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">{row.employeeCode}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{row.affiliation}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{row.basePay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{row.additionalPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.overtimePay > 0 ? `¥${row.overtimePay.toLocaleString()}` : "—"}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.transportAllowance > 0 ? `¥${row.transportAllowance.toLocaleString()}` : "—"}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-red-600 whitespace-nowrap text-xs">¥{row.socialInsuranceTotal.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap text-xs">¥{row.incomeTax.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap text-xs">{row.residentTax > 0 ? `¥${row.residentTax.toLocaleString()}` : "—"}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-blue-700 font-semibold whitespace-nowrap">¥{row.netPay.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="border-t-2 border-slate-200 bg-slate-50">
                    {(() => { const fd = personalData.filter(d=>d.name.includes(aggSearchQuery)); return (<>
                      <td className="px-3 sm:px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap" colSpan={3}>合計 ({fd.length}名)</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.basePay,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.additionalPay,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.overtimePay,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.transportAllowance,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.grossPay,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-red-600 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.socialInsuranceTotal,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-600 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.incomeTax,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-600 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.residentTax,0).toLocaleString()}</td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-blue-700 font-mono tabular-nums whitespace-nowrap">¥{fd.reduce((s,r)=>s+r.netPay,0).toLocaleString()}</td>
                    </>); })()}
                  </tr></tfoot>
                </table>
              </div>
            </div>
          )}

          {view === "vehicle" && (
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100 bg-slate-50/50">{["車種","人数","基本給","無事故手当","残業","総支給額","社保","所得税","差引支給額","社保会社"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${h==="車種"?"text-left":"text-right"}`}>{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicleData.map((row,idx)=>{
                      const r = vehicleEdits[row.type] ?? row;
                      return (<tr key={idx} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={()=>setSelectedVehicle(r)}>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{r.type}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{r.count}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{r.basicWage.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{r.safetyBonus > 0 ? `¥${r.safetyBonus.toLocaleString()}` : "—"}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{r.overtime > 0 ? `¥${r.overtime.toLocaleString()}` : "—"}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-900 whitespace-nowrap">¥{r.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-red-600 whitespace-nowrap text-xs">¥{r.socialInsurance.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap text-xs">¥{r.incomeTax.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono font-semibold tabular-nums text-blue-700 whitespace-nowrap">¥{r.netPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{r.companyInsurance.toLocaleString()}</td>
                      </tr>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "dispatch" && (
            <>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200/60 bg-white p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-50 p-2"><Building2 className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-slate-500">供給元数</p><p className="text-2xl font-semibold text-slate-900">{mockDispatchData.length}</p></div></div></div>
                <div className="rounded-xl border border-slate-200/60 bg-white p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2"><Users className="h-5 w-5 text-slate-600" /></div><div><p className="text-sm text-slate-500">配置人数</p><p className="text-2xl font-semibold text-slate-900">{dispatchTotalWorkers}名</p></div></div></div>
                <div className="rounded-xl border border-slate-200/60 bg-white p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-50 p-2"><TruckIcon className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-slate-500">総稼働日数</p><p className="text-2xl font-semibold text-slate-900">28日</p></div></div></div>
                <div className="rounded-xl border border-slate-200/60 bg-white p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2"><Banknote className="h-5 w-5 text-slate-600" /></div><div><p className="text-sm text-slate-500">賃金総額</p><p className="text-2xl font-semibold text-slate-900">¥{(dispatchTotalWage/10000).toFixed(0)}万</p></div></div></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="供給元・氏名で検索..." value={dispatchSearch} onChange={(e)=>setDispatchSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                  <button onClick={()=>setDispatchView("summary")} className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView==="summary"?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50"}`}>供給元別</button>
                  <button onClick={()=>setDispatchView("detail")} className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView==="detail"?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50"}`}>個人別</button>
                </div>
              </div>
              {dispatchView === "summary" && (
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <div className="overflow-x-auto"><table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">{["供給元","人数","延べ日数","平均日当","賃金合計","対象月"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["人数","延べ日数","平均日当","賃金合計"].includes(h)?"text-right":"text-left"}`}>{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">{filteredDispatchSummary.map(row=><tr key={row.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.destination}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.workerCount}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.workDays}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{row.avgDailyRate.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono font-medium tabular-nums text-slate-900 whitespace-nowrap">¥{row.totalWage.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td></tr>)}</tbody>
                  </table></div>
                </div>
              )}
              {dispatchView === "detail" && (
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <div className="overflow-x-auto"><table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/50">{["作業員名","供給元","車種","日数","日当","合計"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["日数","日当","合計"].includes(h)?"text-right":"text-left"}`}>{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">{filteredDispatchDetail.map((row,idx)=><tr key={idx} className="hover:bg-slate-50/50 transition-colors"><td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td><td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.destination}</td><td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.vehicleType}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.days}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">¥{row.dailyRate.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono font-medium tabular-nums text-slate-900 whitespace-nowrap">¥{row.total.toLocaleString()}</td></tr>)}</tbody>
                  </table></div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ===== 分析 Tab ===== */}
      {activeTab === "分析" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-200/60 shadow-none"><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2"><Truck className="h-5 w-5 text-slate-600" /></div><div><p className="text-xs text-slate-500">車両稼働率</p><p className="text-2xl font-bold text-slate-900">{avgVehicleRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div></div></CardContent></Card>
            <Card className="border-slate-200/60 shadow-none"><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-600" /></div><div><p className="text-xs text-slate-500">従業員稼働率</p><p className="text-2xl font-bold text-slate-900">{avgDriverRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div></div></CardContent></Card>
            <Card className="border-slate-200/60 shadow-none"><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2"><BarChart3 className="h-5 w-5 text-slate-600" /></div><div><p className="text-xs text-slate-500">今月の総便数</p><p className="text-2xl font-bold text-slate-900">{totalTrips}<span className="text-sm text-slate-400 ml-0.5">便</span></p></div></div></CardContent></Card>
            <Card className="border-slate-200/60 shadow-none"><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-50 p-2"><Clock className="h-5 w-5 text-blue-600" /></div><div><p className="text-xs text-slate-500">総残業時間</p><p className="text-2xl font-bold text-slate-900">{formatDecimal(totalOvertimeHrs)}<span className="text-sm text-slate-400 ml-0.5">h</span></p></div></div></CardContent></Card>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
            {(["vehicles","drivers","trend","dashboard"] as const).map(t=>(
              <button key={t} onClick={()=>setAnalysisSub(t)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", analysisSub===t?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-700")}>
                {t==="vehicles"?"車両別":t==="drivers"?"従業員別":t==="trend"?"月次推移":"サマリー"}
              </button>
            ))}
          </div>
          {analysisSub === "vehicles" && (
            <Card className="border-slate-200/60 shadow-none">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">車両別稼働状況（今月）</CardTitle></CardHeader>
              <CardContent><div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="border-b border-slate-100">{["車両番号","車種","稼働日数","稼働率","稼働時間","便数","稼働率バー"].map(h=><th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>{vehicleUtilization.map(v=>{const rate=(v.workDays/v.totalDays)*100;return(<tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="px-3 sm:px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{v.vehicleNumber}</td><td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span></td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.workDays} / {v.totalDays}</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatDecimal(v.hours)} h</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.trips}</td><td className="px-3 sm:px-4 py-3"><div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className={cn("h-full rounded-full",rate>=90?"bg-blue-500":rate>=70?"bg-blue-300":"bg-slate-300")} style={{width:`${rate}%`}} /></div></td></tr>);})}</tbody>
              </table></div></CardContent>
            </Card>
          )}
          {analysisSub === "drivers" && (
            <Card className="border-slate-200/60 shadow-none">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">従業員別稼働状況（今月）</CardTitle></CardHeader>
              <CardContent><div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="border-b border-slate-100">{["社員No","氏名","出勤日数","稼働率","労働時間","便数","残業時間","稼働率バー"].map(h=><th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>{driverUtilization.map(d=>{const rate=(d.workDays/d.totalDays)*100;return(<tr key={d.employeeNo} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="px-3 sm:px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{d.employeeNo}</td><td className="px-3 sm:px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{d.name}</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.workDays} / {d.totalDays}</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatDecimal(d.hours)} h</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.trips}</td><td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{d.overtime>0?`${formatDecimal(d.overtime)} h`:"—"}</td><td className="px-3 sm:px-4 py-3"><div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className={cn("h-full rounded-full",rate>=90?"bg-blue-500":rate>=70?"bg-blue-300":"bg-slate-300")} style={{width:`${rate}%`}} /></div></td></tr>);})}</tbody>
              </table></div></CardContent>
            </Card>
          )}
          {analysisSub === "trend" && (
            <Card className="border-slate-200/60 shadow-none">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900"><div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-slate-600" /></div>月次稼働率推移</CardTitle></CardHeader>
              <CardContent><div className="space-y-4">{monthlyTrend.map(m=>(<div key={m.month} className="rounded-lg border border-slate-100 p-4"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3"><span className="text-sm font-medium text-slate-900">{m.month}</span><span className="text-xs text-slate-400">平均{m.avgTrips}便/人</span></div><div className="space-y-2"><div className="flex items-center gap-3"><span className="text-xs text-slate-500 w-20">車両稼働率</span><div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-slate-400" style={{width:`${m.vehicleRate}%`}} /></div><span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.vehicleRate}%</span></div><div className="flex items-center gap-3"><span className="text-xs text-slate-500 w-20">従業員稼働率</span><div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-400" style={{width:`${m.driverRate}%`}} /></div><span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.driverRate}%</span></div></div></div>))}</div></CardContent>
            </Card>
          )}
          {analysisSub === "dashboard" && (
            <div className="space-y-6">
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900"><div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /></div>月別総支給額の推移</CardTitle></CardHeader>
                <CardContent><div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100 bg-slate-50/50">{["月","キャッシュマシン","振り込み","総支給額","出勤者数","前月比"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${h==="月"?"text-left":"text-right"}`}>{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">{[{month:"10月",wage:3980000,cashWage:2388000,transferWage:1592000,workers:162},{month:"11月",wage:4210000,cashWage:2526000,transferWage:1684000,workers:171},{month:"12月",wage:4650000,cashWage:2790000,transferWage:1860000,workers:183},{month:"1月",wage:4320000,cashWage:2592000,transferWage:1728000,workers:175},{month:"2月",wage:4620000,cashWage:2772000,transferWage:1848000,workers:179},{month:"3月",wage:4850000,cashWage:2910000,transferWage:1940000,workers:187}].map((row,idx,arr)=>{const prev=arr[idx-1];const diff=prev?((row.wage-prev.wage)/prev.wage*100):null;return(<tr key={row.month} className="hover:bg-slate-50/50 transition-colors"><td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.month}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">¥{row.cashWage.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-blue-600 whitespace-nowrap">¥{row.transferWage.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">¥{row.wage.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.workers}名</td><td className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">{diff!==null?<span className={`text-xs font-semibold ${diff>=0?"text-blue-600":"text-red-500"}`}>{diff>=0?"+":""}{diff.toFixed(1)}%</span>:<span className="text-xs text-slate-300">—</span>}</td></tr>);})}</tbody>
                </table></div></CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900"><div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><Building2 className="h-3.5 w-3.5 text-slate-600" /></div>会社別支給割合</CardTitle></CardHeader>
                <CardContent>{(()=>{const cd=[{name:"A運輸株式会社",amount:2150000,workers:85},{name:"B物流株式会社",amount:1480000,workers:52},{name:"C配送センター",amount:890000,workers:35},{name:"D運送",amount:330000,workers:15}];const total=cd.reduce((s,c)=>s+c.amount,0);return(<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-slate-100 bg-slate-50/50">{["会社名","出勤者数","支給額","割合","構成比"].map(h=><th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["出勤者数","支給額","割合"].includes(h)?"text-right":"text-left"}`}>{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{cd.map(c=>{const pct=c.amount/total*100;return(<tr key={c.name} className="hover:bg-slate-50/50 transition-colors"><td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{c.name}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{c.workers}名</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">¥{c.amount.toLocaleString()}</td><td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{pct.toFixed(1)}%</td><td className="px-3 sm:px-4 py-3 pl-6"><div className="h-2 w-full max-w-[160px] bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width:`${pct}%`}} /></div></td></tr>);})}</tbody></table></div>)})()}</CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* 車種別詳細ポップアップ */}
      <Dialog open={!!selectedVehicle} onOpenChange={()=>{setSelectedVehicle(null);setEditingVehicle(null);}}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-900">{selectedVehicle?.type} — 車種別賃金詳細</DialogTitle>
              {!editingVehicle && <button onClick={()=>setEditingVehicle(selectedVehicle?{...selectedVehicle}:null)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors mr-6"><Pencil className="h-3.5 w-3.5" />編集</button>}
            </div>
          </DialogHeader>
          {selectedVehicle && !editingVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500 mb-1">人数</p><p className="text-sm font-medium text-slate-900">{selectedVehicle.count}名</p></div>
                <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500 mb-1">総支給額</p><p className="text-sm font-semibold text-slate-900">¥{selectedVehicle.grossPay.toLocaleString()}</p></div>
                <div className="rounded-lg bg-blue-50 p-3"><p className="text-xs text-slate-500 mb-1">差引支給額</p><p className="text-sm font-bold text-blue-700">¥{selectedVehicle.netPay.toLocaleString()}</p></div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">支給内訳</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">基本給</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">¥{selectedVehicle.basicWage.toLocaleString()}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">休日手当</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.holidayPay > 0 ? `¥${selectedVehicle.holidayPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">無事故手当</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.safetyBonus > 0 ? `¥${selectedVehicle.safetyBonus.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">早出手当</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.earlyPay > 0 ? `¥${selectedVehicle.earlyPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">残業手当</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.overtime > 0 ? `¥${selectedVehicle.overtime.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">残業精算額（未払残業）</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.unpaidOvertime > 0 ? `¥${selectedVehicle.unpaidOvertime.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">その他手当</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.unpaidOtherPay > 0 ? `¥${selectedVehicle.unpaidOtherPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">交通費</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedVehicle.transport > 0 ? `¥${selectedVehicle.transport.toLocaleString()}` : "—"}</td></tr>
                    <tr className="bg-slate-50"><td className="px-4 py-2 text-slate-700 font-medium text-xs">総支給額</td><td className="px-4 py-2 text-right font-mono tabular-nums font-semibold text-slate-900 text-xs">¥{selectedVehicle.grossPay.toLocaleString()}</td></tr>
                  </tbody></table>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">控除内訳</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                    <tr className="bg-red-50/40"><td className="px-4 py-2 text-slate-600 text-xs">社保（本人）</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.socialInsurance.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/40"><td className="px-4 py-2 text-slate-600 text-xs">所得税</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.incomeTax.toLocaleString()}</td></tr>
                    {selectedVehicle.otherDeduct > 0 && <tr className="bg-red-50/40"><td className="px-4 py-2 text-slate-600 text-xs">その他控除</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.otherDeduct.toLocaleString()}</td></tr>}
                    <tr className="bg-red-50/60"><td className="px-4 py-2 text-slate-600 text-xs font-medium">控除合計</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 font-semibold text-xs">−¥{(selectedVehicle.socialInsurance + selectedVehicle.incomeTax + selectedVehicle.otherDeduct).toLocaleString()}</td></tr>
                    <tr className="border-t-2 border-slate-200 bg-blue-50/30"><td className="px-4 py-2.5 text-slate-900 font-semibold text-sm">差引支給額</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-blue-700 font-bold text-sm">¥{selectedVehicle.netPay.toLocaleString()}</td></tr>
                    <tr className="bg-slate-50"><td className="px-4 py-2 text-slate-600 text-xs">社保会社負担</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-700 text-xs">¥{selectedVehicle.companyInsurance.toLocaleString()}</td></tr>
                  </tbody></table>
                </div>
              </div>
            </div>
          )}
          {editingVehicle && (
            <div className="space-y-4">
              {(([["基本給","basicWage"],["休日手当","holidayPay"],["無事故手当","safetyBonus"],["早出手当","earlyPay"],["残業","overtime"],["残業精算額","unpaidOvertime"],["その他手当","unpaidOtherPay"],["交通費","transport"],["総支給額","grossPay"],["社保（本人）","socialInsurance"],["所得税","incomeTax"],["差引支給額","netPay"],["社保会社負担","companyInsurance"]] as [string, keyof VehicleRow][]).map(([label,field])=>(
                <div key={field} className="flex items-center gap-3">
                  <label className="w-40 text-sm text-slate-600 flex-shrink-0">{label}</label>
                  <div className="flex-1 relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span><input type="number" value={editingVehicle[field] as number} onChange={(e)=>setEditingVehicle(prev=>prev?{...prev,[field]:Number(e.target.value)}:null)} className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm text-slate-900 text-right font-mono focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" /></div>
                </div>
              )))}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={()=>setEditingVehicle(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">キャンセル</button>
                <button onClick={()=>{if(editingVehicle){setVehicleEdits(prev=>({...prev,[editingVehicle.type]:editingVehicle}));setSelectedVehicle(editingVehicle);setEditingVehicle(null);}}} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">保存</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 支払詳細統合ポップアップ */}
      {selectedPaymentRow && (() => {
        const transfer = transfersData.find(t => t.name === selectedPaymentRow.name);
        const denom = denominationData.find(d => d.name === selectedPaymentRow.name);
        return (
          <Dialog open={true} onOpenChange={() => { setSelectedPaymentRow(null); setPaymentDetailTab("支払明細"); }}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
              {/* ヘッダー */}
              <div className="bg-white px-6 py-4 rounded-t-xl border-b border-slate-100">
                <p className="text-xs text-slate-400 mb-0.5">支払詳細</p>
                <h2 className="text-lg font-bold text-slate-900">{selectedPaymentRow.name}</h2>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-400 mb-0.5">総支給額</p>
                    <p className="text-sm font-bold text-slate-800 font-mono">¥{selectedPaymentRow.grossPay.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-center">
                    <p className="text-[10px] text-red-400 mb-0.5">控除合計</p>
                    <p className="text-sm font-bold text-red-600 font-mono">−¥{selectedPaymentRow.deductions.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center">
                    <p className="text-[10px] text-blue-400 mb-0.5">差引支給額</p>
                    <p className="text-base font-bold text-blue-700 font-mono">¥{selectedPaymentRow.netPay.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {/* 内部タブ */}
                <div className="flex gap-1 rounded-lg bg-slate-50 border border-slate-200 p-1 w-fit">
                  {(["支払明細", "振込データ", "金種表"] as const).map(t => (
                    <button key={t} onClick={() => setPaymentDetailTab(t)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${paymentDetailTab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* 支払明細 */}
                {paymentDetailTab === "支払明細" && (
                  <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                    <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                      <tr><td className="px-4 py-2.5 text-xs text-slate-500 w-28">対象期間</td><td className="px-4 py-2.5 text-slate-900">{selectedPaymentRow.period}</td></tr>
                      <tr><td className="px-4 py-2.5 text-xs text-slate-500">稼働日数</td><td className="px-4 py-2.5 text-slate-900">{selectedPaymentRow.totalWork}日</td></tr>
                      <tr><td className="px-4 py-2.5 text-xs text-slate-500">支払方法</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${selectedPaymentRow.paymentMethod === "振り込み" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{selectedPaymentRow.paymentMethod}</span></td></tr>
                      <tr><td className="px-4 py-2.5 text-xs text-slate-500">総支給額</td><td className="px-4 py-2.5 text-slate-900 font-mono font-medium">¥{selectedPaymentRow.grossPay.toLocaleString()}</td></tr>
                      <tr className="bg-red-50/30"><td className="px-4 py-2.5 text-xs text-slate-500">控除合計</td><td className="px-4 py-2.5 text-red-600 font-mono">−¥{selectedPaymentRow.deductions.toLocaleString()}</td></tr>
                      <tr className="bg-blue-50/30"><td className="px-4 py-2.5 text-xs text-slate-500 font-medium">差引支給額</td><td className="px-4 py-2.5 text-blue-700 font-mono font-bold">¥{selectedPaymentRow.netPay.toLocaleString()}</td></tr>
                      <tr><td className="px-4 py-2.5 text-xs text-slate-500">ステータス</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedPaymentRow.status === "確定" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{selectedPaymentRow.status === "確定" ? "支払済み" : "未払い"}</span></td></tr>
                    </tbody></table>
                  </div>
                )}

                {/* 振込データ */}
                {paymentDetailTab === "振込データ" && (
                  transfer ? (
                    <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                      <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                        <tr><td className="px-4 py-2.5 text-xs text-slate-500 w-28">銀行名</td><td className="px-4 py-2.5 text-slate-900 font-medium">{transfer.bank}</td></tr>
                        <tr><td className="px-4 py-2.5 text-xs text-slate-500">支店名</td><td className="px-4 py-2.5 text-slate-900">{transfer.branch}</td></tr>
                        <tr><td className="px-4 py-2.5 text-xs text-slate-500">口座種別</td><td className="px-4 py-2.5 text-slate-900">{transfer.accountType}</td></tr>
                        <tr><td className="px-4 py-2.5 text-xs text-slate-500">口座番号</td><td className="px-4 py-2.5 text-slate-900 font-mono tracking-wider">{transfer.accountNo}</td></tr>
                        <tr className="bg-blue-50/30"><td className="px-4 py-2.5 text-xs text-slate-500">振込金額</td><td className="px-4 py-2.5 text-blue-700 font-mono font-bold">¥{transfer.amount.toLocaleString()}</td></tr>
                        <tr><td className="px-4 py-2.5 text-xs text-slate-500">FB状態</td><td className="px-4 py-2.5"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transfer.status === "生成済" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{transfer.status}</span></td></tr>
                      </tbody></table>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">振込データなし（現金払い）</div>
                  )
                )}

                {/* 金種表 */}
                {paymentDetailTab === "金種表" && (
                  denom ? (
                    <div className="space-y-2">
                      <div className="rounded-xl bg-blue-600 px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-100">差引支給額</span>
                        <span className="text-xl font-bold text-white font-mono">¥{denom.netPay.toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                        <div className="grid grid-cols-3 divide-y divide-slate-100">
                          {([["1万円", denom.man], ["5千円", denom.gosen], ["1千円", denom.sen], ["500円", denom.gohyaku], ["100円", denom.hyaku], ["50円", denom.goju], ["10円", denom.ju], ["5円", denom.go], ["1円", denom.ichi]] as [string, number][]).map(([label, val], i) => (
                            <div key={label} className={`flex items-center justify-between px-4 py-2.5 ${i % 3 !== 2 ? "border-r border-slate-100" : ""}`}>
                              <span className="text-xs text-slate-500">{label}</span>
                              <span className={`text-sm font-mono tabular-nums ${val > 0 ? "font-semibold text-slate-900" : "text-slate-300"}`}>{val > 0 ? `${val}枚` : "—"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">金種データなし</div>
                  )
                )}
              </div>
              <div className="px-5 pb-5">
                <Button variant="outline" className="w-full" onClick={() => { setSelectedPaymentRow(null); setPaymentDetailTab("支払明細"); }}>閉じる</Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* 個人別詳細ポップアップ */}
      <Dialog open={!!selectedPerson} onOpenChange={()=>setSelectedPerson(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-base font-semibold text-slate-900">{selectedPerson?.name} — 個人別賃金詳細</DialogTitle></DialogHeader>
          {selectedPerson && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500 mb-0.5">従業員CD</p><p className="text-xs font-medium text-slate-900 font-mono">{selectedPerson.employeeCode}</p></div>
                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500 mb-0.5">所属元</p><p className="text-xs font-medium text-slate-900 leading-tight">{selectedPerson.affiliation}</p></div>
                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500 mb-0.5">稼働日数</p><p className="text-xs font-medium text-slate-900">{selectedPerson.workDays}日</p></div>
                <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-[10px] text-slate-500 mb-0.5">総労働時間</p><p className="text-xs font-medium text-slate-900">{selectedPerson.totalWorkHours}</p></div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">支給内訳</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">本給（基本給）</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">¥{selectedPerson.basePay.toLocaleString()}</td></tr>
                    <tr><td className="px-4 py-2 text-slate-600 text-xs">付加給</td><td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">¥{selectedPerson.additionalPay.toLocaleString()}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 他控除 休日手当</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.otherLeaveAllowance > 0 ? `¥${selectedPerson.otherLeaveAllowance.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 無事故手当</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.accidentFreeAllowance > 0 ? `¥${selectedPerson.accidentFreeAllowance.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 早出手当</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.earlyAllowance > 0 ? `¥${selectedPerson.earlyAllowance.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 残業手当</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.overtimePay > 0 ? `¥${selectedPerson.overtimePay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 残業精算額（前月/当月分）</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.overtimeSettlement > 0 ? `¥${selectedPerson.overtimeSettlement.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 交通費</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.transportAllowance > 0 ? `¥${selectedPerson.transportAllowance.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ その他手当</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-slate-700 text-xs">{selectedPerson.otherAllowance > 0 ? `¥${selectedPerson.otherAllowance.toLocaleString()}` : "—"}</td></tr>
                    <tr className="bg-slate-50/50"><td className="px-4 py-2 text-slate-700 font-medium text-xs">総支給額</td><td className="px-4 py-2 text-right font-mono tabular-nums font-semibold text-slate-900 text-xs">¥{selectedPerson.grossPay.toLocaleString()}</td></tr>
                  </tbody></table>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">控除内訳（社保・税）</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <table className="w-full text-sm"><tbody className="divide-y divide-slate-100">
                    <tr className="bg-red-50/40"><td className="px-4 py-2 text-slate-600 text-xs font-medium">社保険料 小計</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 font-semibold text-xs">−¥{selectedPerson.socialInsuranceTotal.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/20"><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 健康保険料</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.healthInsurance.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/20"><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 厚生年金</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.pensionInsurance.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/20"><td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 雇用保険料</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.employmentInsurance.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/40"><td className="px-4 py-1.5 text-slate-600 text-xs">所得税</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.incomeTax.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/40"><td className="px-4 py-1.5 text-slate-600 text-xs">住民税</td><td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">{selectedPerson.residentTax > 0 ? `−¥${selectedPerson.residentTax.toLocaleString()}` : "—"}</td></tr>
                    <tr className="bg-red-50/60"><td className="px-4 py-2 text-slate-600 text-xs font-medium">控除合計</td><td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 font-semibold text-xs">−¥{selectedPerson.deductions.toLocaleString()}</td></tr>
                    <tr className="border-t-2 border-slate-200 bg-blue-50/30"><td className="px-4 py-2.5 text-slate-900 font-semibold text-sm">差引支給額</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-blue-700 font-bold text-sm">¥{selectedPerson.netPay.toLocaleString()}</td></tr>
                  </tbody></table>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">月別支給額</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <div className="grid grid-cols-3 divide-y divide-slate-100">
                    {MONTH_LABELS.map((m,i)=>(
                      <div key={m} className={`flex items-center justify-between px-3 py-2 ${i%3!==2?"border-r border-slate-100":""}`}>
                        <span className="text-xs text-slate-500">{m}</span>
                        <span className={`text-xs font-mono tabular-nums ${selectedPerson.months[i]>0?"font-semibold text-slate-900":"text-slate-300"}`}>{selectedPerson.months[i]>0?`¥${selectedPerson.months[i].toLocaleString()}`:"—"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-slate-200 bg-blue-50/20 flex items-center justify-between px-3 py-2.5">
                    <span className="text-xs font-semibold text-slate-600">年間合計</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900">¥{selectedPerson.months.reduce((s,v)=>s+v,0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
