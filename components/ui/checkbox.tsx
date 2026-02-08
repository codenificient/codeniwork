import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface CheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> { }

const Checkbox=React.forwardRef<HTMLInputElement,CheckboxProps>(
	( { className,...props },ref ) => {
		return (
			<div className="relative">
				<input
					type="checkbox"
					className={cn(
						"peer h-4 w-4 shrink-0 rounded-sm border border-white/[0.10] bg-white/[0.04] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-violet-600 checked:border-violet-600",
						className
					)}
					ref={ref}
					{...props}
				/>
				<Check className="pointer-events-none absolute left-0 top-0 h-4 w-4 opacity-0 peer-checked:opacity-100 text-white" />
			</div>
		)
	}
)
Checkbox.displayName="Checkbox"

export { Checkbox }
