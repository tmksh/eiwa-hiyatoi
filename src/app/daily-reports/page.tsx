"use client";

import { useState } from "react";
import Link from "next/link";
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
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { Plus, Search, CalendarIcon, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockReports = [
  {
    id: "1",
    workDate: new Date("2024-01-28"),
    workerName: "山田 太郎",
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "19:30",
    breakMinutes: 60,
    status: "calculated" as Status,
  },
  {
    id: "2",
    workDate: new Date("2024-01-28"),
    workerName: "鈴木 一郎",
    company: "A運輸株式会社",
    vehicleType: "2t",
    startTime: "07:00",
    endTime: "18:00",
    breakMinutes: 60,
    status: "confirmed" as Status,
  },
  {
    id: "3",
    workDate: new Date("2024-01-28"),
    workerName: "佐藤 花子",
    company: "B物流株式会社",
    vehicleType: "10t",
    startTime: "06:00",
    endTime: "20:00",
    breakMinutes: 90,
    status: "draft" as Status,
  },
  {
    id: "4",
    workDate: new Date("2024-01-28"),
    workerName: "高橋 健二",
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:30",
    endTime: "17:30",
    breakMinutes: 60,
    status: "draft" as Status,
  },
];

export default function DailyReportsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.workerName.includes(searchQuery) ||
      report.company.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout title="日報管理">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>日報一覧</CardTitle>
                <CardDescription>
                  日々の勤務記録を管理します
                </CardDescription>
              </div>
              <Link href="/daily-reports/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  日報を入力
                </Button>
              </Link>
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
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="calculated">計算済</SelectItem>
                  <SelectItem value="confirmed">確定</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>作業員</TableHead>
                    <TableHead>会社</TableHead>
                    <TableHead>車種</TableHead>
                    <TableHead>出勤</TableHead>
                    <TableHead>退勤</TableHead>
                    <TableHead>休憩</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.workerName}
                      </TableCell>
                      <TableCell>{report.company}</TableCell>
                      <TableCell>{report.vehicleType}</TableCell>
                      <TableCell className="font-mono">
                        {report.startTime}
                      </TableCell>
                      <TableCell className="font-mono">
                        {report.endTime}
                      </TableCell>
                      <TableCell>{report.breakMinutes}分</TableCell>
                      <TableCell>
                        <StatusBadge status={report.status} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/daily-reports/${report.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>全 {filteredReports.length} 件</span>
              <div className="flex gap-4">
                <span>
                  下書き:{" "}
                  {filteredReports.filter((r) => r.status === "draft").length}件
                </span>
                <span>
                  計算済:{" "}
                  {
                    filteredReports.filter((r) => r.status === "calculated")
                      .length
                  }
                  件
                </span>
                <span>
                  確定:{" "}
                  {
                    filteredReports.filter((r) => r.status === "confirmed")
                      .length
                  }
                  件
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
