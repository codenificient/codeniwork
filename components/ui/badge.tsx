import { cva,type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants=cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-md",
				secondary:
					"border-transparent bg-gradient-to-r from-purple-500/80 to-purple-700/80 text-white hover:from-purple-600/90 hover:to-purple-800/90 backdrop-blur-sm border border-purple-400/30",
				destructive:
					"border-transparent bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md",
				outline: "text-purple-200 border-purple-400/50 hover:bg-purple-400/20",
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
