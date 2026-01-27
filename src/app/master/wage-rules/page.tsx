"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
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
import { Plus, Pencil, Search, DollarSign, Calendar } from "lucide-react";

// Mock data
const mockWageRules = [
  {
    id: "1",
    companyId: "1",
    companyName: "A運輸株式会社",
    vehicleTypeId: "1",
    vehicleTypeName: "2tトラック",
    baseDailyWage: 10000,
    baseHours: 8,
    overtimeRateNormal: 1400,
    overtimeRateLate: 1750,
    overtimeRateHoliday: 1750,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
  {
    id: "2",
    companyId: "1",
    companyName: "A運輸株式会社",
    vehicleTypeId: "2",
    vehicleTypeName: "4tトラック",
    baseDailyWage: 11000,
    baseHours: 8,
    overtimeRateNormal: 1500,
    overtimeRateLate: 1875,
    overtimeRateHoliday: 1875,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
  {
    id: "3",
    companyId: "1",
    companyName: "A運輸株式会社",
    vehicleTypeId: "3",
    vehicleTypeName: "10tトラック",
    baseDailyWage: 13000,
    baseHours: 8,
    overtimeRateNormal: 1800,
    overtimeRateLate: 2250,
    overtimeRateHoliday: 2250,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
  {
    id: "4",
    companyId: "2",
    companyName: "B物流株式会社",
    vehicleTypeId: "4",
    vehicleTypeName: "2tトラック",
    baseDailyWage: 9500,
    baseHours: 8,
    overtimeRateNormal: 1300,
    overtimeRateLate: 1625,
    overtimeRateHoliday: 1625,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
  {
    id: "5",
    companyId: "2",
    companyName: "B物流株式会社",
    vehicleTypeId: "5",
    vehicleTypeName: "4tトラック",
    baseDailyWage: 10500,
    baseHours: 8,
    overtimeRateNormal: 1450,
    overtimeRateLate: 1815,
    overtimeRateHoliday: 1815,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
  {
    id: "6",
    companyId: "3",
    companyName: "C配送センター",
    vehicleTypeId: "7",
    vehicleTypeName: "2tトラック",
    baseDailyWage: 9000,
    baseHours: 8,
    overtimeRateNormal: 1250,
    overtimeRateLate: 1565,
    overtimeRateHoliday: 1565,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: null,
    isActive: true,
  },
];

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WageRulesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");

  const filteredRules = mockWageRules.filter((rule) => {
    const matchesSearch =
      rule.companyName.includes(searchQuery) ||
      rule.vehicleTypeName.includes(searchQuery);
    const matchesCompany =
      companyFilter === "all" || rule.companyId === companyFilter;
    return matchesSearch && matchesCompany;
  });

  return (
    <MainLayout title="賃金ルール">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>賃金ルール一覧</CardTitle>
                <CardDescription>
                  会社・車種ごとの基本給・残業単価を管理します
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    新規登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>賃金ルールを新規登録</DialogTitle>
                    <DialogDescription>
                      会社・車種の組み合わせに対する賃金ルールを設定します
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>会社</Label>
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
                        <Label>車種</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="車種を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2t">2tトラック</SelectItem>
                            <SelectItem value="4t">4tトラック</SelectItem>
                            <SelectItem value="10t">10tトラック</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>適用開始日</Label>
                        <Input type="date" defaultValue="2024-01-01" />
                      </div>
                      <div className="grid gap-2">
                        <Label>適用終了日（任意）</Label>
                        <Input type="date" />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">基本給</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>日給（円）</Label>
                          <Input type="number" placeholder="11000" />
                        </div>
                        <div className="grid gap-2">
                          <Label>基本労働時間</Label>
                          <Input type="number" placeholder="8" step="0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">残業単価（円/時間）</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label>通常</Label>
                          <Input type="number" placeholder="1500" />
                        </div>
                        <div className="grid gap-2">
                          <Label>深夜（22-5時）</Label>
                          <Input type="number" placeholder="1875" />
                        </div>
                        <div className="grid gap-2">
                          <Label>休日</Label>
                          <Input type="number" placeholder="1875" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">備考</h4>
                      <Input placeholder="ルールに関するメモ（任意）" />
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
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="会社名・車種で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-[200px]">
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

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>会社</TableHead>
                    <TableHead>車種</TableHead>
                    <TableHead className="text-right">基本日給</TableHead>
                    <TableHead className="text-right">残業単価</TableHead>
                    <TableHead>適用期間</TableHead>
                    <TableHead className="w-[80px]">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        {rule.companyName}
                      </TableCell>
                      <TableCell>{rule.vehicleTypeName}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(rule.baseDailyWage)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          <span className="font-mono">
                            {formatCurrency(rule.overtimeRateNormal)}
                          </span>
                          <span className="text-muted-foreground">/h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(rule.effectiveFrom, "yyyy/MM/dd")}〜
                          {rule.effectiveTo
                            ? format(rule.effectiveTo, "yyyy/MM/dd")
                            : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rule.isActive ? "default" : "secondary"}
                        >
                          {rule.isActive ? "有効" : "無効"}
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

            <div className="mt-4 text-sm text-muted-foreground">
              全 {filteredRules.length} 件
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
