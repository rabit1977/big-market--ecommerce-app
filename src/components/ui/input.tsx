import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary/20 flex h-10 w-full min-w-0 rounded-lg border-1 border-card-foreground/20 bg-input px-4 py-2 text-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-card-foreground/50 focus-visible:bg-card ring-2 ring-primary/10",
        "hover:border-card-foreground/40 hover:bg-secondary/30",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

