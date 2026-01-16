# Specification: UI Control Panel

## ADDED Requirements

### Capability: Pause Control
The simulation must support pausing and resuming without losing state.

#### Scenario: Pause via Button
- **Given** the simulation is running
- **When** the user clicks the pause button (⏸) in the panel header
- **Then** the simulation physics should stop updating
- **And** particles should freeze in place
- **And** the button should change to play icon (▶)
- **And** the FPS display should show "已暂停" indicator

#### Scenario: Pause via Keyboard
- **Given** the simulation is running
- **When** the user presses the Space key
- **Then** the simulation should toggle between paused and running states

#### Scenario: Resume
- **Given** the simulation is paused
- **When** the user clicks the pause button or presses Space
- **Then** the simulation should resume from the exact state it was paused at

---

### Capability: Parameter Sliders
Users must be able to adjust simulation parameters in real-time via sliders.

#### Scenario: Particle Count Adjustment
- **Given** the control panel is visible
- **When** the user adjusts the particle count slider
- **Then** the displayed value should update immediately
- **And** on slider release, the simulation should reinitialize with the new count
- **And** the current layout preset should be preserved

#### Scenario: Friction Adjustment
- **Given** the simulation is running
- **When** the user adjusts the friction slider (range: 0.85-0.98)
- **Then** particle damping should change immediately
- **And** higher values result in smoother, slower motion

#### Scenario: Force Factor Adjustment
- **Given** the simulation is running
- **When** the user adjusts the force strength slider (range: 2-20)
- **Then** the magnitude of particle interactions should scale accordingly
- **And** the change should be visible within 1-2 frames

#### Scenario: Interaction Radius Adjustment
- **Given** the simulation is running
- **When** the user adjusts the R_MAX slider (range: 0.015-0.04)
- **Then** particles should interact over longer/shorter distances
- **And** emergent pattern scale should change accordingly

#### Scenario: Repulsion Strength Adjustment
- **Given** the simulation is running
- **When** the user adjusts the short-range repulsion slider (range: 0-0.8)
- **Then** particles should maintain more/less spacing
- **And** value 0 allows particles to collapse; value 0.8 creates visible gaps

---

### Capability: Color Configuration
Users must be able to customize the 6 particle colors.

#### Scenario: Color Picker Usage
- **Given** the control panel shows 6 color picker inputs
- **When** the user clicks a color picker and selects a new color
- **Then** particles of that type should immediately render in the new color
- **And** the force matrix display should update to reflect the new color

---

### Capability: Force Matrix Editor
Users must be able to view and edit the 6×6 force interaction matrix.

#### Scenario: Matrix Visualization
- **Given** the control panel is visible
- **When** viewing the force matrix section
- **Then** a 6×6 grid of buttons should be displayed
- **And** each button should show its current value (-1.2 to 1.2)
- **And** positive values should have green borders (attraction)
- **And** negative values should have red borders (repulsion)
- **And** button background should reflect the source color

#### Scenario: Click to Cycle Values
- **Given** a matrix cell shows value X
- **When** the user clicks the cell
- **Then** the value should cycle: negative → 0 → positive → negative
- **And** the visual indicator should update immediately

#### Scenario: Scroll to Fine-tune
- **Given** a matrix cell is hovered
- **When** the user scrolls the mouse wheel
- **Then** the value should increment/decrement by 0.1
- **And** the value should be clamped to [-1.2, 1.2]

---

### Capability: Panel Collapse
The panel should be collapsible to maximize simulation viewing area.

#### Scenario: Collapse Panel
- **Given** the panel content is visible
- **When** the user clicks the toggle button (−)
- **Then** the panel content should hide
- **And** only the header should remain visible
- **And** the toggle button should show (+)

#### Scenario: Expand Panel
- **Given** the panel is collapsed
- **When** the user clicks the toggle button (+)
- **Then** the full panel content should become visible
