import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store'
import { RiAspectRatioLine, RiHdLine, RiLayoutGridLine, RiSparkling2Line } from '@remixicon/react'
import { ASSET_RESOLUTIONS } from '../../utils/layoutConstants'

interface UnifiedInputProps {
    mode: 'bottom' | 'sidebar'
    onSubmit: () => void
}

export const UnifiedInput = ({ mode, onSubmit }: UnifiedInputProps) => {
    const { prompt, setPrompt, settings, setSettings } = useAppStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [prompt])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: mode === 'bottom' ? 640 : '100%',
            backgroundColor: 'white',
            borderRadius: 16,
            boxShadow: mode === 'bottom' ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
            border: mode === 'bottom' ? '1px solid #e2e8f0' : '1px solid #e2e8f0',
            padding: 16,
            transition: 'all 0.3s ease'
        }}>
            
            <div style={{ width: '100%', position: 'relative' }}>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to generate..."
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: 15,
                        lineHeight: 1.6,
                        maxHeight: 120,
                        backgroundColor: 'transparent',
                        padding: 0,
                        margin: 0,
                        color: '#1e293b',
                        fontFamily: 'inherit'
                    }}
                    rows={1}
                />
            </div>

            {/* Bottom Controls */}
            <div style={{ 
                display: 'flex', 
                gap: 16, 
                alignItems: 'center',
                marginTop: 4
            }}>
                {/* Aspect Ratio */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <RiAspectRatioLine size={16} color="#64748b" style={{ position: 'absolute', left: 8, pointerEvents: 'none' }} />
                    <select
                        value={settings.aspectRatio}
                        onChange={(e) => setSettings({ aspectRatio: e.target.value as any })}
                        style={{ 
                            appearance: 'none',
                            border: '1px solid #e2e8f0', 
                            background: '#f8fafc', 
                            borderRadius: 6, 
                            padding: '6px 12px 6px 30px', 
                            fontSize: 12, 
                            color: '#475569',
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: 80
                        }}
                    >
                        {Object.entries(ASSET_RESOLUTIONS).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>

                {/* Resolution */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <RiHdLine size={16} color="#64748b" style={{ position: 'absolute', left: 8, pointerEvents: 'none' }} />
                    <select
                        value={settings.resolution}
                        onChange={(e) => setSettings({ resolution: e.target.value as any })}
                        style={{ 
                            appearance: 'none',
                            border: '1px solid #e2e8f0', 
                            background: '#f8fafc', 
                            borderRadius: 6, 
                            padding: '6px 12px 6px 30px', 
                            fontSize: 12, 
                            color: '#475569',
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: 80
                        }}
                    >
                        <option value="2k">2K Res</option>
                        <option value="4k">4K Res</option>
                    </select>
                </div>

                {/* Count */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <RiLayoutGridLine size={16} color="#64748b" style={{ position: 'absolute', left: 8, pointerEvents: 'none' }} />
                    <select
                        value={settings.count}
                        onChange={(e) => setSettings({ count: Number(e.target.value) as any })}
                        style={{ 
                            appearance: 'none',
                            border: '1px solid #e2e8f0', 
                            background: '#f8fafc', 
                            borderRadius: 6, 
                            padding: '6px 12px 6px 30px', 
                            fontSize: 12, 
                            color: '#475569',
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: 80
                        }}
                    >
                        <option value={1}>1 Image</option>
                        <option value={4}>4 Images</option>
                    </select>
                </div>

                <div style={{ flex: 1 }} />

                <button
                    onClick={onSubmit}
                    style={{
                        background: '#1e293b',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        height: 36,
                        padding: '0 16px',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <RiSparkling2Line size={16} />
                    Generate
                </button>
            </div>
        </div>
    )
}
