import { cn } from "./cn";

export function OrderSkeleton({ className }: { className?: string }) {
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[18px] border border-border bg-card p-5 space-y-3">
            <div className="h-4 w-16 rounded bg-accent animate-pulse" />
            <div className="h-6 w-12 rounded bg-accent animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-border bg-card p-6 space-y-4">
        <div className="h-6 w-40 rounded bg-accent animate-pulse" />
        <div className="h-64 w-full rounded-xl bg-accent animate-pulse" />
      </div>

      <div className="rounded-[18px] border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <div className="h-5 w-32 rounded bg-accent animate-pulse" />
        </div>
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-b-0">
              <div className="h-4 w-20 rounded bg-accent animate-pulse" />
              <div className="h-4 w-32 rounded bg-accent animate-pulse" />
              <div className="h-4 w-16 rounded bg-accent animate-pulse" />
              <div className="h-4 w-20 rounded bg-accent animate-pulse" />
              <div className="h-4 w-16 rounded bg-accent animate-pulse" />
              <div className="h-4 w-20 rounded bg-accent animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
