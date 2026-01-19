# 设计：最小缩放下的视口平移

## 逻辑流程

在 `MainLayout.tsx` 的视口逻辑部分：

1. **计算联合包围盒 (`unionBounds`)**: 包含当前视口和新生成的画板。
2. **计算适应缩放 (`fitZoom`)**: `safeArea / unionBounds`。
3. **获取最小缩放 (`minZoom`)**: 从 `editor.getCameraOptions().zoomSteps[0]` 或硬编码 (0.01)。
4. **决策**:
    - **IF** `fitZoom >= minZoom`:
        - 正常逻辑：使用 `fitZoom` 和联合包围盒中心进行 `setCamera`。
    - **ELSE** (`fitZoom < minZoom`):
        - **平移逻辑**：
            - 目标中心 = 新画板的中心 (`boardX + w/2`, `boardY + h/2`)。
            - 目标缩放 = `minZoom` (或者 `currentZoom`，取两者较小者，确保能看清)。
            - 执行 `setCamera` 平移到新画板。

## 细节
- 确保平移过程使用相同的缓动函数 `cubicBezier`。
- 确保 `safeArea` 仍然被考虑（即新内容应该在 Safe Area 的中心）。
