import { Decimal } from "decimal.js";
import { prisma } from "@/lib/db";
import {
  CalculationInput,
  CalculationResult,
  CalculationLogEntry,
  WageRuleData,
  RestraintRule,
} from "./types";
import {
  calculateWorkMinutes,
  calculateRestraintMinutes,
  calculateNightMinutes,
  roundOvertimeMinutes,
} from "./time-utils";

export class WageCalculator {
  /**
   * 該当する賃金ルールを取得
   */
  private async getApplicableRule(
    companyId: string,
    vehicleTypeId: string,
    workDate: Date
  ): Promise<WageRuleData> {
    const rule = await prisma.wageRule.findFirst({
      where: {
        companyId,
        vehicleTypeId,
        isActive: true,
        effectiveFrom: { lte: workDate },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: workDate } }],
      },
      include: {
        company: {
          select: {
            overtimeUnit: true,
            roundingMethod: true,
            restraintRule: true,
          },
        },
      },
      orderBy: { effectiveFrom: "desc" },
    });

    if (!rule) {
      throw new Error(
        `賃金ルールが見つかりません: 会社=${companyId}, 車種=${vehicleTypeId}, 日付=${workDate.toISOString()}`
      );
    }

    return rule as unknown as WageRuleData;
  }

  /**
   * 拘束手当を計算
   */
  private calculateRestraintAllowance(
    restraintMinutes: number,
    rule: RestraintRule | null
  ): Decimal {
    if (!rule || !rule.conditions) {
      return new Decimal(0);
    }

    const restraintHours = restraintMinutes / 60;

    for (const condition of rule.conditions) {
      const minOk = restraintHours >= condition.minHours;
      const maxOk =
        condition.maxHours === null || restraintHours < condition.maxHours;

      if (minOk && maxOk) {
        return new Decimal(condition.allowance);
      }
    }

    return new Decimal(0);
  }

  /**
   * メイン計算処理
   */
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    const log: CalculationLogEntry[] = [];

    // 1. 該当する賃金ルールを取得
    const rule = await this.getApplicableRule(
      input.companyId,
      input.vehicleTypeId,
      input.workDate
    );
    log.push({
      step: "ルール取得",
      ruleId: rule.id,
      baseDailyWage: rule.baseDailyWage.toString(),
      baseHours: rule.baseHours.toString(),
    });

    // 2. 実労働時間を計算
    const workMinutes = calculateWorkMinutes(
      input.startTime,
      input.endTime,
      input.breakMinutes
    );
    log.push({
      step: "実労働時間計算",
      startTime: input.startTime,
      endTime: input.endTime,
      breakMinutes: input.breakMinutes,
      workMinutes,
    });

    // 3. 残業時間を計算
    const baseMinutes = new Decimal(rule.baseHours).mul(60).toNumber();
    const rawOvertimeMinutes = Math.max(0, workMinutes - baseMinutes);
    const overtimeMinutes = roundOvertimeMinutes(
      rawOvertimeMinutes,
      rule.company.overtimeUnit,
      rule.company.roundingMethod as "floor" | "ceil" | "round"
    );
    log.push({
      step: "残業時間計算",
      baseMinutes,
      rawOvertimeMinutes,
      overtimeUnit: rule.company.overtimeUnit,
      roundingMethod: rule.company.roundingMethod,
      overtimeMinutes,
    });

    // 4. 深夜時間を計算
    const nightMinutes = input.isNightShift
      ? calculateNightMinutes(input.startTime, input.endTime, input.breakMinutes)
      : 0;
    log.push({ step: "深夜時間計算", nightMinutes });

    // 5. 基本給
    const baseWage = new Decimal(rule.baseDailyWage);
    log.push({ step: "基本給", value: baseWage.toString() });

    // 6. 残業代計算
    let overtimeRate: Decimal;
    if (input.isHoliday && rule.overtimeRateHoliday) {
      overtimeRate = new Decimal(rule.overtimeRateHoliday);
    } else if (input.isNightShift && rule.overtimeRateLate) {
      overtimeRate = new Decimal(rule.overtimeRateLate);
    } else {
      overtimeRate = new Decimal(rule.overtimeRateNormal || 0);
    }

    const overtimeWage = overtimeRate.mul(overtimeMinutes).div(60).floor();
    log.push({
      step: "残業代計算",
      overtimeMinutes,
      overtimeRate: overtimeRate.toString(),
      overtimeWage: overtimeWage.toString(),
    });

    // 7. 深夜手当
    const nightRate = new Decimal(rule.overtimeRateLate || 0);
    const nightWage = nightRate
      .mul(nightMinutes)
      .div(60)
      .mul(0.25) // 深夜割増分のみ
      .floor();
    log.push({
      step: "深夜手当計算",
      nightMinutes,
      nightWage: nightWage.toString(),
    });

    // 8. 休日手当（休日の場合、基本給に対して加算）
    const holidayWage = input.isHoliday
      ? baseWage.mul(0.35).floor() // 35%割増
      : new Decimal(0);
    log.push({
      step: "休日手当計算",
      isHoliday: input.isHoliday,
      holidayWage: holidayWage.toString(),
    });

    // 9. 拘束手当
    const restraintMinutes = calculateRestraintMinutes(
      input.startTime,
      input.endTime
    );
    const restraintAllowance = this.calculateRestraintAllowance(
      restraintMinutes,
      rule.company.restraintRule as RestraintRule | null
    );
    log.push({
      step: "拘束手当計算",
      restraintMinutes,
      restraintHours: (restraintMinutes / 60).toFixed(2),
      restraintAllowance: restraintAllowance.toString(),
    });

    // 10. 合計
    const totalWage = baseWage
      .add(overtimeWage)
      .add(nightWage)
      .add(holidayWage)
      .add(restraintAllowance);
    log.push({
      step: "合計計算",
      totalWage: totalWage.toString(),
    });

    return {
      workMinutes,
      overtimeMinutes,
      nightMinutes,
      baseWage,
      overtimeWage,
      nightWage,
      holidayWage,
      restraintAllowance,
      otherAllowances: new Decimal(0),
      totalWage,
      calculationLog: log,
      appliedRule: rule,
    };
  }

  /**
   * 一括計算
   */
  async calculateBatch(
    inputs: CalculationInput[]
  ): Promise<Map<string, CalculationResult | Error>> {
    const results = new Map<string, CalculationResult | Error>();

    // 並列実行（10件ずつ）
    const batchSize = 10;
    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);
      const promises = batch.map(async (input) => {
        const key = `${input.workDate.toISOString()}_${input.workerId}`;
        try {
          const result = await this.calculate(input);
          results.set(key, result);
        } catch (error) {
          results.set(key, error as Error);
        }
      });
      await Promise.all(promises);
    }

    return results;
  }
}

// シングルトンインスタンス
export const wageCalculator = new WageCalculator();
