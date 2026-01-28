"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data - 出勤があった日
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

  // 今月の出勤日数
  const workDaysThisMonth = days.filter(day => workDays.includes(format(day, "yyyy-MM-dd"))).length;

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            出勤カレンダー
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              {format(currentMonth, "yyyy年M月", { locale: ja })}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="mb-4 p-3 rounded-xl bg-violet-50 border border-violet-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-violet-600">今月の出勤日数</span>
            <span className="text-2xl font-bold text-violet-700">{workDaysThisMonth}<span className="text-sm ml-0.5">日</span></span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
            <div
              key={day}
              className={cn(
                "py-1.5 font-medium text-gray-400",
                i === 0 && "text-rose-400",
                i === 6 && "text-blue-400"
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
            const hasWork = workDays.includes(dateStr);
            const dayOfWeek = day.getDay();

            return (
              <div
                key={dateStr}
                className={cn(
                  "relative py-2 rounded-lg text-sm",
                  isToday(day) && "ring-2 ring-violet-400 ring-offset-1",
                  hasWork && "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 font-medium",
                  !hasWork && dayOfWeek === 0 && "text-rose-400",
                  !hasWork && dayOfWeek === 6 && "text-blue-400",
                  !hasWork && dayOfWeek !== 0 && dayOfWeek !== 6 && "text-gray-600"
                )}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-gradient-to-br from-amber-100 to-amber-200" />
            <span>出勤日</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded ring-2 ring-violet-400" />
            <span>今日</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

