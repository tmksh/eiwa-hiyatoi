"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Check, ChevronsUpDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const mockWorkers = [
  { id: "1", name: "山田 太郎", code: "E001" },
  { id: "2", name: "鈴木 一郎", code: "E002" },
  { id: "3", name: "佐藤 花子", code: "E003" },
  { id: "4", name: "高橋 健二", code: "E004" },
  { id: "5", name: "田中 美咲", code: "E005" },
];

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

const mockVehicleTypes = [
  { id: "1", companyId: "1", name: "2t" },
  { id: "2", companyId: "1", name: "4t" },
  { id: "3", companyId: "1", name: "10t" },
  { id: "4", companyId: "2", name: "2t" },
  { id: "5", companyId: "2", name: "4t" },
  { id: "6", companyId: "2", name: "10t" },
  { id: "7", companyId: "3", name: "2t" },
  { id: "8", companyId: "3", name: "4t" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NewDailyReportPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [workerOpen, setWorkerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("60");
  const [isHoliday, setIsHoliday] = useState(false);
  const [isNightShift, setIsNightShift] = useState(false);
  const [notes, setNotes] = useState("");

  // Filter vehicle types based on selected company
  const availableVehicles = mockVehicleTypes.filter(
    (v) => v.companyId === selectedCompany
  );

  // Calculate estimated wage (mock calculation)
  const calculateEstimate = () => {
    if (!startTime || !endTime) return null;

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // 日跨ぎ対応

    const workMinutes = totalMinutes - parseInt(breakMinutes);
    const workHours = workMinutes / 60;
    const overtimeHours = Math.max(0, workHours - 8);

    // Mock calculation
    const baseWage = 11000;
    const overtimeRate = 1500;
    const estimated = baseWage + Math.floor(overtimeHours * overtimeRate);

    return {
      workHours: workHours.toFixed(1),
      overtimeHours: overtimeHours.toFixed(1),
      estimated,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmit = () => {
    if (!selectedWorker || !selectedCompany || !selectedVehicle) {
      toast.error("必須項目を入力してください");
      return;
    }

    // TODO: Actually save to DB
    toast.success("日報を保存しました");
    router.push("/daily-reports");
  };

  const handleSubmitAndNext = () => {
    if (!selectedWorker || !selectedCompany || !selectedVehicle) {
      toast.error("必須項目を入力してください");
      return;
    }

    // TODO: Actually save to DB
    toast.success("日報を保存しました");

    // Reset form for next entry
    setSelectedWorker("");
    setStartTime("08:00");
    setEndTime("17:00");
    setBreakMinutes("60");
    setIsHoliday(false);
    setIsNightShift(false);
    setNotes("");
  };

  return (
    <MainLayout title="日報入力">
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>日報を入力</CardTitle>
                <CardDescription>
                  作業員の勤務情報を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date */}
                <div className="grid gap-2">
                  <Label>作業日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date
                          ? format(date, "yyyy年M月d日（E）", { locale: ja })
                          : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Worker */}
                <div className="grid gap-2">
                  <Label>作業員</Label>
                  <Popover open={workerOpen} onOpenChange={setWorkerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={workerOpen}
                        className="w-full justify-between"
                      >
                        {selectedWorker
                          ? mockWorkers.find((w) => w.id === selectedWorker)
                              ?.name
                          : "作業員を選択..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="名前で検索..." />
                        <CommandList>
                          <CommandEmpty>見つかりませんでした</CommandEmpty>
                          <CommandGroup>
                            {mockWorkers.map((worker) => (
                              <CommandItem
                                key={worker.id}
                                value={worker.name}
                                onSelect={() => {
                                  setSelectedWorker(worker.id);
                                  setWorkerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedWorker === worker.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <span className="font-mono text-sm mr-2">
                                  {worker.code}
                                </span>
                                {worker.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Company & Vehicle */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>派遣先会社</Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={(v) => {
                        setSelectedCompany(v);
                        setSelectedVehicle(""); // Reset vehicle when company changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="会社を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>車種</Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={setSelectedVehicle}
                      disabled={!selectedCompany}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="車種を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>出勤時間</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>退勤時間</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>休憩時間（分）</Label>
                    <Select value={breakMinutes} onValueChange={setBreakMinutes}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0分</SelectItem>
                        <SelectItem value="30">30分</SelectItem>
                        <SelectItem value="45">45分</SelectItem>
                        <SelectItem value="60">60分</SelectItem>
                        <SelectItem value="90">90分</SelectItem>
                        <SelectItem value="120">120分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isHoliday"
                      checked={isHoliday}
                      onCheckedChange={(checked) =>
                        setIsHoliday(checked as boolean)
                      }
                    />
                    <Label htmlFor="isHoliday" className="cursor-pointer">
                      休日出勤
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNightShift"
                      checked={isNightShift}
                      onCheckedChange={(checked) =>
                        setIsNightShift(checked as boolean)
                      }
                    />
                    <Label htmlFor="isNightShift" className="cursor-pointer">
                      深夜勤務
                    </Label>
                  </div>
                </div>

                {/* Notes */}
                <div className="grid gap-2">
                  <Label>備考</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="特記事項があれば入力"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => router.back()}>
                    キャンセル
                  </Button>
                  <Button variant="secondary" onClick={handleSubmit}>
                    保存
                  </Button>
                  <Button onClick={handleSubmitAndNext}>
                    保存して次へ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimate Panel */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">概算プレビュー</CardTitle>
                <CardDescription>
                  入力内容から概算を計算します
                </CardDescription>
              </CardHeader>
              <CardContent>
                {estimate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          実労働時間
                        </p>
                        <p className="text-2xl font-bold">
                          {estimate.workHours}
                          <span className="text-base font-normal">時間</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">残業時間</p>
                        <p className="text-2xl font-bold">
                          {estimate.overtimeHours}
                          <span className="text-base font-normal">時間</span>
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground">概算支給額</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(estimate.estimated)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ※ 実際の金額は計算実行後に確定します
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    時間を入力すると概算が表示されます
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
