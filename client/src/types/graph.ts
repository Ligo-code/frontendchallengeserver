export type NodeData = {
    label: string;
  };
  
  export type FlowNode = {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: NodeData;
  };
  
  export type FlowEdge = {
    id: string;
    source: string;
    target: string;
  };