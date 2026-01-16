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
import { SystemDebugDrawer } from '../Debug/SystemDebugDrawer'
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

        // Open sidebar if closed so user sees the chat
        // if (!isSidebarOpen) {
        //    setSidebarOpen(true)
        // }

        // 1. Calculate dimensions based on settings
        // Default to 1:1 if not found
        const resolutionConfig = ASSET_RESOLUTIONS[settings.aspectRatio as AspectRatio] || ASSET_RESOLUTIONS['1:1']
        const assetWidth = resolutionConfig.width
        const assetHeight = resolutionConfig.height

        // Calculate Board Dimensions
        // Padding: 188px
        // Inner Gap: 32px
        // Content Layout: 4 items per row grid
        
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
        // "若产物完全在视口内且长边 > 240px，视口不动"
        // "若产物完全在视口内且长边 < 240px，缩放"
        // "超出视口，增量 fit"
        
        const viewport = editor.getViewportPageBounds()
        const boardBounds = {
            minX: boardX,
            minY: boardY,
            maxX: boardX + boardWidth,
            maxY: boardY + boardHeight,
            width: boardWidth,
            height: boardHeight,
            x: boardX,
            y: boardY
        }
        
        // Check visibility
        const isFullyVisible = viewport.contains(boardBounds as any)
        const longSide = Math.max(boardWidth, boardHeight)
        
        if (isFullyVisible) {
             if (longSide < 240) {
                  editor.zoomToBounds(boardBounds as any, { targetZoom: undefined, animation: { duration: 300 }, inset: 50 })
             }
             // else do nothing
         } else {
             // Not fully visible -> Incremental fit
             // "计算【原视口+新产物】的包围盒"
             
             const unionBounds = {
                 minX: Math.min(viewport.minX, boardX),
                 minY: Math.min(viewport.minY, boardY),
                 maxX: Math.max(viewport.maxX, boardX + boardWidth),
                 maxY: Math.max(viewport.maxY, boardY + boardHeight),
                 width: 0, 
                 height: 0, x:0, y:0
             }
             unionBounds.width = unionBounds.maxX - unionBounds.minX
             unionBounds.height = unionBounds.maxY - unionBounds.minY
             unionBounds.x = unionBounds.minX
             unionBounds.y = unionBounds.minY
             
             // Use a reasonable inset to ensure content is not at the very edge
             editor.zoomToBounds(unionBounds as any, { animation: { duration: 500 }, inset: 50 })
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
