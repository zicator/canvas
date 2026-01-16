import { ASSET_RESOLUTIONS, RESOLUTION_MULTIPLIER } from './layoutConstants'
import type { AspectRatio } from './layoutConstants'

export interface DimensionResult {
    layout: { width: number; height: number }
    generation: { width: number; height: number }
    multiplier: number
}

export const calculateDimensions = (
    aspectRatio: string,
    resolution: string
): DimensionResult => {
    const resolutionConfig = ASSET_RESOLUTIONS[aspectRatio as AspectRatio] || ASSET_RESOLUTIONS['1:1']
    const layoutWidth = resolutionConfig.width
    const layoutHeight = resolutionConfig.height
    
    // Default to 1 if resolution not found (e.g. legacy or error)
    const multiplier = RESOLUTION_MULTIPLIER[resolution as keyof typeof RESOLUTION_MULTIPLIER] || 1
    
    return {
        layout: { width: layoutWidth * multiplier, height: layoutHeight * multiplier },
        generation: { width: layoutWidth * multiplier, height: layoutHeight * multiplier },
        multiplier
    }
}
