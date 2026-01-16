# Design: Polaris UI & New Features

## Visual Style (Polaris-ish)

### Colors
- **Surface**: `#FFFFFF`
- **Border**: `#E1E3E5` (Subdued)
- **Border Hover**: `#8C9196`
- **Border Focus**: `#005BD3` (Interactive)
- **Shadow (Card)**: `0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)`
- **Shadow (Popover)**: `0px 4px 8px rgba(0, 0, 0, 0.1)`
- **Text**: `#202223` (Ink)
- **Text Subdued**: `#6D7175`

### Components

#### Custom Select (Popover)
- **Trigger**: Button-like appearance with icon + text + chevron.
- **Panel**: Absolute positioned, white bg, shadow, rounded (8px).
- **Item**: Padding 8px 12px, hover bg `#F1F2F3`.

## Logic

### Generation Menu
- **Option 1**:
  - Label: "图片生成 4 images"
  - Action: `setSettings({ type: 'image', count: 4 })`
- **Option 2**:
  - Label: "视频生成 1 video"
  - Action: `setSettings({ type: 'video', count: 1 })`
