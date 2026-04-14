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
import { Plus, Pencil, Search, MapPin, Clock, Percent, Truck } from "lucide-react";

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
