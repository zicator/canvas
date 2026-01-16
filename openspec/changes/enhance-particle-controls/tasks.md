# 任务列表 (Tasks)

## 已完成任务 ✅

- [x] **Perf-1**: 消除 `sortParticles()` 中每帧的内存分配 <!-- id: fix-alloc -->
  - 将 `particleCellIds` 移至类成员预分配
  - 性能提升约 100% (14fps → 28fps)

- [x] **Perf-2**: 调优默认参数以平衡性能和效果 <!-- id: tune-defaults -->
  - 默认粒子数从 100k 降至 50k
  - 调整网格大小、交互半径等参数

- [x] **UI-1**: 创建控制面板基础结构 <!-- id: ui-panel -->
  - 玻璃态设计风格
  - 可折叠面板
  - 粘性头部
  - 自定义滚动条

- [x] **UI-2**: 实现暂停/继续功能 <!-- id: pause-control -->
  - 面板头部暂停按钮 (⏸/▶)
  - 空格键快捷键
  - FPS 显示暂停状态

- [x] **UI-3**: 实现参数滑块控制 <!-- id: param-sliders -->
  - 粒子数量 (10k-100k)
  - 阻力 (0.85-0.98)
  - 力量强度 (2-20)
  - 交互半径 (0.015-0.04)
  - 短程排斥 (0-0.8)

- [x] **UI-4**: 实现颜色选择器 <!-- id: color-picker -->
  - 6个颜色输入框
  - 实时更新调色板
  - 矩阵显示同步更新

- [x] **UI-5**: 实现力矩阵可视化编辑器 <!-- id: matrix-editor -->
  - 6×6 按钮矩阵
  - 点击循环 (排斥→中性→吸引)
  - 滚轮微调 ±0.1
  - 颜色/边框反映数值

- [x] **Preset-1**: 实现力矩阵预设系统 <!-- id: force-presets -->
  - 8种预设：随机、贪吃蛇、星系、族群、捕食者、共生、混沌、膜结构
  - 预设按钮带图标和描述
  - 点击应用 + 高亮激活状态

- [x] **Preset-2**: 实现初始布局预设系统 <!-- id: layout-presets -->
  - 6种布局：随机、环形、色块、中心、网格、螺旋
  - Simulation 类新增 `initWithLayout(index)` 方法
  - 每种布局有独特的颜色分配逻辑

- [x] **Physics-1**: 实现短程排斥力 <!-- id: short-repulsion -->
  - 新增 `REPULSION_STRENGTH` 和 `REPULSION_RADIUS` 参数
  - 在 `computeForces()` 中添加排斥力计算
  - 防止粒子塌缩成一个点

- [x] **Refactor-1**: 重构参数导出结构 <!-- id: refactor-params -->
  - 导出 `COLOR_PALETTE` 供 UI 和 Renderer 共享
  - 导出 `FORCE_PRESETS` 和 `LAYOUT_PRESETS`
  - 添加 `randomizeForces()` 函数

- [x] **Refactor-2**: 优化渲染器调色板使用 <!-- id: refactor-renderer -->
  - 从 `params.ts` 导入 `COLOR_PALETTE`
  - 移除 Renderer 内部的调色板副本
  - UI 颜色变更实时生效

## 验收标准

### 性能
- [x] 50k 粒子下 FPS ≥ 28
- [x] 无可见的 GC 停顿
- [x] 参数调整实时生效无卡顿

### 功能
- [x] 暂停按钮和空格键均可控制暂停
- [x] 所有 8 种力矩阵预设可正常应用
- [x] 所有 6 种初始布局可正常生成
- [x] 短程排斥力可通过滑块调节
- [x] 颜色修改后矩阵显示同步更新

### UI/UX
- [x] 面板可折叠
- [x] 滑块值实时显示
- [x] 预设按钮有图标和激活状态
- [x] 矩阵单元格有颜色和数值提示
