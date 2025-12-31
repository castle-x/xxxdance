/**
 * 文档导航组件
 * 
 * 显示文档列表目录
 */

import { memo } from "react"
import { cn } from "@/lib/utils"
import type { DocNavItem } from "./types"

interface DocNavProps {
	/** 文档列表 */
	items: DocNavItem[]
	/** 当前选中的文档 slug */
	activeSlug?: string
	/** 点击文档时的回调 */
	onSelect?: (slug: string) => void
	/** 额外的 className */
	className?: string
}

/**
 * 文档导航
 * 
 * 显示文档目录列表，支持高亮当前文档
 */
export const DocNav = memo(function DocNav({ 
	items, 
	activeSlug, 
	onSelect,
	className 
}: DocNavProps) {
	// 按 order 排序
	const sortedItems = [...items].sort((a, b) => a.order - b.order)

	return (
		<nav className={cn("space-y-1", className)}>
			{sortedItems.map((item) => (
				<button
					key={item.slug}
					onClick={() => onSelect?.(item.slug)}
					className={cn(
						"w-full text-left px-4 py-2 rounded-lg transition-colors",
						"hover:bg-accent hover:text-accent-foreground",
						activeSlug === item.slug && "bg-accent text-accent-foreground font-medium"
					)}
				>
					{item.title}
				</button>
			))}
		</nav>
	)
})

