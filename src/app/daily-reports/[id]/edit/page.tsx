"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data
const mockReport = {
  id: "1",
  workDate: new Date("2024-01-28"),
  workerId: "1",
  workerName: "山田 太郎",
  companyId: "1",
  companyName: "A運輸株式会社",
  vehicleTypeId: "2",
  vehicleTypeName: "4tトラック",
  startTime: "08:00",
  endTime: "19:30",
  breakMinutes: 60,
  isHoliday: false,
  isNightShift: false,
  notes: "",
  status: "calculated" as Status,
};

const mockCompanies = [
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

const mockVehicleTypes = [
  { id: "1", companyId: "1", name: "2tトラック" },
  { id: "2", companyId: "1", name: "4tトラック" },
  { id: "3", companyId: "1", name: "10tトラック" },
  { id: "4", companyId: "2", name: "2tトラック" },
  { id: "5", companyId: "2", name: "4tトラック" },
  { id: "6", companyId: "2", name: "10tトラック" },
  { id: "7", companyId: "3", name: "2tトラック" },
  { id: "8", companyId: "3", name: "4tトラック" },
];

export default function EditDailyReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Initialize with mock data
  const [selectedCompany, setSelectedCompany] = useState(mockReport.companyId);
  const [selectedVehicle, setSelectedVehicle] = useState(
    mockReport.vehicleTypeId
  );
  const [startTime, setStartTime] = useState(mockReport.startTime);
  const [endTime, setEndTime] = useState(mockReport.endTime);
  const [breakMinutes, setBreakMinutes] = useState(
    String(mockReport.breakMinutes)
  );
  const [isHoliday, setIsHoliday] = useState(mockReport.isHoliday);
  const [isNightShift, setIsNightShift] = useState(mockReport.isNightShift);
  const [notes, setNotes] = useState(mockReport.notes);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableVehicles = mockVehicleTypes.filter(
    (v) => v.companyId === selectedCompany
  );

  // Calculate work hours
  const calculateWorkHours = () => {
    if (!startTime || !endTime) return null;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const workMinutes = totalMinutes - parseInt(breakMinutes);
    return (workMinutes / 60).toFixed(1);
  };

  const workHours = calculateWorkHours();

  const handleSave = () => {
    toast.success("日報を更新しました");
    router.push("/daily-reports");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("日報を削除しました");
    router.push("/daily-reports");
  };

  return (
    <MainLayout title="日報編集">
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>日報を編集</CardTitle>
                    <CardDescription>
                      {format(mockReport.workDate, "yyyy年M月d日（E）", {
                        locale: ja,
                      })}{" "}
                      - {mockReport.workerName}
                    </CardDescription>
                  </div>
                  <StatusBadge status={mockReport.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Worker Info (Read-only) */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">作業員</p>
                      <p className="font-medium">{mockReport.workerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">作業日</p>
                      <p className="font-medium">
                        {format(mockReport.workDate, "yyyy年M月d日（E）", {
                          locale: ja,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company & Vehicle */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>派遣先会社</Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={(v) => {
                        setSelectedCompany(v);
                        setSelectedVehicle("");
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
                <div className="flex items-center justify-between pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        削除
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          日報を削除しますか？
                        </DialogTitle>
                        <DialogDescription>
                          この操作は取り消せません。関連する計算結果も削除されます。
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">キャンセル</Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "削除中..." : "削除する"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
                      キャンセル
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      保存
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">変更プレビュー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workHours && (
                  <>
                    <div className="text-center py-4 rounded-lg bg-primary/5">
                      <p className="text-sm text-muted-foreground">実労働時間</p>
                      <p className="text-3xl font-bold text-primary">
                        {workHours}
                        <span className="text-lg font-normal">時間</span>
                      </p>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">派遣先</span>
                        <span>
                          {
                            mockCompanies.find((c) => c.id === selectedCompany)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">車種</span>
                        <span>
                          {
                            mockVehicleTypes.find(
                              (v) => v.id === selectedVehicle
                            )?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">勤務時間</span>
                        <span>
                          {startTime} 〜 {endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isHoliday && (
                        <Badge variant="secondary">休日出勤</Badge>
                      )}
                      {isNightShift && (
                        <Badge variant="secondary">深夜勤務</Badge>
                      )}
                    </div>
                  </>
                )}

                {mockReport.status === "calculated" && (
                  <p className="text-xs text-muted-foreground text-center">
                    保存後、再計算が必要な場合があります
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
