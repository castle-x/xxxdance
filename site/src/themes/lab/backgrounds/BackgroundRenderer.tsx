/**
 * 背景渲染器
 * 
 * 根据当前选择渲染对应的背景组件
 */

import { Suspense } from "react"
import { useBackground } from "./BackgroundProvider"
import { getBackgroundById } from "./registry"

/** 加载占位符 */
function BackgroundLoading() {
	return (
		<div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black">
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[var(--lab-accent)]/30 border-t-[var(--lab-accent)] rounded-full animate-spin" />
			</div>
		</div>
	)
}

export function BackgroundRenderer() {
	const { selectedId, currentParams } = useBackground()
	const bgConfig = getBackgroundById(selectedId)
	
	if (!bgConfig) {
		return <BackgroundLoading />
	}
	
	const Component = bgConfig.component
	
	// 合并固定的 defaultProps 和用户配置的参数
	const finalProps = {
		...(bgConfig.defaultProps || {}),
		...currentParams,
	}
	
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			<Suspense fallback={<BackgroundLoading />}>
				<div className="absolute inset-0">
					<Component {...finalProps} />
				</div>
			</Suspense>
		</div>
	)
}

