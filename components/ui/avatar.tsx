import * as React from "react";
import Image from "next/image";

import { cn } from "@/components/ui/cn";

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

interface AvatarImageProps extends React.ComponentProps<"img"> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

function AvatarImage({
  className,
  src,
  alt = "Avatar",
  width = 40,
  height = 40,
  ...props
}: AvatarImageProps) {
  return (
    <Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover rounded-full",
        className
      )}
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
