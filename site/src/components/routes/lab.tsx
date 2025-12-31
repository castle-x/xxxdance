/**
 * 实验页面 - InfiniteMenu 球形菜单测试
 */

import { memo, Suspense, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { BackgroundRenderer } from "@/themes"
import { cn } from "@/lib/utils"
import InfiniteMenu, { type MenuItem } from "@/components/InfiniteMenu"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"

// 快速入口菜单项
const menuItems: MenuItem[] = [
	{
		image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=600&fit=crop",
		link: "#route",
		title: "路线引导",
		description: "查看详细的路线指引和交通信息",
	},
	{
		image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=600&fit=crop",
		link: "#wechat",
		title: "客服微信",
		description: "扫描二维码添加客服微信",
	},
	{
		image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=600&fit=crop",
		link: "#miniprogram",
		title: "小程序码",
		description: "扫码或微信搜索xxxdance进入小程序",
	},
	{
		image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
		link: "#groupbuy",
		title: "团购核销",
		description: "如何使用美团/大众点评团购券进行核销",
	},
	{
		image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=600&fit=crop",
		link: "#booking",
		title: "预订教程",
		description: "如何在小程序预订课程",
	},
	{
		image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop",
		link: "#dance",
		title: "舞蹈课程",
		description: "探索各种舞蹈风格和课程",
	},
]

interface LabPageProps {
	onNavigate: (page: "home" | "docs") => void
}

export default memo(function LabPage({ onNavigate }: LabPageProps) {
	const [activeDialog, setActiveDialog] = useState<MenuItem | null>(null)

	return (
		<div className="min-h-screen relative overflow-hidden bg-black">
			{/* 背景 */}
			<div className="absolute inset-0 z-0 opacity-30">
				<Suspense fallback={<div className="w-full h-full bg-black" />}>
					<BackgroundRenderer />
				</Suspense>
			</div>

			{/* 返回按钮 */}
			<button
				onClick={() => onNavigate("home")}
				className={cn(
					"fixed top-6 left-6 z-50 p-3 rounded-full",
					"bg-white/[0.06] backdrop-blur-2xl",
					"border border-white/[0.1]",
					"shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
					"hover:bg-white/[0.1] transition-all duration-200"
				)}
			>
				<ArrowLeft className="h-5 w-5 text-white" />
			</button>

			{/* 标题 */}
			<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
				<div className={cn(
					"px-6 py-3 rounded-full",
					"bg-white/[0.06] backdrop-blur-2xl",
					"border border-white/[0.1]",
					"shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
				)}>
					<h1 className="text-lg font-bold text-white">🧪 球形菜单实验</h1>
				</div>
			</div>

			{/* InfiniteMenu 球形菜单 */}
			<div className="relative z-10 w-full h-screen">
				<InfiniteMenu 
					items={menuItems}
					onItemClick={(item) => setActiveDialog(item)}
				/>
			</div>

			{/* 弹框 */}
			<Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
				<DialogContent className="sm:max-w-md bg-zinc-900/95 backdrop-blur-xl border-white/10">
					<DialogHeader>
						<DialogTitle className="text-xl">
							{activeDialog?.title}
						</DialogTitle>
						<DialogDescription>
							{activeDialog?.description}
						</DialogDescription>
					</DialogHeader>
					
					{/* 内容区域 */}
					<div className="mt-4 min-h-[200px] flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
						<div className="text-center text-white/50">
							<p className="text-sm">内容开发中...</p>
							<p className="text-xs mt-1">后续将展示教程或二维码</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
})

