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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Search, Trash2, Coins } from "lucide-react";

// 社会保険等級（健康保険・厚生年金）。介護保険対象者（40〜64歳）は「介護あり」
const SOCIAL_INSURANCE_GRADES = [
  "1等級（介護なし）", "2等級（介護なし）", "3等級（介護なし）",
  "4等級（介護なし）", "5等級（介護なし）", "6等級（介護なし）",
  "7等級（介護なし）", "8等級（介護なし）", "9等級（介護なし）",
  "10等級（介護なし）", "11等級（介護なし）", "12等級（介護なし）",
  "3等級（介護あり）", "6等級（介護あり）", "10等級（介護あり）",
  "15等級（介護あり）", "20等級（介護あり）",
];

// 雇用保険等級
const EMPLOYMENT_INSURANCE_GRADES = [
  "1等級", "2等級", "3等級", "4等級", "5等級",
  "6等級", "7等級", "8等級", "9等級", "10等級",
  "11等級", "12等級", "13等級",
];

interface Allowance {
  id: string;
  name: string;
  amount: number;
  isContinuous: boolean; // オンだと毎日自動付与
}

// Mock data
const mockWorkers = [
  {
    id: "1",
    employeeCode: "E001",
    name: "山田 太郎",
    nameKana: "ヤマダ タロウ",
    defaultCompany: "A運輸株式会社",
    phone: "090-1234-5678",
    isActive: true,
    socialInsuranceGrade: "6等級（介護なし）",
    employmentInsuranceGrade: "4等級",
    allowances: [
      { id: "a1", name: "皆勤手当", amount: 5000, isContinuous: true },
      { id: "a2", name: "リーダー手当", amount: 3000, isContinuous: true },
    ] as Allowance[],
  },
  {
    id: "2",
    employeeCode: "E002",
    name: "鈴木 一郎",
    nameKana: "スズキ イチロウ",
    defaultCompany: "A運輸株式会社",
    phone: "090-2345-6789",
    isActive: true,
    socialInsuranceGrade: "3等級（介護なし）",
    employmentInsuranceGrade: "2等級",
    allowances: [
      { id: "a3", name: "資格手当", amount: 2000, isContinuous: true },
    ] as Allowance[],
  },
  {
    id: "3",
    employeeCode: "E003",
    name: "佐藤 花子",
    nameKana: "サトウ ハナコ",
    defaultCompany: "B物流株式会社",
    phone: "090-3456-7890",
    isActive: true,
    socialInsuranceGrade: "10等級（介護あり）",
    employmentInsuranceGrade: "7等級",
    allowances: [] as Allowance[],
  },
  {
    id: "4",
    employeeCode: "E004",
    name: "高橋 健二",
    nameKana: "タカハシ ケンジ",
    defaultCompany: "A運輸株式会社",
    phone: "090-4567-8901",
    isActive: true,
    socialInsuranceGrade: "6等級（介護あり）",
    employmentInsuranceGrade: "5等級",
    allowances: [
      { id: "a4", name: "早出手当（固定）", amount: 1500, isContinuous: false },
    ] as Allowance[],
  },
  {
    id: "5",
    employeeCode: "E005",
    name: "田中 美咲",
    nameKana: "タナカ ミサキ",
    defaultCompany: "C配送センター",
    phone: "090-5678-9012",
    isActive: false,
    socialInsuranceGrade: "3等級（介護なし）",
    employmentInsuranceGrade: "2等級",
    allowances: [] as Allowance[],
  },
];

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

type Worker = typeof mockWorkers[0];

function AllowanceEditor({
  allowances,
  onChange,
}: {
  allowances: Allowance[];
  onChange: (a: Allowance[]) => void;
}) {
  function addRow() {
    onChange([...allowances, { id: `new-${Date.now()}`, name: "", amount: 0, isContinuous: false }]);
  }
  function removeRow(idx: number) {
    onChange(allowances.filter((_, i) => i !== idx));
  }
  function update(idx: number, key: keyof Allowance, value: string | number | boolean) {
    onChange(allowances.map((a, i) => (i === idx ? { ...a, [key]: value } : a)));
  }

  return (
    <div className="space-y-2">
      {allowances.map((a, idx) => (
        <div key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
          <Input
            value={a.name}
            onChange={(e) => update(idx, "name", e.target.value)}
            placeholder="手当名"
            className="h-8 text-xs flex-1 min-w-[100px]"
          />
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">¥</span>
            <Input
              type="number"
              value={a.amount || ""}
              onChange={(e) => update(idx, "amount", Number(e.target.value))}
              placeholder="金額"
              className="h-8 text-xs w-[100px] pl-5"
            />
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
            <Checkbox
              checked={a.isContinuous}
              onCheckedChange={(v) => update(idx, "isContinuous", !!v)}
              className="h-3.5 w-3.5"
            />
            <span className="text-[11px] text-slate-600 whitespace-nowrap">継続</span>
          </label>
          <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 p-0.5 shrink-0">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="text-xs gap-1" onClick={addRow}>
        <Plus className="h-3.5 w-3.5" />手当を追加
      </Button>
      {allowances.some((a) => a.isContinuous) && (
        <p className="text-[11px] text-green-600">「継続」がオンの手当は毎日自動的に付与されます</p>
      )}
    </div>
  );
}

export default function WorkersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAllowances, setNewAllowances] = useState<Allowance[]>([]);
  const [editAllowances, setEditAllowances] = useState<Allowance[]>([]);

  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      worker.name.includes(searchQuery) ||
      worker.nameKana.includes(searchQuery) ||
      worker.employeeCode.includes(searchQuery)
  );

  return (
    <MainLayout title="マスタ管理">
      <div className="space-y-6">
        <MasterSubnav />
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>作業員一覧</CardTitle>
                <CardDescription>
                  日雇い作業員の情報を管理します
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    新規登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>作業員を新規登録</DialogTitle>
                    <DialogDescription>
                      作業員の情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="employeeCode">従業員番号</Label>
                      <Input id="employeeCode" placeholder="例: E001" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">氏名</Label>
                        <Input id="name" placeholder="例: 山田 太郎" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nameKana">フリガナ</Label>
                        <Input id="nameKana" placeholder="例: ヤマダ タロウ" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="defaultCompany">主な派遣先</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">電話番号</Label>
                      <Input id="phone" placeholder="例: 090-1234-5678" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="socialInsuranceGrade">社会保険等級</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                          <SelectContent>
                            {SOCIAL_INSURANCE_GRADES.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="employmentInsuranceGrade">雇用保険等級</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                          <SelectContent>
                            {EMPLOYMENT_INSURANCE_GRADES.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 mt-1">
                      <Label className="flex items-center gap-1.5 mb-2">
                        <Coins className="h-3.5 w-3.5 text-slate-500" />
                        手当設定
                      </Label>
                      <AllowanceEditor allowances={newAllowances} onChange={setNewAllowances} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => { setIsDialogOpen(false); setNewAllowances([]); }}
                    >
                      キャンセル
                    </Button>
                    <Button onClick={() => { setIsDialogOpen(false); setNewAllowances([]); }}>
                      登録する
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="氏名・従業員番号で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] whitespace-nowrap">従業員番号</TableHead>
                    <TableHead className="whitespace-nowrap">氏名</TableHead>
                    <TableHead className="whitespace-nowrap">フリガナ</TableHead>
                    <TableHead className="whitespace-nowrap">主な派遣先</TableHead>
                    <TableHead className="whitespace-nowrap">電話番号</TableHead>
                    <TableHead className="whitespace-nowrap">社会保険等級</TableHead>
                    <TableHead className="whitespace-nowrap">雇用保険等級</TableHead>
                    <TableHead className="whitespace-nowrap">手当</TableHead>
                    <TableHead className="w-[80px] whitespace-nowrap">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-mono whitespace-nowrap tabular-nums">
                        {worker.employeeCode}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{worker.name}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {worker.nameKana}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{worker.defaultCompany}</TableCell>
                      <TableCell className="whitespace-nowrap">{worker.phone}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${worker.socialInsuranceGrade.includes("介護あり") ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600"}`}>
                          {worker.socialInsuranceGrade}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                          {worker.employmentInsuranceGrade}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {worker.allowances.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {worker.allowances.map((a) => (
                              <span key={a.id} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${a.isContinuous ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-slate-100 text-slate-600"}`}>
                                {a.name} ¥{a.amount.toLocaleString()}
                                {a.isContinuous && <span className="text-[9px]">継続</span>}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={worker.isActive ? "default" : "secondary"}
                        >
                          {worker.isActive ? "有効" : "無効"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingWorker(worker); setEditAllowances([...worker.allowances]); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination info */}
            <div className="mt-4 text-sm text-muted-foreground">
              全 {filteredWorkers.length} 件
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 編集ダイアログ */}
      <Dialog open={!!editingWorker} onOpenChange={(open) => { if (!open) { setEditingWorker(null); setEditAllowances([]); } }}>
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>作業員を編集</DialogTitle>
            <DialogDescription>
              {editingWorker?.name} の情報を編集します
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-empcode">従業員番号</Label>
              <Input id="edit-empcode" defaultValue={editingWorker?.employeeCode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-wname">氏名</Label>
                <Input id="edit-wname" defaultValue={editingWorker?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-wkana">フリガナ</Label>
                <Input id="edit-wkana" defaultValue={editingWorker?.nameKana} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>主な派遣先</Label>
              <Select defaultValue={editingWorker?.defaultCompany}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">電話番号</Label>
              <Input id="edit-phone" defaultValue={editingWorker?.phone} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>社会保険等級</Label>
                <Select defaultValue={editingWorker?.socialInsuranceGrade}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SOCIAL_INSURANCE_GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>雇用保険等級</Label>
                <Select defaultValue={editingWorker?.employmentInsuranceGrade}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_INSURANCE_GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>状態</Label>
              <Select defaultValue={editingWorker?.isActive ? "active" : "inactive"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">有効</SelectItem>
                  <SelectItem value="inactive">無効</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-1">
              <Label className="flex items-center gap-1.5 mb-2">
                <Coins className="h-3.5 w-3.5 text-slate-500" />
                手当設定
              </Label>
              <AllowanceEditor allowances={editAllowances} onChange={setEditAllowances} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingWorker(null); setEditAllowances([]); }}>キャンセル</Button>
            <Button onClick={() => { setEditingWorker(null); setEditAllowances([]); }}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
