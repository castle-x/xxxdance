/**
 * 文档系统类型定义
 */

/** 文档元数据 */
export interface DocMeta {
	/** 文档唯一标识（文件名，不含扩展名） */
	slug: string
	/** 文档标题 */
	title: string
	/** 文档描述 */
	description?: string
	/** 排序顺序 */
	order?: number
	/** 创建时间 */
	createdAt?: string
	/** 更新时间 */
	updatedAt?: string
}

/** 完整文档数据 */
export interface Doc extends DocMeta {
	/** Markdown 内容 */
	content: string
}

/** 文档目录项 */
export interface DocNavItem {
	slug: string
	title: string
	order: number
}

