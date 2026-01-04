import "./index.css"
import { lazy, memo, Suspense } from "react"
import ReactDOM from "react-dom/client"
import { ThemeVariantProvider, BackgroundProvider } from "@/themes"
import { Toaster } from "@/components/ui/toaster"
import { PageLoading } from "@/components/loading"

// 懒加载页面组件（代码分割，提高性能）
const WelcomePage = lazy(() => import("@/components/routes/welcome"))

/**
 * 应用路由组件
 * 
 * 目前只有首页
 */
const App = memo(() => {
	return <WelcomePage />
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
			<ThemeVariantProvider>
				<BackgroundProvider>
				<Layout />
				<Toaster />
				</BackgroundProvider>
			</ThemeVariantProvider>
	)
}

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(<Root />)
