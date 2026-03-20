"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Check, X } from "lucide-react";

const pendingApprovals = [
  {
    id: "1",
    workerName: "山田 太郎",
    company: "A運輸",
    submittedAt: "19:35",
    startTime: "08:00",
    endTime: "19:30",
  },
  {
    id: "2",
    workerName: "鈴木 一郎",
    company: "A運輸",
    submittedAt: "18:05",
    startTime: "07:00",
    endTime: "18:00",
  },
  {
    id: "3",
    workerName: "佐藤 花子",
    company: "B物流",
    submittedAt: "20:10",
    startTime: "06:00",
    endTime: "20:00",
  },
];

export function PendingApprovalsWidget() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
          </div>
          承認待ち日報
          <span className="ml-1 h-5 min-w-5 rounded-full bg-blue-100 px-1.5 text-[11px] font-semibold text-blue-700 flex items-center justify-center">
            {pendingApprovals.length}
          </span>
        </CardTitle>
        <Link href="/daily-reports?status=submitted">
          <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 gap-1 h-7">
            すべて表示
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingApprovals.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">承認待ちの日報はありません</p>
        ) : (
          pendingApprovals.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center text-sm font-medium text-slate-600">
                  {item.workerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.workerName}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.company} / {item.startTime}〜{item.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 mr-1">{item.submittedAt}</span>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 rounded-md">
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500 hover:bg-slate-100 rounded-md">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
