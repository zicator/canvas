# 提案：最小路径视口平移逻辑

## 摘要
当新生成的内容超出安全视口时，不再尝试“居中”新内容或联合区域，而是执行**最小路径平移**：仅将视口移动必要的距离，使新内容刚刚好进入安全区域（对齐边缘）。

## 问题
当前的视口逻辑倾向于将新内容（或联合包围盒）“居中”显示，或者在最小缩放模式下将新内容“底部对齐”。这导致了不必要的视口大幅度移动，干扰用户视野，且不符合“最小干扰”的原则。

## 解决方案
在 `MainLayout.tsx` 的视口逻辑中，当检测到内容在安全视口外时：

1. **计算偏移量 (Delta)**:
   - 计算将新画板移入安全区域所需的最小 X 轴和 Y 轴偏移量。
   - **X轴**:
     - 如果画板在左侧外 -> 向左平移视口直到画板左边缘 = 安全区域左边缘。
     - 如果画板在右侧外 -> 向右平移视口直到画板右边缘 = 安全区域右边缘。
     - 如果在中间 -> 偏移量为 0。
   - **Y轴**:
     - 如果画板在上方外 -> 向上平移视口直到画板上边缘 = 安全区域上边缘。
     - 如果画板在下方外 -> 向下平移视口直到画板下边缘 = 安全区域下边缘。
     - 如果在中间 -> 偏移量为 0。

2. **应用平移**:
   - `TargetCameraX = CurrentCameraX - DeltaX`
   - `TargetCameraY = CurrentCameraY - DeltaY`
   - 保持当前的缩放比例（除非甚至最小缩放都无法容纳单个画板，但这通常不会发生，因为画板是固定大小）。

## 优势
- **稳定性**: 如果新内容只是在右侧边缘漏出一点，视口只会微调一点，而不是猛地跳到新内容中心。
- **一致性**: 无论是换行还是同行扩展，逻辑统一。

## 实现细节
需要将 Page 坐标系下的偏移量转换为 Camera 坐标系的偏移量。
`CameraDelta = ScreenDelta / Zoom` 
这里我们直接在 Page 空间计算需要的视口位移。

Page Safe Area:
`MinX = ViewportMinX + SafeLeft / Zoom`
`MaxX = ViewportMaxX - SafeRight / Zoom`

如果 `BoardMaxX > SafeMaxX`，则视口需要向右移。
`ShiftX = BoardMaxX - SafeMaxX`
`TargetViewportMinX = ViewportMinX + ShiftX`
`TargetCameraX = ScreenCenter / Zoom - TargetViewportCenter` ... 这种计算太绕。

**更简单的计算**:
`CameraX` 定义了 Page (0,0) 在屏幕上的偏移。
`ScreenX = (PageX + CameraX) * Zoom`
`CameraX = ScreenX / Zoom - PageX`

假设我们保持 `Zoom` 不变。
我们需要找到一个新的 `CameraX'`，使得 Board 的特定边缘对齐 Safe Screen 的特定边缘。

例如：**右侧超出**
目标：`BoardMaxPageX` 对齐 `SafeScreenMaxX`
`(BoardMaxPageX + CameraX') * Zoom = SafeScreenMaxX`
`CameraX' = SafeScreenMaxX / Zoom - BoardMaxPageX`

例如：**左侧超出**
目标：`BoardMinPageX` 对齐 `SafeScreenMinX`
`CameraX' = SafeScreenMinX / Zoom - BoardMinPageX`

我们分别计算 X 和 Y 轴的理想 Camera 值，如果不需要动则保持当前值。
