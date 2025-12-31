/**
 * ReactBits 背景组件类型定义
 */

import type { ComponentType } from "react"

/** 参数类型 */
export type ParamType = "number" | "color" | "boolean" | "select"

/** 参数配置 */
export interface ParamConfig {
	type: ParamType
	label: string
	description?: string
	default: number | string | boolean
	min?: number
	max?: number
	step?: number
	options?: { value: string | number; label: string }[]
}

/** 背景组件配置 */
export interface BackgroundConfig {
	id: string
	name: string
	description: string
	component: ComponentType<Record<string, unknown>>
	params: Record<string, ParamConfig>
	/** 需要的依赖（用于说明） */
	dependencies?: string[]
	/** 是否在选择列表中隐藏（代码保留，但不显示） */
	hidden?: boolean
	/** 固定的默认属性（不通过 UI 配置） */
	defaultProps?: Record<string, unknown>
}

/** 背景状态 */
export interface BackgroundState {
	id: string
	params: Record<string, unknown>
}

/** 存储的背景配置 */
export interface StoredBackgroundConfig {
	selectedId: string
	params: Record<string, Record<string, unknown>>
}

