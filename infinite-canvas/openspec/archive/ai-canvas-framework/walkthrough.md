# Walkthrough: AI Canvas Phase 1

## Overview
We have successfully integrated `tldraw` and simulated an AI generation workflow.

## Changes Implemented
1. **Integrated tldraw SDK**: Replaced the custom canvas with `tldraw` (v3).
2. **Custom AI Frame**: Added a custom shape `AIFrameShape` that handles `empty`, `generating`, `success`, and `failed` states.
3. **Mock Service**: Implemented `MockGenerationService` to simulate API latency (2-5s) and return placeholder images.
4. **UI Overlay**: Added a "New AI Frame" button and a floating generation panel.

## Verification Steps

### 1. Start the Application
Run the development server:
```bash
cd "infinite-canvas"
npm run dev
```

### 2. Create an AI Frame
- Open the browser (default `http://localhost:5173`).
- Click the **+ New AI Frame** button in the top-right corner.
- A new frame titled "AI Frame" should appear in the center of the canvas.

### 3. Generate an Image
- Select the AI Frame by clicking on it.
- A **Generative Fill** panel will appear on the right side.
- Enter a prompt (e.g., "A sunset over mountains").
- Click **Generate**.
- Observe the "Generating..." spinner in the frame.
- After ~2-5 seconds, a random image (from Lorem Picsum) should appear.

### 4. Technical Verification
- **Architecture**: Check `src/services/` for the decoupled service interface.
- **Shape Logic**: Check `src/shapes/` for the state management.
