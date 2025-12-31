/**
 * 背景控制面板
 * 
 * 动态显示当前背景的可调参数和毛玻璃样式设置
 */

import { useState } from "react"
import { Settings2, RotateCcw, ChevronDown, ChevronUp, X, Sparkles, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { useBackground } from "./BackgroundProvider"
import { getBackgroundById } from "./registry"
import type { ParamConfig } from "./types"
import { GlassStylePanel } from "../GlassStylePanel"

export function BackgroundControlPanel() {
	const { selectedId, currentParams, updateParam, resetParams, isControlPanelOpen, toggleControlPanel, backgrounds, setBackground } = useBackground()
	const [isCollapsed, setIsCollapsed] = useState(false)
	
	const bgConfig = getBackgroundById(selectedId)
	
	if (!isControlPanelOpen) return null
	
	const params = bgConfig ? Object.entries(bgConfig.params) : []
	
	return (
		<div className="fixed right-4 top-20 z-50 w-80 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md shadow-2xl">
			{/* 标题栏 */}
			<div className="flex items-center justify-between p-3 border-b border-white/10">
				<div className="flex items-center gap-2">
					<Settings2 className="h-4 w-4" style={{ color: "var(--lab-accent)" }} />
					<span className="font-medium text-white text-sm">{t("控制台")}</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-white/70 hover:text-white"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						{isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-white/70 hover:text-white"
						onClick={toggleControlPanel}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
			
			{/* Tab 内容 */}
			{!isCollapsed && (
				<Tabs defaultValue="glass" className="w-full">
					<TabsList className="w-full bg-white/5 rounded-none border-b border-white/10">
						<TabsTrigger value="glass" className="flex-1 text-xs data-[state=active]:bg-white/10">
							<Palette className="h-3 w-3 mr-1" />
							{t("毛玻璃")}
						</TabsTrigger>
						<TabsTrigger value="background" className="flex-1 text-xs data-[state=active]:bg-white/10">
							<Sparkles className="h-3 w-3 mr-1" />
							{t("背景")}
						</TabsTrigger>
					</TabsList>
					
					{/* 毛玻璃样式 Tab */}
					<TabsContent value="glass" className="p-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 mt-0">
						<GlassStylePanel />
					</TabsContent>
					
					{/* 背景参数 Tab */}
					<TabsContent value="background" className="p-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 mt-0">
						<div className="space-y-4">
							{/* 背景选择 */}
							<div className="space-y-2">
								<Label className="text-xs text-white/70">{t("选择背景")}</Label>
								<Select value={selectedId} onValueChange={setBackground}>
									<SelectTrigger className="h-9 bg-white/5 border-white/10">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{backgrounds.filter(bg => !bg.hidden).map((bg) => (
											<SelectItem key={bg.id} value={bg.id}>
												<div className="flex flex-col">
													<span>{bg.name}</span>
													<span className="text-xs text-muted-foreground">{t(bg.description)}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* 背景参数 */}
							{bgConfig && (
								<div className="space-y-3 pt-2 border-t border-white/10">
									<div className="flex items-center justify-between">
										<h4 className="text-sm font-semibold" style={{ color: "var(--lab-accent)" }}>✨ {t("参数调节")}</h4>
										<Button
											variant="ghost"
											size="sm"
											onClick={resetParams}
											className="h-7 text-xs"
										>
											<RotateCcw className="h-3 w-3 mr-1" />
											{t("重置")}
										</Button>
									</div>
									
									{params.length === 0 ? (
										<div className="text-sm text-white/50 py-4 text-center">
											{t("此背景没有可调参数")}
										</div>
									) : (
										<div className="space-y-3">
											{params.map(([key, config]) => (
												<ParamControl
													key={key}
													paramKey={key}
													config={config}
													value={currentParams[key]}
													onChange={(value) => updateParam(key, value)}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			)}
		</div>
	)
}

interface ParamControlProps {
	paramKey: string
	config: ParamConfig
	value: unknown
	onChange: (value: unknown) => void
}

function ParamControl({ paramKey, config, value, onChange }: ParamControlProps) {
	const currentValue = value ?? config.default
	
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between">
				<Label className="text-xs text-white/70">{config.label}</Label>
				{config.type === "number" && (
					<span className="text-xs font-mono" style={{ color: "var(--lab-accent)" }}>{String(currentValue)}</span>
				)}
			</div>
			
			{config.type === "number" && (
				<input
					type="range"
					min={config.min ?? 0}
					max={config.max ?? 100}
					step={config.step ?? 1}
					value={Number(currentValue)}
					onChange={(e) => onChange(Number(e.target.value))}
					className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
						[&::-webkit-slider-thumb]:appearance-none
						[&::-webkit-slider-thumb]:w-3
						[&::-webkit-slider-thumb]:h-3
						[&::-webkit-slider-thumb]:rounded-full
						[&::-webkit-slider-thumb]:bg-[var(--lab-accent)]
						[&::-webkit-slider-thumb]:cursor-pointer
						[&::-webkit-slider-thumb]:transition-transform
						[&::-webkit-slider-thumb]:hover:scale-125
						[&::-moz-range-thumb]:w-3
						[&::-moz-range-thumb]:h-3
						[&::-moz-range-thumb]:rounded-full
						[&::-moz-range-thumb]:bg-[var(--lab-accent)]
						[&::-moz-range-thumb]:border-0
						[&::-moz-range-thumb]:cursor-pointer"
				/>
			)}
			
			{config.type === "color" && (
				<div className="flex items-center gap-2">
					<input
						type="color"
						value={String(currentValue)}
						onChange={(e) => onChange(e.target.value)}
						className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
					/>
					<Input
						value={String(currentValue)}
						onChange={(e) => onChange(e.target.value)}
						className="flex-1 h-8 text-xs bg-white/5 border-white/10 text-white font-mono"
					/>
				</div>
			)}
			
			{config.type === "boolean" && (
				<button
					onClick={() => onChange(!currentValue)}
					className={`w-12 h-6 rounded-full transition-colors ${
						currentValue ? "bg-[var(--lab-accent)]" : "bg-white/10"
					}`}
				>
					<div
						className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
							currentValue ? "translate-x-6" : "translate-x-0.5"
						}`}
					/>
				</button>
			)}
			
			{config.type === "select" && config.options && (
				<Select value={String(currentValue)} onValueChange={onChange}>
					<SelectTrigger className="h-8 text-xs bg-white/5 border-white/10 text-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="bg-black/90 border-white/10">
						{config.options.map((opt) => (
							<SelectItem
								key={String(opt.value)}
								value={String(opt.value)}
								className="text-white hover:bg-white/10"
							>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	)
}

/** 控制面板触发按钮 */
export function BackgroundControlToggle() {
	const { isControlPanelOpen, toggleControlPanel, selectedId } = useBackground()
	const bgConfig = getBackgroundById(selectedId)
	
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleControlPanel}
			className={cn(
				"fixed right-4 top-4 z-50 h-10 w-10 rounded-full border transition-all backdrop-blur-sm",
				isControlPanelOpen
					? "bg-[var(--lab-accent)] border-[var(--lab-accent)] text-white"
					: "bg-black/50 border-white/20 text-white/70 hover:border-[var(--lab-accent)] hover:text-[var(--lab-accent)]"
			)}
			title={`调整 ${bgConfig?.name || "背景"} 参数`}
		>
			<Settings2 className="h-5 w-5" />
		</Button>
	)
}

