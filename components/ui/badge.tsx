import { cva,type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants=cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md",
				secondary:
					"border-white/[0.08] bg-white/[0.06] backdrop-blur-xl text-violet-200",
				destructive:
					"border-transparent bg-red-500/20 text-red-300",
				outline: "text-violet-200 border-white/[0.10] hover:bg-white/[0.06]",
				success: "border-transparent bg-emerald-500/20 text-emerald-300",
				warning: "border-transparent bg-amber-500/20 text-amber-300",
				info: "border-transparent bg-blue-500/20 text-blue-300",
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

function Badge ( { className,variant,...props }: BadgeProps ) {
	return (
		<div className={cn( badgeVariants( { variant } ),className )} {...props} />
	)
}

export { Badge,badgeVariants }
