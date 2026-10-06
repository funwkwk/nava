import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const buttonVariants = {
  primary:
    "bg-[var(--surface-brand)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--surface-brand-strong)]",
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--surface-card)] text-foreground hover:border-[var(--border-strong)] hover:bg-[var(--surface-card-alt)]",
  ghost: "bg-transparent text-foreground hover:bg-[var(--surface-card-alt)]",
  danger: "bg-[var(--surface-critical)] text-white hover:opacity-90",
};

const buttonSizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--surface-brand)] focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
});

function fieldClasses(className?: string) {
  return cn(
    "w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--surface-brand)] focus:ring-4 focus:ring-[var(--surface-brand-soft)]",
    className,
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={fieldClasses(className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select ref={ref} className={fieldClasses(className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={fieldClasses(cn("min-h-28 resize-y", className))}
      {...props}
    />
  );
});

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "brand" | "success" | "warning" | "critical";
}) {
  const tones = {
    neutral:
      "border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--muted-foreground)]",
    brand: "bg-[var(--surface-brand-soft)] text-[var(--surface-brand)]",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--surface-brand)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <Card className="space-y-3 p-5">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <div className="space-y-1.5">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm text-[var(--muted-foreground)]">{delta}</p>
      </div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex min-h-56 flex-col items-start justify-center gap-4 border-dashed bg-[var(--surface-card-alt)]">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {action}
    </Card>
  );
}
