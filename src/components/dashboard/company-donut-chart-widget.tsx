"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const companyData = [
  { name: "A運輸株式会社", amount: 2150000, workers: 85, color: "#1e293b" },
  { name: "B物流株式会社", amount: 1480000, workers: 52, color: "#60a5fa" },
  { name: "C配送センター",  amount: 890000,  workers: 35, color: "#94a3b8" },
  { name: "D運送",          amount: 330000,  workers: 15, color: "#cbd5e1" },
];

const total = companyData.reduce((sum, c) => sum + c.amount, 0);

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { workers: number; color: string } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="font-bold text-slate-700">{d.name}</span>
      </div>
      <p className="text-slate-500">支給額: <span className="font-semibold text-slate-800">¥{formatCurrency(d.value)}</span></p>
      <p className="text-slate-500">出勤者: <span className="font-semibold text-slate-800">{d.payload.workers}名</span></p>
      <p className="text-slate-500">割合: <span className="font-semibold text-slate-800">{((d.value / total) * 100).toFixed(1)}%</span></p>
    </div>
  );
}

export function CompanyDonutChartWidget() {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-slate-600" />
          </div>
          会社別支給割合
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie
                  data={companyData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={50}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {companyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-slate-400">合計</span>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">
                {(total / 10000).toFixed(0)}万
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {companyData.map((company) => {
              const pct = ((company.amount / total) * 100).toFixed(1);
              return (
                <div key={company.name} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: company.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] text-slate-600 truncate">{company.name}</span>
                      <span className="text-[11px] font-semibold text-slate-800 tabular-nums shrink-0">{pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: company.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
