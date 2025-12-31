/**
 * 统一主题按钮组件
 * 
 * 根据当前主题自动选择对应的按钮实现
 * 在明亮/暗黑主题下使用原始 Button 组件
 */

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useThemeVariant } from "./ThemeVariantProvider"
import { LabButton, type LabButtonProps } from "./lab"

export interface ThemedButtonProps extends ButtonProps {
	/** Lab 主题：发光效果 */
	labGlowEffect?: LabButtonProps["glowEffect"]
	/** Lab 主题：发光颜色 */
	labGlowColor?: LabButtonProps["glowColor"]
}

/**
 * 统一主题按钮 - 根据当前主题自动适配
 * 
 * @example
 * // 基础用法
 * <ThemedButton>点击</ThemedButton>
 * 
 * // 带主题特定配置
 * <ThemedButton labGlowEffect="pulse" labGlowColor="magenta">
 *   特效按钮
 * </ThemedButton>
 */
export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
	(
		{
			children,
			className,
			variant,
			size,
			// Lab 主题配置
			labGlowEffect = "static",
			labGlowColor = "cyan",
			...props
		},
		ref
	) => {
		const { hasSpecialButton } = useThemeVariant()

		// 暗黑主题使用特殊按钮
		if (hasSpecialButton) {
			return (
				<LabButton
					ref={ref}
					className={className}
					variant={variant}
					size={size}
					glowEffect={labGlowEffect}
					glowColor={labGlowColor}
					{...props}
				>
					{children}
				</LabButton>
			)
		}

		// 明亮/暗黑主题：使用原始 Button
		return (
			<Button
				ref={ref}
				className={cn(className)}
				variant={variant}
				size={size}
				{...props}
			>
				{children}
			</Button>
		)
	}
)

ThemedButton.displayName = "ThemedButton"
