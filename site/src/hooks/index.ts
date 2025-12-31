/**
 * Hooks 导出
 */

// 文档相关
export { 
	useDocList,
	useDoc,
	useSaveDoc,
	useDeleteDoc,
} from "./useDocs"

// 基于设备类型的判定
export {
	useIsMobileDevice,
	getCurrentOS,
	getCurrentDeviceType,
	isRealMobileDevice,
} from "./useIsMobileDevice"

// 强制手机模式（用于PC端测试）
export {
	useForceMobileMode,
	getForceMobileMode,
} from "./useForceMobileMode"

// 响应式设计相关
export { 
	useMediaQuery,
	useIsMobile,
	useIsTablet,
	useIsDesktop,
	useDeviceType,
	BREAKPOINTS,
	type DeviceType,
} from "./useMediaQuery"
