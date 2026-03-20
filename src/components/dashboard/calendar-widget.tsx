"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";

const workDays = [
  subDays(new Date(), 0),
  subDays(new Date(), 1),
  subDays(new Date(), 2),
  subDays(new Date(), 3),
  subDays(new Date(), 5),
  subDays(new Date(), 6),
  subDays(new Date(), 7),
  subDays(new Date(), 8),
  subDays(new Date(), 10),
  subDays(new Date(), 12),
  subDays(new Date(), 13),
  subDays(new Date(), 14),
  subDays(new Date(), 15),
].map(d => format(d, "yyyy-MM-dd"));

export function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const workDaysThisMonth = days.filter(day => workDays.includes(format(day, "yyyy-MM-dd"))).length;

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
              <CalendarDays className="h-3.5 w-3.5 text-slate-600" />
            </div>
            出勤カレンダー
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={prevMonth}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium min-w-[72px] text-center text-slate-600">
              {format(currentMonth, "yyyy年M月", { locale: ja })}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={nextMonth}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="mb-3 p-2.5 rounded-xl bg-white/40 border border-white/30 flex items-center justify-between">
          <span className="text-xs text-slate-500">今月の出勤日数</span>
          <span className="text-lg font-bold text-slate-900">{workDaysThisMonth}<span className="text-xs text-slate-400 ml-0.5">日</span></span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[11px]">
          {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
            <div
              key={day}
              className={cn(
                "py-1 font-medium text-slate-400",
                i === 0 && "text-slate-400",
                i === 6 && "text-blue-400"
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
            const hasWork = workDays.includes(dateStr);
            const dayOfWeek = day.getDay();

            return (
              <div
                key={dateStr}
                className={cn(
                  "py-1.5 rounded text-[11px]",
                  isToday(day) && "ring-1 ring-blue-400 font-semibold text-blue-600",
                  hasWork && !isToday(day) && "bg-blue-50 text-blue-700 font-medium",
                  !hasWork && dayOfWeek === 0 && "text-slate-400",
                  !hasWork && dayOfWeek === 6 && "text-blue-400",
                  !hasWork && dayOfWeek !== 0 && dayOfWeek !== 6 && "text-slate-500"
                )}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded bg-blue-50 ring-1 ring-blue-200" />
            <span>出勤日</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded ring-1 ring-blue-400" />
            <span>今日</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
