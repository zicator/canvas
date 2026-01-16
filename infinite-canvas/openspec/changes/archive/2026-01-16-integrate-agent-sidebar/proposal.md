# Proposal: Agent Sidebar & Unified Input

## Background
The user wants to evolve the AI Canvas into a more integrated Agent-driven experience.
This involves restructuring the UI to support a persistent "Agent Sidebar" and a unified input mechanism that transitions between a floating bottom bar and the sidebar.

## Problem Statement
- **Fragmented UI**: Tools and inputs are currently ad-hoc overlays.
- **Disconnected Context**: No conversational history or persistent context for generation.
- **Input Duplication**: Need a seamless transition between "quick input" (bottom) and "conversation" (sidebar).

## Solution
Refactor the application layout into three core zones:
1.  **Left Toolbar**: Static tools (Shapes, Sticky Notes, etc.) vertically centered.
2.  **Bottom Input**: A floating input bar for quick access (visible when sidebar is closed).
3.  **Right Sidebar**: A collapsible panel for Agent interaction, history, and advanced settings.

**Key Mechanics**:
- **Unified Input**: The bottom input and sidebar input share the same state. Opening the sidebar hides the bottom input.
- **Synchronization**: Generating an image adds a "Chat Item" in the sidebar AND places an "AI Frame" on the canvas.
- **Settings**: Support Aspect Ratio (1:1, 16:9, 4:3) and Resolution (2k/4k) toggles in the input area.

## Scope
- **UI Layout**: React-based layout manager.
- **State Management**: Zustand store for `uiState` (sidebar open/close) and `agentState` (chat history, settings).
- **Mock Generation**: Enhanced mock service to support returning images with specific aspect ratios.
- **Components**:
    - `Toolbar` (Left)
    - `FloatingInput` (Bottom)
    - `AgentSidebar` (Right)
    - `ChatStream` (Inside Sidebar)

## Risks
- **Canvas Resize**: Ensuring `tldraw` resizes correctly when the sidebar opens/closes.
- **State Sync**: avoiding race conditions between canvas shapes and chat history items.
