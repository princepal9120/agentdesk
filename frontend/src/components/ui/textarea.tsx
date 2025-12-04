/**
 * Clinical Minimalism Textarea Component
 * Medical-grade clean with calm styling.
 */

import * as React from "react"
import { cn } from "@/utils/cn"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[120px] w-full rounded-2xl border border-grey-200 bg-white px-4 py-3 text-sm text-grey-900",
                    "placeholder:text-grey-400",
                    "transition-all duration-200 ease-smooth",
                    "focus:outline-none focus:border-[#2BB59B] focus:ring-2 focus:ring-[#2BB59B]/10",
                    "hover:border-grey-300",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-50",
                    "resize-none",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
