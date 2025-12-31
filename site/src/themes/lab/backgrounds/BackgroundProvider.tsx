/**
 * 实验室背景 Provider
 * 
 * 管理背景选择和参数状态
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { StoredBackgroundConfig, BackgroundState } from "./types"
import { getBackgroundById, getDefaultParams, backgroundRegistry } from "./registry"

interface BackgroundContextType {
	/** 当前选中的背景 ID */
	selectedId: string
	/** 当前背景参数 */
	currentParams: Record<string, unknown>
	/** 设置背景 */
	setBackground: (id: string) => void
	/** 更新参数 */
	updateParam: (key: string, value: unknown) => void
	/** 重置参数为默认值 */
	resetParams: () => void
	/** 获取所有背景列表 */
	backgrounds: typeof backgroundRegistry
	/** 控制面板是否展开 */
	isControlPanelOpen: boolean
	/** 切换控制面板 */
	toggleControlPanel: () => void
}

const BackgroundContext = createContext<BackgroundContextType | null>(null)

const STORAGE_KEY = "xxxdance-lab-background"

/** 从 localStorage 加载配置 */
function loadStoredConfig(): StoredBackgroundConfig {
	const defaultId = "pixelSnow" // 默认背景
	if (typeof window === "undefined") {
		return { selectedId: defaultId, params: {} }
	}
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			const config = JSON.parse(stored) as StoredBackgroundConfig
			// 检查保存的背景是否还存在
			if (getBackgroundById(config.selectedId)) {
				return config
			}
		}
	} catch {
		// 忽略解析错误
	}
	return { selectedId: defaultId, params: {} }
}

/** 保存配置到 localStorage */
function saveStoredConfig(config: StoredBackgroundConfig) {
	if (typeof window === "undefined") return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

interface BackgroundProviderProps {
	children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
	const [storedConfig, setStoredConfig] = useState<StoredBackgroundConfig>(loadStoredConfig)
	const [isControlPanelOpen, setIsControlPanelOpen] = useState(false)
	
	const selectedId = storedConfig.selectedId
	const currentParams = {
		...getDefaultParams(selectedId),
		...(storedConfig.params[selectedId] || {}),
	}
	
	const setBackground = useCallback((id: string) => {
		const newConfig: StoredBackgroundConfig = {
			...storedConfig,
			selectedId: id,
		}
		setStoredConfig(newConfig)
		saveStoredConfig(newConfig)
	}, [storedConfig])
	
	const updateParam = useCallback((key: string, value: unknown) => {
		const newParams = {
			...storedConfig.params,
			[selectedId]: {
				...(storedConfig.params[selectedId] || {}),
				[key]: value,
			},
		}
		const newConfig: StoredBackgroundConfig = {
			...storedConfig,
			params: newParams,
		}
		setStoredConfig(newConfig)
		saveStoredConfig(newConfig)
	}, [storedConfig, selectedId])
	
	const resetParams = useCallback(() => {
		const newParams = { ...storedConfig.params }
		delete newParams[selectedId]
		const newConfig: StoredBackgroundConfig = {
			...storedConfig,
			params: newParams,
		}
		setStoredConfig(newConfig)
		saveStoredConfig(newConfig)
	}, [storedConfig, selectedId])
	
	const toggleControlPanel = useCallback(() => {
		setIsControlPanelOpen((prev) => !prev)
	}, [])
	
	return (
		<BackgroundContext.Provider
			value={{
				selectedId,
				currentParams,
				setBackground,
				updateParam,
				resetParams,
				backgrounds: backgroundRegistry,
				isControlPanelOpen,
				toggleControlPanel,
			}}
		>
			{children}
		</BackgroundContext.Provider>
	)
}

export function useBackground() {
	const context = useContext(BackgroundContext)
	if (!context) {
		throw new Error("useBackground must be used within BackgroundProvider")
	}
	return context
}

