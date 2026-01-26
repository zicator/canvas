import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store'
import { RiAspectRatioLine, RiHdLine, RiSparkling2Line, RiArrowDownSLine, RiImage2Line, RiVideoLine } from '@remixicon/react'
import { ASSET_RESOLUTIONS } from '../../utils/layoutConstants'

interface UnifiedInputProps {
    mode: 'bottom' | 'sidebar'
    onSubmit: () => void
}

/**
 * Polaris-style Custom Select Component
 */
const PolarisSelect = ({ 
    icon: Icon, 
    label, 
    value, 
    options, 
    onChange,
    minWidth = 100
}: {
    icon: any,
    label?: string,
    value: any,
    options: { label: string, value: any, icon?: any }[],
    onChange: (val: any) => void,
    minWidth?: number
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(o => o.value === value)

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 8px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#1e293b',
                        minWidth,
                        outline: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isOpen ? '0 0 0 2px rgba(15, 23, 42, 0.1)' : 'none',
                        borderColor: isOpen ? '#cbd5e1' : '#e2e8f0'
                    }}
                onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.backgroundColor = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'
                }}
            >
                <Icon size={16} color="#64748b" />
                <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label || selectedOption?.label}
                </span>
                <RiArrowDownSLine size={16} color="#64748b" />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 4px)',
                    top: 'auto',
                    left: 0,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e2e8f0',
                    padding: 4,
                    zIndex: 1000,
                    minWidth: Math.max(minWidth, 180),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {options.map((opt) => (
                        <button
                            key={String(opt.value)}
                            onClick={() => {
                                onChange(opt.value)
                                setIsOpen(false)
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                border: 'none',
                                backgroundColor: value === opt.value ? '#f1f5f9' : 'transparent',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 13,
                                color: value === opt.value ? '#0f172a' : '#334155',
                                textAlign: 'left',
                                width: '100%',
                                fontWeight: value === opt.value ? 500 : 400
                            }}
                            onMouseEnter={(e) => {
                                if (value !== opt.value) e.currentTarget.style.backgroundColor = '#f8fafc'
                            }}
                            onMouseLeave={(e) => {
                                if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                        >
                            {opt.icon && <opt.icon size={16} />}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export const UnifiedInput = ({ mode, onSubmit }: UnifiedInputProps) => {
    const { prompt, setPrompt, settings, setSettings } = useAppStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [, setIsFocused] = useState(false)

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

    // Handle Type/Count Change
    const handleTypeChange = (value: string) => {
        if (value === 'image_4') {
            setSettings({ type: 'image', count: 4 })
        } else if (value === 'video_1') {
            setSettings({ type: 'video', count: 1 })
        }
    }

    // Construct current type value for select
    const currentTypeValue = settings.type === 'video' ? 'video_1' : 'image_4'

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: mode === 'bottom' ? 640 : '100%',
            backgroundColor: 'white',
            borderRadius: 16,
            // Modern soft shadow
            boxShadow: mode === 'bottom' 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
                : 'none',
            border: '1px solid #e2e8f0',
            padding: 16,
            transition: 'all 0.3s ease'
        }}>
            
            <div style={{ 
                width: '100%', 
                position: 'relative',
                border: 'none',
                borderRadius: 8,
                padding: '4px 8px',
                transition: 'border-color 0.2s',
            }}>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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
                        color: '#0f172a',
                        fontFamily: 'inherit',
                        fontWeight: 400
                    }}
                    rows={1}
                />
            </div>

            {/* Bottom Controls */}
            <div style={{ 
                display: 'flex', 
                gap: 8,
                alignItems: 'center',
                marginTop: 0,
                flexWrap: 'wrap'
            }}>
                {/* Generation Type & Count - MOVED TO FIRST POSITION */}
                <PolarisSelect
                    icon={settings.type === 'video' ? RiVideoLine : RiImage2Line}
                    value={currentTypeValue}
                    options={[
                        { label: '图片生成 4 images', value: 'image_4', icon: RiImage2Line },
                        { label: '视频生成 1 video', value: 'video_1', icon: RiVideoLine }
                    ]}
                    onChange={handleTypeChange}
                    minWidth={140}
                />

                {/* Aspect Ratio */}
                <PolarisSelect
                    icon={RiAspectRatioLine}
                    value={settings.aspectRatio}
                    options={Object.entries(ASSET_RESOLUTIONS).map(([key, config]) => ({
                        label: config.label,
                        value: key
                    }))}
                    onChange={(val) => setSettings({ aspectRatio: val })}
                    minWidth={100}
                />

                {/* Resolution */}
                <PolarisSelect
                    icon={RiHdLine}
                    value={settings.resolution}
                    options={[
                        { label: '2K', value: '2k' },
                        { label: '4K', value: '4k' }
                    ]}
                    onChange={(val) => setSettings({ resolution: val })}
                    minWidth={100}
                />

                <div style={{ flex: 1 }} />

                <button
                    onClick={onSubmit}
                    style={{
                        backgroundColor: '#0f172a', 
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        height: 32,
                        padding: '0 16px',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e293b'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0f172a'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <RiSparkling2Line size={16} />
                    Generate
                </button>
            </div>
        </div>
    )
}
