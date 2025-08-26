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
					"flex h-10 w-full rounded-md border-2 border-purple-400/50 bg-purple-900/30 px-3 py-2 text-sm text-white placeholder:text-purple-300 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm",
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
