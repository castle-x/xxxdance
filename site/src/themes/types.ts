/**
 * 主题类型定义
 * 
 * 两个主题：明亮、暗黑（带毛玻璃特效）
 */

/** 主题标识 */
export type ThemeVariant = "light" | "dark"

/** 主题配置接口 */
export interface ThemeConfig {
	/** 主题唯一标识 */
	id: ThemeVariant
	/** 显示名称 */
	name: string
	/** 简短描述 */
	description: string
	/** 主题图标 */
	icon: string
	/** 是否为深色主题 */
	isDark: boolean
	/** 是否启用特效背景 */
	hasBackground: boolean
	/** 是否需要特殊卡片样式 */
	hasSpecialCard: boolean
	/** 是否需要特殊按钮样式 */
	hasSpecialButton: boolean
}

/** 主题注册表 - 所有可用主题的配置 */
export const themeRegistry: Record<ThemeVariant, ThemeConfig> = {
	light: {
		id: "light",
		name: "明亮",
		description: "清爽明亮的日间主题",
		icon: "☀️",
		isDark: false,
		hasBackground: false,
		hasSpecialCard: false,
		hasSpecialButton: false,
	},
	dark: {
		id: "dark",
		name: "暗黑",
		description: "深色主题，毛玻璃特效",
		icon: "🌙",
		isDark: true,
		hasBackground: true,
		hasSpecialCard: true,
		hasSpecialButton: true,
	},
}

/** 获取主题配置 */
export function getThemeConfig(variant: ThemeVariant): ThemeConfig {
	return themeRegistry[variant]
}

/** 获取所有主题列表 */
export function getAllThemes(): ThemeConfig[] {
	return Object.values(themeRegistry)
}
