/**
 * 统一主题卡片组件
 * 
 * 根据当前主题自动选择对应的卡片实现
 * 在明亮/暗黑主题下使用原始 Card 组件
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useThemeVariant } from "./ThemeVariantProvider"
import { LabCard, type LabCardProps } from "./lab"

export interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	/** Lab 主题：边框效果类型 */
	labBorderEffect?: LabCardProps["borderEffect"]
	/** Lab 主题：是否启用发光 */
	labGlow?: boolean
	/** Lab 主题：发光强度 */
	labGlowIntensity?: LabCardProps["glowIntensity"]
}

/**
 * 统一主题卡片 - 根据当前主题自动适配
 * 
 * @example
 * // 基础用法 - 自动适配当前主题
 * <ThemedCard>内容</ThemedCard>
 * 
 * // 带主题特定配置
 * <ThemedCard labBorderEffect="gradient" labGlow>
 *   内容
 * </ThemedCard>
 */
export const ThemedCard = forwardRef<HTMLDivElement, ThemedCardProps>(
	(
		{
			children,
			className,
			// Lab 主题配置
			labBorderEffect = "neon",
			labGlow = false,
			labGlowIntensity = "md",
			...props
		},
		ref
	) => {
		const { hasSpecialCard } = useThemeVariant()

		// 暗黑主题使用特殊卡片
		if (hasSpecialCard) {
			return (
				<LabCard
					ref={ref}
					className={className}
					borderEffect={labBorderEffect}
					glow={labGlow}
					glowIntensity={labGlowIntensity}
					{...props}
				>
					{children}
				</LabCard>
			)
		}

		// 明亮/暗黑主题：使用原始 Card
		return (
			<Card ref={ref} className={cn(className)} {...props}>
				{children}
			</Card>
		)
	}
)

ThemedCard.displayName = "ThemedCard"
