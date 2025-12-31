/**
 * 响应式媒体查询 Hook
 * 
 * 用于在 JavaScript 中判断当前屏幕尺寸
 * 配合 Tailwind 的断点系统使用
 */

import { useState, useEffect } from "react"

/**
 * 监听媒体查询变化
 * @param query - 媒体查询字符串，例如 "(min-width: 640px)"
 * @returns 是否匹配当前媒体查询
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(false)

	useEffect(() => {
		// 初始检查
		const media = window.matchMedia(query)
		
		// 设置初始值
		if (media.matches !== matches) {
			setMatches(media.matches)
		}

		// 监听变化
		const listener = () => setMatches(media.matches)
		
		// 使用新的 addEventListener API（兼容旧浏览器）
		if (media.addEventListener) {
			media.addEventListener("change", listener)
		} else {
			// 兼容旧浏览器
			media.addListener(listener)
		}

		// 清理
		return () => {
			if (media.removeEventListener) {
				media.removeEventListener("change", listener)
			} else {
				media.removeListener(listener)
			}
		}
	}, [matches, query])

	return matches
}

/**
 * Tailwind 断点枚举
 * 
 * 与 tailwind.config.js 保持一致
 */
export const BREAKPOINTS = {
	/** 手机（最小宽度） */
	xs: 360,
	/** 平板 */
	sm: 640,
	/** 桌面 */
	md: 768,
	/** 大屏 */
	lg: 1024,
	/** 超大屏 */
	xl: 1280,
	/** 2K */
	"2xl": 1536,
} as const

/**
 * 判断是否为移动设备（< 640px）
 * @deprecated 请使用 useIsMobileDevice() 代替（基于操作系统判断）
 * 基于宽度的判断会在窗口缩放时导致UI不一致
 */
export function useIsMobile(): boolean {
	return useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`)
}

/**
 * 判断是否为平板设备（>= 640px && < 1024px）
 * @deprecated 请使用 useIsMobileDevice() 代替（基于操作系统判断）
 * 基于宽度的判断会在窗口缩放时导致UI不一致
 */
export function useIsTablet(): boolean {
	const isAboveSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`)
	const isBelowLg = useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`)
	return isAboveSm && isBelowLg
}

/**
 * 判断是否为桌面设备（>= 1024px）
 * @deprecated 请使用 useIsMobileDevice() 代替（基于操作系统判断）
 * 基于宽度的判断会在窗口缩放时导致UI不一致
 */
export function useIsDesktop(): boolean {
	return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
}

/**
 * 获取当前设备类型
 * @deprecated 请使用 useIsMobileDevice() 代替（基于操作系统判断）
 * 基于宽度的判断会在窗口缩放时导致UI不一致
 */
export type DeviceType = "mobile" | "tablet" | "desktop"

export function useDeviceType(): DeviceType {
	const isMobile = useIsMobile()
	const isTablet = useIsTablet()
	
	if (isMobile) return "mobile"
	if (isTablet) return "tablet"
	return "desktop"
}

