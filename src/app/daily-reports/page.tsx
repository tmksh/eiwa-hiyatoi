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

type Report = {
  id: string;
  workDate: Date;
  workerName: string;
  company: string;
  vehicleType: string;
  category: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  status: Status;
  submittedAt: Date | null;
  rejectionReason?: string;
};

const initialMockReports: Report[] = [
  { id: "1", workDate: new Date("2024-01-28"), workerName: "山田 太郎", company: "A運輸株式会社", vehicleType: "4t", category: "運搬", startTime: "08:00", endTime: "19:30", breakMinutes: 60, status: "submitted" as Status, submittedAt: new Date("2024-01-28T19:35:00") },
  { id: "2", workDate: new Date("2024-01-28"), workerName: "鈴木 一郎", company: "A運輸株式会社", vehicleType: "2t", category: "荷揚げ", startTime: "07:00", endTime: "18:00", breakMinutes: 60, status: "submitted" as Status, submittedAt: new Date("2024-01-28T18:05:00") },
  { id: "3", workDate: new Date("2024-01-28"), workerName: "佐藤 花子", company: "B物流株式会社", vehicleType: "10t", category: "仕分け", startTime: "06:00", endTime: "20:00", breakMinutes: 90, status: "approved" as Status, submittedAt: new Date("2024-01-28T20:10:00") },
  { id: "4", workDate: new Date("2024-01-28"), workerName: "高橋 健二", company: "A運輸株式会社", vehicleType: "4t", category: "運搬", startTime: "08:30", endTime: "17:30", breakMinutes: 60, status: "draft" as Status, submittedAt: null },
  { id: "5", workDate: new Date("2024-01-28"), workerName: "田中 美咲", company: "C配送センター", vehicleType: "2t", category: "検品", startTime: "09:00", endTime: "18:00", breakMinutes: 60, status: "rejected" as Status, submittedAt: new Date("2024-01-28T18:15:00"), rejectionReason: "休憩時間が実際と異なります" },
  { id: "6", workDate: new Date("2024-01-29"), workerName: "未確定", company: "A運輸株式会社", vehicleType: "4t", category: "運搬", startTime: "08:00", endTime: "", breakMinutes: 60, status: "draft" as Status, submittedAt: null },
];

export default function DailyReportsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reports, setReports] = useState<Report[]>(initialMockReports);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.workerName.includes(searchQuery) || report.company.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "approved" as Status } : r));
    toast.success("日報を承認しました");
  };

  const openRejectDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (!selectedReportId || !rejectionReason.trim()) {
      toast.error("却下理由を入力してください");
      return;
    }
    setReports(prev => prev.map(r => r.id === selectedReportId ? { ...r, status: "rejected" as Status, rejectionReason } : r));
    setRejectDialogOpen(false);
    setSelectedReportId(null);
    setRejectionReason("");
    toast.success("日報を却下しました");
  };

  const pendingCount = reports.filter(r => r.status === "submitted").length;

  return (
    <MainLayout title="勤怠・労務">
      <div className="space-y-6">
        {/* No.22: 入力フロー案内 */}
        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 font-medium">① 日付を選択</span>
          <span>→</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 font-medium">② 車両リストを確認</span>
          <span>→</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 font-medium">③ 担当者名を入力（未確定も可）</span>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>日報一覧</CardTitle>
                <CardDescription>日々の勤務・作業記録を管理します。OCR読取り機能対応</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link href="/daily-reports/new" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    日報を入力
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full sm:w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy年M月d日", { locale: ja }) : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
              <div className="relative flex-1 min-w-0 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="作業員名・会社名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
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
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium whitespace-nowrap">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  承認待ち {pendingCount}件
                </div>
              )}
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">作業員</TableHead>
                    <TableHead className="whitespace-nowrap">会社</TableHead>
                    <TableHead className="whitespace-nowrap">車種</TableHead>
                    <TableHead className="whitespace-nowrap">作業区分</TableHead>
                    {/* No.23: 出退勤 → 日当ベース表記 */}
                    <TableHead className="whitespace-nowrap">開始時刻</TableHead>
                    <TableHead className="whitespace-nowrap">終了時刻</TableHead>
                    <TableHead className="whitespace-nowrap">休憩</TableHead>
                    <TableHead className="whitespace-nowrap">ステータス</TableHead>
                    <TableHead className="w-[180px] whitespace-nowrap">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className={cn(report.status === "submitted" && "bg-blue-50", report.status === "rejected" && "bg-slate-100")}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {/* No.19: 未確定表示 */}
                        {report.workerName === "未確定" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">未確定</span>
                        ) : report.workerName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{report.company}</TableCell>
                      <TableCell className="whitespace-nowrap">{report.vehicleType}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {report.category && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{report.category}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono whitespace-nowrap">{report.startTime}</TableCell>
                      <TableCell className="font-mono whitespace-nowrap">{report.endTime}</TableCell>
                      <TableCell className="whitespace-nowrap">{report.breakMinutes}分</TableCell>
                      <TableCell><StatusBadge status={report.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {report.status === "submitted" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700 hover:bg-slate-100" onClick={() => handleApprove(report.id)}>
                                <Check className="h-4 w-4 mr-1" />承認
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700 hover:bg-slate-200" onClick={() => openRejectDialog(report.id)}>
                                <X className="h-4 w-4 mr-1" />却下
                              </Button>
                            </>
                          )}
                          <Link href={`/daily-reports/${report.id}/edit`}>
                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
              <span>全 {filteredReports.length} 件</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <span className="whitespace-nowrap">承認待ち: {filteredReports.filter((r) => r.status === "submitted").length}件</span>
                <span className="whitespace-nowrap">承認済: {filteredReports.filter((r) => r.status === "approved").length}件</span>
                <span className="whitespace-nowrap">却下: {filteredReports.filter((r) => r.status === "rejected").length}件</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>日報を却下</DialogTitle>
            <DialogDescription>却下理由を入力してください。運転手に通知されます。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">却下理由</Label>
              <Input id="rejectionReason" placeholder="例: 退勤時間が実際と異なります" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>却下する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
