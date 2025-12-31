import { defineConfig, type Plugin } from "vite"
import path from "path"
import fs from "fs/promises"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"

/**
 * 文档 API 插件（开发模式）
 * 
 * 提供文档的 CRUD API：
 * - GET /api/docs - 获取文档列表
 * - GET /api/docs/:slug - 获取单个文档
 * - POST /api/docs/:slug - 保存文档（仅开发模式）
 * - DELETE /api/docs/:slug - 删除文档（仅开发模式）
 */
function docsApiPlugin(): Plugin {
	const DOCS_DIR = path.resolve(__dirname, "content/docs")

	return {
		name: "docs-api",
		configureServer(server) {
			// 确保文档目录存在
			fs.mkdir(DOCS_DIR, { recursive: true }).catch(() => {})

			server.middlewares.use(async (req, res, next) => {
				// 只处理 /api/docs 开头的请求
				if (!req.url?.startsWith("/api/docs")) {
					return next()
				}

				// 设置 JSON 响应头
				res.setHeader("Content-Type", "application/json")

				try {
					const urlPath = req.url.replace(/\?.*$/, "") // 移除查询参数
					const slug = urlPath.replace("/api/docs/", "").replace("/api/docs", "")
				
					// GET /api/docs - 获取文档列表
					if (req.method === "GET" && (!slug || slug === "")) {
						const files = await fs.readdir(DOCS_DIR)
						const docs = await Promise.all(
							files
								.filter(f => f.endsWith(".md"))
								.map(async (file, index) => {
									const content = await fs.readFile(path.join(DOCS_DIR, file), "utf-8")
									const titleMatch = content.match(/^#\s+(.+)$/m)
									return {
										slug: file.replace(".md", ""),
										title: titleMatch?.[1] || file.replace(".md", ""),
										order: index,
									}
								})
						)
						res.end(JSON.stringify(docs))
					return
				}

					// GET /api/docs/:slug - 获取单个文档
					if (req.method === "GET" && slug) {
						const filePath = path.join(DOCS_DIR, `${slug}.md`)
						try {
							const content = await fs.readFile(filePath, "utf-8")
							const titleMatch = content.match(/^#\s+(.+)$/m)
							res.end(JSON.stringify({
								slug,
								title: titleMatch?.[1] || slug,
								content,
							}))
						} catch {
							res.statusCode = 404
							res.end(JSON.stringify({ error: "Document not found" }))
						}
						return
					}
					
					// POST /api/docs/:slug - 保存文档
					if (req.method === "POST" && slug) {
						let body = ""
						req.on("data", chunk => { body += chunk })
						req.on("end", async () => {
							try {
								const { content } = JSON.parse(body)
								const filePath = path.join(DOCS_DIR, `${slug}.md`)
								await fs.writeFile(filePath, content, "utf-8")
								res.end(JSON.stringify({ success: true, slug }))
							} catch (error) {
								res.statusCode = 400
								res.end(JSON.stringify({ error: "Invalid request body" }))
							}
						})
						return
					}

					// DELETE /api/docs/:slug - 删除文档
					if (req.method === "DELETE" && slug) {
						const filePath = path.join(DOCS_DIR, `${slug}.md`)
						try {
							await fs.unlink(filePath)
							res.end(JSON.stringify({ success: true, slug }))
						} catch {
							res.statusCode = 404
							res.end(JSON.stringify({ error: "Document not found" }))
						}
						return
					}

					// 未匹配的请求
					res.statusCode = 405
					res.end(JSON.stringify({ error: "Method not allowed" }))
					
				} catch (error) {
					console.error("[Docs API Error]", error)
					res.statusCode = 500
					res.end(JSON.stringify({ error: "Internal server error" }))
				}
			})
		},
	}
}

/**
 * 文档构建插件
 * 
 * 构建时将 content/docs/*.md 打包成 JSON 数据
 * 生成 src/generated/docs.json 供生产环境使用
 */
function docsBuildPlugin(): Plugin {
	const DOCS_DIR = path.resolve(__dirname, "content/docs")
	const OUTPUT_FILE = path.resolve(__dirname, "src/generated/docs.json")

	return {
		name: "docs-build",
		async buildStart() {
			// 确保输出目录存在
			await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })

			try {
				const files = await fs.readdir(DOCS_DIR)
				const docs = await Promise.all(
					files
						.filter(f => f.endsWith(".md"))
						.map(async (file, index) => {
							const content = await fs.readFile(path.join(DOCS_DIR, file), "utf-8")
							const titleMatch = content.match(/^#\s+(.+)$/m)
							return {
								slug: file.replace(".md", ""),
								title: titleMatch?.[1] || file.replace(".md", ""),
								content,
								order: index,
							}
						})
				)

				await fs.writeFile(OUTPUT_FILE, JSON.stringify(docs, null, 2))
				console.log(`[Docs Build] Generated ${docs.length} documents to src/generated/docs.json`)
			} catch (error) {
				console.error("[Docs Build Error]", error)
				// 生成空文档列表，避免构建失败
				await fs.writeFile(OUTPUT_FILE, "[]")
			}
		},
	}
}

export default defineConfig({
	// 支持 GitHub Pages 部署：使用环境变量 VITE_BASE_PATH 或默认 "/"
	base: process.env.VITE_BASE_PATH || "/",
	plugins: [
		react(),
		tailwindcss(),
		docsApiPlugin(),
		docsBuildPlugin(),
	],
	esbuild: {
		legalComments: "external",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		assetsDir: "assets",
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom"],
				},
			},
		},
	},
})
