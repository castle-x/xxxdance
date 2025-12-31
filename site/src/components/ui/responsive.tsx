/**
 * 响应式显示组件
 * 
 * 根据设备操作系统条件性渲染内容
 * 提供语义化的移动端/桌面端组件
 * 
 * 统一使用基于操作系统的判断，避免窗口宽度变化导致的UI混乱
 */

import { type ReactNode } from "react"
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice"

interface ResponsiveProps {
	children: ReactNode
	/** 是否使用 CSS 隐藏而非不渲染（用于 SEO） */
	fallback?: "hide" | "remove"
}

/**
 * 仅在移动端显示（基于操作系统：iOS、Android、HarmonyOS手机）
 * 
 * @example
 * <Mobile>
 *   <button>手机菜单</button>
 * </Mobile>
 */
export function Mobile({ children, fallback = "remove" }: ResponsiveProps) {
	const isMobile = useIsMobileDevice()
	
	if (fallback === "hide") {
		return <div className={isMobile ? "" : "hidden"}>{children}</div>
	}
	
	return isMobile ? <>{children}</> : null
}

/**
 * 仅在非移动端显示（桌面操作系统：Windows、macOS、Linux、HarmonyOS平板等）
 * 
 * 这是最常用的组件，用于隐藏移动端不需要的元素
 * 
 * @example
 * <NotMobile>
 *   <span>完整文本描述</span>
 * </NotMobile>
 */
export function NotMobile({ children, fallback = "remove" }: ResponsiveProps) {
	const isMobile = useIsMobileDevice()
	
	if (fallback === "hide") {
		return <div className={!isMobile ? "" : "hidden"}>{children}</div>
	}
	
	return !isMobile ? <>{children}</> : null
}

/**
 * @deprecated 使用 NotMobile 代替
 * 保留此组件仅为向后兼容，实际功能与 NotMobile 相同
 */
export function Desktop({ children, fallback = "remove" }: ResponsiveProps) {
	return <NotMobile fallback={fallback}>{children}</NotMobile>
}

/**
 * @deprecated 平板设备归类为桌面端，使用 NotMobile 代替
 * 保留此组件仅为向后兼容
 */
export function Tablet({ children, fallback = "remove" }: ResponsiveProps) {
	return <NotMobile fallback={fallback}>{children}</NotMobile>
}

/**
 * 响应式文本组件
 * 
 * 根据设备操作系统显示不同的文本内容
 * 
 * @example
 * <ResponsiveText
 *   mobile="手机版文字"
 *   desktop="桌面版文字"
 * />
 */
export function ResponsiveText({
	mobile,
	desktop,
}: {
	mobile: ReactNode
	desktop: ReactNode
	/** @deprecated 平板归类为桌面端，此参数不再使用 */
	tablet?: ReactNode
}) {
	const isMobile = useIsMobileDevice()
	
	if (isMobile) return <>{mobile}</>
	return <>{desktop}</>
}

