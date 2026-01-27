"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Search } from "lucide-react";

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
  },
  {
    id: "2",
    employeeCode: "E002",
    name: "鈴木 一郎",
    nameKana: "スズキ イチロウ",
    defaultCompany: "A運輸株式会社",
    phone: "090-2345-6789",
    isActive: true,
  },
  {
    id: "3",
    employeeCode: "E003",
    name: "佐藤 花子",
    nameKana: "サトウ ハナコ",
    defaultCompany: "B物流株式会社",
    phone: "090-3456-7890",
    isActive: true,
  },
  {
    id: "4",
    employeeCode: "E004",
    name: "高橋 健二",
    nameKana: "タカハシ ケンジ",
    defaultCompany: "A運輸株式会社",
    phone: "090-4567-8901",
    isActive: true,
  },
  {
    id: "5",
    employeeCode: "E005",
    name: "田中 美咲",
    nameKana: "タナカ ミサキ",
    defaultCompany: "C配送センター",
    phone: "090-5678-9012",
    isActive: false,
  },
];

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

export default function WorkersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      worker.name.includes(searchQuery) ||
      worker.nameKana.includes(searchQuery) ||
      worker.employeeCode.includes(searchQuery)
  );

  return (
    <MainLayout title="作業員マスタ">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
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
                <DialogContent className="sm:max-w-[500px]">
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
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">従業員番号</TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead>フリガナ</TableHead>
                    <TableHead>主な派遣先</TableHead>
                    <TableHead>電話番号</TableHead>
                    <TableHead className="w-[80px]">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-mono">
                        {worker.employeeCode}
                      </TableCell>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {worker.nameKana}
                      </TableCell>
                      <TableCell>{worker.defaultCompany}</TableCell>
                      <TableCell>{worker.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={worker.isActive ? "default" : "secondary"}
                        >
                          {worker.isActive ? "有効" : "無効"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
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
    </MainLayout>
  );
}
