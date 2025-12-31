/**
 * 实验室主题卡片组件
 * 
 * 提供霓虹边框、发光效果等科技感样式
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface LabCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	/** 边框效果类型 */
	borderEffect?: "none" | "neon" | "gradient" | "pulse"
	/** 是否启用发光效果 */
	glow?: boolean
	/** 发光强度 */
	glowIntensity?: "sm" | "md" | "lg"
}

/**
 * 实验室主题卡片
 * 
 * @example
 * // 基础霓虹边框
 * <LabCard borderEffect="neon">内容</LabCard>
 * 
 * // 渐变边框 + 大发光
 * <LabCard borderEffect="gradient" glow glowIntensity="lg">内容</LabCard>
 * 
 * // 脉冲动画
 * <LabCard borderEffect="pulse">动态效果</LabCard>
 */
export const LabCard = forwardRef<HTMLDivElement, LabCardProps>(
	(
		{
			children,
			className,
			borderEffect = "neon",
			glow = false,
			glowIntensity = "md",
			...props
		},
		ref
	) => {
		const effectClasses = {
			none: "",
			neon: "lab-neon-border",
			gradient: "lab-gradient-border",
			pulse: "lab-neon-border lab-pulse",
		}

		const glowClasses = {
			sm: "shadow-[var(--lab-glow-sm)]",
			md: "shadow-[var(--lab-glow-md)]",
			lg: "shadow-[var(--lab-glow-lg)]",
		}

		return (
			<Card
				ref={ref}
				className={cn(
					effectClasses[borderEffect],
					glow && glowClasses[glowIntensity],
					"transition-all duration-300",
					className
				)}
				{...props}
			>
				{children}
			</Card>
		)
	}
)

LabCard.displayName = "LabCard"

