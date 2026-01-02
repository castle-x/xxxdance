/**
 * 主题 Provider（简化版）
 * 
 * 固定使用暗黑主题
 */

import { useEffect, type ReactNode } from "react"

interface ThemeVariantProviderProps {
	children: ReactNode
}

export function ThemeVariantProvider({ children }: ThemeVariantProviderProps) {
	// 初始化时设置暗黑主题
	useEffect(() => {
		const root = document.documentElement
		const body = document.body

		// 设置暗黑主题 class
		root.classList.add("dark", "theme-dark")
		body.classList.add("theme-dark")

		// 设置 data 属性
		root.dataset.theme = "dark"
		body.dataset.theme = "dark"
	}, [])

	return <>{children}</>
}
