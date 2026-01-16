# Project Context

## Purpose
Particle Life 是一个基于 WebGL 的高性能粒子涌现模拟器。
通过简单的颜色间吸引/排斥规则，让数万粒子自发形成复杂的结构和行为。
这是一个探索"涌现"现象的可视化工具，也是一个 Data-Oriented Design 的实践项目。

## Tech Stack
- **语言**: TypeScript (Strict Mode)
- **构建**: Vite 7.x
- **渲染**: WebGL2 (gl.POINTS)
- **UI**: 纯 DOM (无框架依赖)
- **目标平台**: 现代浏览器 (Chrome/Safari/Firefox)

## Project Conventions

### Code Style
- **命名**: camelCase for variables/functions, PascalCase for classes/types
- **常量**: UPPER_SNAKE_CASE (e.g., `PARAMS`, `FORCE_MATRIX`)
- **文件**: lowercase with dashes (e.g., `simulation.ts`, `ui.ts`)
- **缩进**: 4 spaces
- **空行**: 函数间一个空行，逻辑块间可加空行

### Architecture Patterns
- **Data-Oriented Design**: 使用 Structure of Arrays (SoA) 而非 Array of Structures
- **预分配**: 所有大数组在构造时分配，运行时零分配
- **单一数据源**: 所有参数集中在 `params.ts`
- **无框架 UI**: 直接 DOM 操作，最小化抽象层

### Testing Strategy
- **性能基准**: 50k 粒子 ≥ 28 FPS (M1 Mac)
- **手动验证**: 预设功能通过视觉确认
- **边界测试**: 参数滑块极值不导致崩溃

### Git Workflow
- **Branching**: main (直接推送，小项目)
- **Commits**: 中文 + Emoji，简短描述
- **变更管理**: OpenSpec 提案系统

## Domain Context

### Particle Life 规则
- 世界中有 N 种颜色的粒子 (默认 6 种)
- 每对颜色之间定义一个力值 F[i][j]
  - F > 0: 颜色 i 的粒子被颜色 j 吸引
  - F < 0: 颜色 i 的粒子被颜色 j 排斥
- 力随距离衰减: f = F * (1 - dist / R_MAX)
- 短程排斥: 防止粒子塌缩成一个点

### 典型涌现模式
- **贪吃蛇**: 颜色链条追逐
- **星系**: 同色聚集成团
- **膜结构**: 细胞状边界

## Important Constraints
- **零运行时分配**: 主循环内禁止 `new Array/TypedArray`
- **60fps 目标**: 任何改动需验证性能影响
- **浏览器兼容**: 必须支持 WebGL2

## External Dependencies
- 无外部运行时依赖
- 开发依赖: Vite, TypeScript
