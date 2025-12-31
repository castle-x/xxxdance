import "./index.css"
import { useStore } from "@nanostores/react"
import { lazy, memo, Suspense, useEffect, useState, useCallback } from "react"
import ReactDOM from "react-dom/client"
import { I18nProvider } from "@lingui/react"
import { i18n } from "@/lib/i18n"
import { $router } from "@/components/router"
import { ThemeVariantProvider, BackgroundProvider, GlassStyleProvider, useThemeVariant } from "@/themes"
import { Toaster } from "@/components/ui/toaster"
import { PageLoading } from "@/components/loading"

// 懒加载页面组件（代码分割，提高性能）
const WelcomePage = lazy(() => import("@/components/routes/welcome"))
const DocsPage = lazy(() => import("@/components/routes/home"))
const LabPage = lazy(() => import("@/components/routes/lab"))

type AppPage = "welcome" | "docs" | "lab"

// 从 URL 参数获取初始页面
function getInitialPage(): AppPage {
	const params = new URLSearchParams(window.location.search)
	const pageParam = params.get("page")
	if (pageParam === "docs") return "docs"
	if (pageParam === "lab") return "lab"
	return "welcome"
}

/**
 * 应用路由组件
 * 
 * 根据当前路由显示不同的页面
 */
const App = memo(() => {
	const page = useStore($router)
	const [currentPage, setCurrentPage] = useState<AppPage>(getInitialPage)
	const { setVariant } = useThemeVariant()

	useEffect(() => {
		// 🔥 应用初始化：读取当前浏览器路径并初始化路由
		const currentPath = window.location.pathname + window.location.search
		console.log("[XXxDance] App mounted")
		console.log("[XXxDance] Current URL:", currentPath)
		console.log("[XXxDance] Current page:", currentPage)
		
		// 如果路由未初始化，手动打开当前路径
		if (!page) {
			console.log("[XXxDance] Initializing router with:", currentPath)
			$router.open(currentPath)
		}
	}, [])

	// 导航处理
	const handleNavigate = useCallback((target: "home" | "docs" | "lab") => {
		if (target === "home") {
			// 切换回首页时，强制使用暗黑模式
			setVariant("dark")
			setCurrentPage("welcome")
			window.history.pushState({}, "", "/")
		} else if (target === "lab") {
			// 实验页面也使用暗黑模式
			setVariant("dark")
			setCurrentPage("lab")
			window.history.pushState({}, "", "/?page=lab")
		} else {
			setCurrentPage("docs")
			window.history.pushState({}, "", "/?page=docs")
		}
	}, [setVariant])

	// 根据当前页面状态渲染
	if (currentPage === "welcome") {
		return <WelcomePage onNavigate={handleNavigate} />
	}
	
	if (currentPage === "lab") {
		return <LabPage onNavigate={handleNavigate} />
	}
	
	return <DocsPage onNavigateHome={() => handleNavigate("home")} />
})

/**
 * 全局布局组件
 */
const Layout = () => {
	return (
			<Suspense fallback={<PageLoading />}>
				<App />
			</Suspense>
	)
}

/**
 * 根组件
 */
const Root = () => {
	return (
		<I18nProvider i18n={i18n}>
			<ThemeVariantProvider>
				<BackgroundProvider>
					<GlassStyleProvider>
				<Layout />
				<Toaster />
					</GlassStyleProvider>
				</BackgroundProvider>
			</ThemeVariantProvider>
		</I18nProvider>
	)
}

// 🔥 在 React 渲染前预初始化路由器（可选，但建议保留）
console.log("[XXxDance] Pre-initializing router")
console.log("[XXxDance] window.location.pathname:", window.location.pathname)
$router.open(window.location.pathname + window.location.search)

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(<Root />)
