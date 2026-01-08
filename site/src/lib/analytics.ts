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
 * 命名规则：功能_动作，清晰表达用户行为
 */
export const EVENTS = {
	// ===== 首页主按钮 =====
	/** 点击"特别活动"按钮 */
	BTN_SPECIAL_EVENT: 'btn_special_event',
	/** 点击"跳转小程序"按钮 */
	BTN_MINIPROGRAM: 'btn_miniprogram',
	/** 点击"WiFi"按钮 */
	BTN_WIFI: 'btn_wifi',
	
	// ===== 感兴趣菜单 =====
	/** 打开感兴趣菜单 */
	MENU_OPEN: 'menu_open',
	/** 点击菜单-路线引导 */
	MENU_ROUTE: 'menu_route',
	/** 点击菜单-停车指引 */
	MENU_PARKING: 'menu_parking',
	/** 点击菜单-客服微信 */
	MENU_WECHAT: 'menu_wechat',
	/** 点击菜单-小程序码 */
	MENU_MINIPROGRAM: 'menu_miniprogram',
	/** 点击菜单-团购核销 */
	MENU_GROUPBUY: 'menu_groupbuy',
	/** 点击菜单-预订教程 */
	MENU_BOOKING: 'menu_booking',
	/** 点击菜单-开门开灯 */
	MENU_ACTION: 'menu_action',
	
	// ===== WiFi 操作 =====
	/** 复制 WiFi 账号 */
	WIFI_COPY_SSID: 'wifi_copy_ssid',
	/** 复制 WiFi 密码 */
	WIFI_COPY_PASSWORD: 'wifi_copy_password',
} as const

/**
 * 事件类型（用于类型提示）
 */
export type EventName = typeof EVENTS[keyof typeof EVENTS]

