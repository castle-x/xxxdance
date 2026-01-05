import { defineConfig } from "vite"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
	// 支持 GitHub Pages 部署：使用环境变量 VITE_BASE_PATH 或默认 "/"
	base: process.env.VITE_BASE_PATH || "/",
	plugins: [
		react(),
		tailwindcss(),
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
