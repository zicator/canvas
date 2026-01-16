# AI Canvas - 无限画布 AI 图像生成应用

基于 `tldraw` SDK 构建的 AI 图像生成画布应用，允许用户在无限画布上直接调用 AI 生成图片。

## ✨ 功能特性

- 🎨 **无限画布**：基于 tldraw 的强大画布能力，支持缩放、平移、选择等操作
- 🤖 **AI 图像生成**：通过提示词生成图像，支持多种宽高比和分辨率
- 💬 **Agent 交互**：集成的侧边栏，提供对话式交互和生成历史
- 🎯 **统一输入**：底部浮动输入框和侧边栏输入无缝切换
- 🔄 **状态同步**：画布和侧边栏状态实时同步，确保一致性
- 🎭 **Mock 服务**：内置 Mock 生成服务，便于开发和测试

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

## 📖 使用指南

### 创建 AI Frame

1. **方式一**：点击左侧工具栏的 `+` 按钮，在画布中心创建一个空的 AI Frame
2. **方式二**：在底部输入框或侧边栏输入提示词，点击生成后会自动创建 AI Frame

### 生成图像

1. **输入提示词**：在底部输入框或侧边栏输入框中输入描述
2. **选择设置**：
   - **宽高比**：1:1（正方形）、16:9（横向）、4:3（竖向）
   - **分辨率**：2k（512px）或 4k（1024px）
3. **生成**：点击"Generate"按钮或按 Enter 键
4. **查看结果**：生成完成后，图片会显示在画布上的 AI Frame 中，同时也会出现在侧边栏的聊天历史中

### 工具栏功能

左侧工具栏提供以下工具：
- **↖ Select**：选择工具，用于选择和操作画布上的元素
- **✋ Hand**：手型工具，用于平移画布
- **✏ Draw**：绘制工具，用于在画布上绘制
- **+**：创建新的 AI Frame

### 侧边栏

- **打开/关闭**：点击侧边栏右上角的 `×` 按钮关闭，通过生成操作自动打开
- **聊天历史**：显示所有生成请求和结果的对话历史
- **输入区域**：侧边栏打开时，底部输入框会自动隐藏，使用侧边栏内的输入框

## 🏗️ 项目结构

```
infinite-canvas/
├── src/
│   ├── components/
│   │   ├── Input/
│   │   │   └── UnifiedInput.tsx      # 统一输入组件
│   │   ├── Layout/
│   │   │   └── MainLayout.tsx        # 主布局组件
│   │   ├── Sidebar/
│   │   │   ├── AgentSidebar.tsx      # Agent 侧边栏
│   │   │   └── ChatList.tsx          # 聊天历史列表
│   │   └── Toolbar/
│   │       └── LeftToolbar.tsx      # 左侧工具栏
│   ├── services/
│   │   ├── GenerationService.ts      # 生成服务接口定义
│   │   └── MockGenerationService.ts  # Mock 生成服务实现
│   ├── shapes/
│   │   └── AIFrameShape.tsx          # AI Frame 自定义形状
│   ├── store.ts                       # Zustand 状态管理
│   └── App.tsx                        # 应用入口
├── openspec/
│   └── changes/                       # OpenSpec 变更提案
└── package.json
```

## 🛠️ 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **tldraw v4** - 无限画布 SDK
- **Zustand** - 状态管理
- **nanoid** - ID 生成

## 📋 开发状态

### ✅ 已完成功能

- [x] 基础架构搭建（React + TypeScript + Vite）
- [x] tldraw 集成和自定义形状
- [x] AI Frame 形状（支持 empty/generating/success/failed 状态）
- [x] Mock 生成服务（模拟延迟和占位图片）
- [x] 状态管理（Zustand store）
- [x] Agent 侧边栏（可折叠、聊天历史）
- [x] 统一输入组件（底部/侧边栏双模式）
- [x] 生成流程同步（画布和侧边栏）
- [x] 左侧工具栏（标准工具 + AI Frame 创建）

### 🚧 待完成功能

- [ ] E2E 测试和验证
- [ ] 真实 AI API 集成（Stable Diffusion、Midjourney 等）
- [ ] 图片编辑功能（重绘、变换等）
- [ ] 批量生成
- [ ] 导出和分享功能

## 🔧 开发指南

### 添加新的生成服务

实现 `IGenerationService` 接口：

```typescript
import { IGenerationService, GenerationRequest, GenerationResponse } from './services/GenerationService'

export class RealGenerationService implements IGenerationService {
    async generate(req: GenerationRequest): Promise<GenerationResponse> {
        // 实现真实 API 调用
    }
}
```

然后在 `MainLayout.tsx` 中替换 Mock 服务：

```typescript
// const service = new MockGenerationService()
const service = new RealGenerationService()
```

### 自定义 AI Frame 样式

编辑 `src/shapes/AIFrameShape.tsx` 中的 `component` 方法，修改渲染逻辑和样式。

### 扩展状态管理

在 `src/store.ts` 中添加新的状态和操作：

```typescript
interface AppState {
    // ... 现有状态
    newState: string;
    setNewState: (value: string) => void;
}
```

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📚 相关资源

- [tldraw 文档](https://tldraw.dev)
- [React 文档](https://react.dev)
- [Zustand 文档](https://zustand-demo.pmnd.rs)
