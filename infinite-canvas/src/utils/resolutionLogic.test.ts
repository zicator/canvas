import { describe, it, expect } from 'vitest'
import { calculateDimensions } from './resolutionLogic'
import { ASSET_RESOLUTIONS } from './layoutConstants'

describe('Resolution Logic', () => {
    it('should return base 2K dimensions for "2k" resolution', () => {
        const result = calculateDimensions('16:9', '2k')
        const base = ASSET_RESOLUTIONS['16:9']
        
        // Layout should be base size
        expect(result.layout.width).toBe(base.width)
        expect(result.layout.height).toBe(base.height)
        
        // Generation should be base size (multiplier 1)
        expect(result.generation.width).toBe(base.width)
        expect(result.generation.height).toBe(base.height)
        expect(result.multiplier).toBe(1)
    })

    it('should return scaled dimensions for "4k" resolution (layout should also be scaled)', () => {
        const result = calculateDimensions('16:9', '4k')
        const base = ASSET_RESOLUTIONS['16:9']
        
        // Layout should be double size (4K)
        expect(result.layout.width).toBe(base.width * 2)
        expect(result.layout.height).toBe(base.height * 2)
        
        // Generation should be double size (multiplier 2)
        expect(result.generation.width).toBe(base.width * 2)
        expect(result.generation.height).toBe(base.height * 2)
        expect(result.multiplier).toBe(2)
    })

    it('should handle all aspect ratios correctly', () => {
        const ratios = Object.keys(ASSET_RESOLUTIONS)
        
        ratios.forEach(ratio => {
            const result = calculateDimensions(ratio, '4k')
            const base = ASSET_RESOLUTIONS[ratio as keyof typeof ASSET_RESOLUTIONS]
            
            expect(result.layout.width).toBe(base.width * 2)
            expect(result.generation.width).toBe(base.width * 2)
        })
    })

    it('should default to 1:1 and 2k if inputs are invalid', () => {
        const result = calculateDimensions('invalid', 'invalid')
        const base = ASSET_RESOLUTIONS['1:1']
        
        expect(result.layout.width).toBe(base.width)
        expect(result.generation.width).toBe(base.width)
        expect(result.multiplier).toBe(1)
    })
})
