import { useAppStore } from '../../store'
import { RiCloseLine } from '@remixicon/react'
import { useEditor, createShapeId } from 'tldraw'
import { useEffect } from 'react'

export const SystemDebugDrawer = () => {
    const editor = useEditor()
    const { 
        isDebugDrawerOpen, 
        setDebugDrawerOpen,
        debugRowMaxWidth,
        setDebugRowMaxWidth
    } = useAppStore()

    // Visualize the wrap line
    useEffect(() => {
        if (!isDebugDrawerOpen) return

        const id = createShapeId('debug-wrap-line')
        
        // Create or update the line
        // We draw a vertical dashed line at x = debugRowMaxWidth
        // We need to find where "0" is. AutoLayout uses relative to anchor or 0.
        // If we assume the layout starts at x=0 (simplification for debug), we draw at x=debugRowMaxWidth.
        // Or better, just draw it relative to the viewport or a fixed position?
        // AutoLayout logic: `if (currentRowWidth + ... > maxWidth)`. 
        // The wrap happens relative to the "row start".
        // This is hard to visualize globally because it depends on the "current row".
        // But we can show a "Ruler" or just a line indicating the width relative to the screen or a dummy origin?
        // Let's just skip the complex visualization for now to avoid confusion/bugs, 
        // as the "Preview" can be interpreted as "Try generating".
        // BUT, I can show a toast or message.
        
        return () => {
            // Cleanup if we did anything
        }
    }, [isDebugDrawerOpen, debugRowMaxWidth, editor])

    if (!isDebugDrawerOpen) return null

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 320,
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
            zIndex: 400,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #e2e8f0'
        }}>
            {/* Header */}
            <div style={{
                padding: 16,
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>System Debug</h2>
                <button
                    onClick={() => setDebugDrawerOpen(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        color: '#64748b'
                    }}
                >
                    <RiCloseLine size={20} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Auto Layout</h3>
                    
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                            Row Wrap Threshold (px)
                        </label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                type="range"
                                min="2000"
                                max="20000"
                                step="1000"
                                value={debugRowMaxWidth}
                                onChange={(e) => setDebugRowMaxWidth(Number(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                value={debugRowMaxWidth}
                                onChange={(e) => setDebugRowMaxWidth(Number(e.target.value))}
                                style={{
                                    width: 80,
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                    fontSize: 12
                                }}
                            />
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                            Current: {debugRowMaxWidth}px
                        </p>
                    </div>

                    <div style={{ padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
                        Preview Mode: Adjusting the slider will affect the next generation's layout calculation.
                    </div>
                </div>
            </div>
        </div>
    )
}
