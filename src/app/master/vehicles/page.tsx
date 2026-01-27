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
import { Plus, Pencil, Search, Truck } from "lucide-react";

// Mock data
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

export default function VehiclesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");

  const filteredVehicles = mockVehicleTypes.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.includes(searchQuery) || vehicle.code.includes(searchQuery);
    const matchesCompany =
      companyFilter === "all" || vehicle.companyId === companyFilter;
    return matchesSearch && matchesCompany;
  });

  return (
    <MainLayout title="車種マスタ">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>車種一覧</CardTitle>
                <CardDescription>
                  会社ごとの車種と表示順を管理します
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="code">車種コード</Label>
                        <Input id="code" placeholder="例: 4T" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">車種名</Label>
                        <Input id="name" placeholder="例: 4tトラック" />
                      </div>
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
                  placeholder="車種名・コードで検索..."
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
                    <TableHead className="w-[60px]">順序</TableHead>
                    <TableHead className="w-[100px]">コード</TableHead>
                    <TableHead>車種名</TableHead>
                    <TableHead>会社</TableHead>
                    <TableHead className="w-[80px]">状態</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="text-center">
                        {vehicle.displayOrder}
                      </TableCell>
                      <TableCell className="font-mono">{vehicle.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{vehicle.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {vehicle.companyName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={vehicle.isActive ? "default" : "secondary"}
                        >
                          {vehicle.isActive ? "有効" : "無効"}
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
              全 {filteredVehicles.length} 件
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
