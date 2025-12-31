/**
 * 文档数据 Hook
 * 
 * 开发模式：从 API 获取文档
 * 生产模式：从打包的 JSON 获取文档
 */

import { useState, useEffect, useCallback } from "react"
import type { Doc, DocNavItem } from "@/components/docs/types"

// 生产模式下的静态文档数据
// @ts-ignore - 构建时生成
import staticDocs from "@/generated/docs.json"

const isDev = import.meta.env.DEV

/**
 * 获取文档列表
 */
export function useDocList() {
	const [docs, setDocs] = useState<DocNavItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			if (isDev) {
				// 开发模式：从 API 获取
				const res = await fetch("/api/docs")
				if (!res.ok) throw new Error("Failed to fetch docs")
				const data = await res.json()
				setDocs(data)
			} else {
				// 生产模式：使用静态数据
				setDocs(staticDocs.map((d: Doc) => ({
					slug: d.slug,
					title: d.title,
					order: d.order ?? 0,
				})))
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error")
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		refresh()
	}, [refresh])

	return { docs, loading, error, refresh }
}

/**
 * 获取单个文档
 */
export function useDoc(slug: string | null) {
	const [doc, setDoc] = useState<Doc | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!slug) {
			setDoc(null)
			return
		}

		setLoading(true)
		setError(null)

		const fetchDoc = async () => {
			try {
				if (isDev) {
					// 开发模式：从 API 获取
					const res = await fetch(`/api/docs/${slug}`)
					if (!res.ok) throw new Error("Document not found")
					const data = await res.json()
					setDoc(data)
				} else {
					// 生产模式：从静态数据查找
					const found = staticDocs.find((d: Doc) => d.slug === slug)
					if (!found) throw new Error("Document not found")
					setDoc(found)
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error")
				setDoc(null)
			} finally {
				setLoading(false)
			}
		}

		fetchDoc()
	}, [slug])

	return { doc, loading, error }
}

/**
 * 保存文档（仅开发模式）
 */
export function useSaveDoc() {
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const save = useCallback(async (slug: string, content: string) => {
		if (!isDev) {
			setError("Editing is only available in development mode")
			return false
		}

		setSaving(true)
		setError(null)

		try {
			const res = await fetch(`/api/docs/${slug}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			})

			if (!res.ok) throw new Error("Failed to save document")
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error")
			return false
		} finally {
			setSaving(false)
		}
	}, [])

	return { save, saving, error }
}

/**
 * 删除文档（仅开发模式）
 */
export function useDeleteDoc() {
	const [deleting, setDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const deleteDoc = useCallback(async (slug: string) => {
		if (!isDev) {
			setError("Deleting is only available in development mode")
			return false
		}

		setDeleting(true)
		setError(null)

		try {
			const res = await fetch(`/api/docs/${slug}`, { method: "DELETE" })
			if (!res.ok) throw new Error("Failed to delete document")
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error")
			return false
		} finally {
			setDeleting(false)
		}
	}, [])

	return { deleteDoc, deleting, error }
}

