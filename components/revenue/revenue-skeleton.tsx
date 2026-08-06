import { cn } from "./cn";

export function RevenueSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="h-8 w-48 rounded-lg bg-accent animate-pulse" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[18px] border border-border bg-card p-6 space-y-3">
            <div className="h-4 w-24 rounded bg-accent animate-pulse" />
            <div className="h-8 w-32 rounded bg-accent animate-pulse" />
            <div className="h-3 w-20 rounded bg-accent animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-border bg-card p-6 space-y-4">
        <div className="h-6 w-40 rounded bg-accent animate-pulse" />
        <div className="h-64 w-full rounded-xl bg-accent animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[18px] border border-border bg-card p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-accent animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-accent animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-[18px] border border-border bg-card p-6 space-y-4">
          <div className="h-6 w-40 rounded bg-accent animate-pulse" />
          <div className="h-48 w-full rounded-xl bg-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
