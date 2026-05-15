"use client";

import { useState } from "react";
import { MainLayout, MasterSubnav } from "@/components/layout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Search, MapPin, Clock, Percent, Truck, Building2, ChevronUp, ChevronDown } from "lucide-react";

const VEHICLE_TYPES = ["2tトラック", "4tトラック", "10tトラック", "大型トラック", "ウイングトラック"];

const MULTIPLIER_OPTIONS = [
  { label: "0.10 倍（基本給×10%）", value: "0.10" },
  { label: "0.20 倍（基本給×20%）", value: "0.20" },
  { label: "0.25 倍（基本給×25%）", value: "0.25" },
  { label: "0.30 倍（基本給×30%）", value: "0.30" },
  { label: "0.35 倍（基本給×35%）", value: "0.35" },
  { label: "0.50 倍（基本給×50%）", value: "0.50" },
];

const THRESHOLD_OPTIONS = [
  { label: "15分以上早出", value: "15" },
  { label: "30分以上早出", value: "30" },
  { label: "45分以上早出", value: "45" },
  { label: "60分以上早出", value: "60" },
];

interface EarlyDepartureRule {
  vehicleType: string;
  thresholdMinutes: number;
  multiplier: number;
}

interface OperationDestination {
  id: string;
  name: string;
  prefecture: string;
  estimatedHours: number;
  rules: EarlyDepartureRule[];
  isActive: boolean;
  memo: string;
}

const mockDestinations: OperationDestination[] = [
  {
    id: "1",
    name: "東京中央市場",
    prefecture: "東京都",
    estimatedHours: 2.5,
    rules: [
      { vehicleType: "2tトラック",  thresholdMinutes: 30, multiplier: 0.25 },
      { vehicleType: "4tトラック",  thresholdMinutes: 30, multiplier: 0.25 },
      { vehicleType: "10tトラック", thresholdMinutes: 30, multiplier: 0.30 },
    ],
    isActive: true,
    memo: "",
  },
  {
    id: "2",
    name: "横浜港物流センター",
    prefecture: "神奈川県",
    estimatedHours: 3.0,
    rules: [
      { vehicleType: "4tトラック",  thresholdMinutes: 45, multiplier: 0.30 },
      { vehicleType: "10tトラック", thresholdMinutes: 45, multiplier: 0.35 },
      { vehicleType: "大型トラック", thresholdMinutes: 45, multiplier: 0.35 },
    ],
    isActive: true,
    memo: "港湾早出は45分基準",
  },
  {
    id: "3",
    name: "埼玉北部営業所",
    prefecture: "埼玉県",
    estimatedHours: 1.5,
    rules: [
      { vehicleType: "2tトラック", thresholdMinutes: 30, multiplier: 0.20 },
      { vehicleType: "4tトラック", thresholdMinutes: 30, multiplier: 0.25 },
    ],
    isActive: true,
    memo: "",
  },
  {
    id: "4",
    name: "千葉南倉庫",
    prefecture: "千葉県",
    estimatedHours: 2.0,
    rules: [
      { vehicleType: "4tトラック",  thresholdMinutes: 30, multiplier: 0.25 },
      { vehicleType: "10tトラック", thresholdMinutes: 30, multiplier: 0.30 },
    ],
    isActive: false,
    memo: "現在使用停止",
  },
];

// ─── 供給先別早出時間マスタ ────────────────────────────────────────────────
interface SupplierEarlyTime {
  id: number;
  supplierCode: number;
  supplierName: string;
  subOfficeCode: number;
  subOfficeName: string;
  earlyMinutes: number;
  isActive: boolean;
  memo: string;
}

const supplierEarlyTimeData: SupplierEarlyTime[] = [
  { id:  1, supplierCode:   1, supplierName: "千代田清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id:  2, supplierCode:   5, supplierName: "みなと清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id:  3, supplierCode:   7, supplierName: "新宿清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id:  4, supplierCode:   8, supplierName: "新宿清掃事務所新宿東SS",        subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 10, isActive: true, memo: "" },
  { id:  5, supplierCode:   9, supplierName: "文京清掃事務所",                subOfficeCode:  91, subOfficeName: "小石川リサイクル", earlyMinutes: 20, isActive: true, memo: "" },
  { id:  6, supplierCode:   9, supplierName: "文京清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id:  7, supplierCode:  14, supplierName: "本所清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id:  8, supplierCode:  17, supplierName: "品川清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id:  9, supplierCode:  18, supplierName: "品川区清掃事務所 荏原庁舎",     subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 10, supplierCode:  20, supplierName: "蒲田清掃事務所(調布地区)",      subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 11, supplierCode:  24, supplierName: "目黒区清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 12, supplierCode:  25, supplierName: "世田谷清掃事務所",              subOfficeCode: 251, subOfficeName: "弦巻第一分室",  earlyMinutes: 20, isActive: true, memo: "" },
  { id: 13, supplierCode:  25, supplierName: "世田谷清掃事務所",              subOfficeCode: 252, subOfficeName: "弦巻第二分室",  earlyMinutes: 20, isActive: true, memo: "" },
  { id: 14, supplierCode:  25, supplierName: "世田谷清掃事務所",              subOfficeCode: 253, subOfficeName: "世田谷リサイクル", earlyMinutes: 40, isActive: true, memo: "" },
  { id: 15, supplierCode:  25, supplierName: "世田谷清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 16, supplierCode:  27, supplierName: "玉川清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 17, supplierCode:  28, supplierName: "渋谷清掃事務所",                subOfficeCode: 281, subOfficeName: "宇田川分室",    earlyMinutes: 20, isActive: true, memo: "" },
  { id: 18, supplierCode:  28, supplierName: "渋谷清掃事務所",                subOfficeCode: 282, subOfficeName: "代々木分室",    earlyMinutes: 10, isActive: true, memo: "" },
  { id: 19, supplierCode:  28, supplierName: "渋谷清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 20, supplierCode:  32, supplierName: "豊島清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 21, supplierCode:  34, supplierName: "板橋東清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 22, supplierCode:  35, supplierName: "板橋西清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 23, supplierCode:  37, supplierName: "石神井清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 24, supplierCode:  38, supplierName: "蒲田清掃事務所(蒲田地区)",      subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 25, supplierCode:  39, supplierName: "足立西清掃事務所",              subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 50, isActive: true, memo: "" },
  { id: 26, supplierCode:  45, supplierName: "中防処理施設管理事務所",        subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 27, supplierCode:  46, supplierName: "品川清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 28, supplierCode:  47, supplierName: "中防処理施設管理事務所(溶融）", subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 29, supplierCode:  49, supplierName: "大田清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 30, supplierCode:  51, supplierName: "練馬清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 31, supplierCode:  52, supplierName: "板橋清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 32, supplierCode:  53, supplierName: "足立清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 33, supplierCode:  54, supplierName: "葛飾清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 34, supplierCode:  56, supplierName: "北清掃工場",                    subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 35, supplierCode:  57, supplierName: "世田谷清掃工場",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 36, supplierCode:  58, supplierName: "千歳清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 37, supplierCode:  59, supplierName: "多摩川清掃工場",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 38, supplierCode:  60, supplierName: "大井清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 39, supplierCode:  61, supplierName: "新江東清掃工場",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 40, supplierCode:  63, supplierName: "大田清掃工場第一工場",          subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 41, supplierCode:  64, supplierName: "目黒清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 42, supplierCode:  65, supplierName: "光が丘清掃工場",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 43, supplierCode:  66, supplierName: "有明清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 44, supplierCode:  67, supplierName: "墨田清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 45, supplierCode:  68, supplierName: "港清掃工場",                    subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 40, isActive: true, memo: "" },
  { id: 46, supplierCode:  69, supplierName: "豊島清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 47, supplierCode:  70, supplierName: "中央清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 60, isActive: true, memo: "" },
  { id: 48, supplierCode:  71, supplierName: "渋谷清掃工場",                  subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 49, supplierCode:  87, supplierName: "世田谷清掃事務所（資源）",      subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 50, supplierCode:  89, supplierName: "玉川清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 30, isActive: true, memo: "" },
  { id: 51, supplierCode:  91, supplierName: "渋谷清掃事務所",                subOfficeCode: 282, subOfficeName: "代々木分室",    earlyMinutes: 10, isActive: true, memo: "" },
  { id: 52, supplierCode:  91, supplierName: "渋谷清掃事務所",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 20, isActive: true, memo: "" },
  { id: 53, supplierCode: 460, supplierName: "杉並東破砕作業",                subOfficeCode: 999, subOfficeName: "本所",          earlyMinutes: 10, isActive: true, memo: "" },
];

// 早出時間バッジ色
function earlyMinutesBadge(min: number) {
  if (min >= 60) return "bg-red-100 text-red-700 border-red-200";
  if (min >= 40) return "bg-orange-100 text-orange-700 border-orange-200";
  if (min >= 20) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

// ─── ルールエディタ（コンポーネント外で定義） ────────────────────────────
function RuleEditor({
  rules,
  setRules,
}: {
  rules: EarlyDepartureRule[];
  setRules: (r: EarlyDepartureRule[]) => void;
}) {
  function update(idx: number, key: keyof EarlyDepartureRule, value: string | number) {
    setRules(rules.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  }

  return (
    <div className="space-y-2">
      {rules.map((rule, idx) => (
        <div
          key={idx}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
        >
          <Select
            value={rule.vehicleType}
            onValueChange={(v) => update(idx, "vehicleType", v)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(rule.thresholdMinutes)}
            onValueChange={(v) => update(idx, "thresholdMinutes", Number(v))}
          >
            <SelectTrigger className="h-8 w-[155px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THRESHOLD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(rule.multiplier)}
            onValueChange={(v) => update(idx, "multiplier", Number(v))}
          >
            <SelectTrigger className="h-8 w-[185px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MULTIPLIER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {rules.length > 1 && (
            <button
              type="button"
              onClick={() => setRules(rules.filter((_, i) => i !== idx))}
              className="ml-auto text-xs text-red-500 hover:text-red-700 px-1"
            >
              削除
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-xs gap-1"
        onClick={() =>
          setRules([...rules, { vehicleType: "4tトラック", thresholdMinutes: 30, multiplier: 0.25 }])
        }
      >
        <Plus className="h-3.5 w-3.5" />
        車種ルール追加
      </Button>
    </div>
  );
}

// ─── メインページ ──────────────────────────────────────────────────────────
export default function OperationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<OperationDestination | null>(null);
  const [editingDest, setEditingDest] = useState<OperationDestination | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newRules, setNewRules] = useState<EarlyDepartureRule[]>([
    { vehicleType: "4tトラック", thresholdMinutes: 30, multiplier: 0.25 },
  ]);
  const [editRules, setEditRules] = useState<EarlyDepartureRule[]>([]);

  // 供給先早出時間マスタ
  const [supplierData, setSupplierData] = useState<SupplierEarlyTime[]>(supplierEarlyTimeData);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSortKey, setSupplierSortKey] = useState<"supplierCode" | "earlyMinutes">("supplierCode");
  const [supplierSortAsc, setSupplierSortAsc] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState<SupplierEarlyTime | null>(null);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Omit<SupplierEarlyTime, "id">>({
    supplierCode: 0, supplierName: "", subOfficeCode: 999, subOfficeName: "本所", earlyMinutes: 20, isActive: true, memo: "",
  });

  const filteredSupplier = supplierData
    .filter(s =>
      s.supplierName.includes(supplierSearch) ||
      s.subOfficeName.includes(supplierSearch) ||
      String(s.supplierCode).includes(supplierSearch)
    )
    .sort((a, b) => {
      const v = supplierSortAsc ? 1 : -1;
      return (a[supplierSortKey] > b[supplierSortKey] ? 1 : -1) * v;
    });

  function toggleSupplierSort(key: typeof supplierSortKey) {
    if (supplierSortKey === key) setSupplierSortAsc(p => !p);
    else { setSupplierSortKey(key); setSupplierSortAsc(true); }
  }

  function SortIcon({ k }: { k: typeof supplierSortKey }) {
    if (supplierSortKey !== k) return <ChevronUp className="h-3 w-3 text-slate-300" />;
    return supplierSortAsc
      ? <ChevronUp className="h-3 w-3 text-blue-500" />
      : <ChevronDown className="h-3 w-3 text-blue-500" />;
  }

  const filtered = mockDestinations.filter(
    (d) => d.name.includes(searchQuery) || d.prefecture.includes(searchQuery)
  );

  function openNew() {
    setNewRules([{ vehicleType: "4tトラック", thresholdMinutes: 30, multiplier: 0.25 }]);
    setIsNewOpen(true);
  }

  function openEdit(dest: OperationDestination) {
    setEditRules([...dest.rules]);
    setEditingDest({ ...dest });
    setSelectedDest(null);
  }

  function closeNew() {
    setIsNewOpen(false);
    setNewRules([{ vehicleType: "4tトラック", thresholdMinutes: 30, multiplier: 0.25 }]);
  }

  function closeEdit() {
    setEditingDest(null);
    setEditRules([]);
  }

  return (
    <MainLayout title="マスタ管理">
      <div className="space-y-6">
        <MasterSubnav />

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>運行系マスタ</CardTitle>
                <CardDescription>
                  行き先ごとの早出手当ルール（車種別・基本給倍率）を管理します
                </CardDescription>
              </div>
              <Button onClick={openNew}>
                <Plus className="mr-2 h-4 w-4" />
                新規登録
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              <span className="font-semibold">早出手当の計算方式：</span>
              基本給 × 倍率（固定額・等級制ではなく、車種ごとに設定した倍率を基本給に乗じる方式）
            </div>

            <div className="mb-4 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="行き先名・都道府県で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  className="rounded-xl border border-slate-200/70 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setSelectedDest(dest)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="rounded-lg bg-slate-100 p-1.5 mt-0.5 shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm leading-tight">{dest.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{dest.prefecture}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <Badge variant={dest.isActive ? "default" : "secondary"} className="text-[10px]">
                        {dest.isActive ? "有効" : "停止中"}
                      </Badge>
                      <button
                        className="rounded p-1 hover:bg-slate-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); openEdit(dest); }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />標準 {dest.estimatedHours}h</span>
                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{dest.rules.length}車種</span>
                  </div>

                  <div className="space-y-1">
                    {dest.rules.map((rule, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{rule.vehicleType}</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-3 w-3" />{rule.thresholdMinutes}分〜
                          <Percent className="h-3 w-3 ml-1 text-blue-500" />
                          <span className="font-semibold text-blue-700">×{rule.multiplier}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {dest.memo && (
                    <p className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 pt-2">{dest.memo}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">全 {filtered.length} 件</div>
          </CardContent>
        </Card>

        {/* ── 供給先別早出時間マスタ ── */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  供給先別早出時間マスタ
                </CardTitle>
                <CardDescription>供給先・分室ごとの早出時間（分）を管理します（全{supplierData.length}件）</CardDescription>
              </div>
              <Button onClick={() => { setNewSupplier({ supplierCode: 0, supplierName: "", subOfficeCode: 999, subOfficeName: "本所", earlyMinutes: 20, isActive: true, memo: "" }); setIsNewSupplierOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />新規登録
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 凡例 */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">早出時間：</span>
              {[["10〜15分", "bg-slate-100 text-slate-600 border-slate-200"], ["20〜30分", "bg-amber-100 text-amber-700 border-amber-200"], ["40〜50分", "bg-orange-100 text-orange-700 border-orange-200"], ["60分", "bg-red-100 text-red-700 border-red-200"]].map(([label, cls]) => (
                <span key={label} className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${cls}`}>{label}</span>
              ))}
            </div>
            {/* 検索 */}
            <div className="mb-4 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="供給先名・分室名・コードで検索..."
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* テーブル */}
            <div className="rounded-xl border border-slate-200/70 overflow-clip">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap cursor-pointer select-none hover:text-slate-700"
                      onClick={() => toggleSupplierSort("supplierCode")}
                    >
                      <span className="inline-flex items-center gap-1">コード <SortIcon k="supplierCode" /></span>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">供給先名</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">分室</th>
                    <th
                      className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 whitespace-nowrap cursor-pointer select-none hover:text-slate-700"
                      onClick={() => toggleSupplierSort("earlyMinutes")}
                    >
                      <span className="inline-flex items-center gap-1">早出時間 <SortIcon k="earlyMinutes" /></span>
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 whitespace-nowrap">状態</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSupplier.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => setEditingSupplier({ ...s })}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500 whitespace-nowrap">{String(s.supplierCode).padStart(3, "0")}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">{s.supplierName}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs whitespace-nowrap">
                        {s.subOfficeCode === 999 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <span className="font-mono text-[10px] text-slate-400">{s.subOfficeCode}</span>
                            <span>{s.subOfficeName}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${earlyMinutesBadge(s.earlyMinutes)}`}>
                          <Clock className="h-3 w-3" />{s.earlyMinutes}分
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <Badge variant={s.isActive ? "default" : "secondary"} className="text-[10px]">
                          {s.isActive ? "有効" : "停止中"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="rounded p-1 hover:bg-slate-100 transition-colors"
                          onClick={() => setEditingSupplier({ ...s })}
                        >
                          <Pencil className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSupplier.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">該当する供給先が見つかりません</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-slate-400">{filteredSupplier.length} / {supplierData.length} 件表示</div>
          </CardContent>
        </Card>
      </div>

      {/* ── 詳細ポップアップ ── */}
      <Dialog open={!!selectedDest && !editingDest} onOpenChange={(o) => !o && setSelectedDest(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              {selectedDest?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedDest?.prefecture} / 標準所要時間 {selectedDest?.estimatedHours}h
            </DialogDescription>
          </DialogHeader>
          {selectedDest && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50 overflow-clip">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-100/60">
                  <p className="text-xs font-semibold text-slate-600">早出手当ルール（車種別）</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">車種</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">早出基準</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">基本給倍率</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">計算例（¥11,000基本）</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDest.rules.map((rule, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-slate-800 text-xs font-medium whitespace-nowrap">{rule.vehicleType}</td>
                        <td className="px-4 py-2.5 text-center text-xs text-slate-600 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />{rule.thresholdMinutes}分以上
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center text-sm font-bold text-blue-700">× {rule.multiplier}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-slate-600 whitespace-nowrap">
                          ¥{(11000 * rule.multiplier).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedDest.memo && (
                <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  メモ：{selectedDest.memo}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDest(null)}>閉じる</Button>
            <Button onClick={() => selectedDest && openEdit(selectedDest)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />編集
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 編集ダイアログ ── */}
      <Dialog open={!!editingDest} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>行き先を編集</DialogTitle>
            <DialogDescription>{editingDest?.name} の情報を編集します</DialogDescription>
          </DialogHeader>
          {editingDest && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>行き先名</Label>
                  <Input defaultValue={editingDest.name} />
                </div>
                <div className="grid gap-2">
                  <Label>都道府県</Label>
                  <Input defaultValue={editingDest.prefecture} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>標準所要時間（h）</Label>
                  <Input type="number" step="0.5" defaultValue={editingDest.estimatedHours} />
                </div>
                <div className="grid gap-2">
                  <Label>状態</Label>
                  <Select defaultValue={editingDest.isActive ? "active" : "inactive"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">有効</SelectItem>
                      <SelectItem value="inactive">停止中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-slate-500" />
                  早出手当ルール（車種別 · 基本給倍率）
                </Label>
                <RuleEditor rules={editRules} setRules={setEditRules} />
              </div>
              <div className="grid gap-2">
                <Label>メモ</Label>
                <Input defaultValue={editingDest.memo} placeholder="任意メモ" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>キャンセル</Button>
            <Button onClick={closeEdit}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 供給先 編集ダイアログ ── */}
      <Dialog open={!!editingSupplier} onOpenChange={(o) => !o && setEditingSupplier(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              供給先を編集
            </DialogTitle>
            <DialogDescription>早出時間・状態を編集して保存してください</DialogDescription>
          </DialogHeader>
          {editingSupplier && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>供給先コード</Label>
                  <Input type="number" value={editingSupplier.supplierCode} onChange={e => setEditingSupplier(p => p ? { ...p, supplierCode: Number(e.target.value) } : p)} />
                </div>
                <div className="grid gap-2">
                  <Label>供給先名</Label>
                  <Input value={editingSupplier.supplierName} onChange={e => setEditingSupplier(p => p ? { ...p, supplierName: e.target.value } : p)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>分室コード</Label>
                  <Input type="number" value={editingSupplier.subOfficeCode} onChange={e => setEditingSupplier(p => p ? { ...p, subOfficeCode: Number(e.target.value) } : p)} />
                </div>
                <div className="grid gap-2">
                  <Label>分室名称</Label>
                  <Input value={editingSupplier.subOfficeName} onChange={e => setEditingSupplier(p => p ? { ...p, subOfficeName: e.target.value } : p)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" />早出時間（分）</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={5} value={editingSupplier.earlyMinutes} onChange={e => setEditingSupplier(p => p ? { ...p, earlyMinutes: Number(e.target.value) } : p)} className="pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">分</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {[10, 20, 30, 40, 50, 60].map(m => (
                      <button key={m} type="button" onClick={() => setEditingSupplier(p => p ? { ...p, earlyMinutes: m } : p)}
                        className={`rounded px-2 py-0.5 text-xs border transition-colors ${editingSupplier.earlyMinutes === m ? earlyMinutesBadge(m) + " font-semibold" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                        {m}分
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>状態</Label>
                  <Select value={editingSupplier.isActive ? "active" : "inactive"} onValueChange={v => setEditingSupplier(p => p ? { ...p, isActive: v === "active" } : p)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">有効</SelectItem>
                      <SelectItem value="inactive">停止中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>メモ</Label>
                <Input value={editingSupplier.memo} onChange={e => setEditingSupplier(p => p ? { ...p, memo: e.target.value } : p)} placeholder="任意メモ" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSupplier(null)}>キャンセル</Button>
            <Button onClick={() => {
              if (!editingSupplier) return;
              setSupplierData(prev => prev.map(s => s.id === editingSupplier.id ? editingSupplier : s));
              setEditingSupplier(null);
            }}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 供給先 新規登録ダイアログ ── */}
      <Dialog open={isNewSupplierOpen} onOpenChange={(o) => !o && setIsNewSupplierOpen(false)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              供給先を新規登録
            </DialogTitle>
            <DialogDescription>供給先コード・名称・早出時間を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>供給先コード</Label>
                <Input type="number" value={newSupplier.supplierCode || ""} onChange={e => setNewSupplier(p => ({ ...p, supplierCode: Number(e.target.value) }))} placeholder="例: 100" />
              </div>
              <div className="grid gap-2">
                <Label>供給先名</Label>
                <Input value={newSupplier.supplierName} onChange={e => setNewSupplier(p => ({ ...p, supplierName: e.target.value }))} placeholder="例: ○○清掃事務所" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>分室コード</Label>
                <Input type="number" value={newSupplier.subOfficeCode} onChange={e => setNewSupplier(p => ({ ...p, subOfficeCode: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <Label>分室名称</Label>
                <Input value={newSupplier.subOfficeName} onChange={e => setNewSupplier(p => ({ ...p, subOfficeName: e.target.value }))} placeholder="例: 本所" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" />早出時間（分）</Label>
              <div className="relative">
                <Input type="number" min={0} step={5} value={newSupplier.earlyMinutes} onChange={e => setNewSupplier(p => ({ ...p, earlyMinutes: Number(e.target.value) }))} className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">分</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {[10, 20, 30, 40, 50, 60].map(m => (
                  <button key={m} type="button" onClick={() => setNewSupplier(p => ({ ...p, earlyMinutes: m }))}
                    className={`rounded px-2 py-0.5 text-xs border transition-colors ${newSupplier.earlyMinutes === m ? earlyMinutesBadge(m) + " font-semibold" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    {m}分
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>メモ</Label>
              <Input value={newSupplier.memo} onChange={e => setNewSupplier(p => ({ ...p, memo: e.target.value }))} placeholder="任意メモ" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSupplierOpen(false)}>キャンセル</Button>
            <Button onClick={() => {
              const newId = Math.max(...supplierData.map(s => s.id)) + 1;
              setSupplierData(prev => [...prev, { ...newSupplier, id: newId }]);
              setIsNewSupplierOpen(false);
            }}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 新規登録ダイアログ ── */}
      <Dialog open={isNewOpen} onOpenChange={(o) => !o && closeNew()}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>行き先を新規登録</DialogTitle>
            <DialogDescription>行き先と早出手当ルールを設定します</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>行き先名</Label>
                <Input placeholder="例: 東京中央市場" />
              </div>
              <div className="grid gap-2">
                <Label>都道府県</Label>
                <Input placeholder="例: 東京都" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>標準所要時間（h）</Label>
              <Input type="number" step="0.5" placeholder="2.0" />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-slate-500" />
                早出手当ルール（車種別 · 基本給倍率）
              </Label>
              <RuleEditor rules={newRules} setRules={setNewRules} />
            </div>
            <div className="grid gap-2">
              <Label>メモ</Label>
              <Input placeholder="任意メモ" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeNew}>キャンセル</Button>
            <Button onClick={closeNew}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
