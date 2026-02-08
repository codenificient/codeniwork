import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input=React.forwardRef<HTMLInputElement,InputProps>(
	( { className,type,...props },ref ) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-11 w-full rounded-input border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-violet-300/40 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName="Input"

export { Input }
