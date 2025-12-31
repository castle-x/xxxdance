/**
 * 背景组件注册表
 * 
 * 包含所有可用的背景效果及其参数配置
 */

import { lazy } from "react"
import type { BackgroundConfig } from "./types"

// 懒加载背景组件
const DotGrid = lazy(() => import("./DotGrid"))
const LetterGlitch = lazy(() => import("./LetterGlitch"))
const PixelSnow = lazy(() => import("@/components/PixelSnow"))
const Threads = lazy(() => import("@/components/Threads"))
const Beams = lazy(() => import("@/components/Beams"))

/** 背景组件注册表 */
export const backgroundRegistry: BackgroundConfig[] = [
	{
		id: "pixelSnow",
		name: "像素雪花 PixelSnow",
		description: "飘落的像素风格雪花",
		component: PixelSnow as BackgroundConfig["component"],
		params: {
			color: { type: "color", label: "颜色", default: "#ffffff" },
			flakeSize: { type: "number", label: "雪花大小", default: 0.01, min: 0.005, max: 0.05, step: 0.005 },
			minFlakeSize: { type: "number", label: "最小尺寸", default: 1.25, min: 0.5, max: 3, step: 0.25 },
			pixelResolution: { type: "number", label: "像素分辨率", default: 200, min: 50, max: 400, step: 25 },
			speed: { type: "number", label: "速度", default: 1.25, min: 0.5, max: 3, step: 0.25 },
			density: { type: "number", label: "密度", default: 0.3, min: 0.1, max: 0.8, step: 0.1 },
			direction: { type: "number", label: "方向", default: 125, min: 0, max: 360, step: 15 },
			brightness: { type: "number", label: "亮度", default: 1, min: 0.2, max: 2, step: 0.1 },
		},
	},
	{
		id: "threads",
		name: "丝线 Threads",
		description: "流动的丝线效果",
		component: Threads as BackgroundConfig["component"],
		params: {
			amplitude: { type: "number", label: "振幅", default: 1, min: 0.1, max: 3, step: 0.1 },
			distance: { type: "number", label: "距离", default: 0, min: 0, max: 2, step: 0.1 },
			enableMouseInteraction: { type: "boolean", label: "鼠标交互", default: true },
		},
		// color 参数需要 [r, g, b] 格式，暂不支持 UI 配置
		defaultProps: { color: [1, 1, 1] },
	},
	{
		id: "beams",
		name: "光束 Beams",
		description: "动态光束效果",
		component: Beams as BackgroundConfig["component"],
		params: {
			beamWidth: { type: "number", label: "光束宽度", default: 2, min: 0.5, max: 5, step: 0.5 },
			beamHeight: { type: "number", label: "光束高度", default: 15, min: 5, max: 30, step: 1 },
			beamNumber: { type: "number", label: "光束数量", default: 12, min: 3, max: 20, step: 1 },
			lightColor: { type: "color", label: "光束颜色", default: "#ffffff" },
			speed: { type: "number", label: "速度", default: 1, min: 0.1, max: 3, step: 0.1 },
			noiseIntensity: { type: "number", label: "噪声强度", default: 1.75, min: 0.5, max: 5, step: 0.25 },
		},
	},
	{
		id: "dotGrid",
		name: "点阵 DotGrid",
		description: "交互式点阵网格",
		component: DotGrid as BackgroundConfig["component"],
		params: {
			dotSize: { type: "number", label: "点大小", default: 3, min: 1, max: 10, step: 0.5 },
			gap: { type: "number", label: "间距", default: 20, min: 5, max: 50, step: 1 },
			baseColor: { type: "color", label: "基础颜色", default: "#333333" },
			activeColor: { type: "color", label: "激活颜色", default: "#00ffff" },
			proximity: { type: "number", label: "感应距离", default: 100, min: 20, max: 300, step: 10 },
			shockRadius: { type: "number", label: "冲击半径", default: 200, min: 50, max: 500, step: 10 },
			shockStrength: { type: "number", label: "冲击强度", default: 20, min: 1, max: 50, step: 1 },
		},
	},
	{
		id: "letterGlitch",
		name: "字母故障 LetterGlitch",
		description: "Matrix 风格字符雨",
		component: LetterGlitch as unknown as BackgroundConfig["component"],
		params: {
			glitchSpeed: { type: "number", label: "故障速度", default: 100, min: 10, max: 200, step: 10 },
			centerVignette: { type: "boolean", label: "中心暗角", default: true },
			outerVignette: { type: "boolean", label: "外部暗角", default: true },
			smooth: { type: "boolean", label: "平滑过渡", default: true },
		},
	},
]

/** 按 ID 获取背景配置 */
export function getBackgroundById(id: string): BackgroundConfig | undefined {
	return backgroundRegistry.find((bg) => bg.id === id)
}

/** 获取背景的默认参数值 */
export function getDefaultParams(id: string): Record<string, unknown> {
	const bg = getBackgroundById(id)
	if (!bg) return {}
	
	const defaults: Record<string, unknown> = {}
	for (const [key, config] of Object.entries(bg.params)) {
		defaults[key] = config.default
	}
	return defaults
}
