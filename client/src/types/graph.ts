export interface GraphNode {
  id: string;
  position?: {
    x: number;
    y: number;
  };
  data?: {
    name?: string;
    component_type?: string;
    [key: string]: any;
  };
  type?: string;
}

export interface GraphEdge {
  id?: string;
  source: string;  
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms?: any[];
  branches?: any[];
}