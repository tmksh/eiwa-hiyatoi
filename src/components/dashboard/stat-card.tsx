import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant: "warning" | "error" | "success";
  };
  tags?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
  progress?: {
    current: number;
    total: number;
  };
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

const iconBg = {
  default: "bg-slate-500/10 text-slate-600",
  primary: "bg-blue-500/10 text-blue-600",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  error: "bg-red-500/10 text-red-600",
};

const progressColors = {
  default: "bg-slate-300",
  primary: "bg-blue-400",
  success: "bg-slate-400",
  warning: "bg-blue-400",
  error: "bg-slate-500",
};

const badgeStyles = {
  warning: "bg-blue-50 text-blue-700 ring-blue-200",
  error: "bg-slate-100 text-slate-700 ring-slate-300",
  success: "bg-slate-100 text-slate-700 ring-slate-300",
};

export function StatCard({
  title,
  value,
  unit,
  subValue,
  icon: Icon,
  trend,
  badge,
  tags,
  progress,
  variant = "default",
}: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg[variant])}>
          <Icon className="h-5 w-5" />
        </div>

        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            trend.isPositive ? "text-blue-600" : "text-slate-500"
          )}>
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.isPositive ? "+" : ""}{trend.value}%
          </div>
        )}

        {badge && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[11px] font-medium ring-1",
            badgeStyles[badge.variant]
          )}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
        {subValue && <span className="text-sm text-slate-400">/ {subValue}</span>}
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progressColors[variant])}
              style={{ width: `${Math.min((progress.current / progress.total) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-medium",
                tag.color || "bg-slate-50 text-slate-600"
              )}
            >
              {tag.label} {tag.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
