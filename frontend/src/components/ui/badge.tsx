/**
 * Clinical Minimalism Badge Component
 * Soft backgrounds, rounded pills, calm colors.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-grey-100 text-grey-600",
                success: "bg-success-light text-success",
                warning: "bg-warning-light text-warning",
                error: "bg-error-light text-error",
                info: "bg-info-light text-info",
                teal: "bg-[#ECFDF5] text-[#059669]",
                softBlue: "bg-[#D7EAFB] text-[#1B5E7A]",
                outline: "bg-transparent border border-grey-200 text-grey-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
