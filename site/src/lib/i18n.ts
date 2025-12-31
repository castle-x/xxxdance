/**
 * 国际化配置
 * 
 * 简化版国际化方案
 * 源语言：中文(zh)，支持翻译到英文(en)
 */
import { i18n } from "@lingui/core"

// ============================================
// 翻译定义
// ============================================
// 格式：中文原文 -> 英文翻译
// 代码中直接写中文，切换到英文时自动翻译

const translations: Record<string, Record<string, string>> = {
	// 中文（源语言，保持原样）
	zh: {},
	
	// 英文翻译
	en: {
		// 通用
		"保存": "Save",
		"取消": "Cancel",
		"删除": "Delete",
		"编辑": "Edit",
		"添加": "Add",
		"关闭": "Close",
		"确认": "Confirm",
		"确定": "OK",
		"应用": "Apply",
		"测试": "Test",
		"连接": "Connect",
		"连接中...": "Connecting...",
		"已连接": "Connected",
		"发起连接": "Initiate Connection",
		"点击连接": "Click to connect",
		"点击重新连接": "Click to reconnect",
		"连接失败，点击重试": "Connection failed, click to retry",
		"请先配置 WebDAV": "Please configure WebDAV first",
		"未连接": "Disconnected",
		"失败": "Failed",
		"成功": "Success",
		"错误": "Error",
		"警告": "Warning",
		"信息": "Info",
		"重新连接": "Reconnect",
		"加载中...": "Loading...",
		"暂无数据": "No data",
		"已复制到剪贴板": "Copied to clipboard",
		"复制": "Copy",
		"复制为PNG（动图请下载）": "Copy as PNG (download for animation)",
		"下载原始GIF": "Download original GIF",
		"粘贴": "Paste",
		"刷新": "Refresh",
		"切换语言": "Switch Language",
		"切换主题": "Switch Theme",
		"设置": "Settings",
		"导出": "Export",
		"导入": "Import",
		"配置": "Config",
		"操作": "Actions",
		"重置": "Reset",
		"当前": "Current",
		"控制台": "Console",
		
		// 主题选择
		"选择主题": "Select Theme",
		"明亮": "Light",
		"暗黑": "Dark",
		"实验室": "Laboratory",
		"标准明亮主题": "Standard light theme",
		"标准暗黑主题": "Standard dark theme",
		"点击切换 / 悬停选择背景": "Click to switch / Hover to select background",
		"选择背景效果": "Select Background Effect",
		
		// 毛玻璃样式控制
		"毛玻璃样式": "Glass Style",
		"毛玻璃": "Glass",
		"背景": "Background",
		"选择背景": "Select Background",
		"参数调节": "Parameters",
		"此背景没有可调参数": "No adjustable parameters",
		"主色调": "Accent Color",
		"霓虹青": "Neon Cyan",
		"琥珀金": "Amber Gold",
		"活力橙": "Vibrant Orange",
		"翡翠绿": "Emerald Green",
		"玫瑰红": "Rose Red",
		"幻紫": "Violet",
		"自定义": "Custom",
		"自定义颜色": "Custom Colors",
		"主色": "Primary",
		"亮色": "Light",
		"暗色": "Dark",
		"辉光": "Glow",
		"形状": "Shape",
		"圆角": "Rounded",
		"药丸": "Pill",
		"圆角大小": "Border Radius",
		"模糊": "Blur",
		"无": "None",
		"轻微": "Light",
		"中等": "Medium",
		"较强": "Strong",
		"强": "Intense",
		"很强": "Very Intense",
		"透明度": "Opacity",
		"边框": "Border",
		"显示": "Show",
		"隐藏": "Hide",
		"阴影": "Shadow",
		"外发光": "Outer Glow",
		"内发光": "Inner Glow",
		"高斯模糊": "Gaussian Blur",
		"效果强度": "Effect Intensity",
		
		// 文件类型
		"文本": "Text",
		"图片": "Image",
		"视频": "Video",
		"文件": "File",
		"未知": "Unknown",
		
		// WebDAV 配置
		"WebDAV 配置": "WebDAV Config",
		"配置名称": "Config Name",
		"服务器地址": "Server URL",
		"用户名": "Username",
		"密码": "Password",
		"根目录": "Root Path",
		"测试连接": "Test Connection",
		"连接成功": "Connection Successful",
		"连接失败": "Connection Failed",
		"保存配置": "Save Config",
		"删除配置": "Delete Config",
		"新建配置": "New Config",
		"选择配置": "Select Config",
		"最大条目数": "Max Clips",
		"超过此数量将自动删除最旧的条目": "Oldest entries will be auto-deleted when exceeded",
		"导入配置": "Import Config",
		"粘贴配置": "Paste Config",
		"导入成功": "Import Successful",
		"导入失败": "Import Failed",
		"粘贴成功": "Paste Successful",
		"粘贴失败": "Paste Failed",
		"已导入": "Imported",
		"个配置": "configs",
		"配置版本": "Config Version",
		"剪贴板为空": "Clipboard is empty",
		"请先复制配置文件内容": "Please copy config file content first",
		"无效的配置格式": "Invalid config format",
		"无法读取剪贴板": "Cannot read clipboard",
		"读取剪切板导入": "Import from Clipboard",
		"读取配置文件导入": "Import from File",
		
		// 剪贴板
		"剪贴板同步": "Clipboard Sync",
		"本地剪贴板": "Local Clipboard",
		"云端剪贴板": "Cloud Clipboard",
		"同步": "Sync",
		"同步中...": "Syncing...",
		"同步失败": "Sync Failed",
		"同步成功": "Sync Successful",
		"上传": "Upload",
		"下载": "Download",
		"预览": "Preview",
		"视频预览": "Video Preview",
		"清空": "Clear",
		"清空本地": "Clear Local",
		"清空云端": "Clear Cloud",
		"断开连接": "Disconnect",
		
		// 设备
		"设备": "Device",
		"当前设备": "Current Device",
		"其他设备": "Other Devices",
		"设备名称": "Device Name",
		"设备ID": "Device ID",
		"最后同步": "Last Sync",
		
		// 时间
		"刚刚": "Just now",
		"分钟前": "minutes ago",
		"小时前": "hours ago",
		"天前": "days ago",
		"周前": "weeks ago",
		"月前": "months ago",
		"年前": "years ago",
		
		// 新手引导/教程
		"欢迎使用 XXxDance": "Welcome to XXxDance",
		"跨设备剪贴板同步工具": "Cross-device Clipboard Sync Tool",
		"开始使用": "Get Started",
		"跳过引导": "Skip Guide",
		"下一步": "Next",
		"上一步": "Previous",
		"完成": "Done",
		"一个基于 WebDAV 的跨设备剪贴板同步工具。配置您的 WebDAV 服务器，即可在多个设备间无缝共享剪贴板内容。": "A cross-device clipboard sync tool based on WebDAV. Configure your WebDAV server to seamlessly share clipboard content across multiple devices.",
		"⚡ 快速开始": "⚡ Quick Start",
		"📱 操作说明": "📱 How to Use",
		"🖥️ 操作说明": "🖥️ How to Use",
		"点击": "Click",
		"配置服务器": "Configure Server",
		"按钮，添加您的 WebDAV 服务器信息": "button to add your WebDAV server info",
		"如遇跨域问题，可在配置中开启": "If you encounter CORS issues, enable",
		"代理模式": "Proxy Mode",
		"保存配置后自动连接，即可开始同步文件内容": "Auto-connect after saving config, then start syncing",
		"单击选中列表项，再次点击弹出操作菜单": "Tap to select item, tap again to show action menu",
		"在操作菜单中点击「复制」「下载」「删除」等按钮": "Tap Copy, Download, Delete buttons in the action menu",
		"在操作菜单中点击「复制」「下载」「预览」「删除」": "Tap Copy, Download, Preview, Delete in the action menu",
		"仅 📝 文本支持快速复制，其他文件需点击下载": "Only 📝 text supports quick copy, other files need download",
		"点击导航栏右上角 📋 粘贴按钮，上传剪贴板内容": "Tap 📋 paste button in nav bar to upload clipboard",
		"点击导航栏 📋 粘贴按钮，上传剪贴板内容": "Tap 📋 paste button to upload clipboard",
		"向左滑动粘贴按钮，打开文件选择器上传文件": "Swipe paste button left to open file picker",
		"长按粘贴按钮 2 秒，打开文件选择器上传文件": "Long press paste button 2s to open file picker",
		"🎥 视频支持在线预览播放": "🎥 Videos support online preview",
		"单击选中列表项，按": "Click to select item, press",
		"复制内容": "to copy content",
		"双击列表项，直接复制选中内容": "Double-click item to copy directly",
		"任意位置按": "Press anywhere",
		"粘贴剪贴板内容到云端": "to paste clipboard to cloud",
		"拖放文件到页面任意位置，快速上传到云端 🚀": "Drag & drop files anywhere to upload 🚀",
		"📝 文本、🖼️ 图片、🎬 GIF 支持直接复制，其他文件需点击下载": "📝 Text, 🖼️ images, 🎬 GIFs can be copied directly, others need download",
		
		// 提示消息
		"请先配置 WebDAV 服务器": "Please configure WebDAV server first",
		"请先连接到服务器": "Please connect to server first",
		"复制失败": "Copy failed",
		"无法粘贴文件": "Cannot paste file",
		"检测到文件路径，请使用拖拽上传或文件选择器": "File path detected, please use drag & drop or file selector",
		"剪贴板中没有可处理的内容": "No processable content in clipboard",
		"提示：如果您复制的是文件，请尝试长按粘贴按钮上传文件": "Tip: If you copied a file, try long-pressing the paste button to upload",
		"提示：如果您复制的是文件，请尝试长按": "Tip: If you copied a file, try long-pressing",
		"粘贴按钮上传文件": "paste button to upload",
		"长按上传文件": "Long press to upload file",
		"长按2秒上传文件": "Long press 2s to upload file",
		"向左滑动上传文件": "Swipe left to upload file",
		"单击粘贴，左滑上传": "Tap to paste, swipe left to upload",
		"单击粘贴 / 左滑上传文件": "Tap to paste / Swipe left to upload",
		"选中剪切板，再次点击弹出操作菜单": "Select item, tap again for action menu",
		"已关闭引导": "Guide dismissed",
		"可在设置中重新开启": "Can be re-enabled in settings",
		"查看大图": "View Large Image",
		"详情": "Details",
		"上传失败": "Upload failed",
		"下载失败": "Download failed",
		"删除失败": "Delete failed",
		"正在删除中，请等待完成": "Deleting in progress, please wait",
		"删除中": "Deleting",
		"模拟手机模式": "Simulate Mobile Mode",
		"设备识别测试": "Device Recognition Test",
		"设备信息": "Device Info",
		"调试": "Debug",
		"重置所有数据": "Reset All Data",
		"此操作将清除以下数据：": "This will clear the following data:",
		"WebDAV 服务器配置": "WebDAV server configuration",
		"语言设置": "Language settings",
		"主题偏好": "Theme preferences",
		"教程显示状态": "Tutorial display status",
		"其他本地缓存": "Other local cache",
		"此操作不可撤销，确定要继续吗？": "This action cannot be undone. Are you sure?",
		"确认重置": "Confirm Reset",
		"操作成功": "Operation successful",
		"操作失败": "Operation failed",
		"网络错误": "Network error",
		"服务器错误": "Server error",
		"权限不足": "Permission denied",
		"文件不存在": "File not found",
		"文件已存在": "File already exists",
		"格式错误": "Format error",
		"大小超限": "Size exceeded",
		"开始上传": "Start Uploading",
		"上传成功": "Upload Successful",
		"上传中": "Uploading",
		"正在上传中": "Uploading",
		"请等待当前上传完成": "Please wait for current upload to complete",
		"等待服务器确认": "Waiting for server confirmation",
		"处理中...": "Processing...",
		"剩余": "Remaining",
		"取消上传": "Cancel Upload",
		"复制中": "Copying",
		"正在复制中，请等待完成": "Copying in progress, please wait",
		"下载中": "Downloading",
		"正在下载中，请等待完成": "Downloading in progress, please wait",
		"图片已同步到云端": "Image synced to cloud",
		"视频已同步到云端": "Video synced to cloud",
		"文本已同步到云端": "Text synced to cloud",
		"文件已同步到云端": "File synced to cloud",
		"无法上传图片": "Cannot upload image",
		"无法上传视频": "Cannot upload video",
		"无法上传文本": "Cannot upload text",
		"无法上传文件": "Cannot upload file",
		"读取失败": "Read Failed",
		"无法读取剪贴板内容": "Cannot read clipboard content",
		"坚果云请求频率限制：短时间内请求过多，请稍后再试。建议调整轮询间隔到 15-30 秒。": "Jianguoyun rate limit: Too many requests. Please try again later. Suggest adjusting polling interval to 15-30 seconds.",
		
		// 关于/版本信息
		"关于": "About",
		"版本": "Version",
		"更新日志": "Changelog",
		"检查更新": "Check for Updates",
		"已是最新版本": "Already up to date",
		"发现新版本": "New version available",
		
		// 快捷键
		"快捷键": "Shortcuts",
		"全局快捷键": "Global Shortcuts",
		"复制到云端": "Copy to Cloud",
		"从云端粘贴": "Paste from Cloud",
		"打开设置": "Open Settings",
		"打开历史": "Open History",
		
		// 其他功能
		"历史记录": "History",
		"搜索": "Search",
		"筛选": "Filter",
		"排序": "Sort",
		"按时间": "By Time",
		"按类型": "By Type",
		"按大小": "By Size",
		"升序": "Ascending",
		"降序": "Descending",
		"全选": "Select All",
		"取消选择": "Deselect",
		"批量删除": "Batch Delete",
		"批量下载": "Batch Download",
		
		// 确认对话框
		"确认删除？": "Confirm delete?",
		"此操作不可撤销": "This action cannot be undone",
		"确认清空？": "Confirm clear?",
		"将删除所有条目": "All entries will be deleted",
		
		// 空状态
		"暂无剪贴板内容": "No clipboard content",
		"开始同步以查看内容": "Start syncing to view content",
		"拖拽文件到此处上传": "Drag files here to upload",
		"或点击选择文件": "Or click to select files",
		"Ctrl+V 粘贴内容": "Ctrl+V to paste content",
		
		// 文件操作
		"选择文件": "Select File",
		"拖拽上传": "Drag to Upload",
		"支持的格式": "Supported Formats",
		"文件大小": "File Size",
		"文件名": "File Name",
		"文件类型": "File Type",
		"创建时间": "Created At",
		"修改时间": "Modified At",
		
		// 状态栏
		"已连接到": "Connected to",
		"同步间隔": "Sync Interval",
		"秒": "seconds",
		"上次同步": "Last Sync",
		"待同步": "Pending Sync",
		"条": "items",
		
		// 错误提示
		"无法连接到服务器": "Cannot connect to server",
		"请检查网络连接": "Please check your network",
		"请检查服务器地址": "Please check server URL",
		"请检查用户名和密码": "Please check username and password",
		"会话已过期": "Session expired",
		"请重新登录": "Please login again",
		
		// Toast 消息
		"已删除": "Deleted",
		"已读取": "Read",
	},
}

// ============================================
// i18n 初始化
// ============================================

// 检测用户语言偏好
function detectLocale(): string {
	// 1. 从 localStorage 读取用户设置
	const stored = localStorage.getItem("xxxdance-locale")
	if (stored && translations[stored]) {
		return stored
	}
	
	// 2. 从浏览器语言检测
	const browserLang = navigator.language.toLowerCase()
	if (browserLang.startsWith("zh")) {
		return "zh"
	}
	
	// 3. 默认英文
	return "en"
}

// 当前语言
let currentLocale = detectLocale()

// 初始化 lingui（保留以便未来扩展）
i18n.load("zh", {})
i18n.load("en", {})
i18n.activate(currentLocale)

// ============================================
// 导出 API
// ============================================

/**
 * 翻译函数
 * 传入中文，根据当前语言返回对应翻译
 */
export function t(key: string): string {
	if (currentLocale === "zh") {
		return key // 中文直接返回原文
	}
	return translations[currentLocale]?.[key] || key
}

/**
 * 切换语言
 */
export function setLocale(locale: string) {
	if (translations[locale] !== undefined) {
		localStorage.setItem("xxxdance-locale", locale)
		currentLocale = locale
		i18n.activate(locale)
		// 触发页面刷新以应用新语言
		window.location.reload()
	}
}

/**
 * 获取当前语言
 */
export function getLocale(): string {
	return currentLocale
}

/**
 * 获取支持的语言列表
 */
export function getSupportedLocales(): { code: string; name: string }[] {
	return [
		{ code: "zh", name: "中文" },
		{ code: "en", name: "English" },
	]
}

export { i18n }
