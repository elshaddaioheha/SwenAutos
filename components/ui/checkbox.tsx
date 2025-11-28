import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <div className="relative inline-flex items-center justify-center align-middle">
            <input
                type="checkbox"
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#1D4ED8] checked:border-[#1D4ED8] appearance-none cursor-pointer",
                    className
                )}
                ref={ref}
                {...props}
            />
            <Check className="absolute h-3 w-3 text-white hidden peer-checked:block pointer-events-none" />
        </div>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
