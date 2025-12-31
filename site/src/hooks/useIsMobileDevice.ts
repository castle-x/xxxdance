/**
 * 基于设备类型判断是否为移动设备
 * 
 * 与 useIsMobile() 的区别：
 * - useIsMobile(): 基于屏幕宽度（< 640px）
 * - useIsMobileDevice(): 基于设备类型（mobile）
 * 
 * 注意：平板（tablet）和桌面（desktop）都判定为非移动端
 */

import { useState, useEffect } from "react"

// ============================================
// 设备检测工具（内联）
// ============================================

type DeviceType = "mobile" | "tablet" | "desktop"

function detectDeviceType(): DeviceType {
	if (typeof window === "undefined") return "desktop"
	
	const ua = navigator.userAgent.toLowerCase()
	
	// 检查是否为平板
	const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua)
	if (isTablet) return "tablet"
	
	// 检查是否为手机
	const isMobile = /mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)
	if (isMobile) return "mobile"
	
	return "desktop"
}

function detectOS(): string {
	if (typeof window === "undefined") return "Unknown"
	
	const ua = navigator.userAgent
	
	if (/iPhone|iPad|iPod/i.test(ua)) return "iOS"
	if (/Android/i.test(ua)) return "Android"
	if (/Windows/i.test(ua)) return "Windows"
	if (/Mac/i.test(ua)) return "macOS"
	if (/Linux/i.test(ua)) return "Linux"
	
	return "Unknown"
}

// ============================================
// 强制模式
// ============================================

const FORCE_MOBILE_KEY = "xxxdance-force-mobile-mode"

function getForceMobileMode(): boolean {
	if (typeof window === "undefined") return false
	const stored = localStorage.getItem(FORCE_MOBILE_KEY)
	return stored === "true"
}

// ============================================
// 移动端判定逻辑
// ============================================

/**
 * 检查设备是否为移动端（仅手机为移动端）
 */
function isMobileDevice(deviceType: DeviceType): boolean {
	return deviceType === "mobile"
}

// ============================================
// Hook
// ============================================

/**
 * 判断当前设备是否为移动端（仅手机）
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobileDevice()
 *   
 *   return (
 *     <div>
 *       {isMobile ? "移动端界面" : "桌面端界面"}
 *     </div>
 *   )
 * }
 * ```
 * 
 * @returns 是否为移动端设备（仅手机）
 */
export function useIsMobileDevice(): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(() => {
		if (typeof window === "undefined") return false
		
		// 检查强制手机模式
		if (getForceMobileMode()) return true
		
		return isMobileDevice(detectDeviceType())
	})

	useEffect(() => {
		// 检查强制手机模式
		if (getForceMobileMode()) {
			setIsMobile(true)
			if (import.meta.env.DEV) {
				console.log("[useIsMobileDevice] 🔧 强制手机模式已启用")
			}
			return
		}
		
		// 挂载后再次确认
		const deviceType = detectDeviceType()
		const os = detectOS()
		const result = isMobileDevice(deviceType)
		setIsMobile(result)
		
		if (import.meta.env.DEV) {
			console.log("[useIsMobileDevice] 操作系统:", os, "| 设备类型:", deviceType, "| 判定为移动端:", result)
		}
	}, [])

	return isMobile
}

// ============================================
// 工具函数
// ============================================

/**
 * 获取当前操作系统信息
 */
export function getCurrentOS(): string {
	return detectOS()
}

/**
 * 获取当前设备类型
 */
export function getCurrentDeviceType(): DeviceType {
	return detectDeviceType()
}

/**
 * 检查 **真实** 设备是否为移动端（不受 forceMobileMode 影响）
 */
export function isRealMobileDevice(): boolean {
	if (typeof window === "undefined") return false
	return isMobileDevice(detectDeviceType())
}
