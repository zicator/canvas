# Tasks: Agent Sidebar Integration

## Phase 1: State & Layout

- [x] **State Management** <!-- id: 0 -->
    - Create `store.ts` using Zustand.
    - Define actions for sidebar toggle, chat history, and settings.
- [x] **Left Toolbar Refactor** <!-- id: 1 -->
    - Extract current left-side logic into `components/Toolbar/LeftToolbar.tsx`.
    - Style as vertical bar.
- [x] **Agent Sidebar** <!-- id: 2 -->
    - Create `components/Sidebar/AgentSidebar.tsx`.
    - Implement slide-in animation and close button.
- [x] **Unified Input** <!-- id: 3 -->
    - Create `components/Input/UnifiedInput.tsx`.
    - Implement Settings Pills (Ratio/Resolution).
    - Handle conditional rendering (Bottom vs Sidebar).

## Phase 2: Logic & Sync

- [x] **Generation Logic** <!-- id: 4 -->
    - Update `MockGenerationService` to accept ratio/resolution.
    - Connect `UnifiedInput` submit to `generate()` action.
- [x] **Synchronization** <!-- id: 5 -->
    - Ensure `generate()` updates both Chat History (Store) and Canvas (Shape).
    - Test "Bottom Input -> Sidebar Open -> Result" flow.
- [ ] **E2E Verification** <!-- id: 6 -->
    - Verify layout fidelity.
    - Verify input persistence between modes.
    - Verify generation sync.
