import { Slot } from "@radix-ui/react-slot"
import { cva,type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants=cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				destructive:
					"bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				outline:
					"border-2 border-purple-400 bg-transparent text-purple-300 hover:bg-purple-400/20 hover:border-purple-300 hover:text-white backdrop-blur-sm",
				secondary:
					"bg-gradient-to-r from-purple-500/80 to-purple-700/80 text-white hover:from-purple-600/90 hover:to-purple-800/90 backdrop-blur-sm border border-purple-400/30",
				ghost: "text-purple-200 hover:bg-purple-400/20 hover:text-white",
				link: "text-purple-300 underline-offset-4 hover:underline hover:text-purple-200",
				success: "bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				warning: "bg-gradient-to-r from-orange-600 to-orange-800 text-white hover:from-orange-700 hover:to-orange-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				info: "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				purple: "bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				orange: "bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
				teal: "bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
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

