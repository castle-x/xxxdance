/**
 * 背景渲染器（简化版）
 * 
 * 固定渲染 Threads 背景
 */

import { Suspense, lazy } from "react"

// 懒加载 Threads 背景组件
const Threads = lazy(() => import("@/components/Threads"))

/** 加载占位符 */
function BackgroundLoading() {
	return (
		<div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
	)
}

export function BackgroundRenderer() {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			<Suspense fallback={<BackgroundLoading />}>
				<div className="absolute inset-0">
					<Threads 
						color={[1, 1, 1]} 
						amplitude={1} 
						distance={0} 
						enableMouseInteraction={true} 
					/>
				</div>
			</Suspense>
		</div>
	)
}
