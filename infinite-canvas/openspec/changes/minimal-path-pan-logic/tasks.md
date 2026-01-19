# 任务：最小路径视口平移

- [ ] 在 `MainLayout.tsx` 中替换现有的视口逻辑。 <!-- id: replace-logic -->
- [ ] 实现 X 轴和 Y 轴的独立最小平移计算。 <!-- id: implement-axis-calc -->
- [ ] 验证：
    - 同行生成仅超出右侧时，视口仅横向移动。
    - 换行生成时，视口仅纵向移动（或最小斜向移动）。
    - 视口不再发生大幅度的“居中”跳跃。 <!-- id: verify-minimal-movement -->
