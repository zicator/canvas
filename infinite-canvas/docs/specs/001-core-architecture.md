# System Spec 001: Infinite Canvas Core Architecture

## 1. Core Philosophy
"Bad programmers worry about the code. Good programmers worry about data structures."

We are building a **DOM-based, Nested Node** infinite canvas.
Scale: ~2k-5k nodes.
Constraint: DOM is heavy. We must minimize re-renders.

## 2. Data Structure (The "Truth")

Do NOT structure the State as a Tree. Structure it as a **Flat Normalized Table**.
Trees are good for rendering, bad for updates.

```typescript
type NodeId = string;

// The atom of our universe
interface CanvasNode {
  id: NodeId;
  type: 'container' | 'text' | 'image'; // Extensible
  parentId: NodeId | null; // null = root
  children: NodeId[];      // Ordered list of children IDs. Redundant but necessary for O(1) rendering.
  
  // Geometry (Local Coordinates relative to parent!)
  // This leverages DOM's natural stacking.
  x: number; 
  y: number;
  width: number;
  height: number;
  
  // Stylistic properties
  backgroundColor?: string;
  content?: string;
}

interface CanvasState {
  nodes: Record<NodeId, CanvasNode>;
  rootId: NodeId; // The entry point
  
  // Viewport (The Camera)
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  
  // Interaction State
  selectedIds: Set<NodeId>;
  draggingId: NodeId | null;
}
```

## 3. Rendering Strategy (The "View")

### The Canvas
A single logic-less container that applies the Camera transform.
`transform: translate3d(${x}px, ${y}px, 0) scale(${zoom})`
*Note: Use translate3d to force GPU composition.*

### The Nodes (Recursive)
- **Component**: `<CanvasNode id={id} />`
- **Logic**: 
  1. Retrieve `node` from Store by `id`.
  2. Render `div` with `position: absolute`.
  3. `left: x, top: y, width: w, height: h`.
  4. **CRITICAL**: Utilize `React.memo`. A change in Node A should NOT re-render Node B.
  5. Render `node.children.map(childId => <CanvasNode id={childId} />)` inside.

## 4. Interaction Model
- **Pan/Zoom**: Updates `state.camera`. Uses `wheel` (metaKey for zoom) or `middle-click` drag.
- **Drag Node**: Updates `node.x/y`.
  - *Optimization*: Do NOW commit to React State on every pixel. use a `ref` for immediate DOM manipulation, sync to store on `pointerup`. OR use a high-performance store like `Zustand` with transient updates.
  - Given the "low" count (2k), standard State *might* choke. usage of `react-use-gesture` + direct ref manipulation is preferred for smooth 60fps dragging.

## 5. Potential Pitfalls (The "Worry" List)
1. **Event Bubbling**: Dragging a child must NOT drag the parent. `e.stopPropagation()` is your friend.
2. **Layout Thrashing**: If we rely on `getBoundingClientRect` during drag, we die. State must be the source of truth.
3. **Z-Index**: Nested DOM handles this naturally (last child = on top). No manual z-index management needed unless we implementations "Layers".

## 6. Implementation Plan
1. Setup Vite + React + TypeScript.
2. Setup Zustand (Store).
3. Build the `Canvas` frame (Pan/Zoom).
4. Build the `Node` component (Recursive).
5. Verify performance with 1000 nodes.
