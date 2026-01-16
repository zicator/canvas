import { useAppStore } from '../../store'
import { ChatList } from './ChatList'
import { UnifiedInput } from '../Input/UnifiedInput'
import { RiCloseLine } from '@remixicon/react'

interface AgentSidebarProps {
    onGenerate: () => void
}

export const AgentSidebar = ({ onGenerate }: AgentSidebarProps) => {
    const { isSidebarOpen, toggleSidebar } = useAppStore()

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: 320,
                backgroundColor: 'white',
                borderLeft: '1px solid #e2e8f0',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.05)',
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 400,
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto'
            }}
        >
            {/* Header */}
            <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>
                    Agent Context
                </div>
                <button
                    onClick={toggleSidebar}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#64748b', 
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <RiCloseLine size={20} />
                </button>
            </div>

            {/* Chat History */}
            <ChatList />

            {/* Input Area (in sidebar) */}
            <div style={{ padding: 16, borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <UnifiedInput mode="sidebar" onSubmit={onGenerate} />
            </div>
        </div>
    )
}
