/**
 * 实验室背景系统
 */

export { BackgroundProvider, useBackground } from "./BackgroundProvider"
export { BackgroundRenderer } from "./BackgroundRenderer"
export { BackgroundControlPanel, BackgroundControlToggle } from "./BackgroundControlPanel"
export { backgroundRegistry, getBackgroundById, getDefaultParams } from "./registry"
export type { BackgroundConfig, ParamConfig, BackgroundState, StoredBackgroundConfig } from "./types"

