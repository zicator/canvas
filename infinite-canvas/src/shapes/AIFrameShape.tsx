import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import type { TLBaseShape } from 'tldraw'

/**
 * IAIFrameShape - AI Frame 形状类型定义
 * 
 * 自定义的 tldraw 形状，用于在画布上显示 AI 生成的图像
 * 
 * @type {TLBaseShape<'ai-frame', {...}>}
 * @property {number} w - 宽度（像素）
 * @property {number} h - 高度（像素）
 * @property {'empty' | 'generating' | 'success' | 'failed'} status - 生成状态
 * @property {string} [imageUrl] - 生成的图片 URL（成功时）
 * @property {string} [prompt] - 生成时使用的提示词
 */
export type IAIFrameShape = TLBaseShape<
    'ai-frame',
    {
        w: number
        h: number
        status: 'empty' | 'generating' | 'success' | 'failed'
        imageUrl?: string
        prompt?: string
    }
>

/**
 * AIFrameShapeUtil - AI Frame 形状工具类
 * 
 * 继承自 tldraw 的 BaseBoxShapeUtil，实现了自定义形状的渲染逻辑
 * 支持四种状态：空状态、生成中、成功、失败
 */
export class AIFrameShapeUtil extends BaseBoxShapeUtil<IAIFrameShape> {
    static override type = 'ai-frame' as const

    override getDefaultProps(): IAIFrameShape['props'] {
        return {
            w: 400,
            h: 400,
            status: 'empty',
        }
    }

    override component(shape: IAIFrameShape) {
        const { status, imageUrl } = shape.props

        return (
            <HTMLContainer
                style={{
                    border: '1px solid black',
                    backgroundColor: status === 'generating' ? '#f3f4f6' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    pointerEvents: 'all',
                    overflow: 'hidden',
                }}
            >
                {status === 'empty' && (
                    <div style={{ color: '#666' }}>AI Frame (Right-click to generate)</div>
                )}

                {status === 'generating' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div className="spinner" style={{
                            width: 20, height: 20, border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }} />
                        <span>Generating...</span>
                    </div>
                )}

                {status === 'success' && imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Generated"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        draggable={false}
                    />
                )}

                {status === 'failed' && (
                    <div style={{ color: 'red' }}>Generation Failed</div>
                )}

                <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
            </HTMLContainer>
        )
    }

    override indicator(shape: IAIFrameShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }
}
