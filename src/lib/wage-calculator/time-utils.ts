/**
 * "HH:mm" 形式の時刻を分に変換
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * 分を "HH:mm" 形式に変換
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * 分を "Xh Ym" 形式に変換（表示用）
 */
export function minutesToDisplay(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

/**
 * 労働時間を計算（日跨ぎ対応）
 */
export function calculateWorkMinutes(
  startTime: string,
  endTime: string,
  breakMinutes: number
): number {
  let startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);

  // 日跨ぎ対応（退勤が出勤より前の場合、翌日とみなす）
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes;
  const workMinutes = totalMinutes - breakMinutes;

  return Math.max(0, workMinutes);
}

/**
 * 拘束時間を計算（休憩を含む総時間）
 */
export function calculateRestraintMinutes(
  startTime: string,
  endTime: string
): number {
  let startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

/**
 * 深夜時間帯（22:00-05:00）の労働時間を計算
 */
export function calculateNightMinutes(
  startTime: string,
  endTime: string,
  breakMinutes: number
): number {
  const NIGHT_START = 22 * 60; // 22:00
  const NIGHT_END = 5 * 60; // 05:00

  let start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);

  if (end < start) {
    end += 24 * 60;
  }

  let nightMinutes = 0;

  // 22:00以降の深夜時間
  if (end > NIGHT_START) {
    const nightStart = Math.max(start, NIGHT_START);
    const nightEnd = Math.min(end, 24 * 60);
    nightMinutes += Math.max(0, nightEnd - nightStart);
  }

  // 翌日05:00までの深夜時間
  if (end > 24 * 60) {
    const earlyMorningEnd = Math.min(end - 24 * 60, NIGHT_END);
    nightMinutes += Math.max(0, earlyMorningEnd);
  }

  // 休憩時間を深夜時間から按分で引く（簡略化）
  const totalWork = end - start;
  const nightRatio = totalWork > 0 ? nightMinutes / totalWork : 0;
  nightMinutes -= Math.floor(breakMinutes * nightRatio);

  return Math.max(0, nightMinutes);
}

/**
 * 残業時間を丸める
 */
export function roundOvertimeMinutes(
  minutes: number,
  unit: number,
  method: "floor" | "ceil" | "round"
): number {
  if (unit <= 0) return minutes;

  switch (method) {
    case "floor":
      return Math.floor(minutes / unit) * unit;
    case "ceil":
      return Math.ceil(minutes / unit) * unit;
    case "round":
      return Math.round(minutes / unit) * unit;
    default:
      return minutes;
  }
}
