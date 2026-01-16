# Requirement: Mock AI Generation

## ADDED Requirements

### Requirement: Simulate Image Generation
系统必须 (MUST) 能够模拟 AI 图像生成 API 的延迟和响应。

#### Scenario: 用户成功生成模拟图片
- **Given** 用户已经在画布上放置了一个 AI Frame
- **And** 用户输入了提示词 "A beautiful sunset"
- **When** 用户点击 "生成" 按钮
- **Then** AI Frame 应该进入 "Loading" (加载中) 状态
- **And** 经过一段延迟后 (例如 2 秒)
- **Then** AI Frame 应该显示一张占位图片
- **And** 状态应该变为 "Complete" (完成)
