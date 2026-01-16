# Icon System Guidelines

## Overview
We have adopted **RemixIcon** as our standard icon library for the Infinite Canvas project. This ensures a neutral, modern, and consistent visual style across all custom UI components.

## Selection Criteria
- **Style**: Neutral, "Outlined" for general UI, "Filled" for active states or emphasis.
- **License**: Apache 2.0 (Open Source, Permissive).
- **Format**: SVG (via `@remixicon/react`).

## Usage

### Installation
```bash
npm install @remixicon/react remixicon
```

### Component Usage
Import icons directly from `@remixicon/react`.

```tsx
import { RiHeartLine, RiHeartFill } from '@remixicon/react'

// Standard size is 20px for toolbars
<RiHeartLine size={20} />
```

### Standard Sizes
- **Toolbar Icons**: `20px` (Container is usually 40x40px)
- **Small Actions**: `16px` or `18px`
- **Large Placeholders**: `48px`+

### States
- **Default**: Use the `Line` version (e.g., `RiCursorLine`).
- **Active/Selected**: Use the `Fill` version (e.g., `RiCursorFill`) or change color.
- **Hover**: Handle via CSS/JS background color changes on the button container, not usually by changing the icon itself unless it's a specific interaction.

## Icon Mapping

| Feature | Icon Name | React Component |
|---------|-----------|-----------------|
| Select | Cursor Fill | `<RiCursorFill />` |
| Hand | Hand | `<RiHand />` |
| Draw | Pencil Fill | `<RiPencilFill />` |
| Eraser | Eraser Fill | `<RiEraserFill />` |
| Rectangle | Rectangle Line | `<RiRectangleLine />` |
| Ellipse | Circle Line | `<RiCircleLine />` |
| Text | Text | `<RiText />` |
| Arrow | Arrow Right Up | `<RiArrowRightUpLine />` |
| Line | Subtract Line | `<RiSubtractLine />` |
| AI Frame | Sparkling Fill | `<RiSparklingFill />` |
| Undo | Arrow Go Back | `<RiArrowGoBackLine />` |
| Redo | Arrow Go Forward | `<RiArrowGoForwardLine />` |
| Delete | Delete Bin | `<RiDeleteBinLine />` |
| Duplicate | File Copy | `<RiFileCopyLine />` |
| Chat | Chat 1 / Message 3 | `<RiChat1Line />` |
| Close | Close | `<RiCloseLine />` |

## Accessibility
Always provide `title` or `aria-label` to the wrapping button element.

```tsx
<button title="Select Tool">
  <RiCursorFill />
</button>
```
