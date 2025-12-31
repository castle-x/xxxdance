/**
 * 样式类名合并工具
 * 
 * 使用 clsx + tailwind-merge 智能合并 Tailwind CSS 类名
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn - 合并 Tailwind CSS 类名
 * 
 * @example
 * cn("px-4", "py-2", "bg-blue-500")
 * // → "px-4 py-2 bg-blue-500"
 * 
 * cn("text-sm", isActive && "font-bold")
 * // → "text-sm font-bold" (当 isActive 为 true)
 * 
 * cn("p-2", "p-4")
 * // → "p-4" (后者覆盖前者)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

