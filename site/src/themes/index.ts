/**
 * 主题系统主入口
 * 
 * 两个主题：明亮、暗黑（带毛玻璃特效）
 */

// 类型定义
export {
	type ThemeVariant,
	type ThemeConfig,
	themeRegistry,
	getThemeConfig,
	getAllThemes,
} from "./types"

// Provider
export {
	ThemeVariantProvider,
	useThemeVariant,
	useIsThemeVariant,
} from "./ThemeVariantProvider"

// 统一主题组件（推荐使用）
export { ThemedCard, type ThemedCardProps } from "./ThemedCard"
export { ThemedButton, type ThemedButtonProps } from "./ThemedButton"
export { ThemedBackground, type ThemedBackgroundProps, useBackground } from "./ThemedBackground"

// 暗黑主题组件（直接使用）
export {
	LabCard,
	LabButton,
	LabBackground,
	GlassCard,
	GlassNav,
	type LabCardProps,
	type LabButtonProps,
	type LabBackgroundProps,
	type GlassCardProps,
	type GlassNavProps,
	// 毛玻璃样式系统
	GlassStyleProvider,
	useGlassStyle,
	GlassStylePanel,
	defaultGlassStyle,
	type GlassStyleConfig,
	type GlassShape,
	type GlassBlur,
} from "./lab"

// 背景系统
export {
	BackgroundProvider,
	BackgroundRenderer,
	BackgroundControlPanel,
	BackgroundControlToggle,
	backgroundRegistry,
	getBackgroundById,
	getDefaultParams,
	type BackgroundConfig,
	type ParamConfig,
} from "./lab/backgrounds"
