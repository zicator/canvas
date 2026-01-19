# 设计：最小路径平移算法

## 算法流程

在 `MainLayout.tsx` 的 `else` 分支（即 `isInside` 为 false）中：

1. **准备数据**:
   - `currentCamera`: `{x, y, z}`
   - `zoom`: `currentCamera.z`
   - `safeArea`: `{top, bottom, left, right}` (Screen Coords)
   - `board`: `{minX, maxX, minY, maxY}` (Page Coords)

2. **计算 X 轴目标 CameraX**:
   - **Check Right**: 如果 `(board.maxX + camera.x) * zoom > (screenW - safeArea.right)`
     - 内容超出右边界。
     - Target: `board.maxX` aligned with `screenW - safeArea.right`.
     - `newCameraX = (screenW - safeArea.right) / zoom - board.maxX`
   - **Check Left**: 如果 `(board.minX + camera.x) * zoom < safeArea.left`
     - 内容超出左边界。
     - Target: `board.minX` aligned with `safeArea.left`.
     - `newCameraX = safeArea.left / zoom - board.minX`
   - **Else**: `newCameraX = currentCamera.x`
   - *注意：如果画板宽度大于安全区域宽度，优先对齐左边还是右边？通常优先对齐左上角（阅读顺序）。所以先 Check Right，再 Check Left (覆盖)。*

3. **计算 Y 轴目标 CameraY**:
   - **Check Bottom**: 如果 `(board.maxY + camera.y) * zoom > (screenH - safeArea.bottom)`
     - 内容超出下边界。
     - Target: `board.maxY` aligned with `screenH - safeArea.bottom`.
     - `newCameraY = (screenH - safeArea.bottom) / zoom - board.maxY`
   - **Check Top**: 如果 `(board.minY + camera.y) * zoom < safeArea.top`
     - 内容超出上边界。
     - Target: `board.minY` aligned with `safeArea.top`.
     - `newCameraY = safeArea.top / zoom - board.minY`
   - **Else**: `newCameraY = currentCamera.y`

4. **执行**:
   - `editor.setCamera({ x: newCameraX, y: newCameraY, z: zoom })`
   - 使用缓动。

## 场景验证
- **场景1：同一行向右扩展**
  - Board 仅右侧超出。
  - Check Right 触发。视口向右平移，直到 Board 右边缘贴合 Safe Right。
  - Check Left 不触发。
  - Check Top/Bottom 不触发。
  - 结果：视口水平平滑左移（内容右移进场），垂直不动。符合预期。

- **场景2：新建一行（左下方）**
  - Board 在下方超出，且可能在左侧超出（如果是从右向左换行？通常是左对齐）。
  - Check Bottom 触发。视口向上平移，直到 Board 下边缘贴合 Safe Bottom。
  - Check Left 触发（如果超出）。视口向右平移，直到 Board 左边缘贴合 Safe Left。
  - 结果：视口斜向移动，刚好露出新的一行。符合预期。

## 约束
- 保持 `zoom` 不变。这意味着我们不再尝试缩放来适应（除非用户处于极其巨大的缩放级别导致单个画板都放不下，暂不考虑这种情况，假设画板相对于屏幕是合理的）。
