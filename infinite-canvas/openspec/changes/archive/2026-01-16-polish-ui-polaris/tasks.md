# Tasks: Polish UI & Add Video Option

- [x] **Update Store** <!-- id: 1 -->
    - Add `type: 'image' | 'video'` to `GenerationSettings` in `src/store.ts`.
    - Initialize with default values.

- [x] **Refactor UnifiedInput UI** <!-- id: 2 -->
    - Implement `PolarisPopover` / `PolarisSelect` component mechanism.
    - Style the main input container with Polaris tokens.
    - Implement the "Generation Type" menu with the specific options.
    - Reorder controls (Type/Count first).

- [x] **Verify Changes** <!-- id: 3 -->
    - Check visual consistency.
    - Test switching between Image/Video modes.
    - Ensure correct count is set.
