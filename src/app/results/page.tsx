"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import {
  CalendarIcon,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const mockResults = [
  {
    id: "1",
    workDate: new Date("2024-01-28"),
    workerName: "山田 太郎",
    company: "A運輸",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "19:30",
    workHours: 10.5,
    overtimeHours: 2.5,
    baseWage: 11000,
    overtimeWage: 3750,
    totalWage: 14750,
    status: "confirmed" as Status,
    hasWarning: false,
  },
  {
    id: "2",
    workDate: new Date("2024-01-28"),
    workerName: "鈴木 一郎",
    company: "A運輸",
    vehicleType: "2t",
    startTime: "07:00",
    endTime: "18:00",
    workHours: 10,
    overtimeHours: 2,
    baseWage: 10000,
    overtimeWage: 2800,
    totalWage: 12800,
    status: "confirmed" as Status,
    hasWarning: false,
  },
  {
    id: "3",
    workDate: new Date("2024-01-28"),
    workerName: "佐藤 花子",
    company: "B物流",
    vehicleType: "10t",
    startTime: "06:00",
    endTime: "20:00",
    workHours: 12.5,
    overtimeHours: 4.5,
    baseWage: 13000,
    overtimeWage: 6750,
    totalWage: 19750,
    status: "calculated" as Status,
    hasWarning: true,
    warningMessage: "拘束14時間超",
  },
  {
    id: "4",
    workDate: new Date("2024-01-28"),
    workerName: "高橋 健二",
    company: "A運輸",
    vehicleType: "4t",
    startTime: "08:30",
    endTime: "17:30",
    workHours: 8,
    overtimeHours: 0,
    baseWage: 11000,
    overtimeWage: 0,
    totalWage: 11000,
    status: "confirmed" as Status,
    hasWarning: false,
  },
  {
    id: "5",
    workDate: new Date("2024-01-28"),
    workerName: "田中 美咲",
    company: "C配送",
    vehicleType: "2t",
    startTime: "09:00",
    endTime: "21:00",
    workHours: 11,
    overtimeHours: 3,
    baseWage: 10000,
    overtimeWage: 4200,
    totalWage: 14200,
    status: "calculated" as Status,
    hasWarning: true,
    warningMessage: "手動調整あり",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ResultsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.workerName.includes(searchQuery) ||
      result.company.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredResults.reduce((sum, r) => sum + r.totalWage, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredResults.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleConfirmSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("確定する項目を選択してください");
      return;
    }
    toast.success(`${selectedIds.length}件を確定しました`);
    setSelectedIds([]);
  };

  const handleRecalculateSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("再計算する項目を選択してください");
      return;
    }
    toast.success(`${selectedIds.length}件を再計算しました`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    toast.success("CSVファイルをダウンロードしました");
  };

  return (
    <MainLayout title="計算結果">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>計算結果一覧</CardTitle>
                <CardDescription>
                  計算結果の確認・確定・修正を行います
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV出力
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "yyyy年M月d日", { locale: ja })
                      : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="作業員名・会社名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="calculated">計算済</SelectItem>
                  <SelectItem value="confirmed">確定</SelectItem>
                  <SelectItem value="paid">支払済</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-3">
                <span className="text-sm font-medium">
                  {selectedIds.length}件選択中
                </span>
                <Button size="sm" onClick={handleConfirmSelected}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  一括確定
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRecalculateSelected}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  再計算
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedIds.length === filteredResults.length &&
                          filteredResults.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead>会社</TableHead>
                    <TableHead>車種</TableHead>
                    <TableHead className="text-right">出勤</TableHead>
                    <TableHead className="text-right">退勤</TableHead>
                    <TableHead className="text-right">残業</TableHead>
                    <TableHead className="text-right">合計</TableHead>
                    <TableHead>状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow
                      key={result.id}
                      className={cn(result.hasWarning && "bg-amber-50")}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(result.id)}
                          onCheckedChange={(checked) =>
                            handleSelect(result.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.workerName}</span>
                          {result.hasWarning && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        {result.hasWarning && (
                          <p className="text-xs text-amber-600">
                            {result.warningMessage}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{result.company}</TableCell>
                      <TableCell>{result.vehicleType}</TableCell>
                      <TableCell className="text-right font-mono">
                        {result.startTime}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {result.endTime}
                      </TableCell>
                      <TableCell className="text-right">
                        {result.overtimeHours.toFixed(1)}h
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(result.totalWage)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={result.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex gap-6 text-sm">
                <span>全 {filteredResults.length} 件</span>
                <span>
                  確定:{" "}
                  {
                    filteredResults.filter((r) => r.status === "confirmed")
                      .length
                  }
                  件
                </span>
                <span>
                  未確定:{" "}
                  {
                    filteredResults.filter((r) => r.status === "calculated")
                      .length
                  }
                  件
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">合計金額</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
