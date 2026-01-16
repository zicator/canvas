# Requirement: Agent Sidebar Interaction

## ADDED Requirements

### Requirement: Unified Input System
The system MUST provide a unified input mechanism that seamlessly transitions between a floating bottom bar and a sidebar.

#### Scenario: User opens sidebar from bottom input
- **Given** the sidebar is closed
- **And** the user types "Hello" in the bottom input
- **When** the user clicks "Send" or prompts the agent
- **Then** the sidebar MUST open
- **And** the bottom input MUST disappear
- **And** the "Hello" message MUST appear in the sidebar chat history

### Requirement: Synchronized Generation
The system MUST synchronize generation results between the Agent Sidebar and the Canvas.

#### Scenario: Generating from sidebar
- **Given** the sidebar is open
- **And** the user selects "16:9" ratio
- **When** the user sends prompt "A mountain landscape"
- **Then** a new Chat Item with "Generating..." state MUST appear in sidebar
- **And** a new AI Frame with "Generating..." state MUST appear on the canvas
- **And** after generation completes, both MUST display the same image
