/**
 * XXxDance 欢迎页
 * 
 * 类似 ReactBits 官网的开屏欢迎页面
 */

import { memo, Suspense, useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, MapPin, MessageCircle, Smartphone, ShoppingBag, CalendarCheck, Loader2, Wifi, Car, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackgroundRenderer } from "@/themes"
import { cn } from "@/lib/utils"
import TextType from "@/components/TextType"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"


// Logo 组件
function Logo({ className }: { className?: string }) {
	return (
		<svg 
			className={cn("h-8 w-8", className)} 
			viewBox="0 0 32 32" 
			fill="none"
		>
			<circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
			<path 
				d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round"
			/>
			<circle cx="16" cy="16" r="2" fill="currentColor" />
		</svg>
	)
}

// 教程媒体配置（简化版 - 只保留视频）
interface TutorialMedia {
	video: string
}

// 快速入口项目配置
const quickLinks = [
	{
		id: "route",
		icon: MapPin,
		label: "路线引导",
		title: "点击查看原图/下滑查看更多内容",
		description: "📍上海市普陀区长寿路468号中环商务大厦604室",
		image: "/static/tutorial/address.png",
		tutorial: null as TutorialMedia | null,
	},
	{
		id: "parking",
		icon: Car,
		label: "停车指引",
		title: "停车指引",
		description: "📍上海市普陀区长寿路468号中环商务大厦",
		image: "/static/tutorial/p.png",
		tutorial: null as TutorialMedia | null,
	},
	{
		id: "wechat",
		icon: MessageCircle,
		label: "客服微信",
		title: "客服微信",
		description: "长按识别或保存图片添加客服微信",
		image: "/static/tutorial/service_qrcode.png",
		tutorial: null as TutorialMedia | null,
	},
	{
		id: "miniprogram",
		icon: Smartphone,
		label: "小程序码",
		title: "小程序码",
		description: "长按识别或微信搜xxxdance",
		image: "/static/tutorial/applet_qrcode.png",
		tutorial: null as TutorialMedia | null,
	},
	{
		id: "groupbuy",
		icon: ShoppingBag,
		label: "团购核销",
		title: "团购核销",
		description: "如何使用美团/大众点评团购券进行核销",
		image: null as string | null,
		tutorial: { video: "/static/tutorial/write-off.mp4" } as TutorialMedia,
		hot: true,
	},
	{
		id: "booking",
		icon: CalendarCheck,
		label: "预订教程",
		title: "预订教程",
		description: "如何在小程序预订教室",
		image: null as string | null,
		tutorial: { video: "/static/tutorial/booking.mp4" } as TutorialMedia,
		hot: true,
	},
	{
		id: "action",
		icon: Smartphone,
		label: "开门开灯",
		title: "开门开灯",
		description: "通过小程序开门开灯",
		image: null as string | null,
		tutorial: { video: "/static/tutorial/action.mp4" } as TutorialMedia,
	},
]

// 媒体加载状态
type LoadingState = "idle" | "loading" | "loaded" | "error"

// 预加载所有静态图片（首页加载时调用）
const preloadedImages = new Set<string>()

function preloadImages() {
	// 收集所有需要预加载的图片
	const imagesToPreload = [
		// quickLinks 中的静态图片
		...quickLinks.filter(link => link.image).map(link => link.image!),
		// 特别活动图片
		"/static/tutorial/newyear.png",
		// 停车指引
		"/static/tutorial/p.png",
	]
	
	imagesToPreload.forEach(src => {
		if (preloadedImages.has(src)) return
		preloadedImages.add(src)
		
		const img = new window.Image()
		img.src = src
	})
}

// 教程媒体查看组件（简化版 - 只显示视频）
function TutorialMediaViewer({ tutorial }: { tutorial: TutorialMedia }) {
	const [videoState, setVideoState] = useState<LoadingState>("idle")
	const [loadProgress, setLoadProgress] = useState(0)
	const videoRef = useRef<HTMLVideoElement>(null)
	
	const handleVideoProgress = useCallback(() => {
		const video = videoRef.current
		if (video && video.buffered.length > 0) {
			const buffered = video.buffered.end(video.buffered.length - 1)
			const duration = video.duration
			if (duration > 0) {
				setLoadProgress(Math.round((buffered / duration) * 100))
			}
		}
	}, [])
	
	useEffect(() => {
		if (videoState === "idle") {
			setVideoState("loading")
			setLoadProgress(0)
		}
	}, [videoState])
	
	return (
		<div className="relative rounded-lg overflow-hidden bg-black/30 border border-white/10 aspect-[9/16]">
			{videoState === "loading" && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-black/50">
					<Loader2 className="h-8 w-8 animate-spin text-white/60" />
					<div className="text-center">
						<p className="text-sm text-white/80">正在加载视频...</p>
					</div>
					<div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
						<div 
							className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
							style={{ width: `${loadProgress}%` }}
						/>
					</div>
					<p className="text-xs text-white/40">{loadProgress > 0 ? `${loadProgress}%` : "准备中..."}</p>
				</div>
			)}
			<video
				ref={videoRef}
				src={tutorial.video}
				controls
				playsInline
				className="w-full h-full object-contain"
				onLoadStart={() => setVideoState("loading")}
				onCanPlay={() => setVideoState("loaded")}
				onProgress={handleVideoProgress}
				onError={() => setVideoState("error")}
			/>
			{videoState === "error" && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
					<p className="text-sm text-red-400">视频加载失败</p>
					<p className="text-xs text-white/50">请检查网络后重试</p>
				</div>
			)}
		</div>
	)
}

// 快速入口菜单组件
function QuickLinksMenu() {
	const [isOpen, setIsOpen] = useState(false)
	const [activeDialog, setActiveDialog] = useState<typeof quickLinks[0] | null>(null)
	
	return (
		<>
			{/* 菜单按钮 - 高级毛玻璃大按钮 */}
			<div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						"flex items-center gap-2 px-8 h-[52px] rounded-full text-base font-medium",
						"bg-white/[0.06] backdrop-blur-2xl",
						"border border-white/[0.1]",
						"shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
						"hover:bg-white/[0.1] transition-all duration-200"
					)}
				>
					<span>你感兴趣的都在这里</span>
					<ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
				</button>
				
				{/* 下拉菜单 - 高级毛玻璃效果 */}
				{isOpen && (
					<>
						<div 
							className="fixed inset-0 z-40" 
							onClick={() => setIsOpen(false)} 
						/>
						<div className={cn(
							"absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50",
							"bg-black/50 backdrop-blur-2xl rounded-2xl",
							"border border-white/[0.08]",
							"shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
							"p-2 min-w-[200px]"
						)}>
							{quickLinks.map(link => (
								<button
									key={link.id}
									onClick={() => {
										setActiveDialog(link)
										setIsOpen(false)
									}}
									className={cn(
										"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm",
										"hover:bg-white/[0.08] transition-all duration-150 text-left"
									)}
								>
									<link.icon className="h-4 w-4 text-white/60" />
									<span className="flex-1 text-white/90">{link.label}</span>
									{'hot' in link && link.hot && <span>🔥</span>}
								</button>
							))}
						</div>
					</>
				)}
			</div>
			
			{/* 弹框 */}
			<Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
				<DialogContent className={cn(
					"bg-zinc-900/95 backdrop-blur-xl border-white/10",
					"max-w-[90vw] max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none",
					"top-[1rem] translate-y-0",
					activeDialog?.tutorial ? "sm:max-w-sm" : "sm:max-w-md"
				)}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{activeDialog && <activeDialog.icon className="h-5 w-5" />}
							{activeDialog?.title}
						</DialogTitle>
						<DialogDescription className="text-left text-base text-white/80">
							{activeDialog?.description}
						</DialogDescription>
					</DialogHeader>
					
					{/* 内容区域 */}
					<div className="mt-2">
						{activeDialog?.tutorial ? (
							// 有教程媒体 - 显示 GIF/视频
							<TutorialMediaViewer tutorial={activeDialog.tutorial} />
						) : activeDialog?.image ? (
							// 有静态图片 - 显示图片（点击打开原图）
							<div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
								<img 
									src={activeDialog.image} 
									alt={activeDialog.title}
									className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
									onClick={() => window.open(activeDialog.image!, '_blank')}
									title="点击查看原图"
								/>
							</div>
						) : (
							// 无内容 - 显示占位
							<div className="min-h-[200px] flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
								<div className="text-center text-white/50">
									<p className="text-sm">内容开发中...</p>
									<p className="text-xs mt-1">后续将展示教程或二维码</p>
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default memo(function WelcomePage() {
	// 打字效果文本
	const typingTexts = [
		"私密空间 · 自由练习",
		"你的专属舞蹈练习室",
		"智能科技 · 沉浸体验",
		"专业空间 · 自在起舞",
	]
	
	// 首页加载时预加载所有静态图片
	useEffect(() => {
		// 使用 requestIdleCallback 在浏览器空闲时预加载，不影响首屏渲染
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => preloadImages())
		} else {
			// 降级方案：延迟 1 秒后加载
			setTimeout(preloadImages, 1000)
		}
	}, [])
	
	// 特别活动弹窗
	const [showEventDialog, setShowEventDialog] = useState(false)
	
	// 小程序弹窗
	const [showMiniProgramDialog, setShowMiniProgramDialog] = useState(false)
	
	// WiFi 弹窗
	const [showWifiDialog, setShowWifiDialog] = useState(false)
	const [copiedField, setCopiedField] = useState<string | null>(null)
	
	// 复制到剪贴板
	const copyToClipboard = useCallback(async (text: string, field: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
		} catch {
			// 降级方案
			const textarea = document.createElement('textarea')
			textarea.value = text
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
		}
	}, [])
	
	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* 固定背景 - 后续发布时会固定一个 */}
			<div className="absolute inset-0 z-0">
				<Suspense fallback={<div className="w-full h-full bg-black" />}>
					<BackgroundRenderer />
				</Suspense>
			</div>
			
			{/* 内容层 */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* 导航栏 */}
				<header className="p-4 md:p-6">
					<nav className={cn(
						"max-w-6xl mx-auto flex items-center justify-between",
						"px-6 py-3 rounded-full",
						// 更高级的毛玻璃效果 - 参考 ReactBits
						"bg-white/[0.03] backdrop-blur-2xl",
						"border border-white/[0.08]",
						"shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
					)}>
						{/* Logo 区域 */}
						<div className="flex items-center gap-3">
							<Logo />
							<span className="text-lg font-bold tracking-tight">
								XXx' Dance Vision
							</span>
						</div>
						
						{/* WiFi 按钮 */}
						<button
							onClick={() => setShowWifiDialog(true)}
							className={cn(
								"flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
								"bg-white/[0.06] backdrop-blur-xl",
								"border border-white/[0.1]",
								"shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
								"hover:bg-white/[0.1] transition-all duration-200"
							)}
						>
							<Wifi className="h-4 w-4" />
							<span>Wifi</span>
						</button>
					</nav>
				</header>
				
				{/* 主内容区 */}
				<main className="flex-1 flex items-center justify-center px-4">
					<div className="text-center max-w-3xl mx-auto">
						{/* 标签 - 高级毛玻璃效果 */}
						<div className={cn(
							"inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8",
							// 更精致的毛玻璃效果
							"bg-white/[0.06] backdrop-blur-2xl",
							"border border-white/[0.1]",
							"shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
						)}>
							<span className="text-lg">🎉</span>
							<span className="text-sm font-medium text-white/90">宝子们，新年快乐！</span>
						</div>
						
						{/* 主标题 - 使用打字效果 */}
						<h1 className={cn(
							"text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
							"tracking-tight leading-tight min-h-[1.2em]"
						)}>
							<TextType
								text={typingTexts}
								typingSpeed={80}
								pauseDuration={2000}
								deletingSpeed={40}
								showCursor={true}
								cursorCharacter="|"
								loop={true}
								className="bg-gradient-to-br from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
							/>
						</h1>
						
						{/* 副标题 */}
						<p className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-white/70">
							24小时开放，小程序在线预约。
						</p>
						
						{/* 按钮组 */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							{/* 特别活动按钮 - AI 风格彩色渐变 */}
							<button
								className={cn(
									"group relative rounded-full px-8 h-[52px] text-base font-semibold",
									"text-white overflow-hidden",
									"transition-all duration-300",
									"hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
								)}
								onClick={() => setShowEventDialog(true)}
							>
								{/* 渐变背景层 - 流动动画 */}
								<span className={cn(
									"absolute inset-0 rounded-full",
									"bg-[linear-gradient(90deg,#f472b6,#c084fc,#60a5fa,#34d399,#fbbf24,#f472b6)]",
									"bg-[length:300%_100%]",
									"animate-[gradient-flow_3s_linear_infinite]"
								)} />
								
								{/* 内层背景 - 半透明遮罩让渐变更柔和 */}
								<span className="absolute inset-[2px] rounded-full bg-black/30 backdrop-blur-sm" />
								
								{/* 光泽效果 */}
								<span className={cn(
									"absolute inset-0 rounded-full opacity-0 group-hover:opacity-100",
									"bg-gradient-to-r from-transparent via-white/20 to-transparent",
									"translate-x-[-100%] group-hover:translate-x-[100%]",
									"transition-all duration-700"
								)} />
								
								{/* 文字内容 */}
								<span className="relative z-10 flex items-center gap-2">
									<span className="text-lg">🎊</span>
									<span>特别活动</span>
								</span>
							</button>
							
							<Button
								className={cn(
									"rounded-full px-8 h-[52px] text-base font-medium",
									"bg-white text-black hover:bg-white/90"
								)}
								onClick={() => setShowMiniProgramDialog(true)}
							>
								跳转进入小程序
							</Button>
							
							{/* 快速入口菜单 */}
							<QuickLinksMenu />
						</div>
					</div>
				</main>
			</div>
			
			{/* 特别活动弹窗 */}
			<Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
				<DialogContent className={cn(
					"bg-zinc-900/95 backdrop-blur-xl border-white/10",
					"max-w-[90vw] max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none",
					"top-[1rem] translate-y-0",
					"sm:max-w-md"
				)}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							🎊 新年特别活动
						</DialogTitle>
						<DialogDescription className="text-left">
							新年福利来袭，扫码了解更多优惠详情
						</DialogDescription>
					</DialogHeader>
					
					{/* 内容区域 */}
					<div className="mt-4">
						<div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
							<img 
								src="/static/tutorial/newyear.png" 
								alt="新年特别活动"
								className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
								onClick={() => window.open('/static/tutorial/newyear.png', '_blank')}
								title="点击查看原图"
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			
			{/* 小程序弹窗 */}
			<Dialog open={showMiniProgramDialog} onOpenChange={setShowMiniProgramDialog}>
				<DialogContent className={cn(
					"bg-zinc-900/95 backdrop-blur-xl border-white/10",
					"max-w-[90vw] max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none",
					"top-[1rem] translate-y-0",
					"sm:max-w-md"
				)}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Smartphone className="h-5 w-5" />
							小程序码
						</DialogTitle>
						<DialogDescription className="text-left text-base text-white/80">
							长按识别或微信搜xxxdance
						</DialogDescription>
					</DialogHeader>
					
					{/* 小程序码图片 */}
					<div className="mt-2">
						<div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
							<img 
								src="/static/tutorial/applet_qrcode.png" 
								alt="小程序码"
								className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
								onClick={() => window.open('/static/tutorial/applet_qrcode.png', '_blank')}
								title="点击查看原图"
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			
			{/* WiFi 弹窗 */}
			<Dialog open={showWifiDialog} onOpenChange={setShowWifiDialog}>
				<DialogContent className={cn(
					"bg-zinc-900/95 backdrop-blur-xl border-white/10",
					"max-w-[90vw]",
					"sm:max-w-sm"
				)}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Wifi className="h-5 w-5" />
							WiFi 连接信息
						</DialogTitle>
						<DialogDescription className="text-left">
							点击可复制账号或密码
						</DialogDescription>
					</DialogHeader>
					
					{/* WiFi 信息 */}
					<div className="mt-4 space-y-3">
						{/* WiFi 账号 */}
						<div 
							onClick={() => copyToClipboard('XXxDanceVision5G', 'ssid')}
							className={cn(
								"flex items-center justify-between p-4 rounded-lg cursor-pointer",
								"bg-white/5 border border-white/10",
								"hover:bg-white/10 transition-colors"
							)}
						>
							<div>
								<p className="text-xs text-white/50 mb-1">WiFi 账号</p>
								<p className="text-lg font-medium text-white">XXxDanceVision5G</p>
							</div>
							{copiedField === 'ssid' ? (
								<Check className="h-5 w-5 text-green-400" />
							) : (
								<Copy className="h-5 w-5 text-white/40" />
							)}
						</div>
						
						{/* WiFi 密码 */}
						<div 
							onClick={() => copyToClipboard('XXX888888', 'password')}
							className={cn(
								"flex items-center justify-between p-4 rounded-lg cursor-pointer",
								"bg-white/5 border border-white/10",
								"hover:bg-white/10 transition-colors"
							)}
						>
							<div>
								<p className="text-xs text-white/50 mb-1">WiFi 密码</p>
								<p className="text-lg font-medium text-white font-mono">XXX888888</p>
							</div>
							{copiedField === 'password' ? (
								<Check className="h-5 w-5 text-green-400" />
							) : (
								<Copy className="h-5 w-5 text-white/40" />
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
})
