/**
 * 实验室主题背景组件
 * 
 * 提供网格背景、扫描线、粒子效果等科技感背景
 */

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface LabBackgroundProps {
	children?: ReactNode
	/** 是否显示网格 */
	showGrid?: boolean
	/** 是否显示扫描线效果 */
	showScanlines?: boolean
	/** 额外的 className */
	className?: string
}

/**
 * 实验室主题背景
 * 
 * @example
 * // 完整背景效果
 * <LabBackground showGrid showScanlines>
 *   <App />
 * </LabBackground>
 * 
 * // 仅网格背景
 * <LabBackground showGrid>
 *   <Content />
 * </LabBackground>
 */
export function LabBackground({
	children,
	showGrid = true,
	showScanlines = false,
	className,
}: LabBackgroundProps) {
	return (
		<div className={cn("relative min-h-screen", className)}>
			{/* 基础深色背景 */}
			<div
				className="fixed inset-0 -z-20"
				style={{
					background: "linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 20% 10%))",
				}}
			/>

			{/* 网格背景 */}
			{showGrid && <div className="lab-grid-bg" />}

			{/* 扫描线叠加 */}
			{showScanlines && <div className="lab-scanline-overlay" />}

			{/* 角落装饰光效 - 使用主色调 */}
			<div
				className="fixed inset-0 -z-10 pointer-events-none"
				style={{
					background: `
						radial-gradient(ellipse 40% 30% at 10% 20%, color-mix(in srgb, var(--lab-accent) 8%, transparent), transparent 50%),
						radial-gradient(ellipse 30% 20% at 90% 80%, color-mix(in srgb, var(--lab-neon-purple) 6%, transparent), transparent 50%)
					`,
				}}
			/>

			{/* 页面内容 */}
			{children}
		</div>
	)
}

