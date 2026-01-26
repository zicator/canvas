import { useEditor, useValue, track, GeoShapeGeoStyle } from 'tldraw'
import { useState } from 'react'
import { 
    RiHand, 
    RiPencilLine, 
    RiEraserLine, 
    RiRectangleLine, 
    RiCircleLine, 
    RiText, 
    RiArrowRightUpLine, 
    RiSubtractLine, 
    RiMoreLine,
    RiArrowRightSLine,
    RiTriangleLine,
    RiStarLine,
    RiHexagonLine,
    RiStickyNoteLine,
    RiFocus3Line,
    RiImageLine
} from '@remixicon/react'

const IconCursor = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.20801 5.20703C3.98444 4.00882 5.2001 3.07541 6.28516 3.55762L6.38965 3.6084L20.1035 10.9365C21.3879 11.6232 21.0385 13.5532 19.5947 13.7461L14.2754 14.457L14.2637 14.459C14.0886 14.4804 13.8044 14.6011 13.4678 14.8633C13.1489 15.1117 12.8706 15.4184 12.6982 15.6768L9.69922 20.4492C8.97271 21.6052 7.20462 21.2689 6.9541 19.9268L4.20801 5.20703Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
)

const IconFrame = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.59668 5.98633H16.1963V2.95312H18.1963V5.98633H21V7.98633H18.1963V16.9326H21V18.9326H18.1963V21.1016H16.1963V18.9326H7.59668V21.1016H5.59668V18.9326H2.85156V16.9326H5.59668V7.98633H2.85156V5.98633H5.59668V2.95312H7.59668V5.98633ZM7.59668 16.9326H16.1963V7.98633H7.59668V16.9326Z" fill="currentColor"/>
    </svg>
)

const IconDiamond = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.7129 12L12.001 22.7129L1.28906 12L12.001 1.28809L22.7129 12ZM4.11719 12L12.001 19.8838L19.8848 12L12.001 4.11621L4.11719 12Z" fill="currentColor"/>
    </svg>
)

const TOOLS = [
    // 1. 移动光标
    { id: 'select', icon: <IconCursor size={20} />, label: 'Select' },
    // 2. 抓手
    { id: 'hand', icon: <RiHand size={20} />, label: 'Hand' },
    // 3. 画笔
    { id: 'draw', icon: <RiPencilLine size={20} />, label: 'Draw' },
    // 4. 橡皮
    { id: 'eraser', icon: <RiEraserLine size={20} />, label: 'Eraser' },
    // 5. 画板
    { id: 'frame', icon: <IconFrame size={20} />, label: 'Frame' },
    // 6. 文字
    { id: 'text', icon: <RiText size={20} />, label: 'Text' },
    // 7. 图片 (Placeholder tool)
    { id: 'asset', icon: <RiImageLine size={20} />, label: 'Image' },
    // 8. 形状 (Rectangle as default shape tool)
    { id: 'geo-rectangle', icon: <RiRectangleLine size={20} />, label: 'Rectangle' },
    { id: 'geo-ellipse', icon: <RiCircleLine size={20} />, label: 'Ellipse' },
    // 9. 便利贴
    { id: 'note', icon: <RiStickyNoteLine size={20} />, label: 'Note' },
    // Hidden tools (in More)
    { id: 'arrow', icon: <RiArrowRightUpLine size={20} />, label: 'Arrow' },
    { id: 'line', icon: <RiSubtractLine size={20} style={{ transform: 'rotate(-45deg)' }} />, label: 'Line' },
    { id: 'geo-triangle', icon: <RiTriangleLine size={20} />, label: 'Triangle' },
    { id: 'geo-diamond', icon: <IconDiamond size={20} />, label: 'Diamond' },
    { id: 'geo-hexagon', icon: <RiHexagonLine size={20} />, label: 'Hexagon' },
    { id: 'geo-star', icon: <RiStarLine size={20} />, label: 'Star' },
    { id: 'laser', icon: <RiFocus3Line size={20} />, label: 'Laser' },
]

export const CustomToolbar = track(() => {
    const editor = useEditor()
    const currentToolId = useValue('current tool', () => editor.getCurrentToolId(), [editor])
    const [isMoreOpen, setIsMoreOpen] = useState(false)

    // 显示前 10 个工具 (移动光标 > 抓手 > 画笔 > 橡皮 > 画板 > 文字 > 图片 > 形状(矩形+圆形) > 便利贴)
    // 注意：数组中第 8、9 项是矩形和圆形，都显示在一级菜单
    const VISIBLE_TOOLS_COUNT = 10 
    const visibleTools = TOOLS.slice(0, VISIBLE_TOOLS_COUNT)
    const overflowTools = TOOLS.slice(VISIBLE_TOOLS_COUNT)

    const handleToolClick = (toolId: string) => {
        if (toolId.startsWith('geo-')) {
            const geoType = toolId.replace('geo-', '')
            editor.setCurrentTool('geo')
            editor.updateInstanceState({ stylesForNextShape: { [GeoShapeGeoStyle.id]: geoType } })
            // Don't close more menu if it's one of the main tools
            if (!visibleTools.find(t => t.id === toolId)) {
                setIsMoreOpen(false)
            }
        } else if (toolId === 'asset') {
            // Asset tool placeholder - triggers native upload
            editor.setCurrentTool('asset')
        } else {
            editor.setCurrentTool(toolId)
            if (!visibleTools.find(t => t.id === toolId)) {
                setIsMoreOpen(false)
            }
        }
    }

    return (
        <div style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: 4,
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 300,
            border: '1px solid #e2e8f0'
        }}>
            {visibleTools.map(tool => (
                <ToolButton
                    key={tool.id}
                    icon={tool.icon}
                    label={tool.label}
                    isActive={currentToolId === tool.id || (tool.id.startsWith('geo-') && currentToolId === 'geo')}
                    onClick={() => handleToolClick(tool.id)}
                />
            ))}

            {overflowTools.length > 0 && (
                <div style={{ position: 'relative' }}>
                    <ToolButton
                        icon={isMoreOpen ? <RiArrowRightSLine size={20} style={{ transform: 'rotate(90deg)' }} /> : <RiMoreLine size={20} />}
                        label="More"
                        isActive={false}
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                    />
                    
                    {isMoreOpen && (
                        <div style={{
                            position: 'absolute',
                            left: '100%',
                            bottom: -4, // Align with toolbar bottom (offset by parent padding)
                            marginLeft: 12,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 8,
                            padding: 12,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e2e8f0',
                            maxWidth: 360,
                            minWidth: 168, // 3 * 40 + 2 * 8 + 24 = 168
                            overflowY: 'auto'
                        }}>
                            {overflowTools.map(tool => (
                                <ToolButton
                                    key={tool.id}
                                    icon={tool.icon}
                                    label={tool.label}
                                    isActive={currentToolId === tool.id || (tool.id.startsWith('geo-') && currentToolId === 'geo')}
                                    onClick={() => handleToolClick(tool.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
})

const ToolButton = ({ icon, label, isActive, onClick }: any) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)

    return (
        <button
            onClick={onClick}
            title={label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                backgroundColor: isActive ? '#f1f5f9' : (isPressed ? '#f1f5f9' : (isHovered ? '#f8fafc' : 'transparent')),
                color: isActive ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                boxSizing: 'border-box'
            }}
        >
            {icon}
        </button>
    )
}
