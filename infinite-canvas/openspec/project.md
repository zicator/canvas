# 项目背景 (Project Context)

## 目标 (Purpose)
**集成 AI Agent 的无限画布 (Infinite Canvas with AI Agent)**
构建一个深度集成 AI 能力的现代化无限画布应用。核心目标是提供无缝的“共创 (Co-Creation)”体验，用户可以与 AI Agent 交互，直接在画布上生成、修改和组织内容。该应用模仿标准白板工具（如 Tldraw/Miro）的核心功能，但拥有完全自定义的用户界面和专门的 AI 工作流。

## 技术栈 (Tech Stack)
- **框架**: React 19
- **语言**: TypeScript 5.9
- **构建工具**: Vite 5.4
- **画布引擎**: Tldraw SDK 4.2.3 (Headless Mode / 无头模式)
- **状态管理**: 
  - **应用状态**: Zustand 5.0 (UI 可见性, 聊天记录, 生成设置)
  - **画布状态**: Tldraw Editor / Store (形状, 镜头, 选择)
- **样式**: CSS Modules / Standard CSS (保持整洁, 不使用 styled-components 等 CSS-in-JS 库), `clsx` 用于类名组合。
- **工具库**: `nanoid` 用于 ID 生成。

## 项目规范 (Project Conventions)

### 代码风格 (Code Style)
- **组件**: 使用 Hooks 的函数式组件。
- **响应式 (Reactivity)**: 
  - 对于需要响应画布变化（选择、缩放等）的组件，使用 `tldraw` 的 `track`。
  - 对于全局应用状态，使用 `useAppStore`。
- **命名**: 组件使用 PascalCase，函数/变量使用 camelCase。
- **文件结构**: 在 `src/components/` 下按功能分组 (例如 `Toolbar`, `Sidebar`, `Input`)。

### 架构模式 (Architecture Patterns)
**"Headless Canvas" / 自定义 UI 架构**
- **原则**: 我们**不**使用原生的 Tldraw UI (`<Tldraw hideUi={true} />`)。
- **实现**:
  - 我们构建 100% 自定义的 UI 覆盖层 (工具栏, 侧边栏, 面板)。
  - 我们使用 `useEditor` hook 以编程方式控制画布。
  - 我们使用 `track` 使自定义 UI 对画布状态做出响应。
- **核心组件**:
  - `MainLayout`: 编排 `Tldraw` 实例和覆盖层组件。
  - `CustomToolbar`: 垂直工具栏 (左侧)，替代原生工具。
  - `CustomExtras`: 左上角固定控制栏 (撤销, 重做, 删除)。
  - `CustomStylePanel`: 上下文感知的属性面板 (右侧)，用于选中的形状。
  - `SystemDebugDrawer`: 用于调试系统参数（如自动布局阈值）的抽屉面板。
  - `AgentSidebar`: 右侧可折叠面板，用于 AI 聊天交互。
  - `UnifiedInput`: 一个共享的输入组件，在底部栏和侧边栏之间转换。

### 数据流 (Data Flow)
1. **用户操作**: 点击自定义按钮 -> 调用 `editor.method()` (例如 `editor.createShape()`)。
2. **画布更新**: Tldraw Store 更新 -> `track` 包装器检测到变化 -> 组件重新渲染。
3. **AI 生成**:
   - 用户输入提示词 -> `MockGenerationService` (模拟异步)。
   - 创建临时的 "Generating" (生成中) 形状 -> 服务返回 URL -> 形状更新为 "Success" (成功)。

### Git 工作流 (Git Workflow)
- 基于任务的功能分支。
- 提交应是原子性的且描述清晰。

## 领域背景 (Domain Context)

### 核心对象 (Core Objects)
- **画板 (Board)**:
  - 基础布局单元，对应 Tldraw 的 frame。
  - **内边距 (Padding)**: 188px (画板边缘到内部图片的距离)。
  - **内容间距 (Inner Gap)**: 32px (画板内部图片与图片之间的间距)。
- **产物 (Image/Asset)**:
  - **产物展示**: 所有通过输入框生成的产物，无论数量是 1 张还是4 张，都需要包在一个画板中。
  - 基于真实物理分辨率 (2K基准)，4K 为 2K 的两倍。
  - **16:9 (宽屏)**: 2560 x 1440 px
  - **4:3 (横屏)**: 2304 x 1728 px
  - **3:2**: 2400 x 1600 px
  - **1:1 (方图)**: 2048 x 2048 px
  - **2:3**: 1600 x 2400 px
  - **3:4 (平板)**: 1728 x 2304 px
  - **9:16 (竖屏)**: 1440 x 2560 px

### 自动布局策略 (Auto-Layout Strategy)
当生成新内容时，系统遵循以下规则：

#### 1. 布局间距 (Spacing)
- **画板与画板 (横向)**: 480px
- **行与行 (纵向)**: 800px (新行顶部 距离 上一行最底部)

#### 2. 默认排列 (Default Placement)
- **锚点**: 寻找当前画布中最后一个操作或生成的画板。
- **位置**: 尝试将新画板放置在锚点画板的**右侧**。
- **对齐**: 与当前“视觉行”保持垂直居中对齐。

#### 3. 智能换行 (Smart Wrapping)
- **虚拟判定框**:
  - **阈值**: 10000px (当前行最大允许宽度)。
  - **判定**: (当前连续组总宽度 + 新画板宽度) > 10000px 则触发换行。
- **换行后位置**:
  - **X 轴**: 回归画布起始左对齐线 (Center Offset)。
  - **Y 轴**: 上一行最底边缘 + 800px。

#### 4. 动态行归属 (Row Affinity)
- **判定标准**: 基于几何位置的有效重叠率。
- **公式**: 得分 = 垂直重叠高度 / min(当前画板高度, 目标行高度)。
- **规则**:
  - 得分 > 0.6: 视为属于该行。
  - 得分 > 0.7: 强制包含 (忽略中心对齐偏差)。
  - 优先归属于垂直中心距离最近的行。

### 交互行为 (Interaction Behavior)
- **生成跟随 (Viewport Follow)**:
  1. **完全可见且大图**: 若产物完全在视口内且长边 > 240px，**视口不动**。
  2. **完全可见但过小**: 若产物完全在视口内且长边 < 240px，以产物为中心缩放至长边为 240px。
  3. **超出视口**: 计算【原视口+新产物】的包围盒，增量 fit 至安全视口内。

## 重要约束 (Important Constraints)
- **禁止原生 UI Hack**: 不要尝试覆盖 Tldraw 内部 CSS 类 (`.tlui-*`)。始终使用公共 API 和自定义组件。
- **响应式**: UI 必须适应不同的屏幕尺寸，针对移动设备有特定行为（例如隐藏侧边栏）。
- **性能**: 谨慎使用 `track`，避免整个 UI 树不必要的重新渲染。

## 外部依赖 (External Dependencies)
- **Tldraw SDK**: 核心引擎。
- **Node Modules**: 标准 npm 生态系统。
