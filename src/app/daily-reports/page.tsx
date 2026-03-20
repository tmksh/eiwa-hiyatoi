"use client";

import React, { useState } from "react";
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
import { Plus, Search, CalendarIcon, Pencil, Check, X, AlertCircle, ClipboardCheck, Clock, Route, MapPin, Trash2, Weight, Truck, Download, ChevronLeft, ChevronRight, Users, CalendarDays, CalendarCheck, CalendarPlus, CalendarMinus, Banknote, BookOpen, ArrowRight, Calculator, Filter } from "lucide-react";
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
];

const rollCallsData = [
  { id: 1, date: "2024-01-28", worker: "山田 太郎", checkTime: "17:15", alcohol: "0.00", health: "良好", inspector: "管理者A", status: "完了" },
  { id: 2, date: "2024-01-28", worker: "鈴木 一郎", checkTime: "16:45", alcohol: "0.00", health: "良好", inspector: "管理者A", status: "完了" },
  { id: 3, date: "2024-01-28", worker: "佐藤 花子", checkTime: "18:10", alcohol: "0.00", health: "良好", inspector: "管理者B", status: "完了" },
  { id: 4, date: "2024-01-29", worker: "高橋 健二", checkTime: "—", alcohol: "—", health: "—", inspector: "—", status: "未実施" },
  { id: 5, date: "2024-01-29", worker: "田中 美咲", checkTime: "16:20", alcohol: "0.00", health: "経過観察", inspector: "管理者A", status: "完了" },
];

const TABS = ["日報", "点呼簿", "運行実績", "週休", "有給休暇", "アルバイト", "仕訳"] as const;
type Tab = (typeof TABS)[number];

const TAB_META: Record<Tab, { icon: React.ElementType; description: string; color: string; iconBg: string }> = {
  "日報":     { icon: ClipboardCheck, description: "日々の勤務・作業記録", color: "text-blue-600",    iconBg: "bg-blue-50" },
  "点呼簿":   { icon: Check,          description: "出退勤・アルコール検査", color: "text-emerald-600", iconBg: "bg-emerald-50" },
  "運行実績": { icon: Route,           description: "ルート・輸送重量の記録", color: "text-violet-600",  iconBg: "bg-violet-50" },
  "週休":     { icon: CalendarDays,    description: "週休・勤務シフト管理",   color: "text-slate-600",   iconBg: "bg-slate-100" },
  "有給休暇": { icon: CalendarCheck,   description: "有給取得・残日数管理",   color: "text-amber-600",   iconBg: "bg-amber-50" },
  "アルバイト":{ icon: Users,          description: "アルバイト勤務・給与",   color: "text-pink-600",    iconBg: "bg-pink-50" },
  "仕訳":     { icon: BookOpen,        description: "給与・社保の仕訳入力",   color: "text-indigo-600",  iconBg: "bg-indigo-50" },
};

const mockPaidLeave = [
  { id: 1, name: "山田 太郎", grantDate: "2023/04/01", granted: 20, used: 8, remaining: 12, expiry: "2025/03/31" },
  { id: 2, name: "鈴木 一郎", grantDate: "2023/10/01", granted: 10, used: 3, remaining: 7, expiry: "2025/09/30" },
  { id: 3, name: "佐藤 花子", grantDate: "2023/04/01", granted: 20, used: 18, remaining: 2, expiry: "2025/03/31" },
  { id: 4, name: "高橋 健二", grantDate: "2023/07/01", granted: 11, used: 5, remaining: 6, expiry: "2025/06/30" },
  { id: 5, name: "田中 美咲", grantDate: "2024/01/01", granted: 10, used: 0, remaining: 10, expiry: "2025/12/31" },
];

const mockPartTimeWorkers = [
  { id: 1, name: "木村 翔太", hourlyRate: 1200, workDays: 15, totalHours: 90.0, overtime: 5.0, grossPay: 114000, month: "2024/01", status: "確定" },
  { id: 2, name: "松本 さくら", hourlyRate: 1150, workDays: 12, totalHours: 72.0, overtime: 0, grossPay: 82800, month: "2024/01", status: "確定" },
  { id: 3, name: "小林 大輝", hourlyRate: 1300, workDays: 18, totalHours: 108.0, overtime: 8.0, grossPay: 153400, month: "2024/01", status: "未確定" },
  { id: 4, name: "中村 愛", hourlyRate: 1200, workDays: 10, totalHours: 60.0, overtime: 2.0, grossPay: 75000, month: "2024/01", status: "確定" },
  { id: 5, name: "加藤 隆", hourlyRate: 1100, workDays: 20, totalHours: 120.0, overtime: 10.0, grossPay: 145750, month: "2024/01", status: "未確定" },
];

const mockJournals = [
  { id: 1, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（源泉）", creditAmount: 6800, description: "1月分給与 山田太郎", category: "給与" },
  { id: 2, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（社保）", creditAmount: 42180, description: "1月分給与 山田太郎", category: "給与" },
  { id: 3, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "預り金（住民税）", creditAmount: 8500, description: "1月分給与 山田太郎", category: "給与" },
  { id: 4, date: "2024/01/25", debitAccount: "給料手当", debitAmount: 285000, creditAccount: "普通預金", creditAmount: 227520, description: "1月分給与 山田太郎", category: "給与" },
  { id: 5, date: "2024/02/10", debitAccount: "預り金（源泉）", debitAmount: 30800, creditAccount: "普通預金", creditAmount: 30800, description: "1月分源泉所得税納付", category: "納付" },
  { id: 6, date: "2024/02/28", debitAccount: "預り金（社保）", debitAmount: 210900, creditAccount: "普通預金", creditAmount: 210900, description: "1月分社会保険料納付", category: "納付" },
];

const operationData = [
  { id: "1", date: "2026-03-19", driverName: "山田 太郎", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", routes: [{ destination: "川崎市処理施設", wasteType: "一般廃棄物", weight: 3.2, distance: 28.5 }, { destination: "横浜市リサイクルセンター", wasteType: "産業廃棄物", weight: 2.8, distance: 35.2 }], totalDistance: 63.7, totalWeight: 6.0, trips: 2, startTime: "06:00", endTime: "17:30" },
  { id: "2", date: "2026-03-19", driverName: "鈴木 一郎", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", routes: [{ destination: "東京都中央処理場", wasteType: "一般廃棄物", weight: 8.5, distance: 42.0 }, { destination: "千葉市最終処分場", wasteType: "産業廃棄物", weight: 7.2, distance: 55.8 }], totalDistance: 126.3, totalWeight: 21.7, trips: 3, startTime: "05:30", endTime: "18:00" },
  { id: "3", date: "2026-03-18", driverName: "佐藤 花子", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", routes: [{ destination: "品川区集積所", wasteType: "資源ごみ", weight: 1.5, distance: 12.3 }], totalDistance: 12.3, totalWeight: 1.5, trips: 1, startTime: "07:00", endTime: "15:00" },
];

type DayType = "work" | "off" | "half" | "paid";
const weekDays = ["月", "火", "水", "木", "金", "土", "日"];
const dayTypeConfig: Record<DayType, { label: string; className: string }> = {
  work: { label: "出", className: "bg-blue-50 text-blue-700 font-medium" },
  off:  { label: "休", className: "bg-slate-100 text-slate-400" },
  half: { label: "半", className: "bg-slate-200 text-slate-600" },
  paid: { label: "有", className: "bg-blue-100 text-blue-700" },
};
const scheduleData = [
  { id: "1", name: "山田 太郎", employeeNo: "E001", schedule: { "月": "work", "火": "work", "水": "work", "木": "work", "金": "work", "土": "off", "日": "off" } as Record<string, DayType>, workDays: 22, offDays: 9 },
  { id: "2", name: "鈴木 一郎", employeeNo: "E002", schedule: { "月": "work", "火": "work", "水": "off",  "木": "work", "金": "work", "土": "work", "日": "off" } as Record<string, DayType>, workDays: 21, offDays: 10 },
  { id: "3", name: "佐藤 花子", employeeNo: "E003", schedule: { "月": "work", "火": "work", "水": "work", "木": "off",  "金": "work", "土": "half", "日": "off" } as Record<string, DayType>, workDays: 20, offDays: 11 },
  { id: "4", name: "高橋 健二", employeeNo: "E004", schedule: { "月": "work", "火": "off",  "水": "work", "木": "work", "金": "work", "土": "work", "日": "off" } as Record<string, DayType>, workDays: 21, offDays: 10 },
  { id: "5", name: "田中 次郎", employeeNo: "E005", schedule: { "月": "work", "火": "work", "水": "work", "木": "work", "金": "off",  "土": "off",  "日": "off" } as Record<string, DayType>, workDays: 18, offDays: 13 },
];

export default function DailyReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [reports, setReports] = useState<Report[]>(initialMockReports);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [operationDate, setOperationDate] = useState("2026-03-19");
  const [currentMonth, setCurrentMonth] = useState("2026年3月");
  const [paidLeaveSearch, setPaidLeaveSearch] = useState("");
  const [partTimeSearch, setPartTimeSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.workerName.includes(searchQuery) || report.company.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRollCalls = rollCallsData.filter((row) => {
    const matchesSearch = row.worker.includes(searchQuery);
    const matchesDate = !dateFilter || row.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const filteredPaidLeave = mockPaidLeave.filter((d) => d.name.includes(paidLeaveSearch));
  const filteredPartTimeWorkers = mockPartTimeWorkers.filter((w) => w.name.includes(partTimeSearch));
  const filteredJournals = mockJournals.filter((j) => {
    const matchesSearch = j.description.includes(journalSearch) || j.debitAccount.includes(journalSearch) || j.creditAccount.includes(journalSearch);
    const matchesCategory = categoryFilter === "all" || j.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
        {/* Card navigation */}
        {!activeTab && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TABS.map((tab) => {
              const meta = TAB_META[tab];
              const Icon = meta.icon;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchQuery(""); setDateFilter(""); }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.iconBg}`}>
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 mt-1 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{tab}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{meta.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Back button */}
        {activeTab && (
          <button
            onClick={() => { setActiveTab(null); setSearchQuery(""); setDateFilter(""); }}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            一覧に戻る
          </button>
        )}

        {activeTab === "日報" && (
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
                      <TableHead className="whitespace-nowrap">出勤</TableHead>
                      <TableHead className="whitespace-nowrap">退勤</TableHead>
                      <TableHead className="whitespace-nowrap">休憩</TableHead>
                      <TableHead className="whitespace-nowrap">ステータス</TableHead>
                      <TableHead className="w-[180px] whitespace-nowrap">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className={cn(report.status === "submitted" && "bg-blue-50", report.status === "rejected" && "bg-slate-100")}>
                        <TableCell className="font-medium whitespace-nowrap">{report.workerName}</TableCell>
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
        )}

        {activeTab === "点呼簿" && (
          <>
            <p className="text-sm text-slate-500">終業点呼時刻管理</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2"><ClipboardCheck className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-xs text-slate-500">点呼完了</p><p className="text-xl font-semibold text-slate-900">4件</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2"><Clock className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xs text-slate-500">未実施</p><p className="text-xl font-semibold text-slate-900">1件</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2"><ClipboardCheck className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xs text-slate-500">実施率</p><p className="text-xl font-semibold text-slate-900">80%</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="作業者名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">日付</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">作業者名</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">終業点呼時刻</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">アルコール検知</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">健康状態</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">点呼者</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRollCalls.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-mono whitespace-nowrap">{row.date}</td>
                      <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.worker}</td>
                      <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono whitespace-nowrap">{row.checkTime}</td>
                      <td className="px-3 sm:px-4 py-3 text-slate-700 font-mono whitespace-nowrap tabular-nums">{row.alcohol}</td>
                      <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.health}</td>
                      <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.inspector}</td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "完了" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeTab === "運行実績" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "本日の運行数", value: "10件", icon: Route, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "総走行距離", value: "363.8km", icon: MapPin, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "総処理量", value: "51.6t", icon: Weight, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "稼働車両数", value: "5台", icon: Truck, bg: "bg-blue-50", ic: "text-blue-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <Card key={label} className="border-slate-200/60 shadow-none">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                      <div><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900">{value}</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                <input type="date" value={operationDate} onChange={(e) => setOperationDate(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="ドライバー・車両で検索..." className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 w-full sm:w-56" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200"><Download className="h-3.5 w-3.5" />CSV出力</Button>
                <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white"><Plus className="h-3.5 w-3.5" />新規登録</Button>
              </div>
            </div>
            <Card className="border-slate-200/60 shadow-none">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-900">運行実績一覧</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["日付","ドライバー","車両","車種","便数","走行距離","処理量","時間",""].map((h) => (
                          <th key={h} className="pb-3 text-left font-medium text-slate-500 text-xs whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {operationData.map((record) => (
                        <>
                          <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
                            <td className="py-3 text-slate-700 whitespace-nowrap">{record.date}</td>
                            <td className="py-3 font-medium text-slate-900 whitespace-nowrap">{record.driverName}</td>
                            <td className="py-3 text-slate-600 text-xs whitespace-nowrap">{record.vehicleNumber}</td>
                            <td className="py-3 whitespace-nowrap"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{record.vehicleType}</span></td>
                            <td className="py-3 text-right tabular-nums text-slate-700 whitespace-nowrap">{record.trips}</td>
                            <td className="py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{record.totalDistance} km</td>
                            <td className="py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{record.totalWeight} t</td>
                            <td className="py-3 text-slate-600 text-xs whitespace-nowrap">{record.startTime}〜{record.endTime}</td>
                            <td className="py-3"><Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">詳細</Button></td>
                          </tr>
                          {expandedId === record.id && (
                            <tr key={`${record.id}-detail`}>
                              <td colSpan={9} className="bg-slate-50/50 px-4 py-3">
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-slate-500 mb-2">運搬明細</p>
                                  {record.routes.map((route, idx) => (
                                    <div key={idx} className="flex items-center gap-4 rounded-lg bg-white border border-slate-100 px-4 py-2.5">
                                      <div className="flex items-center gap-2 flex-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /><span className="text-sm font-medium text-slate-700">{route.destination}</span></div>
                                      <div className="flex items-center gap-2"><Trash2 className="h-3.5 w-3.5 text-slate-400" /><span className="text-sm text-slate-600">{route.wasteType}</span></div>
                                      <span className="text-sm tabular-nums text-slate-700 font-medium">{route.weight} t</span>
                                      <span className="text-sm tabular-nums text-slate-600">{route.distance} km</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "週休" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "登録従業員数", value: `${scheduleData.length}名`, icon: Users, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "平均出勤日数", value: "20.4日", icon: CalendarDays, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "今月の営業日数", value: "22日", icon: CalendarDays, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "本日の出勤予定", value: "6名", icon: Users, bg: "bg-blue-50", ic: "text-blue-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <Card key={label} className="border-slate-200/60 shadow-none">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                      <div><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900">{value}</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200"><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm font-medium text-slate-700 min-w-[100px] text-center">{currentMonth}</span>
                <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200"><ChevronRight className="h-4 w-4" /></Button>
                <div className="relative ml-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="従業員名で検索..." className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 w-full sm:w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200"><Download className="h-3.5 w-3.5" />CSV出力</Button>
                <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white"><Plus className="h-3.5 w-3.5" />登録</Button>
              </div>
            </div>
            <Card className="border-slate-200/60 shadow-none">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-left font-medium text-slate-500 text-xs w-16 whitespace-nowrap">社員No</th>
                        <th className="pb-3 text-left font-medium text-slate-500 text-xs w-24 whitespace-nowrap">氏名</th>
                        {weekDays.map((day, i) => (
                          <th key={day} className={cn("pb-3 text-center font-medium text-xs w-10", i >= 5 ? "text-blue-500" : "text-slate-500")}>{day}</th>
                        ))}
                        <th className="pb-3 text-right font-medium text-slate-500 text-xs whitespace-nowrap">出勤日</th>
                        <th className="pb-3 text-right font-medium text-slate-500 text-xs whitespace-nowrap">休日</th>
                        <th className="pb-3 text-xs w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((entry) => (
                        <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 text-xs text-slate-400 whitespace-nowrap">{entry.employeeNo}</td>
                          <td className="py-3 font-medium text-slate-900 whitespace-nowrap">{entry.name}</td>
                          {weekDays.map((day) => {
                            const type = entry.schedule[day];
                            const config = dayTypeConfig[type];
                            return (
                              <td key={day} className="py-3 text-center">
                                <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded text-xs", config.className)}>{config.label}</span>
                              </td>
                            );
                          })}
                          <td className="py-3 text-right tabular-nums font-medium text-slate-900 whitespace-nowrap">{entry.workDays}日</td>
                          <td className="py-3 text-right tabular-nums text-slate-500 whitespace-nowrap">{entry.offDays}日</td>
                          <td className="py-3"><Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">編集</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {Object.entries(dayTypeConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded text-[10px]", config.className)}>{config.label}</span>
                  <span>{key === "work" ? "出勤" : key === "off" ? "休日" : key === "half" ? "半休" : "有給"}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "有給休暇" && (
          <>
            <p className="text-sm text-slate-500">付与・取得・残日数管理</p>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "付与合計", value: "71日", icon: CalendarPlus, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "取得合計", value: "34日", icon: CalendarMinus, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "残日数合計", value: "37日", icon: CalendarCheck, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "残2日以下", value: "1名", icon: AlertCircle, bg: "bg-blue-50", ic: "text-blue-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="作業員名で検索..." value={paidLeaveSearch} onChange={(e) => setPaidLeaveSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <CalendarPlus className="h-4 w-4" />一括付与
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["作業員名","付与日","付与日数","取得日数","残日数","有効期限","消化率"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${h === "付与日数" || h === "取得日数" || h === "残日数" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPaidLeave.map((row) => {
                      const rate = Math.round((row.used / row.granted) * 100);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.grantDate}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.granted}</td>
                          <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.used}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-mono font-medium tabular-nums whitespace-nowrap">
                            <span className={row.remaining <= 2 ? "text-blue-600" : "text-slate-900"}>{row.remaining}</span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.expiry}</td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full rounded-full ${rate >= 80 ? "bg-slate-900" : rate >= 50 ? "bg-blue-500" : "bg-slate-300"}`} style={{ width: `${rate}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{rate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredPaidLeave.length} 件</div>
          </>
        )}

        {activeTab === "アルバイト" && (
          <>
            <p className="text-sm text-slate-500">時給制アルバイトの勤怠・賃金管理</p>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "登録人数", value: "5名", icon: Users, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "総労働時間", value: "450.0h", icon: Clock, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "残業時間合計", value: "25.0h", icon: CalendarDays, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "賃金合計", value: "¥570,950", icon: Banknote, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="氏名で検索..." value={partTimeSearch} onChange={(e) => setPartTimeSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />新規登録
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["氏名","時給","出勤日数","総時間","残業","支給額","対象月","ステータス"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["時給","出勤日数","総時間","残業","支給額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPartTimeWorkers.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.hourlyRate.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.workDays}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.totalHours.toFixed(1)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">{row.overtime.toFixed(1)}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-900 font-mono font-medium tabular-nums whitespace-nowrap">¥{row.grossPay.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.month}</td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "確定" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredPartTimeWorkers.length} 件</div>
          </>
        )}

        {activeTab === "仕訳" && (
          <>
            <p className="text-sm text-slate-500">仕訳・預り金テーブル管理</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "仕訳件数", value: `${mockJournals.length}件`, icon: BookOpen, bg: "bg-blue-50", ic: "text-blue-600" },
                { label: "借方合計", value: "¥1,381,700", icon: Calculator, bg: "bg-slate-100", ic: "text-slate-600" },
                { label: "貸方合計", value: "¥526,700", icon: ArrowRight, bg: "bg-slate-100", ic: "text-slate-600" },
              ].map(({ label, value, icon: Icon, bg, ic }) => (
                <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${bg} p-2`}><Icon className={`h-5 w-5 ${ic}`} /></div>
                    <div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-900">{value}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="勘定科目・摘要で検索..." value={journalSearch} onChange={(e) => setJournalSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="all">全カテゴリ</option>
                  <option value="給与">給与</option>
                  <option value="納付">納付</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Plus className="h-4 w-4" />仕訳追加
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />エクスポート
              </button>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white overflow-clip">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {["日付","借方科目","借方金額","貸方科目","貸方金額","摘要"].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap ${["借方金額","貸方金額"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJournals.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.debitAccount}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.debitAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.creditAccount}</td>
                        <td className="px-3 sm:px-4 py-3 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap">¥{row.creditAmount.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-sm text-slate-500">全 {filteredJournals.length} 件</div>
          </>
        )}
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
