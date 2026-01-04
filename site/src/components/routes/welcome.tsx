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
		description: "📍上海市普陀区长寿路468号中环商务大厦604室\n💡 首次加载图片可能较慢，请耐心等待",
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

// ========== 设备识别模块 ==========
// 检测设备类型（mobile/tablet/desktop）
type DeviceType = "mobile" | "tablet" | "desktop"

const detectDeviceType = (): DeviceType => {
	if (typeof navigator === 'undefined') return "desktop"
	const ua = navigator.userAgent
	
	// 1. 移动设备检测
	if (/Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
		return "mobile"
	}
	
	// 2. 平板设备检测（iPad 或 Android 平板）
	if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) {
		return "tablet"
	}
	
	// 3. 默认为桌面
	return "desktop"
}

// 检测操作系统（顺序很重要！）
type OSType = "iOS" | "Android" | "HarmonyOS" | "Windows" | "macOS" | "Linux" | "Unknown"

const detectOS = (): OSType => {
	if (typeof navigator === 'undefined') return "Unknown"
	const ua = navigator.userAgent
	const platform = navigator.platform || ""
	
	// ✅ 优先级 1: 鸿蒙系统（必须最先检测，UA 包含 "Linux"）
	if (/OpenHarmony|HarmonyOS/i.test(ua)) {
		return "HarmonyOS"
	}
	
	// ✅ 优先级 2: iOS（必须在 macOS 之前，UA 包含 "Mac OS X"）
	if (/iPhone|iPad|iPod/i.test(ua) || platform === "iPhone" || platform === "iPad") {
		return "iOS"
	}
	
	// ✅ 优先级 3: Android
	if (/Android/i.test(ua)) {
		return "Android"
	}
	
	// ✅ 优先级 4: macOS（桌面版，已排除 iOS）
	if (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) {
		return "macOS"
	}
	
	// ✅ 优先级 5: Windows
	if (/Windows NT/i.test(ua) || platform === "Win32" || platform === "Win64") {
		return "Windows"
	}
	
	// ✅ 优先级 6: Linux（最后检测）
	if (/Linux/i.test(ua) || /Linux/i.test(platform)) {
		return "Linux"
	}
	
	return "Unknown"
}

// 检测是否为微信浏览器
const isWechatBrowser = () => {
	if (typeof navigator === 'undefined') return false
	return /MicroMessenger/i.test(navigator.userAgent)
}

// 是否需要 iOS 特殊视频处理
const needIOSVideoFix = () => {
	const os = detectOS()
	return os === "iOS" || isWechatBrowser()
}

// 获取设备图标类型：ios / android / none（PC不显示）
type DeviceIconType = "ios" | "android" | "none"

const getDeviceIconType = (): DeviceIconType => {
	const os = detectOS()
	const deviceType = detectDeviceType()
	
	// PC（桌面设备）不显示图标
	if (deviceType === "desktop") {
		return "none"
	}
	
	// iOS 显示苹果图标
	if (os === "iOS") {
		return "ios"
	}
	
	// 其余（Android、鸿蒙等）显示安卓图标
	return "android"
}

// Apple 图标组件（内联 SVG，不增加资源负担）
function AppleIcon({ className }: { className?: string }) {
	return (
		<svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
		</svg>
	)
}

// Android 图标组件（内联 SVG）
function AndroidIcon({ className }: { className?: string }) {
	return (
		<svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z"/>
		</svg>
	)
}

// 设备图标显示组件
function DeviceIndicator() {
	const [iconType, setIconType] = useState<DeviceIconType>("none")
	
	useEffect(() => {
		setIconType(getDeviceIconType())
	}, [])
	
	if (iconType === "none") return null
	
	return (
		<div className={cn(
			"flex items-center justify-center w-8 h-8 rounded-full",
			"bg-white/[0.06] backdrop-blur-xl",
			"border border-white/[0.1]"
		)}>
			{iconType === "ios" ? (
				<AppleIcon className="text-white/80" />
			) : (
				<AndroidIcon className="text-green-400" />
			)}
		</div>
	)
}

// 预加载全部静态资源（首页加载时调用）
const preloadedImages = new Set<string>()

function preloadImages() {
	// 预加载全部图片
	const imagesToPreload = [
		"/static/tutorial/newyear.png",
		"/static/tutorial/address.png",
		"/static/tutorial/p.png",
		"/static/tutorial/service_qrcode.png",
		"/static/tutorial/applet_qrcode.png",
	]
	
	imagesToPreload.forEach(src => {
		if (preloadedImages.has(src)) return
		preloadedImages.add(src)
		
		const img = new window.Image()
		img.src = src
	})
}

// 预加载所有视频（图片加载完成后调用）
const preloadedVideos = new Set<string>()

function preloadVideos() {
	// 收集所有需要预加载的视频
	const videosToPreload = quickLinks
		.filter(link => link.tutorial?.video)
		.map(link => link.tutorial!.video)
	
	videosToPreload.forEach(src => {
		if (preloadedVideos.has(src)) return
		preloadedVideos.add(src)
		
		// 使用 fetch 预加载视频到浏览器缓存
		fetch(src, { method: 'GET', cache: 'force-cache' })
			.catch(() => {}) // 静默处理错误
	})
}

// 简单图片组件 - 让浏览器自然渲染，无加载动画
function SimpleImage({ 
	src, 
	alt, 
	className,
	onClick,
	title 
}: { 
	src: string
	alt: string
	className?: string
	onClick?: () => void
	title?: string
}) {
	return (
		<img
			src={src}
			alt={alt}
			className={className}
			onClick={onClick}
			title={title}
			loading="lazy"
		/>
	)
}

// 教程媒体查看组件（简化版 - 只显示视频）
function TutorialMediaViewer({ tutorial }: { tutorial: TutorialMedia }) {
	const [videoState, setVideoState] = useState<LoadingState>("idle")
	const [loadProgress, setLoadProgress] = useState(0)
	const videoRef = useRef<HTMLVideoElement>(null)
	const isIOS = needIOSVideoFix()
	
	// iOS/微信：手动设置特定属性
	useEffect(() => {
		const video = videoRef.current
		if (video && isIOS) {
			// iOS Safari 必需
			video.setAttribute("playsinline", "true")
			video.setAttribute("webkit-playsinline", "true")
			// 微信浏览器
			video.setAttribute("x5-playsinline", "true")
			video.setAttribute("x5-video-player-type", "h5")
			video.setAttribute("x5-video-player-fullscreen", "true")
		}
	}, [tutorial.video, isIOS])
	
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
	
	// 处理视频加载完成 + 自动播放
	const handleVideoReady = useCallback(() => {
		setVideoState("loaded")
		const video = videoRef.current
		if (video && video.paused) {
			video.play().catch(() => {
				// 自动播放失败时忽略，让用户手动点击
			})
		}
	}, [])
	
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
			
			{/* 根据设备类型使用不同的视频加载策略 */}
			{isIOS ? (
				// iOS/微信：使用 source 标签 + 完整属性
				<video
					ref={videoRef}
					controls
					playsInline
					autoPlay
					muted
					preload="auto"
					className="w-full h-full object-contain"
					onLoadStart={() => setVideoState("loading")}
					onCanPlay={handleVideoReady}
					onCanPlayThrough={handleVideoReady}
					onLoadedData={handleVideoReady}
					onLoadedMetadata={handleVideoReady}
					onProgress={handleVideoProgress}
					onError={() => setVideoState("error")}
				>
					<source src={tutorial.video} type="video/mp4" />
				</video>
			) : (
				// 安卓/PC：使用简单的 src 属性（之前正常的方式）
				<video
					ref={videoRef}
					src={tutorial.video}
					controls
					playsInline
					autoPlay
					muted
					className="w-full h-full object-contain"
					onLoadStart={() => setVideoState("loading")}
					onCanPlay={handleVideoReady}
					onProgress={handleVideoProgress}
					onError={() => setVideoState("error")}
				/>
			)}
			
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
						<DialogDescription className="text-left text-base text-white/80 whitespace-pre-line">
							{activeDialog?.description}
						</DialogDescription>
					</DialogHeader>
					
					{/* 内容区域 */}
					<div className="mt-2">
						{activeDialog?.tutorial ? (
							// 有教程媒体 - 显示视频
							<TutorialMediaViewer tutorial={activeDialog.tutorial} />
						) : activeDialog?.image ? (
							// 有静态图片 - 显示图片（点击打开原图）
							<div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
								<SimpleImage 
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
	
	// 首页加载时预加载所有静态资源
	useEffect(() => {
		// 使用 requestIdleCallback 在浏览器空闲时预加载，不影响首屏渲染
		const loadResources = () => {
			// 先加载图片（优先级高）
			preloadImages()
			// 延迟 2 秒后加载视频（优先级低，避免抢占带宽）
			setTimeout(preloadVideos, 2000)
		}
		
		if ('requestIdleCallback' in window) {
			requestIdleCallback(loadResources)
		} else {
			// 降级方案：延迟 1 秒后加载
			setTimeout(loadResources, 1000)
		}
	}, [])
	
	// 特别活动弹窗
	const [showEventDialog, setShowEventDialog] = useState(false)
	
	// 小程序弹窗
	const [showMiniProgramDialog, setShowMiniProgramDialog] = useState(false)
	
	// WiFi 弹窗
	const [showWifiDialog, setShowWifiDialog] = useState(false)
	const [copiedField, setCopiedField] = useState<string | null>(null)
	
	// WiFi 引导气泡 - 点击后隐藏
	const [wifiTipHidden, setWifiTipHidden] = useState(false)
	
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
						
						{/* WiFi 按钮 + 设备图标 */}
						<div className="flex items-center gap-2">
							<div className="relative">
								<button
									onClick={() => {
										setShowWifiDialog(true)
										setWifiTipHidden(true)
									}}
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
								
								{/* 引导气泡 - 纯 CSS 动画 */}
								{!wifiTipHidden && (
									<div 
										className="absolute top-full right-0 mt-3 pointer-events-none wifi-tip-bubble"
									>
										{/* 气泡箭头 */}
										<div className="absolute -top-2 right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white/90" />
										{/* 气泡内容 */}
										<div className={cn(
											"px-4 py-2.5 rounded-xl whitespace-nowrap",
											"bg-white/90 text-zinc-900 text-sm font-medium",
											"shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
										)}>
											 点击获取 WiFi 密码 👆
										</div>
									</div>
								)}
							</div>
							
							{/* 设备识别图标（调试用） */}
							<DeviceIndicator />
						</div>
					</nav>
				</header>
				
				{/* 主内容区 */}
				<main className="flex-1 flex items-center justify-center px-4 pb-16">
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
						<DialogDescription className="text-left whitespace-pre-line">
							💡 首次加载图片可能较慢，请耐心等待
						</DialogDescription>
					</DialogHeader>
					
					{/* 内容区域 */}
					<div className="mt-4">
						<div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
							<SimpleImage 
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
							<SimpleImage 
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
