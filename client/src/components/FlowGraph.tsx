import React, { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const FlowGraph: React.FC = () => {
    
    const nodeStyle = {
        background: 'white',
        border: '1px solid black',
        borderRadius: '8px',
        padding: '10px',
        width: '150px',
        textAlign: 'center' as const
    };

    const initialNodes = [
        {
            id: 'form-a',
            data: { label: 'Form A' },
            position: {x: 100, y: 100},
            style: nodeStyle
        },
        {
            id: 'form-b',
            data: { label: 'Form B' },
            position: {x: 50, y: 50},
            style: nodeStyle
        },
        {
            id: 'form-c',
            data: { label: 'Form C' },
            position: {x: 300, y: 50},
            style: nodeStyle
        },
        {
            id: 'form-d',
            data: { label: 'Form D' },
            position: {x: 300, y: 150},
            style: nodeStyle
        },
        {
            id: 'form-e',
            data: { label: 'Form E' },
            position: {x: 600, y: 50},
            style: nodeStyle
        },
    ]

    const initialEdges = [
        {id: 'e1', source: 'form-a', target: 'form-b'},
        {id: 'e2', source: 'form-a', target: 'form-c'},
        {id: 'e3', source: 'form-b', target: 'form-d'},
        {id: 'e4', source: 'form-c', target: 'form-e'},
    ]

    const [nodes, _setNodes] = useState(initialNodes);
    const [edges, _setEdges] = useState(initialEdges);

    const onNodeClick = (_event: any, node: any) => {
        console.log('Node clicked: ', node);
    };

    const defaultEdgeOptions = {
        animated: true,
        type: 'smoothstep',
        style: {stroke: '#aaa'}       
    };

    return (
        <div style={{width: '800px', height: '600px', border: '1px solid black'}}>
         <ReactFlow
         nodes={nodes} edges={edges} onNodeClick={onNodeClick} defaultEdgeOptions={defaultEdgeOptions}>            
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>   
        </div>
    );
};

export default FlowGraph;