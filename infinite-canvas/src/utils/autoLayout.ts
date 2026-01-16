import { Editor } from 'tldraw'
import type { TLShape } from 'tldraw'
import { LAYOUT } from './layoutConstants'

export interface LayoutResult {
    x: number
    y: number
}

// Helper to get bounding box of a shape
const getBounds = (editor: Editor, shape: TLShape) => {
    return editor.getShapePageBounds(shape)
}

// 4. 动态行归属判定 (Row Affinity)
const getRowAffinity = (editor: Editor, targetY: number, targetHeight: number): TLShape[] => {
    const allShapes = editor.getCurrentPageShapes()
    const rowShapes: TLShape[] = []

    allShapes.forEach(shape => {
        if (shape.type !== 'frame') return // Only consider frames (boards) as row markers
        
        const bounds = getBounds(editor, shape)
        if (!bounds) return

        const verticalOverlap = Math.max(0, Math.min(bounds.maxY, targetY + targetHeight) - Math.max(bounds.minY, targetY))
        const minHeight = Math.min(bounds.height, targetHeight)
        
        if (minHeight === 0) return

        const score = verticalOverlap / minHeight

        // Rule: Score > 0.6 -> belongs to row
        // Rule: Score > 0.7 -> forced inclusion (amnesty)
        if (score > 0.6) {
            rowShapes.push(shape)
        }
    })

    // Sort by x position to find the last element in the row
    return rowShapes.sort((a, b) => a.x - b.x)
}

// Find the last operation or generated board (anchor)
const findAnchor = (editor: Editor): TLShape | null => {
    // Strategy: Find the shape with the maximum creation time or modification time?
    // Since we don't have explicit creation time in TLShape without meta, 
    // we can rely on the selection or the right-most, bottom-most shape as a heuristic if no selection.
    
    // Improved Strategy: 
    // 1. If there is a selection, use the last selected item.
    // 2. If no selection, find the frame with the largest ID (assuming nanoid/time-based) or just the last created one.
    // Tldraw doesn't strictly order shapes by creation time in the store array, but usually they are appended.
    // Let's use the shape with the highest index in the rendering order (siblings).
    
    const selectedIds = editor.getSelectedShapeIds()
    if (selectedIds.length > 0) {
        return editor.getShape(selectedIds[selectedIds.length - 1]) || null
    }

    // Fallback: Find the right-most, bottom-most frame
    const shapes = editor.getCurrentPageShapes().filter(s => s.type === 'frame')
    if (shapes.length === 0) return null

    // Sort by Y then X to find the "last" visual element
    return shapes.sort((a, b) => {
        if (Math.abs(a.y - b.y) > 100) { // fuzzy row check
            return a.y - b.y
        }
        return a.x - b.x
    }).pop() || null
}

export const calculateNextPosition = (editor: Editor, newWidth: number, newHeight: number, maxWidth: number = LAYOUT.ROW_MAX_WIDTH): LayoutResult => {
    const anchor = findAnchor(editor)
    
    // If no anchor (empty canvas), start at center-ish or 0,0
    if (!anchor) {
        // Center of the current viewport? Or just 0,0?
        // Let's stick to 0,0 for the first element or center of viewport if user is looking there.
        const viewport = editor.getViewportPageBounds()
        return { x: viewport.center.x - newWidth / 2, y: viewport.center.y - newHeight / 2 }
    }

    const anchorBounds = getBounds(editor, anchor)
    if (!anchorBounds) return { x: 0, y: 0 }

    // 2. 默认排列 (Default Placement): Try to place to the right
    let nextX = anchorBounds.maxX + LAYOUT.BOARD_GAP_X
    // Align vertically center with the anchor
    let nextY = anchorBounds.center.y - newHeight / 2

    // 3. 智能换行 (Smart Wrapping)
    // Detect current row
    const currentRowShapes = getRowAffinity(editor, nextY, newHeight)
    
    console.log('[AutoLayout] Current row shapes:', currentRowShapes.length, 'Anchor:', anchor?.id)

    // Calculate total width of the current row
    let currentRowWidth = 0
    let minX = Infinity
    
    if (currentRowShapes.length > 0) {
        const firstShape = currentRowShapes[0]
        const lastShape = currentRowShapes[currentRowShapes.length - 1]
        const firstBounds = getBounds(editor, firstShape)!
        const lastBounds = getBounds(editor, lastShape)!
        
        minX = firstBounds.minX
        // Current width is from first shape start to last shape end
        currentRowWidth = lastBounds.maxX - firstBounds.minX
    } else {
        // If the anchor itself is the start of a new row (conceptually), 
        // but getRowAffinity should have found the anchor if we aligned with it.
        // If we are here, it means the anchor might be far away vertically? 
        // But we set nextY based on anchor, so it should be found.
        // Let's assume the anchor is part of the row.
        minX = anchorBounds.minX
        currentRowWidth = anchorBounds.width
    }

    // Check threshold
    if (currentRowWidth + LAYOUT.BOARD_GAP_X + newWidth > maxWidth) {
        // Trigger Wrap
        // X: Center Offset (Regression to canvas start left alignment - which we assume is the minX of the current row or 0?)
        // Spec says: "回归画布的起始左对齐线 (Center Offset)" -> Let's use the minX of the current row (align left with the block above)
        // or a global 0 if "Canvas Start". Let's use minX of the previous row to keep things block-aligned.
        nextX = minX !== Infinity ? minX : 0
        
        // Y: Max Bottom of previous row + 800px
        const maxBottom = currentRowShapes.reduce((max, shape) => {
            const b = getBounds(editor, shape)
            return b ? Math.max(max, b.maxY) : max
        }, anchorBounds.maxY)
        
        nextY = maxBottom + LAYOUT.ROW_GAP_Y
    }

    return { x: nextX, y: nextY }
}
