/**
 * 统一主题背景组件
 * 
 * 根据当前主题自动选择对应的背景实现
 * 在明亮/暗黑主题下不渲染特殊背景
 * 在实验室主题下渲染 ReactBits 动态背景
 */

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useThemeVariant } from "./ThemeVariantProvider"
import { 
	BackgroundRenderer, 
	BackgroundControlPanel, 
	BackgroundControlToggle,
	useBackground 
} from "./lab/backgrounds"

export interface ThemedBackgroundProps {
	children: ReactNode
	/** 额外的 className */
	className?: string
	/** 是否显示控制面板按钮（仅 Lab 主题） */
	showControlToggle?: boolean
}

/**
 * 统一主题背景 - 根据当前主题自动适配
 * 
 * 注意：需要在 BackgroundProvider 内使用
 * 
 * @example
 * // 基础用法 - 包裹整个应用
 * <BackgroundProvider>
 *   <ThemedBackground>
 *     <App />
 *   </ThemedBackground>
 * </BackgroundProvider>
 * 
 * // 隐藏控制按钮
 * <ThemedBackground showControlToggle={false}>
 *   <App />
 * </ThemedBackground>
 */
export function ThemedBackground({
	children,
	className,
	showControlToggle = true,
}: ThemedBackgroundProps) {
	const { hasBackground } = useThemeVariant()

	// 如果当前主题不需要特殊背景，直接返回 children
	if (!hasBackground) {
		return <div className={cn("min-h-screen", className)}>{children}</div>
	}

	// 暗黑主题使用 ReactBits 背景
	return (
		<div className={cn("min-h-screen relative", className)}>
			{/* 动态背景 */}
			<BackgroundRenderer />
			
			{/* 控制面板按钮和面板 */}
			{showControlToggle && (
				<>
					<BackgroundControlToggle />
					<BackgroundControlPanel />
				</>
			)}
			
			{/* 内容 */}
			<div className="relative z-10">
				{children}
			</div>
		</div>
	)
}

/**
 * 导出 hooks 供外部使用
 */
export { useBackground }
