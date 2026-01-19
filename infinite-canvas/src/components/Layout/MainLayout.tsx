import { useEditor, AssetRecordType } from 'tldraw'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { useAppStore } from '../../store'
import { AgentSidebar } from '../Sidebar/AgentSidebar'
import { UnifiedInput } from '../Input/UnifiedInput'
import { MockGenerationService } from '../../services/MockGenerationService'
import { CustomToolbar } from '../Toolbar/CustomToolbar'
import { CustomExtras } from '../Toolbar/CustomExtras'
import { CustomStylePanel } from '../Toolbar/CustomStylePanel'
import { SystemDebugDrawer, SafeViewportOverlay } from '../Debug/SystemDebugDrawer'
import { RiChat1Line } from '@remixicon/react'
import { calculateNextPosition } from '../../utils/autoLayout'
import { LAYOUT } from '../../utils/layoutConstants'
import { calculateDimensions } from '../../utils/resolutionLogic'

// Bezier Easing Function for cubic-bezier(0.4, 0, 0.2, 1)
const cubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number) => {
    const cx = 3 * p1x
    const bx = 3 * (p2x - p1x) - cx
    const ax = 1 - cx - bx
    const cy = 3 * p1y
    const by = 3 * (p2y - p1y) - cy
    const ay = 1 - cy - by
    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t
    const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
    const solveCurveX = (x: number) => {
        let t2 = x
        for (let i = 0; i < 8; i++) {
            const x2 = sampleCurveX(t2) - x
            if (Math.abs(x2) < 1e-6) return t2
            const d2 = sampleCurveDerivativeX(t2)
            if (Math.abs(d2) < 1e-6) break
            t2 = t2 - x2 / d2
        }
        return t2
    }
    return (x: number) => sampleCurveY(solveCurveX(x))
}
const customEase = cubicBezier(0.4, 0, 0.2, 1)

const service = new MockGenerationService()

/**
 * MainLayout - 主布局组件
 * 协调所有 UI 组件（左侧工具栏、Agent 侧边栏、底部输入框）和画布交互
 * 负责处理图像生成的完整流程，包括状态同步和错误处理
 */
export const MainLayout = () => {
    const editor = useEditor()
    const {
        isSidebarOpen,
        setSidebarOpen,
        prompt,
        setPrompt,
        addMessage,
        updateMessage,
        settings,
        debugRowMaxWidth
    } = useAppStore()

    /**
     * handleGenerate - 处理图像生成请求
     * 
     * 流程：
     * 1. 验证输入并清空提示词
     * 2. 打开侧边栏（如果关闭）
     * 3. 根据设置计算图片尺寸（宽高比和分辨率）
     * 4. 添加用户消息到聊天历史
     * 5. 添加助手消息（生成中状态）
     * 6. 计算新画板位置 (自动布局)
     * 7. 在画布上创建 Board (Frame) 和 Asset (Image)
     * 8. 调用生成服务
     * 9. 更新聊天历史和画布形状（成功/失败）
     * 
     * @async
     * @returns {Promise<void>}
     */
    const handleGenerate = async () => {
        // Allow empty prompt for random generation
        const currentPrompt = prompt.trim() || 'Random Generation'
        setPrompt('') // Clear input immediately

        // Open sidebar if closed so user sees the chat
        // if (!isSidebarOpen) {
        //    setSidebarOpen(true)
        // }

        // 1. Calculate dimensions based on settings
        const { layout, generation } = calculateDimensions(settings.aspectRatio, settings.resolution)
        
        console.log('[MainLayout] Generation started', { 
            settings, 
            layout, 
            generation 
        })

        // Calculate Board Dimensions
        // Padding: 188px
        // Inner Gap: 32px
        // Content Layout: 4 items per row grid
        
        const count = settings.count
        const cols = Math.min(count, 4)
        const rows = Math.ceil(count / cols)
        
        const contentWidth = cols * layout.width + (cols - 1) * LAYOUT.INNER_GAP
        const contentHeight = rows * layout.height + (rows - 1) * LAYOUT.INNER_GAP
        
        const boardWidth = contentWidth + LAYOUT.BOARD_PADDING * 2
        const boardHeight = contentHeight + LAYOUT.BOARD_PADDING * 2

        // 2. Add User Message to History
        const userMsgId = nanoid()
        addMessage({
            id: userMsgId,
            role: 'user',
            content: currentPrompt,
            timestamp: Date.now()
        })

        // 3. Add Assistant Message (Pending)
        const assistantMsgId = nanoid()
        addMessage({
            id: assistantMsgId,
            role: 'assistant',
            status: 'generating',
            timestamp: Date.now()
        })

        // 4. Calculate Position (Auto Layout)
        const { x: boardX, y: boardY } = calculateNextPosition(editor, boardWidth, boardHeight, debugRowMaxWidth)

        // 5. Create Board (Frame)
        const boardId = `shape:${nanoid()}` as any
        editor.createShape({
            id: boardId,
            type: 'frame',
            x: boardX,
            y: boardY,
            props: {
                w: boardWidth,
                h: boardHeight,
                name: currentPrompt.slice(0, 20) || 'AI Generation'
            }
        })

        // Auto-select the new board
        editor.select(boardId)

        // 6. Create Placeholder Assets inside the Board
        const assetIds: string[] = []
        const positions: {x: number, y: number}[] = []
        
        // Coordinates should be relative to the parent (Board)
        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols)
            const c = i % cols
            positions.push({
                x: LAYOUT.BOARD_PADDING + c * (layout.width + LAYOUT.INNER_GAP),
                y: LAYOUT.BOARD_PADDING + r * (layout.height + LAYOUT.INNER_GAP)
            })
        }

        console.log('[MainLayout] Creating placeholders', { count, positions, boardId })

        positions.forEach(pos => {
            const shapeId = `shape:${nanoid()}` as any
            assetIds.push(shapeId)
            editor.createShape({
                id: shapeId,
                type: 'geo', // Placeholder
                x: pos.x,
                y: pos.y,
                parentId: boardId, // Important: Parenting
                props: {
                    w: layout.width,
                    h: layout.height,
                    fill: 'pattern',
                }
            })
        })
        
        // 7. Viewport Follow Logic
        // Rule A: Inside Viewport -> Do nothing
        // Rule B: Outside Viewport -> Union Fit

        const viewportPageBounds = editor.getViewportPageBounds()
        const zoom = editor.getZoomLevel()

        // Safe Viewport Padding
        const topPadding = 160
        const leftPadding = 160
        const bottomPadding = 160
        const rightPadding = 160
        
            // Calculate Safe Viewport in Page Coordinates
        const viewportScreenBounds = editor.getViewportScreenBounds()
        
        // Define safe area in SCREEN coordinates
        const safeArea = {
            top: 80,
            left: 80,
            bottom: 160,
            right: isSidebarOpen ? 400 : 80
        }

        const safeWidth = viewportScreenBounds.w - safeArea.left - safeArea.right
        const safeHeight = viewportScreenBounds.h - safeArea.top - safeArea.bottom

        // 1. Check if Union Bounds (Current + New) fits in CURRENT safe viewport
        // We need to project the board into screen space to check visibility
        // But simpler: check if board is within the "Page Safe Rect"
        // Page Safe Rect = Viewport Page Bounds reduced by padding / zoom
        
        const currentZoom = editor.getZoomLevel()
        const pageSafeMinX = viewportPageBounds.minX + safeArea.left / currentZoom
        const pageSafeMinY = viewportPageBounds.minY + safeArea.top / currentZoom
        const pageSafeMaxX = viewportPageBounds.maxX - safeArea.right / currentZoom
        const pageSafeMaxY = viewportPageBounds.maxY - safeArea.bottom / currentZoom

        const isInside = 
            boardX >= pageSafeMinX - 1 && // Add 1px buffer
            (boardX + boardWidth) <= pageSafeMaxX + 1 &&
            boardY >= pageSafeMinY - 1 &&
            (boardY + boardHeight) <= pageSafeMaxY + 1

        if (isInside) {
            console.log('[MainLayout] Content inside safe viewport, skipping zoom')
        } else {
            // Calculate Union Bounds (Current Viewport + New Content)
            const unionBounds = {
                minX: Math.min(viewportPageBounds.minX, boardX),
                minY: Math.min(viewportPageBounds.minY, boardY),
                maxX: Math.max(viewportPageBounds.maxX, boardX + boardWidth),
                maxY: Math.max(viewportPageBounds.maxY, boardY + boardHeight),
                w: 0, h: 0
            }
            unionBounds.w = unionBounds.maxX - unionBounds.minX
            unionBounds.h = unionBounds.maxY - unionBounds.minY

            // Calculate Target Zoom to fit UnionBounds into SafeScreenArea
            const zoomW = safeWidth / unionBounds.w
            const zoomH = safeHeight / unionBounds.h
            let targetZoom = Math.min(zoomW, zoomH)

            // Define Min Zoom (match App.tsx config)
            const MIN_ZOOM = 0.01

            if (targetZoom >= MIN_ZOOM) {
                 // Normal "Fit" Logic: Zoom to fit everything
                 // Calculate Target Camera Position to center the UnionBounds
                 
                 const unionCenterPageX = unionBounds.minX + unionBounds.w / 2
                 const unionCenterPageY = unionBounds.minY + unionBounds.h / 2
                 
                 const safeCenterScreenX = safeArea.left + safeWidth / 2
                 const safeCenterScreenY = safeArea.top + safeHeight / 2

                 const targetCameraX = safeCenterScreenX / targetZoom - unionCenterPageX
                 const targetCameraY = safeCenterScreenY / targetZoom - unionCenterPageY

                 editor.setCamera({
                     x: targetCameraX,
                     y: targetCameraY,
                     z: targetZoom
                 }, { animation: { duration: 500, easing: customEase } })
            } else {
                 console.log('[MainLayout] Target zoom too small, executing minimal pan')
                 // Minimal Path Pan Logic (Original Plan)
                 // Keep current zoom (or min zoom) and pan to new content
                 
                 const currentCamera = editor.getCamera()
                 const zoom = Math.max(currentCamera.z, MIN_ZOOM) // Ensure at least min zoom
                 
                 // Screen Dimensions
                 const screenW = viewportScreenBounds.w
                 const screenH = viewportScreenBounds.h
                 
                 // Board Bounds (Page Coords)
                 const bMinX = boardX
                 const bMaxX = boardX + boardWidth
                 const bMinY = boardY
                 const bMaxY = boardY + boardHeight
                 
                 let newCameraX = currentCamera.x
                 let newCameraY = currentCamera.y
                 
                 // --- X Axis Calculation ---
                 if ((bMaxX + newCameraX) * zoom > (screenW - safeArea.right)) {
                     newCameraX = (screenW - safeArea.right) / zoom - bMaxX
                 }
                 if ((bMinX + newCameraX) * zoom < safeArea.left) {
                      newCameraX = safeArea.left / zoom - bMinX
                 }

                 // --- Y Axis Calculation ---
                 if ((bMaxY + newCameraY) * zoom > (screenH - safeArea.bottom)) {
                     newCameraY = (screenH - safeArea.bottom) / zoom - bMaxY
                 }
                 if ((bMinY + newCameraY) * zoom < safeArea.top) {
                     newCameraY = safeArea.top / zoom - bMinY
                 }

                 // Only update if changed
                 if (newCameraX !== currentCamera.x || newCameraY !== currentCamera.y || zoom !== currentCamera.z) {
                      editor.setCamera({
                         x: newCameraX,
                         y: newCameraY,
                         z: zoom
                     }, { animation: { duration: 500, easing: customEase } })
                 }
            }
        }

        try {
            // Call Service
            if (count === 1) {
                const res = await service.generate({
                    prompt: currentPrompt,
                    width: generation.width,
                    height: generation.height,
                    seed: Math.floor(Math.random() * 100000)
                })
                updateMessage(assistantMsgId, { status: 'success', imageUrl: res.url })
                
                // Replace Placeholder with Image
                const shapeId = assetIds[0] as any
                if (editor.getShape(shapeId)) {
                    // Create Asset
                    const assetId = AssetRecordType.createId()
                    editor.createAssets([{
                        id: assetId,
                        typeName: 'asset',
                        type: 'image',
                        meta: {},
                        props: {
                            w: generation.width,
                            h: generation.height,
                            mimeType: 'image/png',
                            src: res.url,
                            name: 'Generated Image',
                            isAnimated: false
                        }
                    }])

                    editor.deleteShapes([shapeId])
                    editor.createShape({
                        type: 'image',
                        x: positions[0].x,
                        y: positions[0].y,
                        parentId: boardId,
                        props: {
                            w: layout.width,
                            h: layout.height,
                            assetId: assetId
                        }
                    })
                }
            } else {
                const promises = Array(count).fill(0).map(() =>
                    service.generate({
                        prompt: currentPrompt,
                        width: generation.width,
                        height: generation.height,
                        seed: Math.floor(Math.random() * 100000)
                    })
                )
                const results = await Promise.all(promises)
                const urls = results.map(r => r.url)
                updateMessage(assistantMsgId, { status: 'success', imageUrls: urls })
                
                urls.forEach((url, idx) => {
                    const shapeId = assetIds[idx] as any
                    if (editor.getShape(shapeId)) {
                        const assetId = AssetRecordType.createId()
                        editor.createAssets([{
                            id: assetId,
                            typeName: 'asset',
                            type: 'image',
                            meta: {},
                            props: {
                                w: generation.width,
                                h: generation.height,
                                mimeType: 'image/png',
                                src: url,
                                name: `Generated Image ${idx + 1}`,
                                isAnimated: false
                            }
                        }])

                        editor.deleteShapes([shapeId])
                        editor.createShape({
                            type: 'image',
                            x: positions[idx].x,
                            y: positions[idx].y,
                            parentId: boardId,
                            props: {
                                w: layout.width,
                                h: layout.height,
                                assetId: assetId
                            }
                        })
                    }
                })
            }

        } catch (e) {
            console.error(e)
            // Error handling
            updateMessage(assistantMsgId, { status: 'failed' })
            assetIds.forEach((sid: any) => {
                if (editor.getShape(sid)) {
                    editor.updateShape({
                        id: sid,
                        type: 'geo',
                        props: { 
                            fill: 'solid',
                            color: 'red',
                        }
                    })
                }
            })
        }
    }

    // Global keyboard shortcuts & Focus management
    useEffect(() => {
        // 1. Ensure focus on canvas click
        // Using 'pointer' event which is generic, or skip event listener if type is strict
        // and just rely on manual focus management in App.tsx and keyboard shortcuts here.
        // If we really need to catch clicks, we can use window listener but check target.
        
        const handleWindowClick = (e: MouseEvent) => {
            // If clicking on the canvas container (which usually has class tl-canvas or similar)
            // or if the target is NOT one of our UI overlays
            const target = e.target as HTMLElement
            // Simple heuristic: if not inside an input/button and not in sidebar
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
            const isButton = target.tagName === 'BUTTON' || target.closest('button')
            const inSidebar = target.closest('[data-agent-sidebar]') // We might need to add this attribute
            
            if (!isInput && !inSidebar && !isButton) {
                // Ideally we should check if it's the canvas, but editor.focus() is safe to call repeatedly
                if (!editor.getInstanceState().isFocused) {
                    editor.focus()
                }
            }
        }
        
        // Actually, Tldraw's internal event for pointer down is 'pointer' not 'pointer_down' in some versions,
        // or it might be strictly typed. 
        // Let's just use the manual keyboard handlers which are the most reliable fix for the user's issue.
        // And remove the problematic editor.on call to fix linter error.

        // 2. Fallback keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return
            }

            const isCmdOrCtrl = e.metaKey || e.ctrlKey

            // Delete / Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedIds = editor.getSelectedShapeIds()
                if (selectedIds.length > 0) {
                    editor.deleteShapes(selectedIds)
                }
            }
            
            // Cmd + A (Select All)
            if (isCmdOrCtrl && e.key === 'a') {
                e.preventDefault()
                editor.selectAll()
            }

            // Cmd + Z (Undo)
            if (isCmdOrCtrl && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                editor.undo()
            }

            // Cmd + Shift + Z (Redo)
            if (isCmdOrCtrl && e.key === 'z' && e.shiftKey) {
                e.preventDefault()
                editor.redo()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        // window.addEventListener('mousedown', handleWindowClick) // Optional, maybe too aggressive
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            // window.removeEventListener('mousedown', handleWindowClick)
        }
    }, [editor])

    return (
        <>
            <SystemDebugDrawer />
            <SafeViewportOverlay />
            <CustomToolbar />
            <CustomExtras />
            <CustomStylePanel />

            {/* Top-right toggle button */}
            <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 350, pointerEvents: 'auto' }}>
                <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        height: 32,
                        padding: '0 12px',
                        fontSize: 13,
                        cursor: 'pointer',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    <RiChat1Line size={16} />
                    Chat
                </button>
            </div>

            {/* Agent Sidebar */}
            <AgentSidebar onGenerate={handleGenerate} />

            {/* Bottom Input (only when sidebar is closed) */}
            {!isSidebarOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 300,
                    width: 'auto'
                }}>
                    <UnifiedInput mode="bottom" onSubmit={handleGenerate} />
                </div>
            )}
        </>
    )
}
