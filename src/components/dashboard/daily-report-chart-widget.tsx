"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

// 今月（3月）の稼働データ（モック）
const dailyData = [
  { day: "1",  count: 18 }, { day: "3",  count: 21 }, { day: "4",  count: 19 },
  { day: "5",  count: 22 }, { day: "6",  count: 20 }, { day: "7",  count: 17 },
  { day: "8",  count: 0  }, // 日曜
  { day: "10", count: 23 }, { day: "11", count: 20 }, { day: "12", count: 19 },
  { day: "13", count: 21 }, { day: "14", count: 22 }, { day: "15", count: 18 },
  { day: "17", count: 24 }, { day: "18", count: 22 }, { day: "19", count: 21 },
  { day: "20", count: 18 },
];

const maxCount = Math.max(...dailyData.map((d) => d.count));

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || !payload[0].value) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-sm">
      <p className="text-slate-500">3月{label}日</p>
      <p className="font-bold text-slate-800">{payload[0].value}件</p>
    </div>
  );
}

export function DailyReportChartWidget() {
  const totalDays = dailyData.filter((d) => d.count > 0).length;
  const totalCount = dailyData.reduce((sum, d) => sum + d.count, 0);
  const avg = (totalCount / totalDays).toFixed(1);

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
              <CalendarDays className="h-3.5 w-3.5 text-slate-600" />
            </div>
            今月の日別稼働件数
          </CardTitle>
          <div className="text-right">
            <p className="text-[10px] text-slate-400">平均</p>
            <p className="text-sm font-bold text-slate-700">{avg}<span className="text-[10px] font-normal text-slate-400 ml-0.5">件/日</span></p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Peak bar */}
        <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>最高 <span className="font-semibold text-slate-700">{maxCount}件</span></span>
          <span>累計 <span className="font-semibold text-slate-700">{totalCount}件</span></span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#475569"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#475569" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
