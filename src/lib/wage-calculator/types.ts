import { Decimal } from "decimal.js";

export interface TimeRange {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface WageRuleData {
  id: string;
  companyId: string;
  vehicleTypeId: string;
  baseDailyWage: Decimal;
  baseHours: Decimal;
  overtimeRateNormal: Decimal | null;
  overtimeRateLate: Decimal | null;
  overtimeRateHoliday: Decimal | null;
  restraintStartHour: number | null;
  restraintAllowance: Decimal | null;
  allowances: Record<string, unknown>;
  company: {
    overtimeUnit: number;
    roundingMethod: string;
    restraintRule: RestraintRule | null;
  };
}

export interface RestraintRule {
  type: "threshold" | "hourly";
  conditions: RestraintCondition[];
  includesBreak: boolean;
}

export interface RestraintCondition {
  minHours: number;
  maxHours: number | null;
  allowance: number;
}

export interface CalculationInput {
  workDate: Date;
  workerId: string;
  companyId: string;
  vehicleTypeId: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  isHoliday: boolean;
  isNightShift: boolean;
  manualAdjustments?: ManualAdjustment[];
}

export interface ManualAdjustment {
  type: "add" | "subtract" | "override";
  field: "baseWage" | "overtimeWage" | "otherAllowances";
  amount: number;
  reason: string;
}

export interface CalculationLogEntry {
  step: string;
  detail?: unknown;
  value?: number | string;
  unit?: string;
  [key: string]: unknown;
}

export interface CalculationResult {
  workMinutes: number;
  overtimeMinutes: number;
  nightMinutes: number;
  baseWage: Decimal;
  overtimeWage: Decimal;
  nightWage: Decimal;
  holidayWage: Decimal;
  restraintAllowance: Decimal;
  otherAllowances: Decimal;
  totalWage: Decimal;
  calculationLog: CalculationLogEntry[];
  appliedRule: WageRuleData;
}
