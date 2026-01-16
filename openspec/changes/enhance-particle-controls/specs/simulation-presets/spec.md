# Specification: Simulation Presets

## ADDED Requirements

### Capability: Force Matrix Presets
The system must provide pre-configured force matrices that produce interesting emergent behaviors.

#### Scenario: Random Preset
- **Given** the user clicks the "随机" (🎲) preset button
- **When** the preset is applied
- **Then** all 36 force matrix values should be randomized
- **And** values should be biased towards attraction (-0.6 to 1.0 range)

#### Scenario: Snake Preset
- **Given** the user clicks the "贪吃蛇" (🐍) preset button
- **When** the preset is applied
- **Then** each color should strongly attract the next color in sequence (0→1→2→3→4→5→0)
- **And** each color should mildly repel the previous color
- **And** same colors should have mild self-attraction
- **And** visible "chasing chains" should form within 5-10 seconds

#### Scenario: Galaxy Preset
- **Given** the user clicks the "星系" (🌌) preset button
- **When** the preset is applied
- **Then** same-color pairs should attract (diagonal = 0.6)
- **And** different-color pairs should mildly repel (off-diagonal = -0.15)
- **And** particles should cluster by color into distinct groups

#### Scenario: Tribes Preset
- **Given** the user clicks the "族群" (🏘️) preset button
- **When** the preset is applied
- **Then** adjacent colors (distance 1 in the color wheel) should attract
- **And** distant colors should repel
- **And** color neighborhoods should form

#### Scenario: Predator Preset
- **Given** the user clicks the "捕食者" (🦁) preset button
- **When** the preset is applied
- **Then** a circular chase relationship should be established (0→1→2→3→4→5→0)
- **And** prey should flee from predator
- **And** dynamic pursuit patterns should emerge

#### Scenario: Symbiosis Preset
- **Given** the user clicks the "共生" (🤝) preset button
- **When** the preset is applied
- **Then** color pairs (0-1, 2-3, 4-5) should mutually attract
- **And** non-paired colors should have neutral or weak interaction
- **And** paired clusters should form

#### Scenario: Chaos Preset
- **Given** the user clicks the "混沌" (🌀) preset button
- **When** the preset is applied
- **Then** forces should alternate based on (i+j) % 2
- **And** even sums → attraction, odd sums → repulsion
- **And** swirling vortex patterns should emerge

#### Scenario: Membrane Preset
- **Given** the user clicks the "膜结构" (🫧) preset button
- **When** the preset is applied
- **Then** same colors should repel (diagonal = -0.3)
- **And** different colors should attract (off-diagonal = 0.25)
- **And** cell-membrane-like boundaries should form

---

### Capability: Initial Layout Presets
The system must provide multiple ways to initialize particle positions.

#### Scenario: Random Layout
- **Given** the user clicks the "随机" (🎲) layout button
- **When** the simulation reinitializes
- **Then** particles should be uniformly distributed across 90% of the world area
- **And** colors should be randomly assigned

#### Scenario: Ring Layout
- **Given** the user clicks the "环形" (⭕) layout button
- **When** the simulation reinitializes
- **Then** particles should be arranged in a ring shape
- **And** ring radius should be approximately 40% of world size
- **And** colors should be assigned based on angular position (color = angle / 360° × 6)

#### Scenario: Blocks Layout
- **Given** the user clicks the "色块" (🟦) layout button
- **When** the simulation reinitializes
- **Then** the world should be divided into 6 rectangular regions (3×2 grid)
- **And** each region should contain only one color
- **And** particles within each region should be randomly distributed

#### Scenario: Center Layout
- **Given** the user clicks the "中心" (🎯) layout button
- **When** the simulation reinitializes
- **Then** all particles should be concentrated within a small radius (0.15) from center
- **And** colors should be randomly mixed
- **And** an immediate "explosion" outward should occur due to repulsion

#### Scenario: Grid Layout
- **Given** the user clicks the "网格" (📐) layout button
- **When** the simulation reinitializes
- **Then** particles should be arranged in a regular grid pattern
- **And** colors should be assigned based on (x + y) % 6

#### Scenario: Spiral Layout
- **Given** the user clicks the "螺旋" (🌀) layout button
- **When** the simulation reinitializes
- **Then** particles should be arranged in a spiral from center outward
- **And** spiral should have approximately 6 turns
- **And** colors should transition smoothly along the spiral

---

### Capability: Short-Range Repulsion
The system must prevent particles from collapsing into a single point.

#### Scenario: Default Repulsion Active
- **Given** the simulation is running with default parameters
- **When** particles approach each other within REPULSION_RADIUS (0.008)
- **Then** a repulsive force should push them apart
- **And** the force magnitude should be proportional to (1 - distance/radius)

#### Scenario: Repulsion Strength Zero
- **Given** the repulsion slider is set to 0
- **When** particles interact under strong attraction
- **Then** particles may collapse into dense clusters
- **And** this is expected behavior for artistic effect

#### Scenario: Repulsion Strength Maximum
- **Given** the repulsion slider is set to 0.8
- **When** observing particle clusters
- **Then** visible gaps should exist between individual particles
- **And** structures should appear more "crystalline" or ordered

---

## MODIFIED Requirements

### Capability: Particle System (from simulate-emergence)

#### Scenario: Massive Scale (MODIFIED)
- **Given** the simulation is initialized
- **When** 50,000 particles are spawned (default, was 100,000)
- **Then** the frame rate should remain above 28 FPS on M1 hardware
- **And** memory usage should be stable (no per-frame allocations)

*Rationale: Reduced default count for better baseline performance while remaining adjustable via UI.*
