# 任务：修复最小缩放下的视口平移

- [ ] 在 `MainLayout.tsx` 中获取 `minZoom` (0.01)。 <!-- id: get-min-zoom -->
- [ ] 实现视口逻辑分支：当 `targetZoom < minZoom` 时，切换为平移到新内容模式。 <!-- id: implement-pan-logic -->
- [ ] 验证在视口极小（或内容极远）时，生成新内容后视口会平移到新内容。 <!-- id: verify-pan -->
