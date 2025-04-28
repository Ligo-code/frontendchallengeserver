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
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms?: any[];
  branches?: any[];
}