# 设计方案：AI Canvas 完整集成架构

## 上下文

本项目是一个基于 `tldraw` SDK 构建的 AI 图像生成画布应用。经过两个阶段的开发，已经实现了核心功能，包括画布集成、AI Frame 形状、Mock 生成服务、Agent 侧边栏和统一输入系统。

本文档整合了两个阶段的架构设计，提供一个统一的技术视角。

## 目标与非目标

### 目标
- 提供清晰的架构设计文档，整合两个阶段的成果
- 说明各模块的职责和交互关系
- 为未来扩展提供设计指导

### 非目标
- 不涉及新的功能开发
- 不改变现有架构（仅文档化）
- 不涉及真实 AI API 集成（后续阶段）

## 架构设计

### 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                     表现层 (Presentation Layer)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ LeftToolbar  │  │   Canvas     │  │AgentSidebar  │      │
│  │              │  │  (tldraw)    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                │                    │            │
│         └────────────────┼────────────────────┘            │
│                          │                                  │
│                  ┌──────────────┐                          │
│                  │  MainLayout  │                          │
│                  │  (协调层)    │                          │
│                  └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   状态管理层 (State Layer)                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Zustand Store (store.ts)                 │     │
│  │                                                    │     │
│  │  - UI State: isSidebarOpen                        │     │
│  │  - Agent State: prompt, settings                  │     │
│  │  - Chat History: chatHistory[]                    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    服务层 (Service Layer)                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │         IGenerationService (接口)                  │     │
│  │                                                    │     │
│  │  generate(req: GenerationRequest):                │     │
│  │    Promise<GenerationResponse>                    │     │
│  └────────────────────────────────────────────────────┘     │
│                          │                                   │
│        ┌──────────────────┴──────────────────┐               │
│        ▼                                    ▼               │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │   Mock       │                    │   Real API    │      │
│  │  Service     │                    │   Service     │      │
│  │  (当前)      │                    │   (未来)      │      │
│  └──────────────┘                    └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 核心模块说明

#### 1. 画布模块 (Canvas Module)

**职责**：
- 渲染无限画布
- 处理用户交互（选择、拖拽、缩放等）
- 管理画布上的所有形状

**关键组件**：
- `Tldraw` 组件：tldraw SDK 的主组件
- `AIFrameShapeUtil`：自定义 AI Frame 形状的工具类
- `AIFrameShape`：AI Frame 的类型定义

**状态管理**：
- AI Frame 的状态存储在 shape 的 props 中
- 状态包括：`empty`, `generating`, `success`, `failed`
- 图片 URL 存储在 `imageUrl` 属性中

**设计决策**：
- 使用 tldraw 的自定义形状机制，而非覆盖层
- 状态与画布数据绑定，确保持久化
- 支持画布的标准操作（选择、移动、调整大小）

#### 2. UI 布局模块 (Layout Module)

**职责**：
- 协调所有 UI 组件的布局
- 管理组件间的交互
- 处理用户输入和生成流程

**关键组件**：
- `MainLayout`：主布局容器，协调所有子组件
- `LeftToolbar`：左侧工具栏（待完善）
- `AgentSidebar`：右侧 Agent 交互面板
- `UnifiedInput`：统一输入组件

**布局策略**：
- 使用绝对定位，确保组件不干扰画布
- 侧边栏使用 transform 实现滑入/滑出动画
- 底部输入框居中定位，响应式宽度

**设计决策**：
- 侧边栏打开时隐藏底部输入框，避免重复
- 使用条件渲染而非 CSS 隐藏，减少 DOM 节点
- 输入状态通过 Zustand store 共享，确保同步

#### 3. 状态管理模块 (State Management)

**职责**：
- 管理全局应用状态
- 提供状态更新方法
- 确保状态一致性

**状态结构**：
```typescript
interface AppState {
  // UI 状态
  isSidebarOpen: boolean;
  
  // Agent 状态
  prompt: string;
  settings: {
    aspectRatio: '1:1' | '16:9' | '4:3';
    resolution: '2k' | '4k';
  };
  
  // 聊天历史
  chatHistory: ChatMessage[];
}
```

**设计决策**：
- 使用 Zustand 而非 Redux，简化状态管理
- 状态集中管理，避免 prop drilling
- 支持细粒度更新（如 `updateMessage`）

#### 4. 服务层 (Service Layer)

**职责**：
- 定义生成服务的标准接口
- 实现 Mock 服务用于开发和测试
- 为未来真实 API 集成提供抽象

**接口设计**：
```typescript
interface IGenerationService {
  generate(req: GenerationRequest): Promise<GenerationResponse>;
}

interface GenerationRequest {
  prompt: string;
  width: number;
  height: number;
  seed?: number;
  negativePrompt?: string; // 未来扩展
}

interface GenerationResponse {
  id: string;
  url: string;
  status: 'pending' | 'success' | 'failed';
  metadata?: any;
}
```

**设计决策**：
- 使用接口抽象，便于替换实现
- Mock 服务模拟真实延迟，验证 UI 响应
- 响应包含唯一 ID，支持追踪和历史管理

### 数据流设计

#### 生成流程数据流

```
1. 用户输入
   UnifiedInput (prompt + settings)
   ↓
   MainLayout.handleGenerate()
   
2. 状态更新
   - 清空输入框 (setPrompt(''))
   - 打开侧边栏 (setSidebarOpen(true))
   - 添加用户消息 (addMessage(userMsg))
   - 添加助手消息 (addMessage(assistantMsg, 'generating'))
   
3. 画布更新
   editor.createShape({
     type: 'ai-frame',
     props: { status: 'generating', ... }
   })
   
4. 服务调用
   MockGenerationService.generate(request)
   ↓
   模拟延迟 (2-5秒)
   ↓
   返回响应 { url, status: 'success' }
   
5. 状态同步
   - 更新助手消息 (updateMessage(assistantMsgId, { imageUrl, status: 'success' }))
   - 更新画布形状 (editor.updateShape({ props: { imageUrl, status: 'success' } }))
```

#### 错误处理流程

```
生成失败
↓
catch 错误
↓
更新助手消息 (status: 'failed')
↓
更新画布形状 (status: 'failed')
↓
显示错误提示
```

### 组件交互图

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     输入提示词
│UnifiedInput │ ──────────────────┐
└──────┬──────┘                    │
       │                           │
       │ onSubmit                  │
       ▼                           │
┌─────────────┐                    │
│ MainLayout  │                    │
│             │                    │
│ handleGenerate()                 │
│   ├─► Store (addMessage)         │
│   ├─► Editor (createShape)       │
│   └─► Service (generate) ────────┘
└──────┬──────┘                    │
       │                           │
       ├───────────────────────────┘
       │
       ▼
┌─────────────┐
│MockService  │
│  generate() │
└──────┬──────┘
       │
       │ 返回结果
       ▼
┌─────────────┐
│ MainLayout  │
│             │
│ 更新 Store  │ ──► ChatList 显示
│ 更新 Editor │ ──► Canvas 显示
└─────────────┘
```

## 技术决策

### 1. 为什么选择 tldraw？

**决策**：使用 tldraw SDK 而非自研画布

**理由**：
- tldraw 提供了成熟的无限画布能力
- 支持自定义形状，满足 AI Frame 需求
- 活跃的社区和良好的文档
- 减少开发时间和维护成本

**替代方案**：自研画布（被拒绝，开发成本过高）

### 2. 为什么使用 Zustand 而非 Redux？

**决策**：使用 Zustand 进行状态管理

**理由**：
- 更简单的 API，学习成本低
- 更少的样板代码
- 性能良好，支持细粒度更新
- 适合中小型应用

**替代方案**：Redux（被拒绝，过于复杂）、Context API（被拒绝，性能问题）

### 3. 为什么使用接口抽象服务层？

**决策**：定义 `IGenerationService` 接口

**理由**：
- 便于替换实现（Mock → Real API）
- 便于测试（可以 mock 服务）
- 清晰的契约定义
- 支持未来扩展（流式传输、进度回调等）

### 4. 为什么统一输入组件支持两种模式？

**决策**：`UnifiedInput` 支持 `bottom` 和 `sidebar` 两种模式

**理由**：
- 减少代码重复
- 确保行为一致性
- 简化状态管理（共享 prompt 状态）
- 更好的用户体验（无缝切换）

**替代方案**：两个独立组件（被拒绝，维护成本高）

## 风险与缓解

### 风险 1：状态同步复杂性

**风险**：画布状态和侧边栏状态可能不同步

**缓解措施**：
- 使用统一的生成流程（`handleGenerate`）
- 在更新前检查形状是否存在（`editor.getShape()`）
- 使用事务性更新（先更新 store，再更新 editor）

### 风险 2：性能问题

**风险**：大量 AI Frame 可能影响画布性能

**缓解措施**：
- tldraw 内置了性能优化（虚拟化、按需渲染）
- 未来可考虑懒加载图片
- 监控性能指标，必要时优化

### 风险 3：组件缺失

**风险**：`LeftToolbar` 组件被引用但文件不存在

**缓解措施**：
- 立即补充实现
- 添加构建时检查
- 完善组件引用文档

## 扩展性设计

### 未来扩展点

1. **真实 AI API 集成**
   - 实现新的 `RealGenerationService`
   - 替换 `MockGenerationService`
   - 无需修改 UI 代码

2. **流式传输支持**
   - 扩展 `IGenerationService` 接口
   - 添加 `onProgress` 回调
   - UI 显示生成进度

3. **批量生成**
   - 扩展生成请求接口
   - 支持多个 prompt
   - 批量更新画布和侧边栏

4. **图片编辑功能**
   - 扩展 `GenerationRequest` 接口
   - 添加 `baseImage` 和 `mask` 参数
   - 实现重绘（Inpainting）功能

## 总结

本架构设计整合了两个阶段的成果，提供了一个清晰、可扩展的技术方案。核心设计原则包括：

- **分层清晰**：表现层、状态层、服务层职责明确
- **接口抽象**：服务层使用接口，便于替换和测试
- **状态集中**：使用 Zustand 集中管理状态
- **组件复用**：统一输入组件减少重复代码

整体架构为未来扩展打下了良好基础，可以平滑地接入真实 AI API 和添加新功能。
