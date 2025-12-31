/**
 * 主题 Provider
 * 
 * 两个主题：明亮、暗黑（带毛玻璃特效）
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type ThemeVariant, getThemeConfig } from "./types"

interface ThemeVariantContextType {
	/** 当前主题 */
	variant: ThemeVariant
	/** 设置主题 */
	setVariant: (variant: ThemeVariant) => void
	/** 切换主题 */
	toggleVariant: () => void
	/** 当前主题是否为深色 */
	isDark: boolean
	/** 当前主题是否启用特效背景 */
	hasBackground: boolean
	/** 当前主题是否有特殊卡片 */
	hasSpecialCard: boolean
}

const ThemeVariantContext = createContext<ThemeVariantContextType | null>(null)

const STORAGE_KEY = "xxxdance-theme"

interface ThemeVariantProviderProps {
	children: ReactNode
	/** 默认主题 */
	defaultVariant?: ThemeVariant
}

export function ThemeVariantProvider({
	children,
	defaultVariant = "dark", // 默认使用暗黑主题
}: ThemeVariantProviderProps) {
	const [variant, setVariantState] = useState<ThemeVariant>(() => {
		if (typeof window === "undefined") return defaultVariant
		const saved = localStorage.getItem(STORAGE_KEY)
		// 兼容旧的 "lab" 值，映射到 "dark"
		if (saved === "lab") return "dark"
		if (saved === "light" || saved === "dark") {
			return saved as ThemeVariant
		}
		return defaultVariant
	})

	// 获取当前主题配置
	const config = getThemeConfig(variant)

	// 设置主题
	const setVariant = (newVariant: ThemeVariant) => {
		setVariantState(newVariant)
		localStorage.setItem(STORAGE_KEY, newVariant)
	}

	// 切换主题
	const toggleVariant = () => {
		setVariant(variant === "light" ? "dark" : "light")
	}

	// 当主题改变时，更新 DOM
	useEffect(() => {
		const root = document.documentElement
		const body = document.body

		// 移除所有主题 class
		root.classList.remove("light", "dark", "theme-light", "theme-dark", "theme-lab")
		body.classList.remove("theme-light", "theme-dark", "theme-lab")

		// 添加当前主题 class
		const themeClass = `theme-${variant}`
		root.classList.add(themeClass)
		body.classList.add(themeClass)

		// 设置明暗模式 class（用于 shadcn 组件）
		if (config.isDark) {
			root.classList.add("dark")
		} else {
			root.classList.add("light")
		}

		// 设置 data 属性
		root.dataset.theme = variant
		body.dataset.theme = variant
	}, [variant, config.isDark])

	const value: ThemeVariantContextType = {
		variant,
		setVariant,
		toggleVariant,
		isDark: config.isDark,
		hasBackground: config.hasBackground,
		hasSpecialCard: config.hasSpecialCard,
	}

	return (
		<ThemeVariantContext.Provider value={value}>
			{children}
		</ThemeVariantContext.Provider>
	)
}

/**
 * 使用主题 Hook
 * 
 * @example
 * const { variant, toggleVariant, isDark } = useThemeVariant()
 * 
 * // 切换主题
 * toggleVariant()
 */
export function useThemeVariant() {
	const context = useContext(ThemeVariantContext)

	if (!context) {
		throw new Error("useThemeVariant must be used within a ThemeVariantProvider")
	}

	return context
}

/**
 * 检查当前是否为特定主题（不抛出错误版本）
 */
export function useIsThemeVariant(targetVariant: ThemeVariant): boolean {
	const context = useContext(ThemeVariantContext)
	return context?.variant === targetVariant
}
