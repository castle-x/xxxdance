/**
 * 毛玻璃样式全局配置 Provider
 * 
 * 控制全局的毛玻璃效果参数和主色调
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

/** 形状类型 */
export type GlassShape = "rounded" | "pill"

/** 模糊强度 */
export type GlassBlur = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

/** 预设主色调名称 */
export type ColorPreset = "cyan" | "amber" | "orange" | "emerald" | "rose" | "violet"

/** 主色调配置 */
export interface ColorTheme {
	name: string
	primary: string      // 主色
	light: string        // 亮色（文字高亮）
	dark: string         // 暗色（边框/阴影）
	glow: string         // 辉光色
}

/** 预设配色方案 */
export const colorPresets: Record<ColorPreset, ColorTheme> = {
	cyan: {
		name: "霓虹青",
		primary: "#06b6d4",
		light: "#67e8f9",
		dark: "#0891b2",
		glow: "#22d3ee",
	},
	amber: {
		name: "琥珀金",
		primary: "#f59e0b",
		light: "#fcd34d",
		dark: "#d97706",
		glow: "#fbbf24",
	},
	orange: {
		name: "活力橙",
		primary: "#f97316",
		light: "#fdba74",
		dark: "#ea580c",
		glow: "#fb923c",
	},
	emerald: {
		name: "翡翠绿",
		primary: "#10b981",
		light: "#6ee7b7",
		dark: "#059669",
		glow: "#34d399",
	},
	rose: {
		name: "玫瑰红",
		primary: "#f43f5e",
		light: "#fda4af",
		dark: "#e11d48",
		glow: "#fb7185",
	},
	violet: {
		name: "幻紫",
		primary: "#8b5cf6",
		light: "#c4b5fd",
		dark: "#7c3aed",
		glow: "#a78bfa",
	},
}

/** 单个组件的形状配置 */
export interface ComponentShapeConfig {
	shape: GlassShape
	borderRadius: number // 仅 rounded 模式有效
}

/** 毛玻璃样式配置 */
export interface GlassStyleConfig {
	// ========== 主色调 ==========
	colorPreset: ColorPreset
	/** 自定义颜色（覆盖预设） */
	customColors: {
		enabled: boolean
		primary: string
		light: string
		dark: string
		glow: string
	}

	// ========== 各组件形状配置 ==========
	shapes: {
		item: ComponentShapeConfig
		info: ComponentShapeConfig
		nav: ComponentShapeConfig
		container: ComponentShapeConfig
	}

	// ========== 列表项（如剪切板 item） ==========
	item: {
		blur: GlassBlur
		bgOpacity: number
		bgColor: string
		borderOpacity: number
		borderColor: string
		hoverBgOpacity: number
	}

	// ========== 信息卡片（如功能说明） ==========
	info: {
		blur: GlassBlur
		bgOpacity: number
		bgColor: string
		borderOpacity: number
		borderColor: string
	}

	// ========== 导航栏 ==========
	nav: {
		blur: GlassBlur
		bgOpacity: number
		bgColor: string
		borderOpacity: number
		borderColor: string
	}

	// ========== 容器卡片 ==========
	container: {
		blur: GlassBlur
		bgOpacity: number
		bgColor: string
		borderOpacity: number
		borderColor: string
		shadowOpacity: number
	}

	// ========== 内发光效果 ==========
	innerGlow: {
		enabled: boolean
		opacity: number // 0-100
		color: string
	}
}

/** 默认配置 */
export const defaultGlassStyle: GlassStyleConfig = {
	// ========== 主色调 ==========
	colorPreset: "cyan",              // 预设色调: cyan(霓虹青) | amber(琥珀金) | orange(活力橙) | emerald(翡翠绿) | rose(玫瑰红) | violet(幻紫)
	customColors: {
		enabled: false,                 // 是否启用自定义颜色（启用后覆盖预设）
		primary: "#06b6d4",             // 主色（图标、高亮边框）
		light: "#67e8f9",               // 亮色（文字高亮）
		dark: "#0891b2",                // 暗色（阴影、边框）
		glow: "#22d3ee",                // 辉光色（发光效果）
	},

	// ========== 各组件形状 ==========
	shapes: {
		item: { shape: "pill", borderRadius: 10 },       // 列表项: pill(药丸) | rounded(圆角)，borderRadius 仅 rounded 时生效
		info: { shape: "pill", borderRadius: 9999 },       // 信息卡片（已弃用）
		nav: { shape: "pill", borderRadius: 10 },        // 导航栏
		container: { shape: "pill", borderRadius: 9999 },  // 主容器
	},

	// ========== 列表项样式（剪切板每一条记录） ==========
	item: {
		blur: "lg",                     // 模糊强度: none | sm | md | lg | xl | 2xl | 3xl
		bgOpacity: 20,                  // 背景透明度 0-100（数值越大越不透明）
		bgColor: "#000000",             // 背景颜色
		borderOpacity: 10,              // 边框透明度 0-100
		borderColor: "#ffffff",         // 边框颜色
		hoverBgOpacity: 15,             // 悬停时背景透明度（通常比 bgOpacity 稍高）
	},

	// ========== 信息卡片样式（已弃用，保留兼容） ==========
	info: {
		blur: "md",
		bgOpacity: 20,
		bgColor: "#ffffff",
		borderOpacity: 10,
		borderColor: "#ffffff",
	},

	// ========== 导航栏样式（顶部状态栏） ==========
	nav: {
		blur: "xl",                     // 模糊强度（建议 xl 以上）
		bgOpacity: 40,                  // 背景透明度（导航栏通常需要更深）
		bgColor: "#000000",             // 背景颜色
		borderOpacity: 10,              // 边框透明度
		borderColor: "#ffffff",         // 边框颜色
	},

	// ========== 主容器样式（包裹整个列表的外框） ==========
	container: {
		blur: "xl",                     // 模糊强度
		bgOpacity: 30,                  // 背景透明度
		bgColor: "#000000",             // 背景颜色
		borderOpacity: 10,              // 边框透明度
		borderColor: "#ffffff",         // 边框颜色
		shadowOpacity: 30,              // 外阴影透明度
	},

	// ========== 内发光效果（玻璃边缘的微光） ==========
	innerGlow: {
		enabled: true,                  // 是否启用
		opacity: 15,                    // 发光透明度 0-100
		color: "#ffffff",               // 发光颜色（通常白色）
	},
}

/** 获取当前生效的颜色 */
export function getActiveColors(config: GlassStyleConfig): ColorTheme {
	if (config.customColors.enabled) {
		return {
			name: "自定义",
			primary: config.customColors.primary,
			light: config.customColors.light,
			dark: config.customColors.dark,
			glow: config.customColors.glow,
		}
	}
	return colorPresets[config.colorPreset]
}

interface GlassStyleContextType {
	config: GlassStyleConfig
	setConfig: (config: GlassStyleConfig) => void
	updateConfig: <K extends keyof GlassStyleConfig>(
		key: K,
		value: GlassStyleConfig[K]
	) => void
	resetToDefault: () => void
}

const GlassStyleContext = createContext<GlassStyleContextType | null>(null)

const STORAGE_KEY = "xxxdance-glass-style"

export function GlassStyleProvider({ children }: { children: ReactNode }) {
	const [config, setConfigState] = useState<GlassStyleConfig>(() => {
		if (typeof window === "undefined") return defaultGlassStyle
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			try {
				return { ...defaultGlassStyle, ...JSON.parse(stored) }
			} catch {
				return defaultGlassStyle
			}
		}
		return defaultGlassStyle
	})

	// 保存到 localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
	}, [config])

	// 更新 CSS 变量
	useEffect(() => {
		const root = document.documentElement

		// 主色调
		const colors = getActiveColors(config)
		root.style.setProperty("--lab-accent", colors.primary)
		root.style.setProperty("--lab-accent-light", colors.light)
		root.style.setProperty("--lab-accent-dark", colors.dark)
		root.style.setProperty("--lab-accent-glow", colors.glow)

		// 各组件形状
		const getShapeRadius = (shapeConfig: ComponentShapeConfig) => 
			shapeConfig.shape === "pill" ? "9999px" : `${shapeConfig.borderRadius}px`
		
		root.style.setProperty("--glass-item-radius", getShapeRadius(config.shapes.item))
		root.style.setProperty("--glass-info-radius", getShapeRadius(config.shapes.info))
		root.style.setProperty("--glass-nav-radius", getShapeRadius(config.shapes.nav))
		root.style.setProperty("--glass-container-radius", getShapeRadius(config.shapes.container))

		// Item 样式
		root.style.setProperty("--glass-item-blur", getBlurValue(config.item.blur))
		root.style.setProperty("--glass-item-bg", hexToRgba(config.item.bgColor, config.item.bgOpacity))
		root.style.setProperty("--glass-item-border", hexToRgba(config.item.borderColor, config.item.borderOpacity))
		root.style.setProperty("--glass-item-hover-bg", hexToRgba(config.item.bgColor, config.item.hoverBgOpacity))

		// Info 样式
		root.style.setProperty("--glass-info-blur", getBlurValue(config.info.blur))
		root.style.setProperty("--glass-info-bg", hexToRgba(config.info.bgColor, config.info.bgOpacity))
		root.style.setProperty("--glass-info-border", hexToRgba(config.info.borderColor, config.info.borderOpacity))

		// Nav 样式
		root.style.setProperty("--glass-nav-blur", getBlurValue(config.nav.blur))
		root.style.setProperty("--glass-nav-bg", hexToRgba(config.nav.bgColor, config.nav.bgOpacity))
		root.style.setProperty("--glass-nav-border", hexToRgba(config.nav.borderColor, config.nav.borderOpacity))

		// Container 样式
		root.style.setProperty("--glass-container-blur", getBlurValue(config.container.blur))
		root.style.setProperty("--glass-container-bg", hexToRgba(config.container.bgColor, config.container.bgOpacity))
		root.style.setProperty("--glass-container-border", hexToRgba(config.container.borderColor, config.container.borderOpacity))
		root.style.setProperty("--glass-container-shadow-opacity", String(config.container.shadowOpacity / 100))

		// 内发光
		root.style.setProperty("--glass-inner-glow", 
			config.innerGlow.enabled 
				? `inset 0 1px 1px ${hexToRgba(config.innerGlow.color, config.innerGlow.opacity)}`
				: "none"
		)
	}, [config])

	const setConfig = (newConfig: GlassStyleConfig) => {
		setConfigState(newConfig)
	}

	const updateConfig = <K extends keyof GlassStyleConfig>(
		key: K,
		value: GlassStyleConfig[K]
	) => {
		setConfigState((prev) => ({ ...prev, [key]: value }))
	}

	const resetToDefault = () => {
		setConfigState(defaultGlassStyle)
	}

	return (
		<GlassStyleContext.Provider value={{ config, setConfig, updateConfig, resetToDefault }}>
			{children}
		</GlassStyleContext.Provider>
	)
}

export function useGlassStyle() {
	const context = useContext(GlassStyleContext)
	if (!context) {
		throw new Error("useGlassStyle must be used within GlassStyleProvider")
	}
	return context
}

// ========== 工具函数 ==========

function getBlurValue(blur: GlassBlur): string {
	const map: Record<GlassBlur, string> = {
		none: "0px",
		sm: "4px",
		md: "12px",
		lg: "16px",
		xl: "24px",
		"2xl": "40px",
		"3xl": "64px",
	}
	return map[blur]
}

function hexToRgba(hex: string, opacity: number): string {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

