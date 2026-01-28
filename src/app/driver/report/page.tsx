"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DriverLayout } from "@/components/layout/driver-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Coffee, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock data
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

// Mock: 却下された日報のデータ（実際はAPIから取得）
const mockRejectedReport = {
  id: "2",
  companyId: "1",
  vehicleId: "2",
  startTime: "07:00",
  endTime: "18:00",
  breakMinutes: "60",
  isHoliday: false,
  notes: "",
  rejectionReason: "退勤時間が実際と異なります。正しい時間を入力してください。",
};

export default function DriverReportPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const today = new Date();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("60");
  const [isHoliday, setIsHoliday] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // 編集モードの場合、却下された日報のデータを読み込む
  useEffect(() => {
    if (isEditing) {
      // 実際はAPIから取得
      setSelectedCompany(mockRejectedReport.companyId);
      setSelectedVehicle(mockRejectedReport.vehicleId);
      setStartTime(mockRejectedReport.startTime);
      setEndTime(mockRejectedReport.endTime);
      setBreakMinutes(mockRejectedReport.breakMinutes);
      setIsHoliday(mockRejectedReport.isHoliday);
      setNotes(mockRejectedReport.notes);
      setRejectionReason(mockRejectedReport.rejectionReason);
    }
  }, [isEditing]);

  const availableVehicles = mockVehicleTypes.filter(
    (v) => v.companyId === selectedCompany
  );

  // Calculate work hours
  const calculateWorkHours = () => {
    if (!startTime || !endTime) return null;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const workMinutes = totalMinutes - parseInt(breakMinutes);
    return (workMinutes / 60).toFixed(1);
  };

  const workHours = calculateWorkHours();

  const handleSubmit = async () => {
    if (!selectedCompany || !selectedVehicle) {
      toast.error("派遣先と車種を選択してください");
      return;
    }

    setIsSubmitting(true);

    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setRejectionReason(null);
    toast.success(isEditing ? "日報を再提出しました" : "日報を提出しました");
  };

  if (isSubmitted) {
    return (
      <DriverLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">提出完了</h2>
          <p className="mb-6 text-muted-foreground">
            本日の日報を提出しました
          </p>
          <Card className="w-full">
            <CardContent className="pt-6">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">日付</dt>
                  <dd className="font-medium">
                    {format(today, "yyyy年M月d日（E）", { locale: ja })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">派遣先</dt>
                  <dd className="font-medium">
                    {mockCompanies.find((c) => c.id === selectedCompany)?.name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">車種</dt>
                  <dd className="font-medium">
                    {mockVehicleTypes.find((v) => v.id === selectedVehicle)?.name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">勤務時間</dt>
                  <dd className="font-medium">
                    {startTime} 〜 {endTime}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">実働</dt>
                  <dd className="font-medium">{workHours}時間</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setIsSubmitted(false)}
          >
            内容を修正する
          </Button>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="space-y-6 pb-32">
        {/* Date Header */}
        <div className="text-center">
          <Badge variant={isEditing ? "destructive" : "secondary"} className="mb-3 text-sm px-4 py-1.5">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            {isEditing ? "修正が必要" : "本日"}
          </Badge>
          <h1 className="text-3xl font-bold">
            {format(today, "M月d日（E）", { locale: ja })}
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            {isEditing ? "の日報を修正" : "の日報を入力"}
          </p>
        </div>

        {/* 却下理由の表示 */}
        {rejectionReason && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">却下理由</p>
                  <p className="text-sm text-red-700 mt-1">{rejectionReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">勤務情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">派遣先</Label>
              <Select
                value={selectedCompany}
                onValueChange={(v) => {
                  setSelectedCompany(v);
                  setSelectedVehicle("");
                }}
              >
                <SelectTrigger className="h-14 text-base">
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

            {/* Vehicle */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">車種</Label>
              <Select
                value={selectedVehicle}
                onValueChange={setSelectedVehicle}
                disabled={!selectedCompany}
              >
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="車種を選択" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id} className="text-base">
                      {vehicle.name}トラック
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5" />
                  出勤
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-14 text-xl font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5" />
                  退勤
                </Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-14 text-xl font-semibold"
                />
              </div>
            </div>

            {/* Break */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Coffee className="h-5 w-5" />
                休憩時間
              </Label>
              <Select value={breakMinutes} onValueChange={setBreakMinutes}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className="text-base">なし</SelectItem>
                  <SelectItem value="30" className="text-base">30分</SelectItem>
                  <SelectItem value="45" className="text-base">45分</SelectItem>
                  <SelectItem value="60" className="text-base">60分</SelectItem>
                  <SelectItem value="90" className="text-base">90分</SelectItem>
                  <SelectItem value="120" className="text-base">120分</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Holiday Flag */}
            <div className="flex items-center space-x-4 rounded-xl border-2 p-5">
              <Checkbox
                id="isHoliday"
                checked={isHoliday}
                onCheckedChange={(checked) => setIsHoliday(checked as boolean)}
                className="h-6 w-6"
              />
              <Label htmlFor="isHoliday" className="flex-1 cursor-pointer">
                <span className="font-bold text-base">休日出勤</span>
                <p className="text-sm text-muted-foreground mt-0.5">
                  日曜・祝日の場合はチェック
                </p>
              </Label>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">備考（任意）</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="特記事項があれば入力"
                className="h-14 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {workHours && (
          <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-amber-700">実働時間</span>
                <span className="text-4xl font-bold text-amber-600">
                  {workHours}
                  <span className="text-xl font-semibold ml-1">時間</span>
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          size="lg"
          className={`w-full h-16 text-xl font-bold rounded-xl shadow-lg ${isEditing ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-amber-200/50"}`}
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedCompany || !selectedVehicle}
        >
          {isSubmitting ? (
            "送信中..."
          ) : (
            <>
              <Send className="mr-2 h-6 w-6" />
              {isEditing ? "修正して再提出" : "日報を提出"}
            </>
          )}
        </Button>
      </div>
    </DriverLayout>
  );
}
