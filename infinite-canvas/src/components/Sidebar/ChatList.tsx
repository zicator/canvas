import { useAppStore } from '../../store'

export const ChatList = () => {
    const chatHistory = useAppStore(state => state.chatHistory)

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chatHistory.map((msg) => (
                <div
                    key={msg.id}
                    style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }}
                >
                    <div style={{
                        backgroundColor: msg.role === 'user' ? '#e2e8f0' : 'transparent',
                        padding: msg.role === 'user' ? '8px 12px' : '0 0 8px 0',
                        borderRadius: 12,
                        fontSize: 14,
                        color: '#333',
                        lineHeight: 1.5,
                        borderBottomRightRadius: msg.role === 'user' ? 2 : 12
                    }}>
                        {msg.content}
                    </div>

                    {msg.status === 'generating' && (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#64748b' }}>
                            <div className="spinner" style={{ width: 12, height: 12, border: '2px solid #cbd5e1', borderTopColor: '#64748b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Generative Fill...
                        </div>
                    )}

                    {msg.status === 'success' && msg.imageUrl && (
                        <img
                            src={msg.imageUrl}
                            alt="Generated result"
                            style={{
                                width: '100%',
                                borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                aspectRatio: 'auto'
                            }}
                        />
                    )}

                    {msg.status === 'success' && msg.imageUrls && msg.imageUrls.length > 1 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 4
                        }}>
                            {msg.imageUrls.map((url) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt="Generated result"
                                    style={{
                                        width: '100%',
                                        borderRadius: 4,
                                        border: '1px solid #e2e8f0',
                                        aspectRatio: '1',
                                        objectFit: 'cover'
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {msg.status === 'failed' && (
                        <div style={{ fontSize: 12, color: '#ef4444' }}>
                            Generation failed.
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
