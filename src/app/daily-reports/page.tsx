"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { Plus, Search, CalendarIcon, Pencil, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const initialMockReports = [
  {
    id: "1",
    workDate: new Date("2024-01-28"),
    workerName: "山田 太郎",
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "19:30",
    breakMinutes: 60,
    status: "submitted" as Status,
    submittedAt: new Date("2024-01-28T19:35:00"),
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
    status: "submitted" as Status,
    submittedAt: new Date("2024-01-28T18:05:00"),
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
    status: "approved" as Status,
    submittedAt: new Date("2024-01-28T20:10:00"),
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
    submittedAt: null,
  },
  {
    id: "5",
    workDate: new Date("2024-01-28"),
    workerName: "田中 美咲",
    company: "C配送センター",
    vehicleType: "2t",
    startTime: "09:00",
    endTime: "18:00",
    breakMinutes: 60,
    status: "rejected" as Status,
    submittedAt: new Date("2024-01-28T18:15:00"),
    rejectionReason: "休憩時間が実際と異なります",
  },
];

export default function DailyReportsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reports, setReports] = useState(initialMockReports);
  
  // 却下ダイアログ用
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.workerName.includes(searchQuery) ||
      report.company.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 承認処理
  const handleApprove = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: "approved" as Status } : r
    ));
    toast.success("日報を承認しました");
  };

  // 却下ダイアログを開く
  const openRejectDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  // 却下処理
  const handleReject = () => {
    if (!selectedReportId || !rejectionReason.trim()) {
      toast.error("却下理由を入力してください");
      return;
    }
    setReports(prev => prev.map(r => 
      r.id === selectedReportId 
        ? { ...r, status: "rejected" as Status, rejectionReason: rejectionReason } 
        : r
    ));
    setRejectDialogOpen(false);
    setSelectedReportId(null);
    setRejectionReason("");
    toast.success("日報を却下しました");
  };

  // 承認待ち件数
  const pendingCount = reports.filter(r => r.status === "submitted").length;

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
                  <SelectItem value="submitted">承認待ち</SelectItem>
                  <SelectItem value="approved">承認済</SelectItem>
                  <SelectItem value="rejected">却下</SelectItem>
                  <SelectItem value="calculated">計算済</SelectItem>
                  <SelectItem value="confirmed">確定</SelectItem>
                </SelectContent>
              </Select>
              
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  承認待ち {pendingCount}件
                </div>
              )}
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
                    <TableHead className="w-[180px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className={cn(
                      report.status === "submitted" && "bg-yellow-50",
                      report.status === "rejected" && "bg-red-50"
                    )}>
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
                        <div className="flex items-center gap-1">
                          {report.status === "submitted" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                                onClick={() => handleApprove(report.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                承認
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                onClick={() => openRejectDialog(report.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                却下
                              </Button>
                            </>
                          )}
                          <Link href={`/daily-reports/${report.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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
                  承認待ち:{" "}
                  {filteredReports.filter((r) => r.status === "submitted").length}件
                </span>
                <span>
                  承認済:{" "}
                  {filteredReports.filter((r) => r.status === "approved").length}件
                </span>
                <span>
                  却下:{" "}
                  {filteredReports.filter((r) => r.status === "rejected").length}件
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 却下理由入力ダイアログ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>日報を却下</DialogTitle>
            <DialogDescription>
              却下理由を入力してください。運転手に通知されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">却下理由</Label>
              <Input
                id="rejectionReason"
                placeholder="例: 退勤時間が実際と異なります"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              キャンセル
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              却下する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
