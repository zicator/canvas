# 任务列表：AI Canvas 集成

## Phase 1: 基础架构与 Mock 实现

- [x] **项目初始化** <!-- id: 0 -->
    - 使用 Vite 初始化新的 React 应用 (或集成到现有项目)。
    - 安装 `tldraw` 及其依赖。
    - 配置基础布局。
- [x] **画布集成** <!-- id: 1 -->
    - 挂载 `Tldraw` 组件。
    - 配置特定的画布设置 (如需禁用无关工具)。
- [x] **架构实现** <!-- id: 2 -->
    - 创建 `services/GenerationService.ts` 接口定义。
    - 实现 `services/MockGenerationService.ts`，包含显式延迟逻辑。
- [x] **自定义形状: AI Frame** <!-- id: 3 -->
    - 利用 `Tldraw` shape API 定义 `AIFrame` 自定义形状。
    - 创建形状的渲染组件 (实现 空闲/加载中/结果 三种状态)。
- [x] **UI 控制** <!-- id: 4 -->
    - 实现悬浮面板或右键菜单以触发生成操作。
    - 将 UI 事件连接到 `GenerationService`。
- [x] **端到端验证 (E2E Verification)** <!-- id: 5 -->
    - 验证用户可以创建 Frame。
    - 验证输入 Prompt 能触发 Mock 服务。
    - 验证 "Loading" 状态可见。
    - 验证 "结果" 图片正确显示在画布上。
