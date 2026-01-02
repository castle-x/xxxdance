import { defineConfig } from "vite"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import viteImagemin from "vite-plugin-imagemin"

export default defineConfig({
	// 支持 GitHub Pages 部署：使用环境变量 VITE_BASE_PATH 或默认 "/"
	base: process.env.VITE_BASE_PATH || "/",
	plugins: [
		react(),
		tailwindcss(),
		// 图片压缩插件
		viteImagemin({
			// PNG 压缩配置
			optipng: {
				optimizationLevel: 7,
			},
			// PNG 有损压缩（更小体积）
			pngquant: {
				quality: [0.7, 0.85],
				speed: 4,
			},
			// JPEG 压缩
			mozjpeg: {
				quality: 80,
			},
			// WebP 生成（同时生成 WebP 格式）
			webp: {
				quality: 80,
			},
		}),
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
