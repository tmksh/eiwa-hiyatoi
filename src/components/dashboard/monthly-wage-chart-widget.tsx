"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const monthlyData = [
  { month: "10月", wage: 3980000, cashWage: 2388000, transferWage: 1592000, workers: 162 },
  { month: "11月", wage: 4210000, cashWage: 2526000, transferWage: 1684000, workers: 171 },
  { month: "12月", wage: 4650000, cashWage: 2790000, transferWage: 1860000, workers: 183 },
  { month: "1月",  wage: 4320000, cashWage: 2592000, transferWage: 1728000, workers: 175 },
  { month: "2月",  wage: 4620000, cashWage: 2772000, transferWage: 1848000, workers: 179 },
  { month: "3月",  wage: 4850000, cashWage: 2910000, transferWage: 1940000, workers: 187 },
];

function formatYen(value: number) {
  return `¥${(value / 10000).toFixed(0)}万`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">
            {entry.name === "出勤者数"
              ? `${entry.value}名`
              : `¥${new Intl.NumberFormat("ja-JP").format(entry.value)}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyWageChartWidget() {
  const latest = monthlyData[monthlyData.length - 1];
  const prev = monthlyData[monthlyData.length - 2];
  const diff = ((latest.wage - prev.wage) / prev.wage * 100).toFixed(1);
  const isUp = latest.wage >= prev.wage;

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
            </div>
            月別総支給額の推移
          </CardTitle>
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isUp ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
            <TrendingUp className="h-3 w-3" />
            {isUp ? "+" : ""}{diff}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="wage"
              orientation="left"
              tickFormatter={formatYen}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={52}
              domain={[3000000, "auto"]}
            />
            <YAxis
              yAxisId="workers"
              orientation="right"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            {/* No.27: 支払い方法別内訳 (積み上げ棒グラフ) */}
            <Bar
              yAxisId="wage"
              dataKey="cashWage"
              name="キャッシュマシン"
              stackId="wage"
              fill="#cbd5e1"
              radius={[0, 0, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              yAxisId="wage"
              dataKey="transferWage"
              name="振り込み"
              stackId="wage"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="workers"
              type="monotone"
              dataKey="workers"
              name="出勤者数"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
