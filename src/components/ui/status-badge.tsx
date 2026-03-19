import { cn } from "@/lib/utils";

export type Status = "draft" | "submitted" | "approved" | "rejected" | "calculated" | "confirmed" | "paid" | "error";

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: "下書き",
    className: "bg-slate-100 text-slate-600",
  },
  submitted: {
    label: "承認待ち",
    className: "bg-blue-50 text-blue-600",
  },
  approved: {
    label: "承認済",
    className: "bg-slate-100 text-slate-700",
  },
  rejected: {
    label: "却下",
    className: "bg-slate-100 text-slate-500",
  },
  calculated: {
    label: "計算済",
    className: "bg-blue-50 text-blue-600",
  },
  confirmed: {
    label: "確定",
    className: "bg-slate-200 text-slate-700",
  },
  paid: {
    label: "支払済",
    className: "bg-slate-200 text-slate-700",
  },
  error: {
    label: "エラー",
    className: "bg-slate-100 text-slate-500",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
