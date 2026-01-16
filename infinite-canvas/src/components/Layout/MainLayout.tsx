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
import { LAYOUT, ASSET_RESOLUTIONS } from '../../utils/layoutConstants'
import type { AspectRatio } from '../../utils/layoutConstants'


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

        // 1. Calculate dimensions based on settings
        const resolutionConfig = ASSET_RESOLUTIONS[settings.aspectRatio as AspectRatio] || ASSET_RESOLUTIONS['1:1']
        const assetWidth = resolutionConfig.width
        const assetHeight = resolutionConfig.height

        // Calculate Board Dimensions
        const count = settings.count
        const cols = Math.min(count, 4)
        const rows = Math.ceil(count / cols)
        
        const contentWidth = cols * assetWidth + (cols - 1) * LAYOUT.INNER_GAP
        const contentHeight = rows * assetHeight + (rows - 1) * LAYOUT.INNER_GAP
        
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

        // 6. Create Placeholder Assets inside the Board
        const assetIds: string[] = []
        const positions: {x: number, y: number}[] = []
        
        // Coordinates should be relative to the parent (Board)
        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols)
            const c = i % cols
            positions.push({
                x: LAYOUT.BOARD_PADDING + c * (assetWidth + LAYOUT.INNER_GAP),
                y: LAYOUT.BOARD_PADDING + r * (assetHeight + LAYOUT.INNER_GAP)
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
                    w: assetWidth,
                    h: assetHeight,
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
        const topPadding = 80
        const leftPadding = 80
        const bottomPadding = 160
        const rightPadding = isSidebarOpen ? 400 : 80

        // Calculate Safe Viewport in Page Coordinates
        const safeMinX = viewportPageBounds.minX + leftPadding / zoom
        const safeMinY = viewportPageBounds.minY + topPadding / zoom
        const safeMaxX = viewportPageBounds.maxX - rightPadding / zoom
        const safeMaxY = viewportPageBounds.maxY - bottomPadding / zoom

        const isInside = 
            boardX >= safeMinX &&
            (boardX + boardWidth) <= safeMaxX &&
            boardY >= safeMinY &&
            (boardY + boardHeight) <= safeMaxY

        if (isInside) {
            console.log('[MainLayout] Content inside safe viewport, skipping zoom')
        } else {
            console.log('[MainLayout] Content outside safe viewport, adjusting camera')
            
            // Calculate Union Bounds (Current Viewport + New Content)
            // Note: We use the Safe Current Viewport (not full viewport) to avoid including obscured areas
            const safeCurrentBounds = {
                minX: safeMinX,
                minY: safeMinY,
                maxX: safeMaxX,
                maxY: safeMaxY
            }

            const unionBounds = {
                minX: Math.min(safeCurrentBounds.minX, boardX),
                minY: Math.min(safeCurrentBounds.minY, boardY),
                maxX: Math.max(safeCurrentBounds.maxX, boardX + boardWidth),
                maxY: Math.max(safeCurrentBounds.maxY, boardY + boardHeight),
                width: 0, height: 0
            }
            unionBounds.width = unionBounds.maxX - unionBounds.minX
            unionBounds.height = unionBounds.maxY - unionBounds.minY

            // Calculate Target Zoom to fit Union Bounds into Available Screen Space
            const viewportScreenBounds = editor.getViewportScreenBounds()
            const { w: screenW, h: screenH } = viewportScreenBounds
            
            const availableW = screenW - leftPadding - rightPadding
            const availableH = screenH - topPadding - bottomPadding

            if (availableW > 0 && availableH > 0) {
                // Add a small internal inset (20px) so content doesn't touch the safety lines exactly
                const internalInset = 20
                const targetW = availableW - internalInset * 2
                const targetH = availableH - internalInset * 2

                const zoomX = targetW / unionBounds.width
                const zoomY = targetH / unionBounds.height
                let targetZoom = Math.min(zoomX, zoomY)

                // Clamp zoom to reasonable limits
                // Ensure we don't zoom in too much (e.g. > 1) if content is small
                // But allow zooming out as much as needed
                targetZoom = Math.min(targetZoom, 1)
                
                // Calculate center of the Union Bounds in Page Space
                const contentCenterX = unionBounds.minX + unionBounds.width / 2
                const contentCenterY = unionBounds.minY + unionBounds.height / 2

                // Calculate center of the Safe Area in Screen Space
                const safeCenterX = leftPadding + availableW / 2
                const safeCenterY = topPadding + availableH / 2

                // Calculate Target Camera Position
                // Formula: screenX = (pageX - cameraX) * zoom  =>  cameraX = pageX - screenX / zoom
                const targetCameraX = contentCenterX - safeCenterX / targetZoom
                const targetCameraY = contentCenterY - safeCenterY / targetZoom

                editor.setCamera({
                    x: targetCameraX,
                    y: targetCameraY,
                    z: targetZoom
                }, { animation: { duration: 300, easing: (t) => t * (2 - t) } }) // EaseOutQuad
            }
        }

        try {
            // Call Service
            if (count === 1) {
                const res = await service.generate({
                    prompt: currentPrompt,
                    width: assetWidth,
                    height: assetHeight,
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
                            w: assetWidth,
                            h: assetHeight,
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
                            w: assetWidth,
                            h: assetHeight,
                            assetId: assetId
                        }
                    })
                }
            } else {
                const promises = Array(count).fill(0).map(() =>
                    service.generate({
                        prompt: currentPrompt,
                        width: assetWidth,
                        height: assetHeight,
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
                                w: assetWidth,
                                h: assetHeight,
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
                                w: assetWidth,
                                h: assetHeight,
                                assetId: assetId
                            }
                        })
                    }
                })
            }

            // Select the newly created board to highlight the result
            if (editor.getShape(boardId)) {
                editor.select(boardId)
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

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedIds = editor.getSelectedShapeIds()
                if (selectedIds.length > 0) {
                    editor.deleteShapes(selectedIds)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
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
