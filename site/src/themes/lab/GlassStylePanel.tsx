/**
 * 毛玻璃样式控制面板
 */

import { 
	useGlassStyle, 
	type GlassBlur,
	type ComponentShapeConfig,
	type ColorPreset,
	colorPresets,
	getActiveColors,
} from "./GlassStyleProvider"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { RotateCcwIcon, CircleIcon, SquareIcon, PaletteIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n"

// 使用函数获取翻译选项
const getBlurOptions = (): { value: GlassBlur; label: string }[] => [
	{ value: "none", label: t("无") },
	{ value: "sm", label: `${t("轻微")} (4px)` },
	{ value: "md", label: `${t("中等")} (12px)` },
	{ value: "lg", label: `${t("较强")} (16px)` },
	{ value: "xl", label: `${t("强")} (24px)` },
	{ value: "2xl", label: `${t("很强")} (40px)` },
	{ value: "3xl", label: `${t("极强")} (64px)` },
]

const presetOrder: ColorPreset[] = ["cyan", "amber", "orange", "emerald", "rose", "violet"]

export function GlassStylePanel() {
	const { config, updateConfig, resetToDefault } = useGlassStyle()
	const activeColors = getActiveColors(config)

	// 更新单个组件的形状
	const updateShape = (
		component: keyof typeof config.shapes,
		shapeConfig: Partial<ComponentShapeConfig>
	) => {
		updateConfig("shapes", {
			...config.shapes,
			[component]: { ...config.shapes[component], ...shapeConfig },
		})
	}

	// 选择预设配色
	const selectPreset = (preset: ColorPreset) => {
		updateConfig("colorPreset", preset)
		updateConfig("customColors", { ...config.customColors, enabled: false })
	}

	// 更新自定义颜色
	const updateCustomColor = (key: keyof typeof config.customColors, value: string | boolean) => {
		updateConfig("customColors", { ...config.customColors, [key]: value })
	}

	return (
		<div className="space-y-4">
			{/* 标题和重置 */}
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold" style={{ color: activeColors.primary }}>
					🎨 {t("毛玻璃样式")}
				</h4>
				<Button
					variant="ghost"
					size="sm"
					onClick={resetToDefault}
					className="h-7 text-xs"
				>
					<RotateCcwIcon className="h-3 w-3 mr-1" />
					{t("重置")}
				</Button>
			</div>

			{/* 主色调选择 */}
			<div className="space-y-3 p-3 rounded-lg bg-white/5">
				<div className="flex items-center gap-2">
					<PaletteIcon className="h-4 w-4" style={{ color: activeColors.primary }} />
					<Label className="text-xs text-white/70">{t("主色调")}</Label>
				</div>
				
				{/* 预设配色 */}
				<div className="grid grid-cols-3 gap-2">
					{presetOrder.map((preset) => {
						const colors = colorPresets[preset]
						const isActive = !config.customColors.enabled && config.colorPreset === preset
						return (
							<button
								key={preset}
								onClick={() => selectPreset(preset)}
								className={cn(
									"flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
									isActive 
										? "border-white/30 bg-white/10" 
										: "border-white/10 hover:border-white/20 hover:bg-white/5"
								)}
							>
								<div 
									className="w-6 h-6 rounded-full shadow-lg"
									style={{ 
										backgroundColor: colors.primary,
										boxShadow: isActive ? `0 0 12px ${colors.glow}` : undefined
									}}
								/>
								<span className="text-[10px] text-white/60">{t(colors.name)}</span>
							</button>
						)
					})}
				</div>

				{/* 自定义颜色开关 */}
				<div className="flex items-center justify-between pt-2 border-t border-white/10">
					<Label className="text-xs text-white/50">{t("自定义颜色")}</Label>
					<Switch
						checked={config.customColors.enabled}
						onCheckedChange={(v) => updateCustomColor("enabled", v)}
					/>
				</div>

				{/* 自定义颜色详细设置 */}
				{config.customColors.enabled && (
					<div className="space-y-2 pt-2">
						<ColorInput
							label={t("主色")}
							value={config.customColors.primary}
							onChange={(v) => updateCustomColor("primary", v)}
						/>
						<ColorInput
							label={t("亮色")}
							value={config.customColors.light}
							onChange={(v) => updateCustomColor("light", v)}
						/>
						<ColorInput
							label={t("暗色")}
							value={config.customColors.dark}
							onChange={(v) => updateCustomColor("dark", v)}
						/>
						<ColorInput
							label={t("辉光")}
							value={config.customColors.glow}
							onChange={(v) => updateCustomColor("glow", v)}
						/>
					</div>
				)}
			</div>

			{/* 分组配置 */}
			<Accordion type="multiple" defaultValue={["item"]} className="space-y-1">
				{/* 列表项 */}
				<AccordionItem value="item" className="border-white/10">
					<AccordionTrigger className="text-sm py-2 hover:no-underline">
						📋 {t("列表项")}
					</AccordionTrigger>
					<AccordionContent className="space-y-3 pt-2">
						<ShapeControl
							shapeConfig={config.shapes.item}
							onChange={(v) => updateShape("item", v)}
						/>
						<GlassGroupControls
							group={config.item}
							onChange={(v) => updateConfig("item", v)}
							showHover
						/>
					</AccordionContent>
				</AccordionItem>

				{/* 导航栏 */}
				<AccordionItem value="nav" className="border-white/10">
					<AccordionTrigger className="text-sm py-2 hover:no-underline">
						🧭 {t("导航栏")}
					</AccordionTrigger>
					<AccordionContent className="space-y-3 pt-2">
						<ShapeControl
							shapeConfig={config.shapes.nav}
							onChange={(v) => updateShape("nav", v)}
						/>
						<GlassGroupControls
							group={config.nav}
							onChange={(v) => updateConfig("nav", v)}
						/>
					</AccordionContent>
				</AccordionItem>

				{/* 内发光 */}
				<AccordionItem value="glow" className="border-white/10">
					<AccordionTrigger className="text-sm py-2 hover:no-underline">
						✨ {t("内发光效果")}
					</AccordionTrigger>
					<AccordionContent className="space-y-3 pt-2">
						<div className="flex items-center justify-between">
							<Label className="text-xs">{t("启用内发光")}</Label>
							<Switch
								checked={config.innerGlow.enabled}
								onCheckedChange={(v) => 
									updateConfig("innerGlow", { ...config.innerGlow, enabled: v })
								}
							/>
						</div>
						{config.innerGlow.enabled && (
							<>
								<div className="space-y-1">
									<div className="flex justify-between text-xs">
										<span className="text-white/50">{t("发光强度")}</span>
										<span style={{ color: "var(--lab-accent)" }}>{config.innerGlow.opacity}%</span>
									</div>
									<Slider
										min={0}
										max={50}
										step={5}
										value={[config.innerGlow.opacity]}
										onValueChange={([v]) => 
											updateConfig("innerGlow", { ...config.innerGlow, opacity: v })
										}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-xs text-white/50 shrink-0">{t("颜色")}</Label>
									<Input
										type="color"
										value={config.innerGlow.color}
										onChange={(e) => 
											updateConfig("innerGlow", { ...config.innerGlow, color: e.target.value })
										}
										className="w-10 h-8 p-1"
									/>
									<Input
										type="text"
										value={config.innerGlow.color}
										onChange={(e) => 
											updateConfig("innerGlow", { ...config.innerGlow, color: e.target.value })
										}
										className="flex-1 h-8 text-xs"
									/>
								</div>
							</>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

/** 形状控制组件 */
interface ShapeControlProps {
	shapeConfig: ComponentShapeConfig
	onChange: (config: Partial<ComponentShapeConfig>) => void
}

function ShapeControl({ shapeConfig, onChange }: ShapeControlProps) {
	return (
		<div className="space-y-2 p-2 rounded bg-white/5">
			<Label className="text-xs text-white/70">{t("形状")}</Label>
			<div className="flex gap-2">
				<Button
					variant={shapeConfig.shape === "rounded" ? "default" : "outline"}
					size="sm"
					onClick={() => onChange({ shape: "rounded" })}
					className="flex-1 h-7 text-xs"
				>
					<SquareIcon className="h-3 w-3 mr-1" />
					{t("圆角")}
				</Button>
				<Button
					variant={shapeConfig.shape === "pill" ? "default" : "outline"}
					size="sm"
					onClick={() => onChange({ shape: "pill" })}
					className="flex-1 h-7 text-xs"
				>
					<CircleIcon className="h-3 w-3 mr-1" />
					{t("药丸")}
				</Button>
			</div>
			{shapeConfig.shape === "rounded" && (
				<div className="space-y-1">
					<div className="flex justify-between text-xs">
						<span className="text-white/50">{t("圆角大小")}</span>
						<span style={{ color: "var(--lab-accent)" }}>{shapeConfig.borderRadius}px</span>
					</div>
					<Slider
						min={0}
						max={32}
						step={2}
						value={[shapeConfig.borderRadius]}
						onValueChange={([v]) => onChange({ borderRadius: v })}
					/>
				</div>
			)}
		</div>
	)
}

/** 单组控制 */
interface GlassGroupControlsProps {
	group: {
		blur: GlassBlur
		bgOpacity: number
		bgColor: string
		borderOpacity: number
		borderColor: string
		shadowOpacity?: number
		hoverBgOpacity?: number
	}
	onChange: (value: any) => void
	showShadow?: boolean
	showHover?: boolean
}

function GlassGroupControls({ group, onChange, showShadow, showHover }: GlassGroupControlsProps) {
	const blurOptions = getBlurOptions()
	const update = (key: string, value: any) => {
		onChange({ ...group, [key]: value })
	}

	return (
		<div className="space-y-3">
			{/* 模糊强度 */}
			<div className="flex items-center gap-2">
				<Label className="text-xs text-white/50 w-16 shrink-0">{t("模糊")}</Label>
				<Select value={group.blur} onValueChange={(v) => update("blur", v)}>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{blurOptions.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* 背景颜色 */}
			<div className="flex items-center gap-2">
				<Label className="text-xs text-white/50 w-16 shrink-0">{t("背景色")}</Label>
				<Input
					type="color"
					value={group.bgColor}
					onChange={(e) => update("bgColor", e.target.value)}
					className="w-10 h-8 p-1"
				/>
				<Input
					type="text"
					value={group.bgColor}
					onChange={(e) => update("bgColor", e.target.value)}
					className="flex-1 h-8 text-xs"
				/>
			</div>

			{/* 背景透明度 */}
			<div className="space-y-1">
				<div className="flex justify-between text-xs">
					<span className="text-white/50">{t("背景透明度")}</span>
					<span style={{ color: "var(--lab-accent)" }}>{group.bgOpacity}%</span>
				</div>
				<Slider
					min={0}
					max={100}
					step={5}
					value={[group.bgOpacity]}
					onValueChange={([v]) => update("bgOpacity", v)}
				/>
			</div>

			{/* Hover 背景透明度 */}
			{showHover && group.hoverBgOpacity !== undefined && (
				<div className="space-y-1">
					<div className="flex justify-between text-xs">
						<span className="text-white/50">{t("悬停透明度")}</span>
						<span style={{ color: "var(--lab-accent)" }}>{group.hoverBgOpacity}%</span>
					</div>
					<Slider
						min={0}
						max={100}
						step={5}
						value={[group.hoverBgOpacity]}
						onValueChange={([v]) => update("hoverBgOpacity", v)}
					/>
				</div>
			)}

			{/* 边框颜色 */}
			<div className="flex items-center gap-2">
				<Label className="text-xs text-white/50 w-16 shrink-0">{t("边框色")}</Label>
				<Input
					type="color"
					value={group.borderColor}
					onChange={(e) => update("borderColor", e.target.value)}
					className="w-10 h-8 p-1"
				/>
				<Input
					type="text"
					value={group.borderColor}
					onChange={(e) => update("borderColor", e.target.value)}
					className="flex-1 h-8 text-xs"
				/>
			</div>

			{/* 边框透明度 */}
			<div className="space-y-1">
				<div className="flex justify-between text-xs">
					<span className="text-white/50">{t("边框透明度")}</span>
					<span style={{ color: "var(--lab-accent)" }}>{group.borderOpacity}%</span>
				</div>
				<Slider
					min={0}
					max={100}
					step={5}
					value={[group.borderOpacity]}
					onValueChange={([v]) => update("borderOpacity", v)}
				/>
			</div>

			{/* 阴影透明度 */}
			{showShadow && group.shadowOpacity !== undefined && (
				<div className="space-y-1">
					<div className="flex justify-between text-xs">
						<span className="text-white/50">{t("阴影透明度")}</span>
						<span style={{ color: "var(--lab-accent)" }}>{group.shadowOpacity}%</span>
					</div>
					<Slider
						min={0}
						max={100}
						step={5}
						value={[group.shadowOpacity]}
						onValueChange={([v]) => update("shadowOpacity", v)}
					/>
				</div>
			)}
		</div>
	)
}

/** 颜色输入组件 */
interface ColorInputProps {
	label: string
	value: string
	onChange: (value: string) => void
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
	return (
		<div className="flex items-center gap-2">
			<Label className="text-xs text-white/50 w-10 shrink-0">{label}</Label>
			<Input
				type="color"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-8 h-6 p-0.5 rounded"
			/>
			<Input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1 h-6 text-xs font-mono"
			/>
		</div>
	)
}

