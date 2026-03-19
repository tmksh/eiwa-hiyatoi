"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Users, Download, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type DayType = "work" | "off" | "half" | "paid";

interface ScheduleEntry {
  id: string;
  name: string;
  employeeNo: string;
  schedule: Record<string, DayType>;
  workDays: number;
  offDays: number;
}

const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

const scheduleData: ScheduleEntry[] = [
  {
    id: "1",
    name: "山田 太郎",
    employeeNo: "E001",
    schedule: {
      "月": "work", "火": "work", "水": "work", "木": "work", "金": "work", "土": "off", "日": "off",
    },
    workDays: 22,
    offDays: 9,
  },
  {
    id: "2",
    name: "鈴木 一郎",
    employeeNo: "E002",
    schedule: {
      "月": "work", "火": "work", "水": "off", "木": "work", "金": "work", "土": "work", "日": "off",
    },
    workDays: 21,
    offDays: 10,
  },
  {
    id: "3",
    name: "佐藤 花子",
    employeeNo: "E003",
    schedule: {
      "月": "work", "火": "work", "水": "work", "木": "off", "金": "work", "土": "half", "日": "off",
    },
    workDays: 20,
    offDays: 11,
  },
  {
    id: "4",
    name: "高橋 健二",
    employeeNo: "E004",
    schedule: {
      "月": "work", "火": "off", "水": "work", "木": "work", "金": "work", "土": "work", "日": "off",
    },
    workDays: 21,
    offDays: 10,
  },
  {
    id: "5",
    name: "田中 次郎",
    employeeNo: "E005",
    schedule: {
      "月": "work", "火": "work", "水": "work", "木": "work", "金": "off", "土": "off", "日": "off",
    },
    workDays: 18,
    offDays: 13,
  },
  {
    id: "6",
    name: "渡辺 三郎",
    employeeNo: "E006",
    schedule: {
      "月": "work", "火": "work", "水": "work", "木": "work", "金": "work", "土": "work", "日": "off",
    },
    workDays: 25,
    offDays: 6,
  },
  {
    id: "7",
    name: "伊藤 四郎",
    employeeNo: "E007",
    schedule: {
      "月": "off", "火": "work", "水": "work", "木": "work", "金": "work", "土": "off", "日": "off",
    },
    workDays: 17,
    offDays: 14,
  },
  {
    id: "8",
    name: "中村 五郎",
    employeeNo: "E008",
    schedule: {
      "月": "work", "火": "work", "水": "off", "木": "work", "金": "work", "土": "half", "日": "off",
    },
    workDays: 19,
    offDays: 12,
  },
];

const dayTypeConfig: Record<DayType, { label: string; className: string }> = {
  work: { label: "出", className: "bg-blue-50 text-blue-700 font-medium" },
  off: { label: "休", className: "bg-slate-100 text-slate-400" },
  half: { label: "半", className: "bg-slate-200 text-slate-600" },
  paid: { label: "有", className: "bg-blue-100 text-blue-700" },
};

export default function WeeklySchedulePage() {
  const [currentMonth, setCurrentMonth] = useState("2026年3月");

  return (
    <MainLayout title="週休スケジュール管理" subtitle="従業員の週休パターン・出勤スケジュール管理">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">登録従業員数</p>
                  <p className="text-2xl font-bold text-slate-900">{scheduleData.length}<span className="text-sm text-slate-400 ml-0.5">名</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">平均出勤日数</p>
                  <p className="text-2xl font-bold text-slate-900">20.4<span className="text-sm text-slate-400 ml-0.5">日</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <CalendarDays className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">今月の営業日数</p>
                  <p className="text-2xl font-bold text-slate-900">22<span className="text-sm text-slate-400 ml-0.5">日</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">本日の出勤予定</p>
                  <p className="text-2xl font-bold text-slate-900">6<span className="text-sm text-slate-400 ml-0.5">名</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-slate-700 min-w-[100px] text-center">{currentMonth}</span>
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="relative ml-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="従業員名で検索..."
                className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 w-56"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
              <Download className="h-3.5 w-3.5" />
              CSV出力
            </Button>
            <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white">
              <Plus className="h-3.5 w-3.5" />
              スケジュール登録
            </Button>
          </div>
        </div>

        {/* Schedule Table */}
        <Card className="border-slate-200/60 shadow-none">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs w-16">社員No</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs w-28">氏名</th>
                    {weekDays.map((day, i) => (
                      <th
                        key={day}
                        className={cn(
                          "pb-3 text-center font-medium text-xs w-14",
                          i >= 5 ? "text-blue-500" : "text-slate-500"
                        )}
                      >
                        {day}
                      </th>
                    ))}
                    <th className="pb-3 text-right font-medium text-slate-500 text-xs w-16">出勤日</th>
                    <th className="pb-3 text-right font-medium text-slate-500 text-xs w-16">休日</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 text-xs text-slate-400">{entry.employeeNo}</td>
                      <td className="py-3 font-medium text-slate-900">{entry.name}</td>
                      {weekDays.map((day) => {
                        const type = entry.schedule[day];
                        const config = dayTypeConfig[type];
                        return (
                          <td key={day} className="py-3 text-center">
                            <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded text-xs", config.className)}>
                              {config.label}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-3 text-right tabular-nums font-medium text-slate-900">{entry.workDays}日</td>
                      <td className="py-3 text-right tabular-nums text-slate-500">{entry.offDays}日</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">
                          編集
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {Object.entries(dayTypeConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded text-[10px]", config.className)}>
                {config.label}
              </span>
              <span>
                {key === "work" && "出勤"}
                {key === "off" && "休日"}
                {key === "half" && "半休"}
                {key === "paid" && "有給"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
