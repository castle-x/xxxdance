/**
 * 毛玻璃卡片组件
 * 
 * 仿 ReactBits 官网示例的毛玻璃样式
 * 支持通过全局 CSS 变量控制样式
 * 
 * 特点：
 * - 半透明背景 + backdrop-filter 模糊
 * - 左右两端半圆形（pill 形状）
 * - 无特效边框，简洁干净
 * - 微妙的边框高光
 * - 仅在暗黑主题启用毛玻璃，明亮主题使用标准样式
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useThemeVariant } from "../ThemeVariantProvider"

/** 组件类型变体 - 对应不同的样式配置 */
export type GlassVariant = "container" | "item" | "info" | "nav"

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	/** 变体类型，决定使用哪组样式配置 */
	variant?: GlassVariant
	/** 形状：pill（药丸/胶囊形）或 rounded（圆角矩形）- 设为 auto 使用全局配置 */
	shape?: "pill" | "rounded" | "auto"
	/** 是否使用 CSS 变量（全局样式控制） */
	useGlobalStyle?: boolean
	/** 模糊强度（仅在 useGlobalStyle=false 时生效） */
	blur?: "sm" | "md" | "lg" | "xl"
	/** 背景透明度（仅在 useGlobalStyle=false 时生效） */
	opacity?: "light" | "medium" | "dark"
	/** 是否显示边框 */
	border?: boolean
	/** 是否有内发光效果 */
	innerGlow?: boolean
}

/**
 * 毛玻璃卡片 - 仿 ReactBits 示例风格
 * 
 * @example
 * // 使用全局样式控制的容器
 * <GlassCard variant="container" className="p-4">
 *   <h2>列表背景</h2>
 * </GlassCard>
 * 
 * // 使用全局样式控制的列表项
 * <GlassCard variant="item" className="p-3">
 *   <span>列表项内容</span>
 * </GlassCard>
 * 
 * // 传统方式（不使用全局样式）
 * <GlassCard useGlobalStyle={false} shape="pill" blur="xl" opacity="dark">
 *   <span>自定义样式</span>
 * </GlassCard>
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
	(
		{
			children,
			className,
			variant = "container",
			shape = "auto",
			useGlobalStyle = true,
			blur = "lg",
			opacity = "medium",
			border = true,
			innerGlow = true,
			...props
		},
		ref
	) => {
		const { hasSpecialCard } = useThemeVariant()

		// 非暗黑主题：使用标准卡片样式
		if (!hasSpecialCard) {
			// 根据 shape 属性决定圆角样式
			const shapeClass = shape === "rounded" ? "rounded-lg" : "rounded-full"
			
			const standardVariantStyles: Record<GlassVariant, string> = {
				container: `bg-card border border-border ${shapeClass}`,
				item: `bg-card border border-border ${shapeClass} hover:bg-accent transition-colors`,
				info: `bg-card border border-border ${shapeClass}`,
				nav: `bg-card border border-border ${shapeClass}`,
			}

			return (
				<div
					ref={ref}
					className={cn(
						"relative",
						standardVariantStyles[variant],
						className
					)}
					{...props}
				>
					{children}
				</div>
			)
		}

		// 暗黑主题：使用毛玻璃样式
		if (useGlobalStyle) {
			const variantStyles: Record<GlassVariant, string> = {
				container: "glass-container",
				item: "glass-item",
				info: "glass-info",
				nav: "glass-nav",
			}

			return (
				<div
					ref={ref}
					className={cn(
						"relative",
						variantStyles[variant],
						// 形状：明确指定时覆盖 CSS 变量
						shape === "pill" && "!rounded-full",
						shape === "rounded" && "!rounded-xl",
						className
					)}
					{...props}
				>
					{children}
				</div>
			)
		}

		// 传统静态样式（暗黑主题手动指定）
		const blurMap = {
			sm: "backdrop-blur-sm",
			md: "backdrop-blur-md",
			lg: "backdrop-blur-lg",
			xl: "backdrop-blur-xl",
		}

		const opacityMap = {
			light: "bg-white/5",
			medium: "bg-white/10",
			dark: "bg-black/40",
		}

		const shapeMap = {
			auto: "rounded-xl",
			pill: "rounded-full",
			rounded: "rounded-xl",
		}

		return (
			<div
				ref={ref}
				className={cn(
					"relative",
					shapeMap[shape],
					blurMap[blur],
					opacityMap[opacity],
					border && "border border-white/10",
					innerGlow && "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
					"shadow-lg shadow-black/20",
					className
				)}
				{...props}
			>
				{children}
			</div>
		)
	}
)

GlassCard.displayName = "GlassCard"

/**
 * 毛玻璃导航栏 - 专门用于顶部导航
 */
export interface GlassNavProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode
	/** 形状：pill（药丸）或 rounded（圆角） */
	shape?: "pill" | "rounded"
	/** 是否使用 CSS 变量（全局样式控制） */
	useGlobalStyle?: boolean
}

export const GlassNav = forwardRef<HTMLElement, GlassNavProps>(
	({ children, className, shape, useGlobalStyle = true, ...props }, ref) => {
		const { hasSpecialCard } = useThemeVariant()

		// 非暗黑主题：使用标准导航样式（固定药丸样式）
		if (!hasSpecialCard) {
			return (
				<nav
					ref={ref}
					className={cn(
						"bg-card border border-border rounded-full",
						"px-6 py-3",
						"flex items-center",
						className
					)}
					{...props}
				>
					{children}
				</nav>
			)
		}

		// 暗黑主题：使用毛玻璃样式（使用 CSS 变量控制）
		// 如果明确指定了 shape，则覆盖全局设置
		const shapeStyle = shape 
			? { borderRadius: shape === "pill" ? "9999px" : "0.75rem" }
			: undefined

		return (
			<nav
				ref={ref}
				className={cn(
					"glass-nav",
					"px-6 py-3",
					"flex items-center",
					className
				)}
				style={shapeStyle}
				{...props}
			>
				{children}
			</nav>
		)
	}
)

GlassNav.displayName = "GlassNav"

