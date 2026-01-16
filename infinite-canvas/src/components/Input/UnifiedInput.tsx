import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store'
import { RiAspectRatioLine, RiHdLine, RiSparkling2Line, RiArrowDownSLine, RiImage2Line, RiVideoLine } from '@remixicon/react'
import { ASSET_RESOLUTIONS, RESOLUTION_MULTIPLIER } from '../../utils/layoutConstants'

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
                        padding: '6px 8px 6px 8px',
                        border: '1px solid #E1E3E5',
                        borderRadius: 8, // Polaris standard 8px
                        backgroundColor: isOpen ? '#F6F6F7' : 'transparent',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#202223',
                        minWidth,
                        outline: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isOpen ? '0 0 0 2px #005BD3' : 'none',
                        borderColor: isOpen ? '#005BD3' : '#E1E3E5'
                    }}
                onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.backgroundColor = '#F6F6F7'
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'
                }}
            >
                <Icon size={16} color="#5C5F62" />
                <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label || selectedOption?.label}
                </span>
                <RiArrowDownSLine size={16} color="#5C5F62" />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 4px)',
                    top: 'auto',
                    left: 0,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0,0,0,0.05)',
                    border: '1px solid #E1E3E5',
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
                                backgroundColor: value === opt.value ? '#F1F8F5' : 'transparent', // Light green selection or grey
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 13,
                                color: value === opt.value ? '#008060' : '#202223', // Polaris Green for selected
                                textAlign: 'left',
                                width: '100%',
                                fontWeight: value === opt.value ? 500 : 400
                            }}
                            onMouseEnter={(e) => {
                                if (value !== opt.value) e.currentTarget.style.backgroundColor = '#F6F6F7'
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
    const [isFocused, setIsFocused] = useState(false)

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
            borderRadius: 12, // Slightly larger radius for the main card
            // Polaris Card Shadow
            boxShadow: mode === 'bottom' 
                ? '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)' 
                : 'none',
            border: '1px solid #E1E3E5',
            padding: 12, // Slightly tighter padding
            transition: 'all 0.3s ease'
        }}>
            
            <div style={{ 
                width: '100%', 
                position: 'relative',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
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
                        lineHeight: 1.5,
                        maxHeight: 120,
                        backgroundColor: 'transparent',
                        padding: 0,
                        margin: 0,
                        color: '#202223',
                        fontFamily: 'inherit'
                    }}
                    rows={1}
                />
            </div>

            {/* Bottom Controls */}
            <div style={{ 
                display: 'flex', 
                gap: 8, // Tighter gap
                alignItems: 'center',
                marginTop: 0
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
                        background: '#1e293b', // Keeping dark theme for primary action or use Polaris Green #008060?
                        // User asked for "consistent with reference page". Reference is Polaris.
                        // Polaris Primary Button is #008060 (Green) or Black in some contexts. 
                        // Let's stick to the current dark theme for the button to maintain some brand identity, 
                        // or switch to black/dark grey as per modern Polaris.
                        backgroundColor: '#0f172a', 
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        height: 32, // Smaller, more compact
                        padding: '0 16px',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'} // Darker on hover
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                >
                    <RiSparkling2Line size={16} />
                    Generate
                </button>
            </div>
        </div>
    )
}
