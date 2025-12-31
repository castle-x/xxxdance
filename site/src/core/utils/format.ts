/**
 * 格式化工具函数
 */

/**
 * formatFileSize - 格式化文件大小
 * 
 * 将字节数转换为人类可读的格式
 * 
 * @param bytes 文件大小（字节）
 * @returns 格式化后的字符串
 * 
 * @example
 * formatFileSize(1024) // → "1.00 KB"
 * formatFileSize(1048576) // → "1.00 MB"
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 B"
	const k = 1024
	const sizes = ["B", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

