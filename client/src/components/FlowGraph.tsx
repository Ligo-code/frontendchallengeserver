import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  NodeMouseHandler,
  ReactFlowProvider, 
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchGraph } from '../services/api';
import { getLayoutedElements } from '../utils/layoutUtils';
import FormNode from './nodes/FormNode';
import BranchNode from './nodes/BranchNode';
import NodeDetails from './NodeDetails';

// Define node types outside the component to avoid React warnings
const nodeTypes = {
  form: FormNode,
  branch: BranchNode,
  };

const FlowGraph: React.FC = () => {
  // State for graph data
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');

  // Container styles
  const containerStyle: React.CSSProperties = {
    width: '800px',
    height: '600px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    margin: '0 auto'
  };

  /**
   * Applies automatic layout to nodes and edges
   */
  const applyLayout = useCallback((nodesToLayout: Node[], edgesToLayout: Edge[]) => {
    if (!nodesToLayout.length) return;
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesToLayout,
      edgesToLayout,
      layoutDirection
    );
    
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [layoutDirection]);

  /**
   * Determines node color based on type
   */
  const getNodeColor = useCallback((type?: string): string => {
    switch(type) {
      case 'form': return '#e6f7ff';
      case 'branch': return '#fff7e6';
      default: return '#f9f9f9';
    }
  }, []);

  /**
   * Load graph data on component mount
   */
  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setLoading(true);
        const data = await fetchGraph();
        
        if (!data || !data.nodes) {
          throw new Error('Invalid data structure received from API');
        }
        
        // Transform nodes to React Flow format
        const mappedNodes = (data.nodes || [])
          .filter(node => !!node.id)
          .map((node, index) => {
            if (!node.position) {
              console.warn(`Node ${node.id} has no position. Assigning default position.`);
            }

            const nodeType = node.type || 
                          (node.data?.component_type === 'form' ? 'form' : 
                           node.data?.component_type === 'branch' ? 'branch' : 'default');

            return {
              id: node.id,
              type: nodeType,
              data: { 
                label: node.data?.name || `Node ${index + 1}`,
                type: nodeType,
                originalData: node.data
              },
              position: node.position || { 
                x: (index % 3) * 250, 
                y: Math.floor(index / 3) * 200 
              },
              style: {
                background: getNodeColor(nodeType),
                border: '1px solid #777',
                borderRadius: '8px',
                padding: '10px'
              }
            };
          });

        // Transform edges to React Flow format
        const mappedEdges = (data.edges || []).map((edge, index) => ({
          id: edge.id || `e${edge.source}-${edge.target}-${index}`,
          source: edge.source,
          target: edge.target,
          style: { stroke: '#555' },
          animated: true,
          type: 'smoothstep'
        }));

        // Apply automatic layout after initial render
        setTimeout(() => {
          applyLayout(mappedNodes, mappedEdges);
          setLoading(false);
          setError(null);
        }, 0);
      } catch (err) {
        console.error('Error loading graph data:', err);
        setError('Failed to load graph. Please check console for details.');
        setNodes([]);
        setEdges([]);
        setLoading(false);
      }
    };

    loadGraphData();
  }, [applyLayout, getNodeColor]);

  /**
   * Handle node click event
   */
  const onNodeClick: NodeMouseHandler = (_event, node) => {
    console.log('Selected node:', node);
    setSelectedNode(node);
  };

  /**
   * Close the details panel
   */
  const closeDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const defaultEdgeOptions = useMemo(() => ({
    animated: true,
    type: 'smoothstep',
    style: { 
      stroke: '#aaa', 
      strokeWidth: 1.5 
    }
  }), []);

  /**
   * Handle layout direction change
   */
  const handleDirectionChange = useCallback((direction: 'TB' | 'LR') => {
    setLayoutDirection(direction);
    applyLayout(nodes, edges);
  }, [applyLayout, nodes, edges]);

  // Display loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          Loading graph...
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  // Render the graph
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={containerStyle}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            defaultEdgeOptions={defaultEdgeOptions}  
            fitView            
          >
            <Background />
            <MiniMap nodeStrokeWidth={3} />
            <Controls />
            
            <Panel position="top-left">
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                background: 'white',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                <button 
                  onClick={() => handleDirectionChange('TB')}
                  style={{ 
                    padding: '6px 12px',
                    background: layoutDirection === 'TB' ? '#eaf6ff' : 'white',
                    border: layoutDirection === 'TB' ? '1px solid #1a73e8' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontWeight: layoutDirection === 'TB' ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  Vertical Layout
                </button>
                <button 
                  onClick={() => handleDirectionChange('LR')}
                  style={{ 
                    padding: '6px 12px',
                    background: layoutDirection === 'LR' ? '#eaf6ff' : 'white',
                    border: layoutDirection === 'LR' ? '1px solid #1a73e8' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontWeight: layoutDirection === 'LR' ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  Horizontal Layout
                </button>
              </div>
            </Panel>
          </ReactFlow>
          
          <NodeDetails node={selectedNode} onClose={closeDetails} />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowGraph;