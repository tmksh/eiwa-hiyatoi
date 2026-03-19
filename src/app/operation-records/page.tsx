"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Search, Filter, Download, MapPin, Trash2, Weight, Route } from "lucide-react";

const operationRecords = [
  {
    id: "1",
    date: "2026-03-19",
    driverName: "山田 太郎",
    vehicleNumber: "品川 100 あ 1234",
    vehicleType: "4t",
    routes: [
      { destination: "川崎市処理施設", wasteType: "一般廃棄物", weight: 3.2, distance: 28.5 },
      { destination: "横浜市リサイクルセンター", wasteType: "産業廃棄物", weight: 2.8, distance: 35.2 },
    ],
    totalDistance: 63.7,
    totalWeight: 6.0,
    trips: 2,
    startTime: "06:00",
    endTime: "17:30",
  },
  {
    id: "2",
    date: "2026-03-19",
    driverName: "鈴木 一郎",
    vehicleNumber: "品川 200 い 5678",
    vehicleType: "10t",
    routes: [
      { destination: "東京都中央処理場", wasteType: "一般廃棄物", weight: 8.5, distance: 42.0 },
      { destination: "千葉市最終処分場", wasteType: "産業廃棄物", weight: 7.2, distance: 55.8 },
      { destination: "川崎市処理施設", wasteType: "一般廃棄物", weight: 6.0, distance: 28.5 },
    ],
    totalDistance: 126.3,
    totalWeight: 21.7,
    trips: 3,
    startTime: "05:30",
    endTime: "18:00",
  },
  {
    id: "3",
    date: "2026-03-19",
    driverName: "佐藤 花子",
    vehicleNumber: "品川 300 う 9012",
    vehicleType: "2t",
    routes: [
      { destination: "品川区集積所", wasteType: "資源ごみ", weight: 1.5, distance: 12.3 },
    ],
    totalDistance: 12.3,
    totalWeight: 1.5,
    trips: 1,
    startTime: "07:00",
    endTime: "15:00",
  },
  {
    id: "4",
    date: "2026-03-18",
    driverName: "高橋 健二",
    vehicleNumber: "品川 100 え 3456",
    vehicleType: "4t",
    routes: [
      { destination: "川崎市処理施設", wasteType: "一般廃棄物", weight: 3.8, distance: 28.5 },
      { destination: "東京都中央処理場", wasteType: "産業廃棄物", weight: 4.1, distance: 42.0 },
    ],
    totalDistance: 70.5,
    totalWeight: 7.9,
    trips: 2,
    startTime: "06:30",
    endTime: "17:00",
  },
  {
    id: "5",
    date: "2026-03-18",
    driverName: "田中 次郎",
    vehicleNumber: "品川 200 お 7890",
    vehicleType: "10t",
    routes: [
      { destination: "横浜市リサイクルセンター", wasteType: "資源ごみ", weight: 5.5, distance: 35.2 },
      { destination: "千葉市最終処分場", wasteType: "一般廃棄物", weight: 9.0, distance: 55.8 },
    ],
    totalDistance: 91.0,
    totalWeight: 14.5,
    trips: 2,
    startTime: "05:00",
    endTime: "16:30",
  },
];

const summaryByDestination = [
  { name: "川崎市処理施設", trips: 45, totalWeight: 156.2, totalDistance: 1282.5 },
  { name: "東京都中央処理場", trips: 38, totalWeight: 289.0, totalDistance: 1596.0 },
  { name: "横浜市リサイクルセンター", trips: 32, totalWeight: 112.8, totalDistance: 1126.4 },
  { name: "千葉市最終処分場", trips: 28, totalWeight: 198.5, totalDistance: 1562.4 },
  { name: "品川区集積所", trips: 22, totalWeight: 33.0, totalDistance: 270.6 },
];

const summaryByWasteType = [
  { type: "一般廃棄物", trips: 85, totalWeight: 425.0 },
  { type: "産業廃棄物", trips: 52, totalWeight: 312.5 },
  { type: "資源ごみ", trips: 28, totalWeight: 52.0 },
];

export default function OperationRecordsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-03-19");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <MainLayout title="運行実績管理" subtitle="車両別の運搬実績・運行記録の管理">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Route className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">本日の運行数</p>
                  <p className="text-2xl font-bold text-slate-900">10<span className="text-sm text-slate-400 ml-0.5">件</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">総走行距離</p>
                  <p className="text-2xl font-bold text-slate-900">363.8<span className="text-sm text-slate-400 ml-0.5">km</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Weight className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">総処理量</p>
                  <p className="text-2xl font-bold text-slate-900">51.6<span className="text-sm text-slate-400 ml-0.5">t</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">稼働車両数</p>
                  <p className="text-2xl font-bold text-slate-900">5<span className="text-sm text-slate-400 ml-0.5">台</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ドライバー・車両で検索..."
                className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 w-64"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
              <Filter className="h-3.5 w-3.5" />
              フィルター
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
              <Download className="h-3.5 w-3.5" />
              CSV出力
            </Button>
            <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white">
              <Plus className="h-3.5 w-3.5" />
              新規登録
            </Button>
          </div>
        </div>

        {/* Records Table */}
        <Card className="border-slate-200/60 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900">運行実績一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs">日付</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs">ドライバー</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs">車両</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs">車種</th>
                    <th className="pb-3 text-right font-medium text-slate-500 text-xs">便数</th>
                    <th className="pb-3 text-right font-medium text-slate-500 text-xs">走行距離</th>
                    <th className="pb-3 text-right font-medium text-slate-500 text-xs">処理量</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs">時間</th>
                    <th className="pb-3 text-left font-medium text-slate-500 text-xs"></th>
                  </tr>
                </thead>
                <tbody>
                  {operationRecords.map((record) => (
                    <>
                      <tr
                        key={record.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                      >
                        <td className="py-3 text-slate-700">{record.date}</td>
                        <td className="py-3 font-medium text-slate-900">{record.driverName}</td>
                        <td className="py-3 text-slate-600 text-xs">{record.vehicleNumber}</td>
                        <td className="py-3">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {record.vehicleType}
                          </span>
                        </td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{record.trips}</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">{record.totalDistance} km</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">{record.totalWeight} t</td>
                        <td className="py-3 text-slate-600 text-xs">{record.startTime}〜{record.endTime}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">
                            詳細
                          </Button>
                        </td>
                      </tr>
                      {expandedId === record.id && (
                        <tr key={`${record.id}-detail`}>
                          <td colSpan={9} className="bg-slate-50/50 px-4 py-3">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-slate-500 mb-2">運搬明細</p>
                              {record.routes.map((route, idx) => (
                                <div key={idx} className="flex items-center gap-4 rounded-lg bg-white border border-slate-100 px-4 py-2.5">
                                  <div className="flex items-center gap-2 flex-1">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">{route.destination}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-sm text-slate-600">{route.wasteType}</span>
                                  </div>
                                  <span className="text-sm tabular-nums text-slate-700 font-medium">{route.weight} t</span>
                                  <span className="text-sm tabular-nums text-slate-600">{route.distance} km</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Sections */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* By Destination */}
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-slate-600" />
                </div>
                運搬先別集計（今月）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summaryByDestination.map((dest) => (
                  <div key={dest.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{dest.name}</p>
                      <p className="text-xs text-slate-400">{dest.trips}便</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-slate-900">{dest.totalWeight} t</p>
                      <p className="text-xs text-slate-400 tabular-nums">{dest.totalDistance} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Waste Type */}
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5 text-blue-600" />
                </div>
                ごみ種類別集計（今月）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summaryByWasteType.map((waste) => {
                  const maxWeight = Math.max(...summaryByWasteType.map(w => w.totalWeight));
                  const percentage = (waste.totalWeight / maxWeight) * 100;
                  return (
                    <div key={waste.type} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{waste.type}</span>
                          <span className="text-xs text-slate-400">({waste.trips}便)</span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-slate-900">{waste.totalWeight} t</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-slate-400" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
