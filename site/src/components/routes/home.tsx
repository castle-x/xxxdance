/**
 * XXxDance 文档页
 * 
 * 文档教程展示主界面（移动端优先）
 */

import { memo, useEffect, useState, Suspense } from "react"
import { GlassNav, GlassCard, useThemeVariant, BackgroundRenderer } from "@/themes"
import { cn } from "@/lib/utils"
import { MoonStar, Sun, Menu, X, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocList, useDoc } from "@/hooks"
import { DocViewer, DocNav } from "@/components/docs"
import { Mobile, NotMobile } from "@/components/ui/responsive"

const isDev = import.meta.env.DEV

interface DocsPageProps {
	onNavigateHome?: () => void
}

export default memo(function DocsPage({ onNavigateHome }: DocsPageProps) {
	const { variant, toggleVariant, hasBackground } = useThemeVariant()
	
	// 文档状态
	const { docs, loading: listLoading } = useDocList()
	const [activeSlug, setActiveSlug] = useState<string | null>(null)
	const { doc, loading: docLoading } = useDoc(activeSlug)
		
	// 移动端侧边栏状态
	const [sidebarOpen, setSidebarOpen] = useState(false)
	
	// 设置页面标题
	useEffect(() => {
		document.title = doc?.title ? `${doc.title} - XXxDance` : "XXxDance 文档"
	}, [doc?.title])
	
	// 自动选择第一个文档
	useEffect(() => {
		if (docs.length > 0 && !activeSlug) {
			setActiveSlug(docs[0].slug)
		}
	}, [docs, activeSlug])
	
	// 选择文档时关闭移动端侧边栏
	const handleSelectDoc = (slug: string) => {
		setActiveSlug(slug)
		setSidebarOpen(false)
	}

	// 主题图标
	const ThemeIcon = variant === "dark" ? MoonStar : Sun

	// 侧边栏内容
	const sidebarContent = (
		<div className="h-full flex flex-col">
			<div className="p-4 border-b border-border">
				<h2 className="font-semibold text-lg">文档目录</h2>
				{isDev && (
					<p className="text-xs text-muted-foreground mt-1">
						✏️ 开发模式 - 可编辑
					</p>
				)}
			</div>
			<div className="flex-1 overflow-y-auto p-2">
				{listLoading ? (
					<div className="p-4 text-center text-muted-foreground">
						加载中...
					</div>
				) : docs.length === 0 ? (
					<div className="p-4 text-center text-muted-foreground">
						暂无文档
					</div>
				) : (
					<DocNav
						items={docs}
						activeSlug={activeSlug || undefined}
						onSelect={handleSelectDoc}
		/>
				)}
			</div>
		</div>
	)

	return (
		<div className="min-h-screen flex flex-col relative">
			{/* 背景 - 仅暗黑主题显示 */}
			{hasBackground && (
				<div className="fixed inset-0 z-0">
					<Suspense fallback={<div className="w-full h-full bg-black" />}>
						<BackgroundRenderer />
					</Suspense>
				</div>
			)}
			
			{/* 内容层 */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* 导航栏 */}
				<header className="sticky top-0 z-40 p-4">
					<GlassNav className="w-full max-w-6xl mx-auto justify-between py-3 px-4 md:px-6">
						<div className="flex items-center gap-3">
							{/* 返回首页按钮 */}
							{onNavigateHome && (
								<Button
									variant="ghost"
									size="icon"
									onClick={onNavigateHome}
									className="rounded-full -ml-2"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
							)}
							
							{/* 移动端：显示菜单按钮 */}
							<Mobile>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setSidebarOpen(true)}
									className="rounded-full"
								>
									<Menu className="h-5 w-5" />
								</Button>
							</Mobile>
							
							<span className="text-xl font-bold">XXxDance</span>
							<NotMobile>
								<span className="text-sm text-muted-foreground">文档教程</span>
							</NotMobile>
						</div>
						
						<div className="flex items-center gap-2">
							{/* 首页按钮 */}
							{onNavigateHome && (
								<NotMobile>
									<Button
										variant="ghost"
										size="sm"
										onClick={onNavigateHome}
										className="rounded-full"
									>
										<Home className="h-4 w-4 mr-2" />
										首页
									</Button>
								</NotMobile>
								)}
							
							{/* 主题切换按钮 */}
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleVariant}
								className="rounded-full"
								title={variant === "dark" ? "切换到明亮模式" : "切换到暗黑模式"}
							>
								<ThemeIcon className="h-5 w-5" />
							</Button>
						</div>
					</GlassNav>
				</header>

				{/* 主内容区 */}
				<main className="flex-1 flex">
					{/* 桌面端：固定侧边栏 */}
					<NotMobile>
						<aside className="w-64 shrink-0 p-4 pl-4">
							<GlassCard shape="rounded" className="h-[calc(100vh-8rem)] sticky top-24 overflow-hidden">
								{sidebarContent}
					</GlassCard>
						</aside>
					</NotMobile>
					
					{/* 移动端：抽屉式侧边栏 */}
					<Mobile>
						{sidebarOpen && (
							<>
								{/* 遮罩 */}
								<div 
									className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
									onClick={() => setSidebarOpen(false)}
				/>
								{/* 侧边栏 */}
								<div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl">
									<div className="flex items-center justify-between p-4 border-b border-border">
										<span className="font-semibold">文档目录</span>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setSidebarOpen(false)}
										>
											<X className="h-5 w-5" />
										</Button>
									</div>
									<div className="h-[calc(100%-4rem)] overflow-y-auto">
										{sidebarContent}
									</div>
								</div>
							</>
						)}
					</Mobile>

					{/* 文档内容区 */}
					<div className="flex-1 p-4 min-w-0">
						<div className="max-w-4xl mx-auto">
							{docLoading ? (
								<GlassCard shape="rounded" className="p-8 text-center">
									<div className="animate-pulse">加载中...</div>
								</GlassCard>
							) : doc ? (
								<GlassCard shape="rounded" className="p-6 md:p-8 overflow-hidden">
									<DocViewer content={doc.content} />
								</GlassCard>
							) : (
								<GlassCard shape="rounded" className="p-8 text-center">
									<h1 className="text-2xl font-bold mb-4">
										欢迎来到 XXxDance
									</h1>
									<p className="text-muted-foreground mb-6">
										选择左侧目录中的文档开始阅读
									</p>
									{docs.length === 0 && (
										<p className="text-sm text-muted-foreground">
											{isDev ? (
												<>
													📝 在 <code className="bg-muted px-1 rounded">content/docs/</code> 目录下创建 Markdown 文件
												</>
											) : (
												"暂无文档"
											)}
										</p>
									)}
								</GlassCard>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
})
