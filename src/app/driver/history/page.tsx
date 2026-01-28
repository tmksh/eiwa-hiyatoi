"use client";

import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { ja } from "date-fns/locale";
import { DriverLayout } from "@/components/layout/driver-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import { ChevronLeft, ChevronRight, Calendar, Clock, Banknote, AlertCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock history data
const mockHistory = [
  {
    id: "1",
    workDate: new Date(),
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "19:30",
    workHours: 10.5,
    totalWage: 14750,
    status: "submitted" as Status,
    rejectionReason: null,
  },
  {
    id: "2",
    workDate: subDays(new Date(), 1),
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "07:00",
    endTime: "18:00",
    workHours: 10,
    totalWage: 14000,
    status: "rejected" as Status,
    rejectionReason: "退勤時間が実際と異なります。正しい時間を入力してください。",
  },
  {
    id: "3",
    workDate: subDays(new Date(), 2),
    company: "B物流株式会社",
    vehicleType: "10t",
    startTime: "06:00",
    endTime: "17:00",
    workHours: 10,
    totalWage: 15000,
    status: "approved" as Status,
    rejectionReason: null,
  },
  {
    id: "4",
    workDate: subDays(new Date(), 3),
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "17:00",
    workHours: 8,
    totalWage: 11000,
    status: "confirmed" as Status,
    rejectionReason: null,
  },
  {
    id: "5",
    workDate: subDays(new Date(), 5),
    company: "C配送センター",
    vehicleType: "2t",
    startTime: "09:00",
    endTime: "18:00",
    workHours: 8,
    totalWage: 10000,
    status: "paid" as Status,
    rejectionReason: null,
  },
  {
    id: "6",
    workDate: subDays(new Date(), 6),
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "07:30",
    endTime: "19:00",
    workHours: 10.5,
    totalWage: 14750,
    status: "paid" as Status,
    rejectionReason: null,
  },
  {
    id: "7",
    workDate: subDays(new Date(), 7),
    company: "A運輸株式会社",
    vehicleType: "4t",
    startTime: "08:00",
    endTime: "17:00",
    workHours: 8,
    totalWage: 11000,
    status: "paid" as Status,
    rejectionReason: null,
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DriverHistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get work dates for calendar marking
  const workDates = mockHistory.map((h) => format(h.workDate, "yyyy-MM-dd"));

  // Filter history by selected date or show all for current month
  const filteredHistory = selectedDate
    ? mockHistory.filter(
        (h) => format(h.workDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : mockHistory.filter((h) => isSameMonth(h.workDate, currentMonth));

  // Calculate monthly totals
  const monthlyHistory = mockHistory.filter((h) => isSameMonth(h.workDate, currentMonth));
  const totalDays = monthlyHistory.length;
  const totalHours = monthlyHistory.reduce((sum, h) => sum + h.workHours, 0);
  const totalWage = monthlyHistory.reduce((sum, h) => sum + h.totalWage, 0);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  return (
    <DriverLayout>
      <div className="space-y-6 pb-32">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {format(currentMonth, "yyyy年M月", { locale: ja })}
          </h1>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Monthly Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
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
                <p className="text-2xl font-bold text-primary">
                  {(totalWage / 10000).toFixed(1)}<span className="text-sm">万</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <Card>
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
                    i === 0 && "text-red-500",
                    i === 6 && "text-blue-500"
                  )}
                >
                  {day}
                </div>
              ))}
              {/* Empty cells for start of month */}
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

        {/* History List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {selectedDate
                ? format(selectedDate, "M月d日", { locale: ja }) + "の勤務"
                : "今月の勤務履歴"}
            </h2>
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

          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                この期間の勤務記録はありません
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((record) => (
              <Card key={record.id} className={cn(
                record.status === "rejected" && "border-red-200 bg-red-50/50"
              )}>
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
                  
                  {/* 却下理由の表示 */}
                  {record.status === "rejected" && record.rejectionReason && (
                    <div className="mb-3 p-3 rounded-lg bg-red-100 border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">却下理由</p>
                          <p className="text-sm text-red-700">{record.rejectionReason}</p>
                        </div>
                      </div>
                      <Link href={`/driver/report?edit=${record.id}`}>
                        <Button size="sm" variant="outline" className="mt-2 w-full border-red-300 text-red-700 hover:bg-red-100">
                          <Pencil className="h-3 w-3 mr-1" />
                          修正して再提出
                        </Button>
                      </Link>
                    </div>
                  )}
                  
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
                    {record.status !== "submitted" && record.status !== "rejected" && (
                      <span className="flex items-center gap-1 font-semibold">
                        <Banknote className="h-4 w-4 text-primary" />
                        {formatCurrency(record.totalWage)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DriverLayout>
  );
}
