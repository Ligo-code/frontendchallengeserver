# Journey Builder Graph Visualization

This project implements a visualization for directed acyclic graphs (DAGs) that represent form workflows in Journey Builder. 

## Project Goals

- Create an interactive graph visualization of connected forms
- Allow users to understand the flow of data between forms
- Provide an intuitive interface for exploring complex form relationships
- Support easy navigation through the workflow

## Planned Features

- Graph visualization using React Flow
- Automatic layout calculation
- Custom node rendering for different types (forms, branches)
- Interactive controls for adjusting the view
- Details panel for examining selected nodes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
4. Open http://localhost:5173 in your browser

## Initial Project Structure
src/
├── components/    # React components
├── services/      # API services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions

## Technologies

- React 19
- TypeScript
- React Flow
- Vite

## Next Steps

- Set up the basic project structure
- Implement API service for fetching graph data
- Create the main graph visualization component
- Add custom node rendering
- Implement layout controls

