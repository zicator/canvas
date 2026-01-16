import { useEditor, useValue, track, GeoShapeGeoStyle } from 'tldraw'
import React, { useState } from 'react'
import { 
    RiCursorFill, 
    RiHand, 
    RiPencilLine, 
    RiEraserLine, 
    RiRectangleLine, 
    RiCircleLine, 
    RiText, 
    RiArrowRightUpLine, 
    RiSubtractLine, 
    RiSparklingFill,
    RiMoreLine,
    RiArrowRightSLine,
    RiTriangleLine,
    RiStarLine,
    RiHexagonLine,
    RiStickyNoteLine,
    RiFocus3Line,
    RiImageLine,
    RiShapeLine
} from '@remixicon/react'

const IconCursor = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.20801 5.20703C3.98444 4.00882 5.2001 3.07541 6.28516 3.55762L6.38965 3.6084L20.1035 10.9365C21.3879 11.6232 21.0385 13.5532 19.5947 13.7461L14.2754 14.457L14.2637 14.459C14.0886 14.4804 13.8044 14.6011 13.4678 14.8633C13.1489 15.1117 12.8706 15.4184 12.6982 15.6768L9.69922 20.4492C8.97271 21.6052 7.20462 21.2689 6.9541 19.9268L4.20801 5.20703Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
)

const IconHand = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1328 1C13.3087 1.00011 14.3082 1.7436 14.6943 2.78516C14.9737 2.6882 15.2734 2.63379 15.5859 2.63379C16.8523 2.63394 17.9134 3.50044 18.2158 4.67285C18.4491 4.6096 18.6945 4.57422 18.9482 4.57422C20.4932 4.57441 21.746 5.82719 21.7461 7.37207V14.8115C21.7461 14.8575 21.7414 14.9029 21.7354 14.9473C21.5812 19.4012 17.9266 22.9657 13.4346 22.9658C10.7012 22.9657 8.27548 21.6442 6.7627 19.6104V19.6094L2.87402 14.6318C1.88485 13.3649 2.11108 11.5369 3.37695 10.5479C4.14511 9.94793 5.1193 9.79607 5.98828 10.0508V5.22266C5.98828 3.72383 7.20332 2.50879 8.70215 2.50879C9.02225 2.50882 9.32859 2.56634 9.61328 2.66797C10.0288 1.68748 11.0009 1 12.1328 1ZM12.1328 3C11.7633 3 11.4577 3.27269 11.4062 3.62793C11.4232 3.70083 11.4336 3.77644 11.4336 3.85449V10.4473L11.4287 10.5488C11.3777 11.0533 10.9515 11.4473 10.4336 11.4473C9.9157 11.4472 9.48947 11.0533 9.43848 10.5488L9.43359 10.4473V5.25098C9.42254 5.20998 9.4131 5.16812 9.40723 5.125C9.35986 4.77604 9.061 4.50892 8.70215 4.50879C8.30789 4.50879 7.98828 4.8284 7.98828 5.22266V12.0684L7.97559 12.2256C7.91825 12.5858 7.66716 12.8919 7.31445 13.0137C6.91114 13.1527 6.4631 13.0205 6.2002 12.6846L5.88477 12.2812V12.2803C5.57533 11.8846 5.00353 11.8146 4.60742 12.124C4.21124 12.4338 4.1413 13.0058 4.4502 13.4014L8.35352 18.3984L8.36816 18.417C9.51993 19.9652 11.3605 20.9657 13.4346 20.9658C16.8736 20.9657 19.669 18.2133 19.7412 14.791L19.7461 14.7275V7.37207C19.746 6.95895 19.4316 6.61891 19.0293 6.57812L18.9482 6.57422C18.6902 6.57422 18.4599 6.69825 18.3135 6.89258V10.4463C18.3135 10.9985 17.8656 11.4461 17.3135 11.4463C16.7612 11.4463 16.3135 10.9986 16.3135 10.4463V6.76172C16.3089 6.72285 16.3057 6.68349 16.3057 6.64355V5.35254C16.3055 5.00558 16.0591 4.71576 15.7314 4.64844L15.5859 4.63379C15.21 4.63379 14.9049 4.92215 14.873 5.29004V5.31152C14.8732 5.31835 14.874 5.32517 14.874 5.33203V10.4463C14.874 10.572 14.849 10.6919 14.8066 10.8027C14.8046 10.8081 14.8039 10.814 14.8018 10.8193C14.751 10.9454 14.6755 11.0822 14.582 11.2285L14.5771 11.2354L14.2881 11.666L13.7939 11.334L14.0771 10.9121L14.083 10.9033C14.156 10.7891 14.2149 10.6823 14.2539 10.5859C14.269 10.5485 14.2804 10.5134 14.2881 10.4814V3.85449C14.2881 3.84581 14.2877 3.83732 14.2861 3.8291C14.2796 3.79155 14.2682 3.76611 14.2607 3.75488C14.2541 3.74503 14.2464 3.73837 14.2402 3.73437C14.1873 3.69947 14.0322 3.66579 13.8438 3.66504C13.6558 3.66429 13.5015 3.69677 13.4492 3.73047C13.4429 3.73453 13.435 3.74125 13.4287 3.75195C13.4214 3.76412 13.4101 3.79051 13.4033 3.82812C13.4022 3.83466 13.4014 3.8413 13.4014 3.84863V10.4473H12.8066V3.85449C12.8066 3.09216 13.4216 2.47656 14.1826 2.47656C14.5518 2.47656 14.8876 2.62479 15.1328 2.86816C15.3788 2.62369 15.7159 2.47461 16.0869 2.47461C16.8488 2.47461 17.4658 3.09218 17.4658 3.85449V4.54297C17.6534 4.46083 17.8631 4.41504 18.085 4.41504C18.8471 4.41504 19.4639 5.03261 19.4639 5.79492V6.375C19.6508 6.29415 19.8596 6.24805 20.0811 6.24805C20.8432 6.24805 21.4609 6.86562 21.4609 7.62793V14.75L21.4551 14.8184C21.3976 17.5186 19.192 19.6918 16.4785 19.6914C14.7354 19.6913 13.2059 18.8052 12.2393 17.5059L12.2275 17.4912L8.85059 12.9805C9.36278 13.3619 9.65487 13.9845 9.60156 14.6211C9.53974 15.3582 8.92476 15.9171 8.18555 15.916C7.57463 15.9151 7.03154 15.5262 6.8125 14.9785L3.80566 15.4297L6.61133 19.1777V19.1787C7.80802 20.7872 9.72886 21.8339 11.8682 21.8339C15.5323 21.8339 18.5244 19.0189 18.6016 15.4336C18.6062 15.3995 18.6104 15.3644 18.6104 15.3281V7.62793C18.6104 6.81665 17.9517 6.15723 17.1416 6.15723C16.9423 6.15723 16.752 6.19692 16.5771 6.26953L16.3535 5.79492C16.3535 4.98364 15.6948 4.32422 14.8848 4.32422C14.6853 4.32422 14.495 4.36394 14.3193 4.43652L14.0957 3.96289C14.0957 3.15161 13.437 2.49219 12.627 2.49219C11.8169 2.49219 11.1582 3.15161 11.1582 3.96289V10.4463C11.1582 10.8457 10.834 11.1709 10.4336 11.1709C10.0332 11.1709 9.70898 10.8457 9.70898 10.4463V3.85449C9.70898 2.27092 10.9989 0.982422 12.5859 0.982422C13.5684 0.982422 14.4385 1.48296 14.9609 2.24902C15.4851 1.48411 16.3541 0.984375 17.3359 0.984375C18.9229 0.984375 20.2129 2.27288 20.2129 3.85645V4.31348C20.6725 4.54226 21.0772 4.88126 21.3789 5.30469C21.9421 5.24074 22.4289 5.39999 22.8027 5.73438C23.3361 6.21142 23.6338 6.90048 23.6338 7.62793V14.75C23.6338 18.1065 21.3208 20.9157 18.0674 21.6592L17.9424 21.1123Z" fill="currentColor"/>
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
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                backgroundColor: isActive ? 'rgba(0,0,0,0.07)' : (isPressed ? 'rgba(0,0,0,0.07)' : (isHovered ? 'rgba(0,0,0,0.05)' : 'transparent')),
                color: isActive ? '#2d3748' : '#718096',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                padding: 0,
                boxSizing: 'border-box'
            }}
        >
            {icon}
        </button>
    )
}
