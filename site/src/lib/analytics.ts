/**
 * Umami 事件追踪工具
 * 
 * Umami 会自动追踪：
 * - 页面访问（PV）
 * - 设备类型（手机/平板/桌面）
 * - 浏览器、操作系统
 * - 访问来源、地理位置
 * 
 * 使用示例：
 * trackEvent('click_wifi')
 * trackEvent('menu_click', { item: 'route', label: '路线引导' })
 */

declare global {
	interface Window {
		umami?: {
			track: (event: string, data?: Record<string, unknown>) => void
		}
	}
}

/**
 * 追踪自定义事件
 * @param eventName 事件名称
 * @param eventData 事件附加数据（可选）
 */
export function trackEvent(
	eventName: string,
	eventData?: Record<string, unknown>
) {
	try {
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(eventName, eventData)
		}
	} catch (e) {
		// 静默失败，不影响用户体验
		console.debug('[Analytics] Track failed:', e)
	}
}

/**
 * 预定义的事件名称常量
 * 使用常量可以避免拼写错误，便于统一管理
 */
export const EVENTS = {
	// ===== 菜单相关 =====
	/** 打开感兴趣菜单 */
	MENU_OPEN: 'menu_open',
	/** 点击菜单项 */
	MENU_CLICK: 'menu_click',
	
	// ===== 弹窗相关 =====
	/** 打开特别活动弹窗 */
	EVENT_DIALOG_OPEN: 'event_dialog_open',
	/** 打开小程序弹窗 */
	MINIPROGRAM_OPEN: 'miniprogram_open',
	/** 打开 WiFi 弹窗 */
	WIFI_DIALOG_OPEN: 'wifi_dialog_open',
	
	// ===== WiFi 操作 =====
	/** 复制 WiFi 名称 */
	WIFI_COPY_SSID: 'wifi_copy_ssid',
	/** 复制 WiFi 密码 */
	WIFI_COPY_PASSWORD: 'wifi_copy_password',
	
	// ===== 教程相关 =====
	/** 播放教程视频 */
	TUTORIAL_VIDEO_PLAY: 'tutorial_video_play',
	/** 查看原图 */
	IMAGE_VIEW_FULL: 'image_view_full',
} as const

/**
 * 事件类型（用于类型提示）
 */
export type EventName = typeof EVENTS[keyof typeof EVENTS]

