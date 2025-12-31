/**
 * useForceMobileMode - 强制手机模式 Hook
 * 
 * 用于在PC端测试手机端UI
 */

import { useState, useEffect } from "react"

const STORAGE_KEY = "xxxdance-force-mobile-mode"

export function useForceMobileMode(): [boolean, (enabled: boolean) => void] {
	const [forceMobileMode, setForceMobileMode] = useState<boolean>(() => {
		if (typeof window === "undefined") return false
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored === "true"
	})

	const toggleForceMobileMode = (enabled: boolean) => {
		setForceMobileMode(enabled)
		localStorage.setItem(STORAGE_KEY, enabled.toString())
	}

	return [forceMobileMode, toggleForceMobileMode]
}

export function getForceMobileMode(): boolean {
	if (typeof window === "undefined") return false
	const stored = localStorage.getItem(STORAGE_KEY)
	return stored === "true"
}

