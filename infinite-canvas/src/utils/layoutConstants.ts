// Layout and Spacing Constants
export const LAYOUT = {
    BOARD_PADDING: 188,
    INNER_GAP: 32,
    BOARD_GAP_X: 480,
    ROW_GAP_Y: 800,
    ROW_MAX_WIDTH: 15000,
}

// Asset Resolutions (Based on 2K standard)
// Sorted from Horizontal (widest) to Vertical (tallest)
export const ASSET_RESOLUTIONS = {
    '16:9': { width: 2560, height: 1440, label: '16:9' },
    '4:3': { width: 2304, height: 1728, label: '4:3' },
    '3:2': { width: 2400, height: 1600, label: '3:2' },
    '1:1': { width: 2048, height: 2048, label: '1:1' },
    '2:3': { width: 1600, height: 2400, label: '2:3' },
    '3:4': { width: 1728, height: 2304, label: '3:4' },
    '9:16': { width: 1440, height: 2560, label: '9:16' },
} as const

export type AspectRatio = keyof typeof ASSET_RESOLUTIONS
