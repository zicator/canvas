import { useEditor, track } from 'tldraw'
import { RiArrowGoBackLine, RiArrowGoForwardLine, RiDeleteBinLine, RiFileCopyLine, RiMenuLine, RiBugLine } from '@remixicon/react'
import { useAppStore } from '../../store'
import { useState } from 'react'

export const CustomExtras = track(() => {
    const editor = useEditor()
    const { setDebugDrawerOpen } = useAppStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div style={{
            position: 'absolute',
            left: 12,
            top: 12,
            display: 'flex',
            gap: 4,
            padding: 4,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 300,
            border: '1px solid #e2e8f0'
        }}>
            <div style={{ position: 'relative' }}>
                <IconButton 
                    icon={<RiMenuLine size={18} />} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    title="Menu"
                />
                {isMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 4,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        minWidth: 160,
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ padding: '8px 12px', fontSize: 13, color: '#94a3b8' }}>
                            More options coming soon...
                        </div>
                    </div>
                )}
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', margin: '0 4px' }} />
            <IconButton 
                icon={<RiBugLine size={18} />} 
                onClick={() => setDebugDrawerOpen(true)} 
                title="开发者模式"
            />
            <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', margin: '0 4px' }} />
            <IconButton 
                icon={<RiArrowGoBackLine size={18} />} 
                onClick={() => editor.undo()} 
                title="Undo"
            />
            <IconButton 
                icon={<RiArrowGoForwardLine size={18} />} 
                onClick={() => editor.redo()} 
                title="Redo"
            />
            <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', margin: '0 4px' }} />
            <IconButton 
                icon={<RiDeleteBinLine size={18} />} 
                onClick={() => editor.deleteShapes(editor.getSelectedShapeIds())} 
                disabled={editor.getSelectedShapeIds().length === 0}
                title="Delete"
            />
             <IconButton 
                icon={<RiFileCopyLine size={18} />} 
                onClick={() => {
                    const ids = editor.getSelectedShapeIds()
                    if(ids.length > 0) {
                        editor.duplicateShapes(ids)
                    }
                }} 
                disabled={editor.getSelectedShapeIds().length === 0}
                title="Duplicate"
            />
        </div>
    )
})

const IconButton = ({ icon, onClick, disabled, title }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            backgroundColor: 'transparent',
            color: disabled ? '#cbd5e1' : '#4a5568',
            border: 'none',
            borderRadius: 6,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = '#f7fafc')}
        onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
        {icon}
    </button>
)
