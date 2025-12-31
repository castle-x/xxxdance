/**
 * 响应式设计工具函数
 * 
 * 统一管理响应式相关的常量和工具函数
 */

import { BREAKPOINTS } from "@/hooks/useMediaQuery"

/**
 * 响应式断点常量
 * 导出以便在其他地方使用
 */
export { BREAKPOINTS }

/**
 * 最小屏幕宽度（手机）
 * 用于设置全局 min-width
 */
export const MIN_SCREEN_WIDTH = BREAKPOINTS.xs // 360px

/**
 * 移动端断点（小于此宽度为移动端）
 */
export const MOBILE_BREAKPOINT = BREAKPOINTS.sm // 640px

/**
 * 常用的响应式 class 组合
 * 
 * 提供语义化的类名，避免重复编写
 */
export const RESPONSIVE_CLASSES = {
	/** 仅移动端显示 */
	mobileOnly: "sm:hidden",
	
	/** 仅桌面端显示（>= 640px） */
	desktopOnly: "hidden sm:block",
	
	/** 仅桌面端 inline 显示 */
	desktopOnlyInline: "hidden sm:inline",
	
	/** 仅桌面端 flex 显示 */
	desktopOnlyFlex: "hidden sm:flex",
	
	/** 仅平板和桌面端显示 */
	tabletDesktopOnly: "hidden sm:block lg:block",
	
	/** 仅大屏显示（>= 1024px） */
	largeOnly: "hidden lg:block",
	
	/** 移动端 inline，桌面端 hidden */
	mobileInlineOnly: "inline sm:hidden",
	
	/** 移动端 flex，桌面端 hidden */
	mobileFlexOnly: "flex sm:hidden",
} as const

/**
 * 响应式间距
 * 
 * 移动端使用较小间距，桌面端使用较大间距
 */
export const RESPONSIVE_SPACING = {
	/** padding: 移动端 3，桌面端 6 */
	px: "px-3 sm:px-6",
	
	/** padding: 移动端 4，桌面端 8 */
	p: "p-4 sm:p-8",
	
	/** gap: 移动端 2，桌面端 3 */
	gap: "gap-2 sm:gap-3",
	
	/** gap: 移动端 3，桌面端 4 */
	gapLg: "gap-3 sm:gap-4",
} as const

/**
 * 生成响应式类名
 * 
 * @param base - 基础类名
 * @param mobile - 移动端类名（可选）
 * @param desktop - 桌面端类名（可选）
 * @returns 完整的响应式类名字符串
 * 
 * @example
 * responsiveClass("text-base", "text-sm", "text-lg")
 * // => "text-base text-sm sm:text-lg"
 */
export function responsiveClass(
	base: string,
	mobile?: string,
	desktop?: string
): string {
	const classes = [base]
	if (mobile) classes.push(mobile)
	if (desktop) classes.push(`sm:${desktop}`)
	return classes.join(" ")
}

/**
 * 截断文本（移动端适配）
 * 
 * @param text - 原始文本
 * @param maxLength - 移动端最大长度
 * @param isMobile - 是否为移动端
 * @returns 截断后的文本
 * 
 * @example
 * truncateForMobile("WindowsChrome", 3, true) // => "Win..."
 * truncateForMobile("WindowsChrome", 3, false) // => "WindowsChrome"
 */
export function truncateForMobile(
	text: string,
	maxLength: number,
	isMobile: boolean
): string {
	if (!isMobile || text.length <= maxLength) {
		return text
	}
	return `${text.slice(0, maxLength)}...`
}

/**
 * 获取响应式尺寸
 * 
 * @param mobile - 移动端尺寸
 * @param desktop - 桌面端尺寸
 * @param isMobile - 是否为移动端
 * @returns 当前设备对应的尺寸
 * 
 * @example
 * getResponsiveSize(300, 500, true) // => 300
 * getResponsiveSize(300, 500, false) // => 500
 */
export function getResponsiveSize(
	mobile: number,
	desktop: number,
	isMobile: boolean
): number {
	return isMobile ? mobile : desktop
}

