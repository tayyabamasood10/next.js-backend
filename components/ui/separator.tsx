import * as React from "react";

import { cn } from "@/components/ui/cn";

function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<"hr"> & { orientation?: "horizontal" | "vertical", decorative?: boolean }) {
  return (
    <hr
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-slot="separator"
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
