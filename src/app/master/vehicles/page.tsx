"use client";

import { useRef, useState } from "react";
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
import { Plus, Pencil, Search, Truck } from "lucide-react";

// 既知の車種名候補（コードはバックエンドのみ、UIには非表示）
const VEHICLE_NAME_SUGGESTIONS = [
  "軽トラック",
  "1tトラック",
  "2tトラック",
  "2t冷蔵トラック",
  "3tトラック",
  "4tトラック",
  "4t冷蔵トラック",
  "8tトラック",
  "10tトラック",
  "10t冷蔵トラック",
  "大型トラック",
  "ウイングトラック",
  "バン",
];

// Mock data（code はバックエンド管理用、UIには表示しない）
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

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

type VehicleType = typeof mockVehicleTypes[0];

function VehicleNameInput({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = VEHICLE_NAME_SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s !== value
  );

  return (
    <div className="relative">
      <Input
        id={id}
        ref={inputRef}
        value={value}
        placeholder={placeholder ?? "例: 4tトラック"}
        autoComplete="off"
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
          {filtered.map((s) => (
            <li
              key={s}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer"
              onMouseDown={() => { onChange(s); setOpen(false); }}
            >
              <Truck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function VehiclesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");

  // フォーム用状態
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");

  const filteredVehicles = mockVehicleTypes.filter((vehicle) => {
    const matchesSearch = vehicle.name.includes(searchQuery);
    const matchesCompany =
      companyFilter === "all" || vehicle.companyId === companyFilter;
    return matchesSearch && matchesCompany;
  });

  return (
    <MainLayout title="マスタ管理">
      <div className="space-y-6">
        <MasterSubnav />
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>車種一覧</CardTitle>
                <CardDescription>
                  会社ごとの車種と表示順を管理します
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setNewName(""); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    新規登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[460px]">
                  <DialogHeader>
                    <DialogTitle>車種を新規登録</DialogTitle>
                    <DialogDescription>
                      車種の情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company">会社</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="会社を選択" />
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
                      <Label htmlFor="vname">車種名</Label>
                      <VehicleNameInput
                        id="vname"
                        value={newName}
                        onChange={setNewName}
                      />
                      <p className="text-xs text-slate-400">候補から選ぶか、直接入力してください</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="displayOrder">表示順</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        placeholder="1"
                        defaultValue={1}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => { setIsDialogOpen(false); setNewName(""); }}
                    >
                      キャンセル
                    </Button>
                    <Button onClick={() => { setIsDialogOpen(false); setNewName(""); }}>
                      登録する
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="車種名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="会社で絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての会社</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table（車種コードは非表示） */}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] whitespace-nowrap">順序</TableHead>
                    <TableHead className="whitespace-nowrap">車種名</TableHead>
                    <TableHead className="whitespace-nowrap">会社</TableHead>
                    <TableHead className="w-[80px] whitespace-nowrap">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="text-center whitespace-nowrap tabular-nums">
                        {vehicle.displayOrder}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{vehicle.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {vehicle.companyName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={vehicle.isActive ? "default" : "secondary"}
                        >
                          {vehicle.isActive ? "有効" : "無効"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingVehicle(vehicle); setEditName(vehicle.name); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              全 {filteredVehicles.length} 件
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 編集ダイアログ（車種コード非表示） */}
      <Dialog open={!!editingVehicle} onOpenChange={(open) => { if (!open) { setEditingVehicle(null); setEditName(""); } }}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>車種を編集</DialogTitle>
            <DialogDescription>
              {editingVehicle?.name} の情報を編集します
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>会社</Label>
              <Select defaultValue={editingVehicle?.companyId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-vname">車種名</Label>
              <VehicleNameInput
                id="edit-vname"
                value={editName}
                onChange={setEditName}
              />
              <p className="text-xs text-slate-400">候補から選ぶか、直接入力してください</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-order">表示順</Label>
              <Input id="edit-order" type="number" defaultValue={editingVehicle?.displayOrder} />
            </div>
            <div className="grid gap-2">
              <Label>状態</Label>
              <Select defaultValue={editingVehicle?.isActive ? "active" : "inactive"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">有効</SelectItem>
                  <SelectItem value="inactive">無効</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingVehicle(null); setEditName(""); }}>キャンセル</Button>
            <Button onClick={() => { setEditingVehicle(null); setEditName(""); }}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
