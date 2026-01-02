/**
 * 背景 Provider（简化版）
 * 
 * 固定使用 Threads 背景
 */

import { type ReactNode } from "react"

interface BackgroundProviderProps {
	children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
	return <>{children}</>
}
