"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  BarChart3,
  Users,
  Calendar,
  TruckIcon,
  Filter,
  Building2,
  Banknote,
  Fuel,
  Truck,
  TrendingUp,
  Plus,
  Pencil,
  Clock,
} from "lucide-react";

const TABS = ["集計", "分析"] as const;
type Tab = (typeof TABS)[number];

type AggView = "personal" | "weekly" | "vehicle" | "dispatch";

type PersonalRow = {
  name: string;
  affiliation: string;
  overtimePay: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  months: number[];
  workDays: number;
  overtimeHours: number;
  healthInsurance: number;
  pensionInsurance: number;
  employmentInsurance: number;
  incomeTax: number;
  residentTax: number;
};

const personalData: PersonalRow[] = [
  // 新運転東京高円寺支部
  { name: "守屋 繁巳",   affiliation: "新運転東京高円寺支部", overtimePay: 0,    grossPay: 16465, deductions: 8025,  netPay: 8440,  workDays: 1, overtimeHours: 0,   healthInsurance: 2244, pensionInsurance: 4026, employmentInsurance: 90,  incomeTax: 255, residentTax: 1410, months: [0,0,16465,0,0,0,0,0,0,0,0,0] },
  { name: "山口 周郎",   affiliation: "新運転東京高円寺支部", overtimePay: 0,    grossPay: 17900, deductions: 7812,  netPay: 10088, workDays: 1, overtimeHours: 0,   healthInsurance: 2618, pensionInsurance: 4026, employmentInsurance: 98,  incomeTax: 310, residentTax: 760,  months: [0,0,17900,0,0,0,0,0,0,0,0,0] },
  { name: "奥田 桂一郎", affiliation: "新運転東京高円寺支部", overtimePay: 5150, grossPay: 22850, deductions: 11826, netPay: 11024, workDays: 1, overtimeHours: 2.5, healthInsurance: 3332, pensionInsurance: 5124, employmentInsurance: 125, incomeTax: 565, residentTax: 2680, months: [0,0,22850,0,0,0,0,0,0,0,0,0] },
  { name: "岡村 義一",   affiliation: "新運転東京高円寺支部", overtimePay: 4120, grossPay: 21820, deductions: 11971, netPay: 9849,  workDays: 1, overtimeHours: 2.0, healthInsurance: 3332, pensionInsurance: 5124, employmentInsurance: 120, incomeTax: 485, residentTax: 2910, months: [0,0,21820,0,0,0,0,0,0,0,0,0] },
  { name: "伴 悦巳",     affiliation: "新運転東京高円寺支部", overtimePay: 0,    grossPay: 17700, deductions: 10486, netPay: 7214,  workDays: 1, overtimeHours: 0,   healthInsurance: 3154, pensionInsurance: 4850, employmentInsurance: 97,  incomeTax: 235, residentTax: 2150, months: [0,0,17700,0,0,0,0,0,0,0,0,0] },
  // クリーン労働組合
  { name: "寺久保 順一", affiliation: "クリーン労働組合",     overtimePay: 4168, grossPay: 17308, deductions: 5604,  netPay: 11704, workDays: 1, overtimeHours: 2.0, healthInsurance: 2023, pensionInsurance: 3111, employmentInsurance: 95,  incomeTax: 375, residentTax: 0,    months: [0,0,17308,0,0,0,0,0,0,0,0,0] },
  { name: "金野 拓海",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 18000, deductions: 9609,  netPay: 8391,  workDays: 1, overtimeHours: 0,   healthInsurance: 2559, pensionInsurance: 4575, employmentInsurance: 90,  incomeTax: 275, residentTax: 2110, months: [0,0,18000,0,0,0,0,0,0,0,0,0] },
  { name: "宮本 幸治",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 7515,  netPay: 5685,  workDays: 1, overtimeHours: 0,   healthInsurance: 2281, pensionInsurance: 3457, employmentInsurance: 72,  incomeTax: 155, residentTax: 1550, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "片岡 廉吉郎", affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 7063,  netPay: 6137,  workDays: 1, overtimeHours: 0,   healthInsurance: 2142, pensionInsurance: 3294, employmentInsurance: 72,  incomeTax: 165, residentTax: 1390, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "横山 郁生",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 18132, deductions: 10072, netPay: 8060,  workDays: 1, overtimeHours: 0,   healthInsurance: 2797, pensionInsurance: 4301, employmentInsurance: 99,  incomeTax: 285, residentTax: 2590, months: [0,0,18132,0,0,0,0,0,0,0,0,0] },
  { name: "松田 弘",     affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 6029,  netPay: 7171,  workDays: 1, overtimeHours: 0,   healthInsurance: 1934, pensionInsurance: 2928, employmentInsurance: 72,  incomeTax: 185, residentTax: 910,  months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "宍戸 謙一",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 15175, deductions: 8185,  netPay: 6990,  workDays: 1, overtimeHours: 0,   healthInsurance: 2449, pensionInsurance: 3752, employmentInsurance: 74,  incomeTax: 210, residentTax: 1700, months: [0,0,15175,0,0,0,0,0,0,0,0,0] },
  { name: "後藤田 伸志", affiliation: "クリーン労働組合",     overtimePay: 975,  grossPay: 14400, deductions: 7432,  netPay: 6968,  workDays: 1, overtimeHours: 0.5, healthInsurance: 2440, pensionInsurance: 3305, employmentInsurance: 72,  incomeTax: 195, residentTax: 1420, months: [0,0,14400,0,0,0,0,0,0,0,0,0] },
  { name: "山田 裕一",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 16670, deductions: 8471,  netPay: 8199,  workDays: 1, overtimeHours: 0,   healthInsurance: 2975, pensionInsurance: 4575, employmentInsurance: 91,  incomeTax: 230, residentTax: 600,  months: [0,0,16670,0,0,0,0,0,0,0,0,0] },
  { name: "多胡 弘",     affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 6531,  netPay: 6669,  workDays: 1, overtimeHours: 0,   healthInsurance: 2023, pensionInsurance: 3111, employmentInsurance: 72,  incomeTax: 175, residentTax: 1150, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "紅粉 浩幸",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 15150, deductions: 8120,  netPay: 7030,  workDays: 1, overtimeHours: 0,   healthInsurance: 2449, pensionInsurance: 3752, employmentInsurance: 74,  incomeTax: 205, residentTax: 1640, months: [0,0,15150,0,0,0,0,0,0,0,0,0] },
  { name: "木松 憲義",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 16500, deductions: 8729,  netPay: 7771,  workDays: 1, overtimeHours: 0,   healthInsurance: 2618, pensionInsurance: 4026, employmentInsurance: 90,  incomeTax: 235, residentTax: 1760, months: [0,0,16500,0,0,0,0,0,0,0,0,0] },
  { name: "實右 健太郎", affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 6983,  netPay: 6217,  workDays: 1, overtimeHours: 0,   healthInsurance: 2142, pensionInsurance: 3294, employmentInsurance: 72,  incomeTax: 165, residentTax: 1310, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "松中 義博",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 7083,  netPay: 6117,  workDays: 1, overtimeHours: 0,   healthInsurance: 2142, pensionInsurance: 3294, employmentInsurance: 72,  incomeTax: 165, residentTax: 1410, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "茂木 享夫",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 16500, deductions: 6924,  netPay: 9576,  workDays: 1, overtimeHours: 0,   healthInsurance: 2023, pensionInsurance: 3026, employmentInsurance: 75,  incomeTax: 400, residentTax: 1400, months: [0,0,16500,0,0,0,0,0,0,0,0,0] },
  { name: "奥村 剛平",   affiliation: "クリーン労働組合",     overtimePay: 632,  grossPay: 17632, deductions: 8466,  netPay: 9166,  workDays: 1, overtimeHours: 0.5, healthInsurance: 2244, pensionInsurance: 4026, employmentInsurance: 96,  incomeTax: 310, residentTax: 1790, months: [0,0,17632,0,0,0,0,0,0,0,0,0] },
  { name: "安田 晶平",   affiliation: "クリーン労働組合",     overtimePay: 315,  grossPay: 17316, deductions: 9208,  netPay: 8108,  workDays: 1, overtimeHours: 0.5, healthInsurance: 2397, pensionInsurance: 4301, employmentInsurance: 95,  incomeTax: 265, residentTax: 2150, months: [0,0,17316,0,0,0,0,0,0,0,0,0] },
  { name: "矢野 巨介",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 18396, deductions: 9165,  netPay: 9231,  workDays: 1, overtimeHours: 0,   healthInsurance: 2618, pensionInsurance: 4026, employmentInsurance: 101, incomeTax: 340, residentTax: 2080, months: [0,0,18396,0,0,0,0,0,0,0,0,0] },
  { name: "菊池 修平",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13200, deductions: 7962,  netPay: 5238,  workDays: 1, overtimeHours: 0,   healthInsurance: 2691, pensionInsurance: 3759, employmentInsurance: 72,  incomeTax: 150, residentTax: 1290, months: [0,0,13200,0,0,0,0,0,0,0,0,0] },
  { name: "武田 俊也",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 16500, deductions: 8729,  netPay: 7771,  workDays: 1, overtimeHours: 0,   healthInsurance: 2618, pensionInsurance: 4026, employmentInsurance: 90,  incomeTax: 235, residentTax: 1760, months: [0,0,16500,0,0,0,0,0,0,0,0,0] },
  { name: "松本 好史",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 16500, deductions: 8770,  netPay: 7730,  workDays: 1, overtimeHours: 0,   healthInsurance: 2244, pensionInsurance: 4026, employmentInsurance: 90,  incomeTax: 250, residentTax: 2160, months: [0,0,16500,0,0,0,0,0,0,0,0,0] },
  { name: "濱口 剛仁",   affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 14820, deductions: 5286,  netPay: 9534,  workDays: 1, overtimeHours: 0,   healthInsurance: 1428, pensionInsurance: 2562, employmentInsurance: 81,  incomeTax: 390, residentTax: 825,  months: [0,0,14820,0,0,0,0,0,0,0,0,0] },
  { name: "三浦 瑞",     affiliation: "クリーン労働組合",     overtimePay: 0,    grossPay: 13700, deductions: 6679,  netPay: 7021,  workDays: 1, overtimeHours: 0,   healthInsurance: 2023, pensionInsurance: 3111, employmentInsurance: 75,  incomeTax: 190, residentTax: 1280, months: [0,0,13700,0,0,0,0,0,0,0,0,0] },
];
const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"] as const;
const weeklyData = [
  { name: "山田 太郎", days: [14000, 14000, 14000, 14000, 14000, 0, 0] },
  { name: "鈴木 一郎", days: [12500, 12500, 12500, 12500, 12500, 0, 0] },
  { name: "佐藤 花子", days: [16000, 16000, 16000, 16000, 16000, 8000, 0] },
  { name: "高橋 健二", days: [13500, 13500, 13500, 13500, 13500, 0, 0] },
  { name: "田中 美咲", days: [10000, 10000, 10000, 10000, 10000, 0, 0] },
];

type VehicleRow = {
  type: string;
  count: number;
  basicWage: number;
  holidayPay: number;
  safetyBonus: number;
  earlyPay: number;
  overtime: number;
  unpaidOvertime: number;
  unpaidOtherPay: number;
  otherDeductions: number;
  transport: number;
  grossPay: number;
  socialInsurance: number;
  incomeTax: number;
  otherDeduct: number;
  netPay: number;
  companyInsurance: number;
};

const vehicleData: VehicleRow[] = [
  { type: "3 小型特殊車",           count: 3,  basicWage: 41320,    holidayPay: 0, safetyBonus: 2180,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 3040,   otherDeductions: 5900,  transport: 1300,  grossPay: 53740,    socialInsurance: 22118,  incomeTax: 830,  otherDeduct: 0, netPay: 25632,   companyInsurance: 22835 },
  { type: "5 小型プレス車",          count: 31, basicWage: 438080,   holidayPay: 0, safetyBonus: 39520,  earlyPay: 0, overtime: 0,      unpaidOvertime: 54816,   unpaidOtherPay: 47456,  otherDeductions: 48200, transport: 13200, grossPay: 586456,   socialInsurance: 209151, incomeTax: 9867, otherDeduct: 0, netPay: 314178,  companyInsurance: 217401 },
  { type: "9 大型特殊車(大コン)",    count: 2,  basicWage: 30720,    holidayPay: 0, safetyBonus: 4680,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 1054,   otherDeductions: 0,     transport: 800,   grossPay: 37254,    socialInsurance: 15758,  incomeTax: 580,  otherDeduct: 0, netPay: 15846,   companyInsurance: 16258 },
  { type: "13 軽小型ダンプ車",       count: 7,  basicWage: 80020,    holidayPay: 0, safetyBonus: 4425,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 13200, transport: 3200,  grossPay: 100845,   socialInsurance: 37873,  incomeTax: 1480, otherDeduct: 0, netPay: 53492,   companyInsurance: 39133 },
  { type: "15 大型ダンプ車(密閉型)", count: 3,  basicWage: 36560,    holidayPay: 0, safetyBonus: 6340,   earlyPay: 0, overtime: 0,      unpaidOvertime: 5480,    unpaidOtherPay: 4742,   otherDeductions: 13800, transport: 1400,  grossPay: 62842,    socialInsurance: 24784,  incomeTax: 1300, otherDeduct: 0, netPay: 29848,   companyInsurance: 25598 },
  { type: "16 コンテナ車(破砕物用)", count: 1,  basicWage: 15360,    holidayPay: 0, safetyBonus: 2340,   earlyPay: 0, overtime: 0,      unpaidOvertime: 5270,    unpaidOtherPay: 527,    otherDeductions: 0,     transport: 400,   grossPay: 18627,    socialInsurance: 9012,   incomeTax: 235,  otherDeduct: 0, netPay: 6540,    companyInsurance: 9289 },
  { type: "101 小型ダンプ車",        count: 4,  basicWage: 56680,    holidayPay: 0, safetyBonus: 5820,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 5900,  transport: 1700,  grossPay: 70100,    socialInsurance: 22300,  incomeTax: 1032, otherDeduct: 0, netPay: 40138,   companyInsurance: 23613 },
  { type: "105 資源小型プレス車(区)", count: 4,  basicWage: 57580,    holidayPay: 0, safetyBonus: 420,    earlyPay: 0, overtime: 0,      unpaidOvertime: 4877,    unpaidOtherPay: 5664,   otherDeductions: 5400,  transport: 1700,  grossPay: 70764,    socialInsurance: 21768,  incomeTax: 1153, otherDeduct: 0, netPay: 41773,   companyInsurance: 22522 },
  { type: "106 中型プレス車",        count: 3,  basicWage: 41320,    holidayPay: 0, safetyBonus: 4780,   earlyPay: 0, overtime: 0,      unpaidOvertime: 4279,    unpaidOtherPay: 0,      otherDeductions: 6400,  transport: 1300,  grossPay: 53800,    socialInsurance: 21614,  incomeTax: 845,  otherDeduct: 0, netPay: 26091,   companyInsurance: 22321 },
  { type: "120 普通貨物車",          count: 2,  basicWage: 21200,    holidayPay: 0, safetyBonus: 0,      earlyPay: 0, overtime: 0,      unpaidOvertime: 632,     unpaidOtherPay: 11300,  otherDeductions: 0,     transport: 1000,  grossPay: 34132,    socialInsurance: 11590,  incomeTax: 620,  otherDeduct: 0, netPay: 18842,   companyInsurance: 11990 },
  { type: "122 軽貨物",              count: 5,  basicWage: 54940,    holidayPay: 0, safetyBonus: 1475,   earlyPay: 0, overtime: 0,      unpaidOvertime: 3476,    unpaidOtherPay: 5688,   otherDeductions: 13200, transport: 2400,  grossPay: 77703,    socialInsurance: 22232,  incomeTax: 1294, otherDeduct: 0, netPay: 51577,   companyInsurance: 23038 },
  { type: "221 小型ダンプ車(区契約)", count: 4,  basicWage: 61440,    holidayPay: 0, safetyBonus: 6060,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 0,     transport: 1600,  grossPay: 69100,    socialInsurance: 28423,  incomeTax: 1040, otherDeduct: 0, netPay: 30967,   companyInsurance: 29352 },
  { type: "225 資源小型プレス車(区)", count: 4,  basicWage: 42400,    holidayPay: 0, safetyBonus: 0,      earlyPay: 0, overtime: 0,      unpaidOvertime: 316,     unpaidOtherPay: 22600,  otherDeductions: 0,     transport: 2000,  grossPay: 67316,    socialInsurance: 26277,  incomeTax: 1020, otherDeduct: 0, netPay: 33459,   companyInsurance: 27156 },
  { type: "226 中型プレス(区契約)",   count: 2,  basicWage: 30720,    holidayPay: 0, safetyBonus: 4280,   earlyPay: 0, overtime: 0,      unpaidOvertime: 2084,    unpaidOtherPay: 0,      otherDeductions: 0,     transport: 800,   grossPay: 35800,    socialInsurance: 15750,  incomeTax: 500,  otherDeduct: 0, netPay: 16010,   companyInsurance: 16246 },
  { type: "232 軽貨物(世田谷ペット)", count: 2,  basicWage: 23140,    holidayPay: 0, safetyBonus: 1475,   earlyPay: 0, overtime: 0,      unpaidOvertime: 748,     unpaidOtherPay: 316,    otherDeductions: 3300,  transport: 900,   grossPay: 29131,    socialInsurance: 10708,  incomeTax: 440,  otherDeduct: 0, netPay: 14193,   companyInsurance: 11069 },
  { type: "550 第1収集作業員",        count: 82, basicWage: 912610,   holidayPay: 0, safetyBonus: 133740, earlyPay: 0, overtime: 1368,   unpaidOvertime: 29709,   unpaidOtherPay: 25641,  otherDeductions: 5552,  transport: 37700, grossPay: 1116611,  socialInsurance: 350847, incomeTax: 14131,otherDeduct: 0, netPay: 686813,  companyInsurance: 366863 },
  { type: "551 第2収集作業員",        count: 2,  basicWage: 23600,    holidayPay: 0, safetyBonus: 2766,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 0,     transport: 800,   grossPay: 27166,    socialInsurance: 1749,   incomeTax: 176,  otherDeduct: 0, netPay: 25241,   companyInsurance: 2725 },
  { type: "555 破砕作業員",           count: 6,  basicWage: 67110,    holidayPay: 0, safetyBonus: 9540,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 500,   transport: 2700,  grossPay: 79850,    socialInsurance: 26384,  incomeTax: 998,  otherDeduct: 0, netPay: 44898,   companyInsurance: 27738 },
  { type: "703 資源新小型特殊車",     count: 4,  basicWage: 47800,    holidayPay: 0, safetyBonus: 5000,   earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 11800, transport: 1800,  grossPay: 66400,    socialInsurance: 14729,  incomeTax: 913,  otherDeduct: 0, netPay: 48248,   companyInsurance: 15792 },
  { type: "705 資源中型プレス(杉並)", count: 1,  basicWage: 15360,    holidayPay: 0, safetyBonus: 440,    earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 0,     transport: 400,   grossPay: 16200,    socialInsurance: 6359,   incomeTax: 245,  otherDeduct: 0, netPay: 7606,    companyInsurance: 6573 },
  { type: "706 資源新小型特殊車",     count: 2,  basicWage: 31320,    holidayPay: 0, safetyBonus: 280,    earlyPay: 0, overtime: 0,      unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 0,     transport: 800,   grossPay: 32400,    socialInsurance: 14826,  incomeTax: 415,  otherDeduct: 0, netPay: 13049,   companyInsurance: 15286 },
  { type: "707 小型プレス(渋谷)",     count: 1,  basicWage: 15660,    holidayPay: 0, safetyBonus: 140,    earlyPay: 0, overtime: 467,    unpaidOvertime: 0,       unpaidOtherPay: 0,      otherDeductions: 0,     transport: 400,   grossPay: 16667,    socialInsurance: 964,    incomeTax: 206,  otherDeduct: 0, netPay: 15497,   companyInsurance: 1503 },
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
  { name: "片岡 廉吉郎", destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "横山 郁生",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 18132, total: 18132 },
  { name: "松田 弘",     destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "宍戸 謙一",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 15175, total: 15175 },
  { name: "後藤田 伸志", destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 14400, total: 14400 },
  { name: "山田 裕一",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 16670, total: 16670 },
  { name: "多胡 弘",     destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "紅粉 浩幸",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 15150, total: 15150 },
  { name: "木松 憲義",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 16500, total: 16500 },
  { name: "實右 健太郎", destination: "クリーン労働組合",     vehicleType: "運転手", days: 1, dailyRate: 13200, total: 13200 },
  { name: "松中 義博",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "茂木 享夫",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 16500, total: 16500 },
  { name: "奥村 剛平",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 17632, total: 17632 },
  { name: "安田 晶平",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 17316, total: 17316 },
  { name: "矢野 巨介",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 18396, total: 18396 },
  { name: "菊池 修平",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13200, total: 13200 },
  { name: "武田 俊也",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 16500, total: 16500 },
  { name: "松本 好史",   destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 16500, total: 16500 },
  { name: "濱口 剛仁",   destination: "クリーン労働組合",     vehicleType: "運転手", days: 1, dailyRate: 14820, total: 14820 },
  { name: "三浦 瑞",     destination: "クリーン労働組合",     vehicleType: "作業員", days: 1, dailyRate: 13700, total: 13700 },
];

const fuelRecords = [
  { id: "1", date: "2026-03-19", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 128.5, fuelAmount: 32.1, fuelEfficiency: 4.0, cost: 5136, station: "出光 川崎SS" },
  { id: "2", date: "2026-03-19", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 186.3, fuelAmount: 62.1, fuelEfficiency: 3.0, cost: 9936, station: "ENEOS 品川SS" },
  { id: "3", date: "2026-03-18", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "佐藤 花子", distance: 85.2, fuelAmount: 14.2, fuelEfficiency: 6.0, cost: 2272, station: "出光 川崎SS" },
  { id: "4", date: "2026-03-18", vehicleNumber: "品川 100 え 3456", vehicleType: "4t", driver: "高橋 健二", distance: 145.0, fuelAmount: 36.3, fuelEfficiency: 4.0, cost: 5808, station: "ENEOS 横浜SS" },
  { id: "5", date: "2026-03-17", vehicleNumber: "品川 200 お 7890", vehicleType: "10t", driver: "田中 次郎", distance: 210.5, fuelAmount: 70.2, fuelEfficiency: 3.0, cost: 11232, station: "コスモ 東京SS" },
  { id: "6", date: "2026-03-17", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 98.3, fuelAmount: 24.6, fuelEfficiency: 4.0, cost: 3936, station: "出光 川崎SS" },
  { id: "7", date: "2026-03-16", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "渡辺 三郎", distance: 72.1, fuelAmount: 12.0, fuelEfficiency: 6.0, cost: 1920, station: "ENEOS 品川SS" },
  { id: "8", date: "2026-03-16", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 195.8, fuelAmount: 65.3, fuelEfficiency: 3.0, cost: 10448, station: "コスモ 東京SS" },
];

const vehicleSummary = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", totalDistance: 1850.2, totalFuel: 462.6, avgEfficiency: 4.0, totalCost: 74016 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", totalDistance: 3120.5, totalFuel: 1040.2, avgEfficiency: 3.0, totalCost: 166432 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t", totalDistance: 1280.0, totalFuel: 213.3, avgEfficiency: 6.0, totalCost: 34128 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t", totalDistance: 1920.8, totalFuel: 480.2, avgEfficiency: 4.0, totalCost: 76832 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", totalDistance: 2850.3, totalFuel: 950.1, avgEfficiency: 3.0, totalCost: 152016 },
];

const vehicleUtilization = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", workDays: 20, totalDays: 22, hours: 185.5, maxHours: 220, trips: 42 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", workDays: 22, totalDays: 22, hours: 220.0, maxHours: 220, trips: 65 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t", workDays: 18, totalDays: 22, hours: 144.0, maxHours: 220, trips: 25 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t", workDays: 19, totalDays: 22, hours: 171.0, maxHours: 220, trips: 38 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", workDays: 21, totalDays: 22, hours: 210.0, maxHours: 220, trips: 60 },
  { vehicleNumber: "品川 400 か 1111", vehicleType: "4t", workDays: 15, totalDays: 22, hours: 120.0, maxHours: 220, trips: 28 },
  { vehicleNumber: "品川 500 き 2222", vehicleType: "2t", workDays: 10, totalDays: 22, hours: 80.0, maxHours: 220, trips: 15 },
];

const driverUtilization = [
  { name: "山田 太郎", employeeNo: "E001", workDays: 22, totalDays: 22, hours: 198.0, trips: 45, overtime: 18.0 },
  { name: "鈴木 一郎", employeeNo: "E002", workDays: 21, totalDays: 22, hours: 195.5, trips: 63, overtime: 15.5 },
  { name: "佐藤 花子", employeeNo: "E003", workDays: 20, totalDays: 22, hours: 160.0, trips: 25, overtime: 0 },
  { name: "高橋 健二", employeeNo: "E004", workDays: 21, totalDays: 22, hours: 189.0, trips: 42, overtime: 9.0 },
  { name: "田中 次郎", employeeNo: "E005", workDays: 18, totalDays: 22, hours: 162.0, trips: 36, overtime: 12.0 },
  { name: "渡辺 三郎", employeeNo: "E006", workDays: 22, totalDays: 22, hours: 215.5, trips: 55, overtime: 35.5 },
];

const monthlyTrend = [
  { month: "2025年10月", vehicleRate: 82, driverRate: 88, avgTrips: 38 },
  { month: "2025年11月", vehicleRate: 85, driverRate: 90, avgTrips: 40 },
  { month: "2025年12月", vehicleRate: 78, driverRate: 82, avgTrips: 35 },
  { month: "2026年01月", vehicleRate: 80, driverRate: 85, avgTrips: 36 },
  { month: "2026年02月", vehicleRate: 88, driverRate: 92, avgTrips: 42 },
  { month: "2026年03月", vehicleRate: 84, driverRate: 89, avgTrips: 39 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value);
}
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(value);
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("集計");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<AggView>("personal");
  const [selectedPerson, setSelectedPerson] = useState<PersonalRow | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleRow | null>(null);
  const [vehicleEdits, setVehicleEdits] = useState<Record<string, VehicleRow>>({});

  const [dispatchSearch, setDispatchSearch] = useState("");
  const [dispatchView, setDispatchView] = useState<"summary" | "detail">("summary");

  const [fuelSubTab, setFuelSubTab] = useState<"records" | "vehicles">("records");
  const [analysisSub, setAnalysisSub] = useState<"vehicles" | "drivers" | "trend" | "dashboard">("vehicles");

  const filteredDispatchSummary = mockDispatchData.filter((d) => d.destination.includes(dispatchSearch));
  const filteredDispatchDetail = mockWorkerDetail.filter((d) => d.name.includes(dispatchSearch) || d.destination.includes(dispatchSearch));
  const dispatchTotalWage = mockDispatchData.reduce((acc, d) => acc + d.totalWage, 0);
  const dispatchTotalWorkers = mockDispatchData.reduce((acc, d) => acc + d.workerCount, 0);

  const totalFuel = fuelRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
  const totalCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalDistance = fuelRecords.reduce((sum, r) => sum + r.distance, 0);
  const avgEfficiency = totalDistance / totalFuel;

  const avgVehicleRate = vehicleUtilization.reduce((sum, v) => sum + (v.workDays / v.totalDays) * 100, 0) / vehicleUtilization.length;
  const avgDriverRate = driverUtilization.reduce((sum, d) => sum + (d.workDays / d.totalDays) * 100, 0) / driverUtilization.length;
  const totalTrips = driverUtilization.reduce((sum, d) => sum + d.trips, 0);
  const totalOvertime = driverUtilization.reduce((sum, d) => sum + d.overtime, 0);

  return (
    <MainLayout title="集計">
      <div className="space-y-6">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 集計 Tab */}
        {activeTab === "集計" && (
          <>
            <div>
              <p className="text-sm text-slate-500">個人別月別・指定期間別・車種別集計</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">対象人数</p>
                    <p className="text-2xl font-semibold text-slate-900">5名</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">期間合計</p>
                    <p className="text-2xl font-semibold text-slate-900">¥3,957,000</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Calendar className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">集計期間</p>
                    <p className="text-lg font-semibold text-slate-900">2024/01〜03</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setView("personal")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "personal" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Users className="h-3.5 w-3.5" />
                  個人別月別
                </button>
                <button
                  onClick={() => setView("dispatch")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "dispatch" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  派遣先別
                </button>
                <button
                  onClick={() => setView("vehicle")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "vehicle" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <TruckIcon className="h-3.5 w-3.5" />
                  車種別
                </button>
                <button
                  onClick={() => setView("weekly")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${view === "weekly" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  週別
                </button>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                エクスポート
              </button>
            </div>

            {view === "personal" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">名前</th>
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">所属元</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業手当</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総支給額</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {personalData.filter((d) => d.name.includes(searchQuery) || d.affiliation.includes(searchQuery)).map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedPerson(row)}
                        >
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap">{row.affiliation}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap text-slate-700">¥{row.overtimePay.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap font-semibold text-slate-900">¥{row.grossPay.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap text-blue-700 font-semibold">¥{row.netPay.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 bg-slate-50">
                        <td className="px-3 sm:px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">合計</td>
                        <td className="px-3 sm:px-4 py-3"></td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">
                          ¥{personalData.filter((d) => d.name.includes(searchQuery) || d.affiliation.includes(searchQuery)).reduce((s, r) => s + r.overtimePay, 0).toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                          ¥{personalData.filter((d) => d.name.includes(searchQuery) || d.affiliation.includes(searchQuery)).reduce((s, r) => s + r.grossPay, 0).toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-blue-700 font-mono tabular-nums whitespace-nowrap">
                          ¥{personalData.filter((d) => d.name.includes(searchQuery) || d.affiliation.includes(searchQuery)).reduce((s, r) => s + r.netPay, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {view === "weekly" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="sticky left-0 z-10 bg-slate-50/90 px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                        {DAY_LABELS.map((d) => (
                          <th key={d} className={`px-3 py-3 text-right text-xs font-medium whitespace-nowrap ${d === "土" ? "text-blue-500" : d === "日" ? "text-red-400" : "text-slate-500"}`}>{d}</th>
                        ))}
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">週合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {weeklyData.filter((d) => d.name.includes(searchQuery)).map((row, idx) => {
                        const total = row.days.reduce((s, v) => s + v, 0);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="sticky left-0 z-10 bg-white px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                            {row.days.map((v, i) => (
                              <td key={i} className={`px-3 py-3 text-right font-mono tabular-nums whitespace-nowrap ${v === 0 ? "text-slate-300" : "text-slate-700"}`}>{v === 0 ? "—" : `¥${v.toLocaleString()}`}</td>
                            ))}
                            <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{total.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === "vehicle" && (
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">車種</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">基本給</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">残業</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総支給額</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">差引支給額</th>
                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">社保会社</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vehicleData.map((row, idx) => {
                        const r = vehicleEdits[row.type] ?? row;
                        return (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => setSelectedVehicle(r)}>
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{r.type}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{r.basicWage.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{r.overtime > 0 ? `¥${r.overtime.toLocaleString()}` : "—"}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-semibold tabular-nums whitespace-nowrap">¥{r.grossPay.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-blue-700 font-mono font-semibold tabular-nums whitespace-nowrap">¥{r.netPay.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{r.companyInsurance.toLocaleString()}</td>
                        </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 bg-slate-50">
                        <td className="px-3 sm:px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">合計</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{vehicleData.reduce((s, r) => s + r.basicWage, 0).toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{vehicleData.reduce((s, r) => s + r.overtime, 0).toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">¥{vehicleData.reduce((s, r) => s + r.grossPay, 0).toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-blue-700 font-mono tabular-nums whitespace-nowrap">¥{vehicleData.reduce((s, r) => s + r.netPay, 0).toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{vehicleData.reduce((s, r) => s + r.companyInsurance, 0).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {view === "dispatch" && (
              <>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2"><Building2 className="h-5 w-5 text-blue-600" /></div>
                      <div><p className="text-sm text-slate-500">派遣先数</p><p className="text-2xl font-semibold text-slate-900">{mockDispatchData.length}</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-2"><Users className="h-5 w-5 text-slate-600" /></div>
                      <div><p className="text-sm text-slate-500">配置人数</p><p className="text-2xl font-semibold text-slate-900">{dispatchTotalWorkers}名</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2"><TruckIcon className="h-5 w-5 text-blue-600" /></div>
                      <div><p className="text-sm text-slate-500">総稼働日数</p><p className="text-2xl font-semibold text-slate-900">680日</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-2"><Banknote className="h-5 w-5 text-slate-600" /></div>
                      <div><p className="text-sm text-slate-500">賃金総額</p><p className="text-2xl font-semibold text-slate-900">¥{(dispatchTotalWage / 10000).toFixed(0)}万</p></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="派遣先・氏名で検索..."
                      value={dispatchSearch}
                      onChange={(e) => setDispatchSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <button
                      onClick={() => setDispatchView("summary")}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView === "summary" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      派遣先別
                    </button>
                    <button
                      onClick={() => setDispatchView("detail")}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${dispatchView === "detail" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      個人別
                    </button>
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

                {dispatchView === "summary" && (
                  <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">派遣先</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">人数</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">延べ日数</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">平均日当</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">賃金合計</th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">対象月</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredDispatchSummary.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.destination}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workerCount}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.avgDailyRate.toLocaleString()}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.totalWage.toLocaleString()}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {dispatchView === "detail" && (
                  <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業員名</th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">派遣先</th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">車種</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日数</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">日当</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">合計</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredDispatchDetail.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.destination}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.vehicleType}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.days}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.dailyRate.toLocaleString()}</td>
                              <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="text-sm text-slate-500">
                  全 {dispatchView === "summary" ? filteredDispatchSummary.length : filteredDispatchDetail.length} 件
                </div>
              </>
            )}
          </>
        )}

        {/* 分析 Tab */}
        {activeTab === "分析" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><Truck className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">車両稼働率</p><p className="text-2xl font-bold text-slate-900">{avgVehicleRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">従業員稼働率</p><p className="text-2xl font-bold text-slate-900">{avgDriverRate.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">%</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2"><BarChart3 className="h-5 w-5 text-slate-600" /></div>
                    <div><p className="text-xs text-slate-500">今月の総便数</p><p className="text-2xl font-bold text-slate-900">{totalTrips}<span className="text-sm text-slate-400 ml-0.5">便</span></p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><Clock className="h-5 w-5 text-blue-600" /></div>
                    <div><p className="text-xs text-slate-500">総残業時間</p><p className="text-2xl font-bold text-slate-900">{formatNumber(totalOvertime)}<span className="text-sm text-slate-400 ml-0.5">h</span></p></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {(["vehicles", "drivers", "trend", "dashboard"] as const).map((t) => (
                  <button key={t} onClick={() => setAnalysisSub(t)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", analysisSub === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                    {t === "vehicles" ? "車両別" : t === "drivers" ? "従業員別" : t === "trend" ? "月次推移" : "サマリー"}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200"><Download className="h-3.5 w-3.5" />CSV出力</Button>
            </div>

            {analysisSub === "vehicles" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">車両別稼働状況（今月）</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["車両番号","車種","稼働日数","稼働率","稼働時間","便数","稼働率バー"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleUtilization.map((v) => {
                          const rate = (v.workDays / v.totalDays) * 100;
                          return (
                            <tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-3 sm:px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{v.vehicleNumber}</td>
                              <td className="px-3 sm:px-4 py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span></td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.workDays} / {v.totalDays}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatNumber(v.hours)} h</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.trips}</td>
                              <td className="px-3 sm:px-4 py-3">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")} style={{ width: `${rate}%` }} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisSub === "drivers" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">従業員別稼働状況（今月）</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["社員No","氏名","出勤日数","稼働率","労働時間","便数","残業時間","稼働率バー"].map((h) => (
                            <th key={h} className="px-3 sm:px-4 pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {driverUtilization.map((d) => {
                          const rate = (d.workDays / d.totalDays) * 100;
                          return (
                            <tr key={d.employeeNo} className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-3 sm:px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{d.employeeNo}</td>
                              <td className="px-3 sm:px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{d.name}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.workDays} / {d.totalDays}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{rate.toFixed(1)}%</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{formatNumber(d.hours)} h</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{d.trips}</td>
                              <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{d.overtime > 0 ? `${formatNumber(d.overtime)} h` : "-"}</td>
                              <td className="px-3 sm:px-4 py-3">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={cn("h-full rounded-full", rate >= 90 ? "bg-blue-500" : rate >= 70 ? "bg-blue-300" : "bg-slate-300")} style={{ width: `${rate}%` }} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisSub === "trend" && (
              <Card className="border-slate-200/60 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                    <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-slate-600" /></div>
                    月次稼働率推移
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrend.map((m) => (
                      <div key={m.month} className="rounded-lg border border-slate-100 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <span className="text-sm font-medium text-slate-900">{m.month}</span>
                          <span className="text-xs text-slate-400">平均{m.avgTrips}便/人</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 w-20">車両稼働率</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-slate-400" style={{ width: `${m.vehicleRate}%` }} />
                            </div>
                            <span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.vehicleRate}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 w-20">従業員稼働率</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-blue-400" style={{ width: `${m.driverRate}%` }} />
                            </div>
                            <span className="text-xs font-medium tabular-nums text-slate-700 w-12 text-right">{m.driverRate}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisSub === "dashboard" && (
              <div className="space-y-6">
                {/* 月別総支給額・出勤者数 */}
                <Card className="border-slate-200/60 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                      <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /></div>
                      月別総支給額の推移
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">月</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">キャッシュマシン</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">振り込み</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">総支給額</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">出勤者数</th>
                            <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">前月比</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { month: "10月", wage: 3980000, cashWage: 2388000, transferWage: 1592000, workers: 162 },
                            { month: "11月", wage: 4210000, cashWage: 2526000, transferWage: 1684000, workers: 171 },
                            { month: "12月", wage: 4650000, cashWage: 2790000, transferWage: 1860000, workers: 183 },
                            { month: "1月",  wage: 4320000, cashWage: 2592000, transferWage: 1728000, workers: 175 },
                            { month: "2月",  wage: 4620000, cashWage: 2772000, transferWage: 1848000, workers: 179 },
                            { month: "3月",  wage: 4850000, cashWage: 2910000, transferWage: 1940000, workers: 187 },
                          ].map((row, idx, arr) => {
                            const prev = arr[idx - 1];
                            const diff = prev ? ((row.wage - prev.wage) / prev.wage * 100) : null;
                            return (
                              <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.month}</td>
                                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">¥{row.cashWage.toLocaleString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-blue-600 whitespace-nowrap">¥{row.transferWage.toLocaleString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">¥{row.wage.toLocaleString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{row.workers}名</td>
                                <td className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                                  {diff !== null ? (
                                    <span className={`text-xs font-semibold ${diff >= 0 ? "text-blue-600" : "text-red-500"}`}>
                                      {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-300">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-200 bg-slate-50">
                            <td className="px-3 sm:px-4 py-3 text-xs font-semibold text-slate-600">合計</td>
                            <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold font-mono tabular-nums text-slate-600">¥{(2388000+2526000+2790000+2592000+2772000+2910000).toLocaleString()}</td>
                            <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold font-mono tabular-nums text-blue-600">¥{(1592000+1684000+1860000+1728000+1848000+1940000).toLocaleString()}</td>
                            <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold font-mono tabular-nums text-slate-900">¥{(3980000+4210000+4650000+4320000+4620000+4850000).toLocaleString()}</td>
                            <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold font-mono tabular-nums text-slate-700">{(162+171+183+175+179+187)}名</td>
                            <td className="px-3 sm:px-4 py-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* 会社別支給割合 */}
                <Card className="border-slate-200/60 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                      <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><Building2 className="h-3.5 w-3.5 text-slate-600" /></div>
                      会社別支給割合
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const companyData = [
                        { name: "A運輸株式会社", amount: 2150000, workers: 85 },
                        { name: "B物流株式会社", amount: 1480000, workers: 52 },
                        { name: "C配送センター",  amount: 890000,  workers: 35 },
                        { name: "D運送",          amount: 330000,  workers: 15 },
                      ];
                      const total = companyData.reduce((s, c) => s + c.amount, 0);
                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">会社名</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">出勤者数</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">支給額</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-slate-500 whitespace-nowrap">割合</th>
                                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap pl-6">構成比</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {companyData.map((c) => {
                                const pct = (c.amount / total * 100);
                                return (
                                  <tr key={c.name} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{c.name}</td>
                                    <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{c.workers}名</td>
                                    <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">¥{c.amount.toLocaleString()}</td>
                                    <td className="px-3 sm:px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">{pct.toFixed(1)}%</td>
                                    <td className="px-3 sm:px-4 py-3 pl-6">
                                      <div className="h-2 w-full max-w-[160px] bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-slate-200 bg-slate-50">
                                <td className="px-3 sm:px-4 py-3 text-xs font-semibold text-slate-600">合計</td>
                                <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold font-mono tabular-nums text-slate-700">{companyData.reduce((s, c) => s + c.workers, 0)}名</td>
                                <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold font-mono tabular-nums text-slate-900">¥{total.toLocaleString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-700">100%</td>
                                <td className="px-3 sm:px-4 py-3"></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* 今月の日別稼働件数 */}
                <Card className="border-slate-200/60 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                      <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center"><Calendar className="h-3.5 w-3.5 text-slate-600" /></div>
                      今月の日別稼働件数（3月）
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const dailyData = [
                        { day: "1",  count: 18 }, { day: "3",  count: 21 }, { day: "4",  count: 19 },
                        { day: "5",  count: 22 }, { day: "6",  count: 20 }, { day: "7",  count: 17 },
                        { day: "8",  count: 0  },
                        { day: "10", count: 23 }, { day: "11", count: 20 }, { day: "12", count: 19 },
                        { day: "13", count: 21 }, { day: "14", count: 22 }, { day: "15", count: 18 },
                        { day: "17", count: 24 }, { day: "18", count: 22 }, { day: "19", count: 21 },
                        { day: "20", count: 18 },
                      ];
                      const activeDays = dailyData.filter((d) => d.count > 0);
                      const total = dailyData.reduce((s, d) => s + d.count, 0);
                      const avg = (total / activeDays.length).toFixed(1);
                      const max = Math.max(...dailyData.map((d) => d.count));
                      return (
                        <div className="space-y-3">
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span>稼働日数 <span className="font-semibold text-slate-800">{activeDays.length}日</span></span>
                            <span>累計 <span className="font-semibold text-slate-800">{total}件</span></span>
                            <span>平均 <span className="font-semibold text-slate-800">{avg}件/日</span></span>
                            <span>最高 <span className="font-semibold text-slate-800">{max}件</span></span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap">日付</th>
                                  <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 whitespace-nowrap">件数</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap pl-4">割合</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {dailyData.filter((d) => d.count > 0).map((d) => (
                                  <tr key={d.day} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">3月{d.day}日</td>
                                    <td className="px-3 py-2 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">{d.count}件</td>
                                    <td className="px-3 py-2 pl-4">
                                      <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full bg-slate-500" style={{ width: `${(d.count / max) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-slate-400 tabular-nums">{(d.count / total * 100).toFixed(1)}%</span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2 border-slate-200 bg-slate-50">
                                  <td className="px-3 py-3 text-xs font-semibold text-slate-600">合計</td>
                                  <td className="px-3 py-3 text-right text-xs font-bold font-mono tabular-nums text-slate-900">{total}件</td>
                                  <td className="px-3 py-3"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* 車種別詳細ポップアップ（編集可能） */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => { setSelectedVehicle(null); setEditingVehicle(null); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-900">
                {selectedVehicle?.type} — 賃金詳細（26/03/02）
              </DialogTitle>
              {!editingVehicle && (
                <button
                  onClick={() => setEditingVehicle(selectedVehicle ? { ...selectedVehicle } : null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors mr-6"
                >
                  <Pencil className="h-3.5 w-3.5" />編集
                </button>
              )}
            </div>
          </DialogHeader>
          {selectedVehicle && !editingVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 mb-1">人数</p>
                  <p className="text-sm font-medium text-slate-900">{selectedVehicle.count}名</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-slate-500 mb-1">差引支給額</p>
                  <p className="text-sm font-bold text-blue-700">¥{selectedVehicle.netPay.toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="px-4 py-2.5 text-slate-600">基本給</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">¥{selectedVehicle.basicWage.toLocaleString()}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">休日手当</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.holidayPay > 0 ? `¥${selectedVehicle.holidayPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">無事故手当</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.safetyBonus > 0 ? `¥${selectedVehicle.safetyBonus.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">早出</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.earlyPay > 0 ? `¥${selectedVehicle.earlyPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">残業</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.overtime > 0 ? `¥${selectedVehicle.overtime.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">未払残業</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.unpaidOvertime > 0 ? `¥${selectedVehicle.unpaidOvertime.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">未払残その他手当</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">{selectedVehicle.unpaidOtherPay > 0 ? `¥${selectedVehicle.unpaidOtherPay.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">その他控除</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-red-600">{selectedVehicle.otherDeductions > 0 ? `−¥${selectedVehicle.otherDeductions.toLocaleString()}` : "—"}</td></tr>
                    <tr><td className="px-4 py-2.5 text-slate-600">交通費</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">¥{selectedVehicle.transport.toLocaleString()}</td></tr>
                    <tr className="bg-slate-50"><td className="px-4 py-2.5 text-slate-700 font-medium">総支給額</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 font-semibold">¥{selectedVehicle.grossPay.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/40"><td className="px-4 py-2.5 text-slate-600 pl-6 text-xs">└ 社保（本人）</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.socialInsurance.toLocaleString()}</td></tr>
                    <tr className="bg-red-50/40"><td className="px-4 py-2.5 text-slate-600 pl-6 text-xs">└ 源泉税</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.incomeTax.toLocaleString()}</td></tr>
                    {selectedVehicle.otherDeduct > 0 && (
                      <tr className="bg-red-50/40"><td className="px-4 py-2.5 text-slate-600 pl-6 text-xs">└ その他控除</td><td className="px-4 py-2.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedVehicle.otherDeduct.toLocaleString()}</td></tr>
                    )}
                    <tr className="border-t-2 border-slate-200 bg-blue-50/30">
                      <td className="px-4 py-3 text-slate-900 font-semibold">差引支給額</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700 font-bold text-base">¥{selectedVehicle.netPay.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-600">社保会社負担</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">¥{selectedVehicle.companyInsurance.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {editingVehicle && (
            <div className="space-y-4">
              {(([
                ["基本給", "basicWage"],
                ["休日手当", "holidayPay"],
                ["無事故手当", "safetyBonus"],
                ["早出", "earlyPay"],
                ["残業", "overtime"],
                ["未払残業", "unpaidOvertime"],
                ["未払残その他手当", "unpaidOtherPay"],
                ["その他控除", "otherDeductions"],
                ["交通費", "transport"],
                ["総支給額", "grossPay"],
                ["社保（本人）", "socialInsurance"],
                ["源泉税", "incomeTax"],
                ["その他控除（追加）", "otherDeduct"],
                ["差引支給額", "netPay"],
                ["社保会社負担", "companyInsurance"],
              ] as [string, keyof VehicleRow][]).map(([label, field]) => (
                <div key={field} className="flex items-center gap-3">
                  <label className="w-40 text-sm text-slate-600 flex-shrink-0">{label}</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                    <input
                      type="number"
                      value={editingVehicle[field] as number}
                      onChange={(e) => setEditingVehicle((prev) => prev ? { ...prev, [field]: Number(e.target.value) } : null)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm text-slate-900 text-right font-mono focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )))}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditingVehicle(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    if (editingVehicle) {
                      setVehicleEdits((prev) => ({ ...prev, [editingVehicle.type]: editingVehicle }));
                      setSelectedVehicle(editingVehicle);
                      setEditingVehicle(null);
                    }
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 個人別詳細ポップアップ */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              {selectedPerson?.name} — 個人別賃金詳細
            </DialogTitle>
          </DialogHeader>
          {selectedPerson && (
            <div className="space-y-4">
              {/* 基本情報 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] text-slate-500 mb-0.5">所属元</p>
                  <p className="text-xs font-medium text-slate-900 leading-tight">{selectedPerson.affiliation}</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] text-slate-500 mb-0.5">出勤日数</p>
                  <p className="text-xs font-medium text-slate-900">{selectedPerson.workDays}日</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] text-slate-500 mb-0.5">残業時間</p>
                  <p className="text-xs font-medium text-slate-900">{selectedPerson.overtimeHours}h</p>
                </div>
              </div>

              {/* 支給・控除 */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">支給・控除</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-2 text-slate-600 text-xs">残業手当</td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums text-slate-900 text-xs">{selectedPerson.overtimePay > 0 ? `¥${selectedPerson.overtimePay.toLocaleString()}` : "—"}</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="px-4 py-2 text-slate-700 font-medium text-xs">総支給額</td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums font-semibold text-slate-900 text-xs">¥{selectedPerson.grossPay.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-red-50/40">
                        <td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 健康保険</td>
                        <td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.healthInsurance.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-red-50/40">
                        <td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 厚生年金</td>
                        <td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.pensionInsurance.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-red-50/40">
                        <td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 雇用保険</td>
                        <td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.employmentInsurance.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-red-50/40">
                        <td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 源泉税</td>
                        <td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.incomeTax.toLocaleString()}</td>
                      </tr>
                      {selectedPerson.residentTax > 0 && (
                        <tr className="bg-red-50/40">
                          <td className="px-4 py-1.5 text-slate-500 pl-6 text-xs">└ 住民税</td>
                          <td className="px-4 py-1.5 text-right font-mono tabular-nums text-red-600 text-xs">−¥{selectedPerson.residentTax.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="bg-red-50/60">
                        <td className="px-4 py-2 text-slate-600 text-xs font-medium">控除合計</td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 font-semibold text-xs">−¥{selectedPerson.deductions.toLocaleString()}</td>
                      </tr>
                      <tr className="border-t-2 border-slate-200 bg-blue-50/30">
                        <td className="px-4 py-2.5 text-slate-900 font-semibold text-sm">差引支給額</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-blue-700 font-bold text-sm">¥{selectedPerson.netPay.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 月別内訳 */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">月別支給額</p>
                <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
                  <div className="grid grid-cols-3 divide-y divide-slate-100">
                    {MONTH_LABELS.map((m, i) => (
                      <div key={m} className={`flex items-center justify-between px-3 py-2 ${i % 3 !== 2 ? "border-r border-slate-100" : ""}`}>
                        <span className="text-xs text-slate-500">{m}</span>
                        <span className={`text-xs font-mono tabular-nums ${selectedPerson.months[i] > 0 ? "font-semibold text-slate-900" : "text-slate-300"}`}>
                          {selectedPerson.months[i] > 0 ? `¥${selectedPerson.months[i].toLocaleString()}` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-slate-200 bg-blue-50/20 flex items-center justify-between px-3 py-2.5">
                    <span className="text-xs font-semibold text-slate-600">年間合計</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                      ¥{selectedPerson.months.reduce((s, v) => s + v, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
