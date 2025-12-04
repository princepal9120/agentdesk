/**
 * Clinical Minimalism Button Component
 * Apple-inspired medical aesthetic with pill-shaped or softly rounded buttons.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB59B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                // Primary: Teal with soft shadow
                default: "bg-[#2BB59B] text-white hover:bg-[#249A84] shadow-teal hover:shadow-teal-lg active:scale-[0.98]",

                // Destructive: Soft red
                destructive: "bg-error text-white hover:bg-error-dark shadow-sm",

                // Outline: Thin border, soft hover
                outline: "border border-grey-200 bg-white hover:bg-grey-50 hover:border-grey-300 text-grey-700",

                // Secondary: Soft blue background
                secondary: "bg-[#D7EAFB] text-grey-800 hover:bg-[#B8D9F8]",

                // Ghost: Transparent with soft hover
                ghost: "hover:bg-grey-100 text-grey-600 hover:text-grey-900",

                // Link: Teal text with underline
                link: "text-[#2BB59B] underline-offset-4 hover:underline",

                // Soft: Very subtle background
                soft: "bg-grey-100 text-grey-700 hover:bg-grey-200",

                // Success: Green variant
                success: "bg-success text-white hover:bg-success-dark",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-full",
                sm: "h-9 px-4 rounded-full text-xs",
                lg: "h-12 px-8 rounded-full text-base",
                xl: "h-14 px-10 rounded-full text-lg",
                icon: "h-10 w-10 rounded-full",
                "icon-sm": "h-8 w-8 rounded-full",
                "icon-lg": "h-12 w-12 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
