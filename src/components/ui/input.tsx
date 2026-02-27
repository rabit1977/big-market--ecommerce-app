import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary/20 flex h-10 w-full min-w-0 rounded-lg border border-border bg-input px-4 py-2 text-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-primary/50 focus-visible:bg-background",
        "hover:bg-secondary/20",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

