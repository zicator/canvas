import { useEditor, DefaultColorStyle, DefaultFillStyle, DefaultDashStyle, DefaultSizeStyle } from 'tldraw'
import { track } from 'tldraw'
import { RiPaletteLine, RiPaintFill, RiRulerLine, RiDashboardLine } from '@remixicon/react'

export const CustomStylePanel = track(() => {
    const editor = useEditor()

    // Get selected shapes
    const selectedShapes = editor.getSelectedShapes()
    
    // If no shapes selected, don't show panel
    if (selectedShapes.length === 0) return null

    // Helper to get common style value
    const getCommonStyle = (style: any) => {
        const firstValue = (selectedShapes[0].props as any)[style.id]
        return selectedShapes.every(s => (s.props as any)[style.id] === firstValue) ? firstValue : null
    }

    // Define colors (using Tldraw's default palette or custom)
    const colors = ['black', 'grey', 'light-violet', 'violet', 'blue', 'light-blue', 'yellow', 'orange', 'green', 'light-green', 'red', 'light-red']
    const fills = ['none', 'semi', 'solid', 'pattern']
    const dashes = ['draw', 'solid', 'dashed', 'dotted']
    const sizes = ['s', 'm', 'l', 'xl']

    // Handlers
    const handleStyleChange = (style: any, value: string) => {
        editor.setStyleForSelectedShapes(style, value)
    }

    return (
        <div className="custom-style-panel" style={{
            position: 'absolute',
            top: 60, // Below the top bar
            right: 12,
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 400,
            width: '200px',
            pointerEvents: 'auto'
        }}>
            {/* Color Picker */}
            <div className="style-section">
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RiPaletteLine size={14} /> Color
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                    {colors.map(color => (
                        <button
                            key={color}
                            onPointerDown={(e) => {
                                e.preventDefault() // Prevent focus theft
                                handleStyleChange(DefaultColorStyle, color)
                            }}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: `var(--color-${color})`, // Tldraw CSS variables
                                border: `1px solid ${getCommonStyle(DefaultColorStyle) === color ? '#2196f3' : 'rgba(0,0,0,0.1)'}`,
                                cursor: 'pointer',
                                padding: 0,
                                boxShadow: getCommonStyle(DefaultColorStyle) === color ? '0 0 0 2px rgba(33, 150, 243, 0.3)' : 'none',
                                transition: 'all 0.2s'
                            }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Fill Picker */}
            <div className="style-section">
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RiPaintFill size={14} /> Fill
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {fills.map(fill => (
                        <button
                            key={fill}
                            onPointerDown={(e) => {
                                e.preventDefault()
                                handleStyleChange(DefaultFillStyle, fill)
                            }}
                            style={{
                                flex: 1,
                                height: 24,
                                border: `1px solid ${getCommonStyle(DefaultFillStyle) === fill ? '#2196f3' : '#ddd'}`,
                                borderRadius: 4,
                                fontSize: 10,
                                background: getCommonStyle(DefaultFillStyle) === fill ? '#e3f2fd' : '#f5f5f5',
                                color: getCommonStyle(DefaultFillStyle) === fill ? '#2196f3' : '#333',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {fill}
                        </button>
                    ))}
                </div>
            </div>

             {/* Size Picker */}
             <div className="style-section">
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RiRulerLine size={14} /> Size
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {sizes.map(size => (
                        <button
                            key={size}
                            onPointerDown={(e) => {
                                e.preventDefault()
                                handleStyleChange(DefaultSizeStyle, size)
                            }}
                            style={{
                                flex: 1,
                                height: 24,
                                border: `1px solid ${getCommonStyle(DefaultSizeStyle) === size ? '#2196f3' : '#ddd'}`,
                                borderRadius: 4,
                                fontSize: 10,
                                background: getCommonStyle(DefaultSizeStyle) === size ? '#e3f2fd' : '#f5f5f5',
                                color: getCommonStyle(DefaultSizeStyle) === size ? '#2196f3' : '#333',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dash Picker */}
            <div className="style-section">
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RiDashboardLine size={14} /> Dash
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {dashes.map(dash => (
                        <button
                            key={dash}
                            onPointerDown={(e) => {
                                e.preventDefault()
                                handleStyleChange(DefaultDashStyle, dash)
                            }}
                            style={{
                                flex: 1,
                                height: 24,
                                border: `1px solid ${getCommonStyle(DefaultDashStyle) === dash ? '#2196f3' : '#ddd'}`,
                                borderRadius: 4,
                                fontSize: 10,
                                background: getCommonStyle(DefaultDashStyle) === dash ? '#e3f2fd' : '#f5f5f5',
                                color: getCommonStyle(DefaultDashStyle) === dash ? '#2196f3' : '#333',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {dash}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
})
