/**
 * 实验室主题按钮组件
 * 
 * 提供霓虹发光、脉冲动画等科技感按钮样式
 */

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface LabButtonProps extends ButtonProps {
	/** 发光效果 */
	glowEffect?: "none" | "static" | "pulse"
	/** 发光颜色 */
	glowColor?: "cyan" | "magenta" | "purple" | "green"
}

/**
 * 实验室主题按钮
 * 
 * @example
 * // 静态发光按钮
 * <LabButton glowEffect="static">点击</LabButton>
 * 
 * // 脉冲发光按钮
 * <LabButton glowEffect="pulse" glowColor="magenta">动态</LabButton>
 */
export const LabButton = forwardRef<HTMLButtonElement, LabButtonProps>(
	(
		{
			children,
			className,
			glowEffect = "static",
			glowColor = "cyan",
			variant = "default",
			...props
		},
		ref
	) => {
		// 使用 CSS 变量，cyan 默认使用主色调
		const colorMap = {
			cyan: "var(--lab-accent)",
			magenta: "var(--lab-neon-magenta)",
			purple: "var(--lab-neon-purple)",
			green: "var(--lab-neon-green)",
		}

		const glowStyles = {
			none: {},
			static: {
				boxShadow: `0 0 8px ${colorMap[glowColor]}, 0 0 16px color-mix(in srgb, ${colorMap[glowColor]} 40%, transparent)`,
				borderColor: colorMap[glowColor],
			},
			pulse: {
				animation: "lab-pulse 2s ease-in-out infinite",
			},
		}

		return (
			<Button
				ref={ref}
				variant={variant}
				className={cn(
					"relative transition-all duration-300",
					glowEffect === "pulse" && "lab-pulse",
					className
				)}
				style={glowEffect !== "none" ? glowStyles[glowEffect] : undefined}
				{...props}
			>
				{children}
			</Button>
		)
	}
)

LabButton.displayName = "LabButton"

