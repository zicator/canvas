# Proposal: UI Polish (Polaris Style) & Generation Options

## Context
The user wants to align the UI with Shopify Polaris design guidelines and introduce a new "Generation Type" control that switches between Image (4 count) and Video (1 count) modes.

## Changes

### 1. UI Polish (Polaris Design System)
- **Input Component**:
  - Adopt Polaris shadow, border, and radius tokens.
  - Ensure focus states match Polaris (blue focus ring).
- **Custom Menu Panels**:
  - Replace native `<select>` with custom Trigger + Popover components.
  - Style popovers with Polaris shadows and typography.
  - Add hover effects and proper spacing.

### 2. Functional Updates
- **Generation Settings**:
  - Add `type: 'image' | 'video'` to store settings.
  - Default to `type: 'image', count: 4`.
- **Layout Adjustment**:
  - Move "Generation Quantity/Type" selector to the **first** position in the toolbar.
  - Options:
    - "图片生成 4 images" (Sets count=4, type=image)
    - "视频生成 1 video" (Sets count=1, type=video)

## Implementation Plan
1. Update `store.ts` to include `type` in `GenerationSettings`.
2. Create reusable `PolarisSelect` component (internal to UnifiedInput or separate).
3. Refactor `UnifiedInput` to use the new layout and components.
