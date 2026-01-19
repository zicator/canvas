# 设计：视口与选中逻辑规范

## 1. 自动选中实现
在 `handleGenerate` 流程中，`editor.createShape` 创建画板后，立即调用：
```typescript
editor.select(boardId)
```

## 2. 视口计算逻辑

### 变量定义
- `safeArea`: 屏幕空间下的安全区域（上/左/右 80px, 下 160px，侧边栏展开时右侧 400px）。
- `viewportScreenBounds`: 当前视口的屏幕尺寸。
- `safeWidth`, `safeHeight`: 安全区域的宽高。

### 逻辑分支

#### 分支 1: Is Inside?
计算新画板在 Page 空间下的坐标，是否完全包含在 `viewportPageBounds` 收缩后的安全区域内。
- **Check**: `boardMinX >= safeMinX` && `boardMaxX <= safeMaxX` ...
- **Action**: Do nothing.

#### 分支 2: Fit Logic (Normal Case)
如果不在视口内，计算联合包围盒 `unionBounds`。
计算 `targetZoom = min(safeWidth / unionW, safeHeight / unionH)`。
- **Check**: `targetZoom >= MIN_ZOOM (0.01)`
- **Action**: `editor.setCamera(...)` to center `unionBounds` with `targetZoom`.

#### 分支 3: Minimal Pan Logic (Edge Case)
如果 `targetZoom < MIN_ZOOM`，说明内容太散或太远。
- **Action**:
  - 保持 `zoom = max(currentZoom, MIN_ZOOM)`。
  - 计算 X 轴偏移：
    - 右侧超出 -> 视口右移，使画板右边缘对齐安全区右边缘。
    - 左侧超出 -> 视口左移，使画板左边缘对齐安全区左边缘。
  - 计算 Y 轴偏移：
    - 底部超出 -> 视口下移，使画板底边缘对齐安全区底边缘。
    - 顶部超出 -> 视口上移，使画板顶边缘对齐安全区顶边缘。
  - 应用新的 Camera X/Y。

## 算法细节 (Minimal Pan)
```typescript
// X Axis
if ((bMaxX + newCameraX) * zoom > (screenW - safeArea.right)) {
    newCameraX = (screenW - safeArea.right) / zoom - bMaxX
}
if ((bMinX + newCameraX) * zoom < safeArea.left) {
    newCameraX = safeArea.left / zoom - bMinX
}
// Y Axis similar...
```
