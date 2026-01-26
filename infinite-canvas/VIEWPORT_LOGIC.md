# 画布视口自适应逻辑流程图

> 请使用 VS Code / Trae 的 Markdown Preview 功能查看此图表 (Cmd + Shift + V 或点击右上角预览图标)。

```mermaid
flowchart TD
    Start([开始: 生成新画板]) --> Create[创建画板 Frame]
    Create --> Select[Action: 自动选中新画板]
    Select --> CalcSafe[计算安全视口区域 Safe Viewport]
    CalcSafe --> CheckInside{新画板完全在视口内?}
    
    CheckInside -- Yes (Inside) --> Stable[保持视口静止]
    Stable --> End([结束])
    
    CheckInside -- No (Outside) --> CalcFit["计算适配缩放比 TargetZoom<br/>(联合包围盒 Union Bounds)"]
    CalcFit --> CheckZoom{"TargetZoom >= MinZoom (1%)?"}
    
    CheckZoom -- Yes (可缩放) --> FitView["Action: 缩放适应 Fit Viewport"]
    FitView --> FitDesc["将联合包围盒居中显示"]
    FitDesc --> End
    
    CheckZoom -- No (过小) --> PanView["Action: 最小路径平移 Minimal Pan"]
    PanView --> KeepZoom["保持当前缩放比例<br/>Zoom = max(Current, Min)"]
    KeepZoom --> CheckX{"X轴超出方向?"}
    
    CheckX -- 右侧超出 --> PanRight["视口右移 -> 对齐画板右边缘"]
    CheckX -- 左侧超出 --> PanLeft["视口左移 -> 对齐画板左边缘"]
    CheckX -- 未超出 --> NoPanX["X轴不动"]
    
    PanRight --> CheckY{"Y轴超出方向?"}
    PanLeft --> CheckY
    NoPanX --> CheckY
    
    CheckY -- 底部超出 --> PanDown["视口下移 -> 对齐画板下边缘"]
    CheckY -- 顶部超出 --> PanUp["视口上移 -> 对齐画板上边缘"]
    CheckY -- 未超出 --> NoPanY["Y轴不动"]
    
    PanDown --> ApplyCam["应用新视口坐标"]
    PanUp --> ApplyCam
    NoPanY --> ApplyCam
    
    ApplyCam --> End

    style Select fill:#d1fae5,stroke:#059669
    style FitView fill:#dbeafe,stroke:#2563eb
    style PanView fill:#fee2e2,stroke:#dc2626
    style Stable fill:#f3f4f6,stroke:#4b5563
```

## 规则说明

1.  **R1. 即时反馈原则 (Instant Selection)**
    *   新生成的画板必须立即自动选中。

2.  **R2. 视口稳定性原则 (Viewport Stability)**
    *   如果新生成的内容完全位于当前安全视口内，视口必须保持绝对静止。

3.  **R3. 分级自适应策略 (Tiered Adaptation Strategy)**
    *   **Tier A (Fit)**: 如果缩放后内容依然清晰（`>= 1%`），则缩放视口以容纳所有内容。
    *   **Tier B (Pan)**: 如果缩放后内容过小（`< 1%`），则放弃缩放，仅平移视口以展示新内容。

4.  **R4. 最小路径平移算法 (Minimal Path Pan)**
    *   在执行 Tier B 平移时，仅移动视口刚好露出新内容的距离。
