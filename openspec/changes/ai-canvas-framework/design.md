# 设计方案：AI Canvas 框架

## 架构概览
本应用是一个基于 `tldraw` SDK 构建的客户端 React 应用。
我们将采用分层架构，将 UI（画布层）与 业务逻辑（生成服务层）解耦。

```mermaid
graph TD
    User[用户] -->|交互| Canvas[画布 UI (tldraw)]
    Canvas -->|触发| AITool[AI 工具组件]
    AITool -->|调用| Service[生成服务接口]
    
    subgraph Services
    MockService[Mock 服务]
    RealService[真实 API 服务 (未来)]
    end
    
    Service -->|使用| MockService
    Service -.->|未来| RealService
    
    MockService -->|返回| ImageAsset[图片资源]
    ImageAsset -->|更新| Canvas
```

## 核心组件

### 1. 画布模块 (Canvas Module)
- **技术栈**: `tldraw` SDK。
- **职责**: 渲染无限画布，处理手势操作，管理场景图 (Scene Graph)。
- **自定义项**:
    - `AIFrameShape`: 一个自定义形状，代表 "生成区域"。
    - `AIPanel`: 悬浮面板，用于输入 Prompt 提示词和设置参数。

### 2. 生成服务层 (Generation Service Layer)
我们将定义严格的图像生成接口，确保 Mock 实现和未来真实 API 实现与 UI 的耦合度降到最低。

```typescript
// 接口定义
export interface GenerationRequest {
  prompt: string;
  width: number;
  height: number;
  seed?: number;
  negativePrompt?: string;
}

export interface GenerationResponse {
  id: string;
  url: string; // Blob URL 或 远程 URL
  status: 'pending' | 'success' | 'failed';
  metadata?: any;
}

export interface IGenerationService {
  generate(req: GenerationRequest): Promise<GenerationResponse>;
}
```

### 3. Mock 实现策略
`MockGenerationService` 将负责：
- 接收任意 prompt 输入。
- 模拟网络延迟 (例如 2-5 秒)。
- 返回预设或程序生成的占位图 (例如使用 `picsum.photos` 或带有文字覆盖的本地占位符)。
- 验证 UI 中的 "Loading" 状态处理是否正常。

## 数据流 (Data Flow)
1. **初始化**: 用户创建一个 "AI Frame" 或选择一个区域。
2. **输入**: 用户在关联的 UI 面板中输入提示词。
3. **请求**: 调用 `generate()`，传入尺寸和提示词。
4. **加载中**: Shape 更新状态为 `generating`，显示加载动画/骨架屏。
5. **响应**: 服务返回图片 URL。
6. **更新**: Shape 更新状态为 `complete` 并渲染图片。

## 未来扩展性 (Extensibility)
- **重绘 (Inpainting)**: 接口可扩展以接受 `mask` 或 `baseImage`。
- **流式传输**: 未来更新可能支持 `onProgress` 回调以显示扩散步骤。
- **历史记录**: `GenerationResponse` 包含 `id` 以追踪生成历史。
