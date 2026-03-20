"use client";

import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { EmployeeLayout } from "@/components/layout/employee-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Banknote,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

const now = new Date();

const mockPayslips = [
  {
    id: "ps-1",
    period: format(now, "yyyy年M月", { locale: ja }),
    periodKey: format(now, "yyyy-MM"),
    workDays: 18,
    totalHours: 153.5,
    baseWage: 198000,
    overtimeWage: 42750,
    holidayWage: 0,
    nightWage: 0,
    restraintAllowance: 8500,
    otherAllowances: 0,
    grossPay: 249250,
    healthInsurance: 12450,
    pension: 22800,
    employmentInsurance: 3740,
    incomeTax: 5200,
    residentTax: 8300,
    otherDeductions: 0,
    totalDeductions: 52490,
    netPay: 196760,
    status: "confirmed" as const,
    paidDate: null,
  },
  {
    id: "ps-2",
    period: format(subMonths(now, 1), "yyyy年M月", { locale: ja }),
    periodKey: format(subMonths(now, 1), "yyyy-MM"),
    workDays: 22,
    totalHours: 187.0,
    baseWage: 242000,
    overtimeWage: 56250,
    holidayWage: 15000,
    nightWage: 3200,
    restraintAllowance: 12750,
    otherAllowances: 0,
    grossPay: 329200,
    healthInsurance: 16450,
    pension: 30100,
    employmentInsurance: 4938,
    incomeTax: 7800,
    residentTax: 8300,
    otherDeductions: 0,
    totalDeductions: 67588,
    netPay: 261612,
    status: "paid" as const,
    paidDate: "3月5日",
  },
  {
    id: "ps-3",
    period: format(subMonths(now, 2), "yyyy年M月", { locale: ja }),
    periodKey: format(subMonths(now, 2), "yyyy-MM"),
    workDays: 20,
    totalHours: 168.0,
    baseWage: 220000,
    overtimeWage: 37500,
    holidayWage: 0,
    nightWage: 0,
    restraintAllowance: 4250,
    otherAllowances: 0,
    grossPay: 261750,
    healthInsurance: 13080,
    pension: 23940,
    employmentInsurance: 3926,
    incomeTax: 5600,
    residentTax: 8300,
    otherDeductions: 0,
    totalDeductions: 54846,
    netPay: 206904,
    status: "paid" as const,
    paidDate: "2月5日",
  },
];

const mockDailyRecords = [
  { id: "1", workDate: new Date(), company: "A運輸株式会社", vehicleType: "4t", startTime: "08:00", endTime: "19:30", workHours: 10.5, totalWage: 14750, status: "submitted" as Status },
  { id: "2", workDate: subDays(new Date(), 1), company: "A運輸株式会社", vehicleType: "4t", startTime: "07:00", endTime: "18:00", workHours: 10, totalWage: 14000, status: "approved" as Status },
  { id: "3", workDate: subDays(new Date(), 2), company: "B物流株式会社", vehicleType: "10t", startTime: "06:00", endTime: "17:00", workHours: 10, totalWage: 15000, status: "approved" as Status },
  { id: "4", workDate: subDays(new Date(), 3), company: "A運輸株式会社", vehicleType: "4t", startTime: "08:00", endTime: "17:00", workHours: 8, totalWage: 11000, status: "confirmed" as Status },
  { id: "5", workDate: subDays(new Date(), 5), company: "C配送センター", vehicleType: "2t", startTime: "09:00", endTime: "18:00", workHours: 8, totalWage: 10000, status: "paid" as Status },
  { id: "6", workDate: subDays(new Date(), 6), company: "A運輸株式会社", vehicleType: "4t", startTime: "07:30", endTime: "19:00", workHours: 10.5, totalWage: 14750, status: "paid" as Status },
  { id: "7", workDate: subDays(new Date(), 7), company: "A運輸株式会社", vehicleType: "4t", startTime: "08:00", endTime: "17:00", workHours: 8, totalWage: 11000, status: "paid" as Status },
];

type ViewMode = "payslip" | "daily";

export default function EmployeePayslipPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("payslip");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedPayslip, setExpandedPayslip] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const workDates = mockDailyRecords.map((h) => format(h.workDate, "yyyy-MM-dd"));

  const filteredRecords = selectedDate
    ? mockDailyRecords.filter(
        (h) => format(h.workDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : mockDailyRecords.filter((h) => isSameMonth(h.workDate, currentMonth));

  const monthlyRecords = mockDailyRecords.filter((h) => isSameMonth(h.workDate, currentMonth));
  const totalDays = monthlyRecords.length;
  const totalHours = monthlyRecords.reduce((sum, h) => sum + h.workHours, 0);
  const totalWage = monthlyRecords.reduce((sum, h) => sum + h.totalWage, 0);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  return (
    <EmployeeLayout>
      <div className="space-y-5 pb-28">
        {/* View Toggle */}
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode("payslip")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
              viewMode === "payslip"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            )}
          >
            <FileText className="inline h-4 w-4 mr-1.5 -mt-0.5" />
            支払明細
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
              viewMode === "daily"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            )}
          >
            <Calendar className="inline h-4 w-4 mr-1.5 -mt-0.5" />
            日別明細
          </button>
        </div>

        {viewMode === "payslip" && (
          <>
            {/* Payslip List */}
            <div className="space-y-4">
              {mockPayslips.map((payslip) => {
                const isExpanded = expandedPayslip === payslip.id;
                return (
                  <Card key={payslip.id} className="border-0 shadow-md overflow-hidden">
                    {/* Header - always visible */}
                    <button
                      onClick={() => setExpandedPayslip(isExpanded ? null : payslip.id)}
                      className="w-full text-left"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{payslip.period}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              稼働{payslip.workDays}日 / {payslip.totalHours}時間
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                payslip.status === "paid"
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-blue-50 text-blue-700"
                              )}
                            >
                              {payslip.status === "paid" ? `${payslip.paidDate}支給` : "確定"}
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">差引支給額</p>
                          </div>
                          <p className="text-3xl font-bold text-blue-700 tabular-nums">
                            {formatCurrency(payslip.netPay)}
                          </p>
                        </div>
                      </CardContent>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 space-y-4">
                        {/* Earnings */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">支給</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">基本給</span>
                              <span className="font-medium tabular-nums">{formatCurrency(payslip.baseWage)}</span>
                            </div>
                            {payslip.overtimeWage > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">残業手当</span>
                                <span className="font-medium tabular-nums">{formatCurrency(payslip.overtimeWage)}</span>
                              </div>
                            )}
                            {payslip.holidayWage > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">休日手当</span>
                                <span className="font-medium tabular-nums">{formatCurrency(payslip.holidayWage)}</span>
                              </div>
                            )}
                            {payslip.nightWage > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">深夜手当</span>
                                <span className="font-medium tabular-nums">{formatCurrency(payslip.nightWage)}</span>
                              </div>
                            )}
                            {payslip.restraintAllowance > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">拘束手当</span>
                                <span className="font-medium tabular-nums">{formatCurrency(payslip.restraintAllowance)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                              <span>総支給額</span>
                              <span className="tabular-nums">{formatCurrency(payslip.grossPay)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Deductions */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">控除</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">健康保険</span>
                              <span className="font-medium tabular-nums text-slate-500">-{formatCurrency(payslip.healthInsurance)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">厚生年金</span>
                              <span className="font-medium tabular-nums text-slate-500">-{formatCurrency(payslip.pension)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">雇用保険</span>
                              <span className="font-medium tabular-nums text-slate-500">-{formatCurrency(payslip.employmentInsurance)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">所得税</span>
                              <span className="font-medium tabular-nums text-slate-500">-{formatCurrency(payslip.incomeTax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">住民税</span>
                              <span className="font-medium tabular-nums text-slate-500">-{formatCurrency(payslip.residentTax)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                              <span>控除合計</span>
                              <span className="tabular-nums text-slate-600">-{formatCurrency(payslip.totalDeductions)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Net Pay */}
                        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-800">差引支給額</span>
                            <span className="text-2xl font-bold text-blue-700 tabular-nums">
                              {formatCurrency(payslip.netPay)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "daily" && (
          <>
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">
                {format(currentMonth, "yyyy年M月", { locale: ja })}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Monthly Summary */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-blue-50/30">
              <CardContent className="pt-5 pb-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">出勤日数</p>
                    <p className="text-2xl font-bold">{totalDays}<span className="text-sm">日</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">総労働時間</p>
                    <p className="text-2xl font-bold">{totalHours.toFixed(1)}<span className="text-sm">h</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">総支給額</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(totalWage / 10000).toFixed(1)}<span className="text-sm">万</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mini Calendar */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  カレンダー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
                    <div
                      key={day}
                      className={cn(
                        "py-1 font-medium",
                        i === 0 && "text-slate-500",
                        i === 6 && "text-blue-500"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {days.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const hasWork = workDates.includes(dateStr);
                    const isSelected =
                      selectedDate && format(selectedDate, "yyyy-MM-dd") === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() =>
                          setSelectedDate(isSelected ? null : day)
                        }
                        className={cn(
                          "relative py-2 rounded-md text-sm transition-colors",
                          isToday(day) && "font-bold",
                          isSelected && "bg-primary text-primary-foreground",
                          !isSelected && hasWork && "bg-primary/10",
                          !isSelected && !hasWork && "hover:bg-muted"
                        )}
                      >
                        {format(day, "d")}
                        {hasWork && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Daily Records */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {selectedDate
                    ? format(selectedDate, "M月d日", { locale: ja }) + "の勤務"
                    : "今月の勤務履歴"}
                </h3>
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                  >
                    すべて表示
                  </Button>
                )}
              </div>

              {filteredRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    この期間の勤務記録はありません
                  </CardContent>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <Card key={record.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {format(record.workDate, "M/d（E）", { locale: ja })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.company} / {record.vehicleType}
                          </p>
                        </div>
                        <StatusBadge status={record.status} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {record.startTime}〜{record.endTime}
                          </span>
                          <Badge variant="secondary">
                            {record.workHours}h
                          </Badge>
                        </div>
                        {record.status !== "submitted" && (
                          <span className="flex items-center gap-1 font-semibold">
                            <Banknote className="h-4 w-4 text-blue-600" />
                            {formatCurrency(record.totalWage)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
