import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const FormNode: React.FC<NodeProps> = ({ data }) => {
    return (
        <div className="form-node">
        <Handle 
          type="target" 
          position={Position.Left} 
          id="target" 
        />
        <div className="node-content">
          <div className="node-header">Form</div>
          <div className="node-label">{data.label}</div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="source"  
        />
      </div>
    );
  };
  
  export default memo(FormNode);

