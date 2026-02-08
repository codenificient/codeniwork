import { Slot } from "@radix-ui/react-slot"
import { cva,type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants=cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5",
				destructive:
					"bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5",
				outline:
					"border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl text-violet-200 hover:bg-white/[0.08] hover:border-white/[0.16] hover:text-white",
				secondary:
					"bg-white/[0.06] backdrop-blur-xl text-white hover:bg-white/[0.10] border border-white/[0.08]",
				ghost: "text-violet-200 hover:bg-white/[0.06] hover:text-white",
				link: "text-violet-300 underline-offset-4 hover:underline hover:text-violet-200",
				glow: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-violet hover:shadow-[0_0_32px_rgba(139,92,246,0.5),0_0_64px_rgba(139,92,246,0.2)] hover:-translate-y-0.5 animate-glow-pulse",
				success: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				warning: "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				info: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				purple: "bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				orange: "bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				teal: "bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-button px-3",
				lg: "h-11 rounded-button px-8",
				icon: "h-10 w-10",
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

const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(
	( { className,variant,size,asChild=false,...props },ref ) => {
		const Comp=asChild? Slot:"button"
		return (
			<Comp
				className={cn( buttonVariants( { variant,size,className } ) )}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName="Button"

export { Button,buttonVariants }
