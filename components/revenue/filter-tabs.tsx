import { cn } from "@/components/ui/cn";

interface FilterTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabs({ items, active, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl bg-accent/60 p-1", className)}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
            active === item
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
