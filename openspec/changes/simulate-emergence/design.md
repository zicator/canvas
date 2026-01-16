# 设计文档 (Design)

## 架构哲学
**"Good programmers worry about data structures."**

我们不会创建 `class Particle`。那是给初学者的。
我们将使用 **Structure of Arrays (SoA)**。

### 数据结构
核心状态由几个 `Float32Array` 组成，容量为 $N$ (100,000+)：
- `pos_x`: 粒子 X 坐标
- `pos_y`: 粒子 Y 坐标
- `vel_x`: 粒子 X 速度
- `vel_y`: 粒子 Y 速度
- `color`: 粒子颜色/类型 ID

### 空间划分 (The Grid)
为了控制粒子间的相互作用，我们需要 O(1) 的邻域查找。
- 世界被划分为 `C x R` 个单元格 (Cell)。
- 使用 `Uint32Array` 作为哈希映射：`grid_head[cell_index]` 指向该单元格的第一个粒子。
- 使用 `next_particle[particle_index]` 形成链表。
这种 "Linked Cell List" 算法在内存中是紧凑的，构建开销极低。

### 渲染 (Rendering)
- **WebGL**: 使用 `gl.POINTS` 进行批量绘制。
- **Data Transfer**: 直接将 `pos_x/y` 和 `color` 数组作为 Attribute Buffer 传输给 GPU。零拷贝（如果可能），或最小化拷贝。

## 交互规则
- 鼠标/触控作为扰动源。
- 粒子根据网格规则（例如：同色聚集、异色排斥、Conway Life 变体等）更新速度。
