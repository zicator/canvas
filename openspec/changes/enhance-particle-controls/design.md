# 设计文档 (Design)

## 架构决策

### 1. 性能优化策略

#### 问题分析
原始实现每帧在 `sortParticles()` 中分配 `new Int32Array(100000)`：
```typescript
// ❌ 每帧分配 400KB 内存
const particleCellIds = new Int32Array(this.count);
```

这导致：
- 频繁的 GC (Garbage Collection) 停顿
- 内存碎片化
- FPS 不稳定

#### 解决方案
将临时缓冲区提升为类成员，构造时一次性分配：
```typescript
// ✅ 预分配，重复使用
class Simulation {
    particleCellIds: Int32Array;
    
    constructor() {
        this.particleCellIds = new Int32Array(this.count);
    }
    
    sortParticles() {
        const particleCellIds = this.particleCellIds; // 重用
    }
}
```

**Linus 原则**："Don't allocate in the loop!"

### 2. 短程排斥力物理模型

#### 问题
粒子在纯吸引力作用下会无限靠近，最终塌缩成一个点。

#### 解决方案
添加短程排斥力，形成类似分子间 Lennard-Jones 势的效果：

```
     力
      ^
      |    排斥区     吸引区
      |      ↑          ↓
   +  |     /|\        
      |    / | \       /~~~~
   0  |---/--|--\-----/------> 距离
      |  /   |   \   /
   -  | /    |    \_/
      |/     |
      +------+------------>
         R_rep   R_max
```

实现：
```typescript
if (distSq < repulsionRadiusSq) {
    const repF = repulsionStrength * (1.0 - dist / repulsionRadius);
    fx -= dirX * repF;  // 反方向
    fy -= dirY * repF;
}
```

### 3. UI 架构

#### 设计原则
- **单一数据源**：所有参数存储在 `params.ts` 的 `PARAMS` 对象
- **响应式更新**：UI 直接修改 `PARAMS`，模拟下一帧自动生效
- **无框架依赖**：纯 DOM 操作，最小化运行时开销

#### 组件结构
```
控制面板
├── 面板头部 (暂停按钮 + 折叠按钮)
├── 模拟参数 (滑块组)
├── 颜色配置 (颜色选择器网格)
├── 力矩阵预设 (按钮网格)
├── 力矩阵编辑器 (6×6 按钮矩阵)
├── 初始布局 (按钮网格)
└── 重置按钮
```

### 4. 预设系统设计

#### 力矩阵预设
每个预设是一个函数，直接操作 `FORCE_MATRIX`：

```typescript
type ForcePreset = {
    name: string;
    emoji: string;
    description: string;
    apply: () => void;
};

// 贪吃蛇示例
{
    name: '贪吃蛇',
    emoji: '🐍',
    apply: () => {
        FORCE_MATRIX.fill(0);
        for (let i = 0; i < 6; i++) {
            FORCE_MATRIX[i * 6 + ((i + 1) % 6)] = 0.8; // 追逐下一种颜色
            FORCE_MATRIX[i * 6 + i] = 0.2;             // 同色微吸引
        }
    }
}
```

#### 布局预设
每个布局是一个 Simulation 方法：

```typescript
initWithLayout(layoutIndex: number) {
    switch (layoutIndex) {
        case 1: this.initRing(); break;
        case 2: this.initBlocks(); break;
        // ...
    }
}
```

### 5. 暂停机制

#### 实现方式
- `PARAMS.paused` 标志位
- 主循环检查标志位决定是否调用 `sim.step()`
- 渲染始终执行（暂停时仍可看到粒子）

```typescript
function loop(now: number) {
    if (!ui.isPaused()) {
        sim.step();  // 仅暂停物理
    }
    renderer.draw(sim);  // 渲染不暂停
    requestAnimationFrame(loop);
}
```

## 性能基准

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 100k 粒子 | ~14 FPS | ~18 FPS |
| 50k 粒子 | ~25 FPS | ~30 FPS |
| 30k 粒子 | ~35 FPS | ~45 FPS |

*测试环境：MacBook Pro M1*

## 代码组织

```
particle life/src/
├── params.ts      # 参数 + 预设定义
├── simulation.ts  # 物理引擎 + 布局初始化
├── renderer.ts    # WebGL 渲染
├── ui.ts          # 控制面板 (新增)
└── main.ts        # 入口 + 主循环
```
