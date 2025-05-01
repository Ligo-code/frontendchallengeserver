# Journey Builder Graph Visualization

This project implements a visualization for directed acyclic graphs (DAGs) representing form flows in Journey Builder. The visualization allows users to see the relationships between different forms and navigate the workflow visually.

## Features

- Interactive graph visualization of forms and their connections
- Automatic layout calculation for optimal node positioning
- Support for both vertical and horizontal layouts
- Node selection with detailed information display
- Clean, responsive design with proper styling

## Running Locally

1. Clone the repository
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
4. Open http://localhost:5173 in your browser

## Project Structure
src/
├── components/       # React components
│   ├── nodes/        # Custom node components
│   │   ├── FormNode.tsx
│   │   └── BranchNode.tsx
│   ├── FlowGraph.tsx # Main graph component
│   └── NodeDetails.tsx
├── services/         # API services
│   └── api.ts
├── types/            # TypeScript type definitions
│   └── graph.ts
├── utils/            # Utility functions
│   └── layoutUtils.ts
└── App.tsx           # Main application component


## Extending with New Data Sources

To add a new data source:

1. Define the data structure in `src/types/graph.ts`
2. Create a new service function in `src/services/api.ts`
3. Update the `FlowGraph` component to use the new data source

Example of adding a new data source:

```typescript
// In api.ts
export const fetchAlternativeGraph = async (): Promise<GraphData> => {
  // Implementation here
};

// In FlowGraph.tsx
// Update useEffect to use the new data source
useEffect(() => {
  const loadData = async () => {
    const data = await fetchAlternativeGraph();
    // Process data...
  };
  loadData();
}, []);


Technologies Used

React 19
TypeScript
React Flow
Dagre (for automatic graph layout)
Vite (for build and development)