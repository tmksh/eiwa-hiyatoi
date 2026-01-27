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

// Mock data - will be replaced with actual data from DB
const mockCompanies = [
  {
    id: "1",
    code: "A001",
    name: "A運輸株式会社",
    overtimeUnit: 15,
    roundingMethod: "floor",
    isActive: true,
  },
  {
    id: "2",
    code: "B001",
    name: "B物流株式会社",
    overtimeUnit: 10,
    roundingMethod: "round",
    isActive: true,
  },
  {
    id: "3",
    code: "C001",
    name: "C配送センター",
    overtimeUnit: 5,
    roundingMethod: "ceil",
    isActive: true,
  },
  {
    id: "4",
    code: "D001",
    name: "D輸送株式会社",
    overtimeUnit: 15,
    roundingMethod: "floor",
    isActive: false,
  },
];

const roundingMethodLabels: Record<string, string> = {
  floor: "切り捨て",
  ceil: "切り上げ",
  round: "四捨五入",
};

export default function CompaniesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = mockCompanies.filter(
    (company) =>
      company.name.includes(searchQuery) || company.code.includes(searchQuery)
  );

  return (
    <MainLayout title="会社マスタ">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>会社一覧</CardTitle>
                <CardDescription>
                  派遣先会社の情報と残業計算ルールを管理します
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
                    <DialogTitle>会社を新規登録</DialogTitle>
                    <DialogDescription>
                      派遣先会社の情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">会社コード</Label>
                      <Input id="code" placeholder="例: A001" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">会社名</Label>
                      <Input id="name" placeholder="例: A運輸株式会社" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="overtimeUnit">残業計算単位（分）</Label>
                        <Select defaultValue="15">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5分</SelectItem>
                            <SelectItem value="10">10分</SelectItem>
                            <SelectItem value="15">15分</SelectItem>
                            <SelectItem value="30">30分</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="roundingMethod">端数処理</Label>
                        <Select defaultValue="floor">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
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
                  placeholder="会社名・コードで検索..."
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
                    <TableHead className="w-[100px]">コード</TableHead>
                    <TableHead>会社名</TableHead>
                    <TableHead className="w-[120px]">残業単位</TableHead>
                    <TableHead className="w-[120px]">端数処理</TableHead>
                    <TableHead className="w-[80px]">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-mono">{company.code}</TableCell>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>{company.overtimeUnit}分</TableCell>
                      <TableCell>
                        {roundingMethodLabels[company.roundingMethod]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={company.isActive ? "default" : "secondary"}
                        >
                          {company.isActive ? "有効" : "無効"}
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
