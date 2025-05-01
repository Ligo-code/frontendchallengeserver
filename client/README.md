# Journey Builder Graph Visualization

This project implements a visualization for directed acyclic graphs (DAGs) representing form flows in Journey Builder. The visualization allows users to see the relationships between different forms and navigate the workflow visually.

## Features

- Interactive graph visualization of forms and their connections
- Automatic layout calculation for optimal node positioning
- Support for both vertical and horizontal layouts
- Node selection with detailed information display
- Field prefill configuration between connected forms
- Advanced data source selection with hierarchical browsing
- Clean, responsive design with proper styling

## Running Locally

1. Clone the repository
2. Install dependencies: npm install
3. Start the development server: npm run dev
4. Open http://localhost:5173 in your browser

## Running Tests
npm test

## Project Structure
src/
├── components/       # React components
│   ├── nodes/        # Custom node components
│   │   ├── FormNode.tsx
│   │   ├── BranchNode.tsx
│   │   └── DataSourceModal.tsx
│   ├── FlowGraph.tsx # Main graph component
│   ├── NodeDetails.tsx
│   └── PrefillPanel.tsx
├── services/         # API services
│   ├── api.ts
│   └── dependencyService.ts
├── types/            # TypeScript type definitions
│   ├── graph.ts
│   └── prefill.ts
├── utils/            # Utility functions
│   └── layoutUtils.ts
└── App.tsx           # Main application component

## Form Prefill Functionality

Journey Builder supports prefilling form fields with data from previous forms in the user journey. This reduces duplicate data entry and improves the user experience.

### How to Use Prefill

1. Click on any form node in the graph to select it
2. A prefill panel will appear on the left side of the screen
3. Enable the "Enable prefill for this form" checkbox
4. Available form fields will be displayed
5. For each field, click "Map Field" to select a source for the data
6. Click "Save Configuration" to save your prefill settings

### Advanced Data Source Selection

The DataSourceModal component provides a hierarchical interface for selecting data sources:

1. **Direct Dependencies**: Forms that directly connect to the current form
2. **Transitive Dependencies**: Forms indirectly connected through other forms
3. **Action Properties**: Global system properties like IDs, timestamps, and status
4. **Client Organisation Properties**: Organization-specific data fields

Features of the data source modal:
- Expandable/collapsible groups for better organization
- Search functionality to quickly find relevant fields
- Clear visual hierarchy with proper indentation
- Responsive design that works on various screen sizes

### Technical Details

The prefill functionality uses a mapping system to link fields between forms:
- Source fields can come from multiple types of data sources
- Each target field can be mapped to exactly one source field
- Forms with active prefill configuration are visually highlighted
- Direct and transitive dependencies are calculated automatically

## Extending with New Data Sources

To add a new data source:

1. Define the data source type in `src/types/prefill.ts`
2. Update the dependency service in `src/services/dependencyService.ts`
3. Add the new source type to `fetchAvailableDataSources` in `src/services/api.ts`
4. Update the DataSourceModal component to display the new source type

Example of adding a new data source type:

```typescript
// In prefill.ts
export interface PrefillMapping {
  targetFieldId: string;
  sourceType: 'form' | 'action' | 'client' | 'newSource';
  sourcePath: string;
}

// In api.ts
export const fetchAvailableDataSources = async (formId: string): Promise<DataSourceGroup[]> => {
  // Existing code...
  
  // Add new source type
  sources.push({
    id: 'new-source',
    name: 'New Source Type',
    type: 'global',
    fields: [
      { id: 'field1', name: 'Field 1', path: 'newSource.field1' },
      { id: 'field2', name: 'Field 2', path: 'newSource.field2' }
    ]
  });
  
  return sources;
};
```
Technologies Used

React 19
TypeScript
React Flow
Dagre (for automatic graph layout)
Jest and Testing Library (for testing)
Vite (for build and development)