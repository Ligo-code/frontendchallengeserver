import * as dagre from "dagre";
import { Node, Edge } from "reactflow";

/*
Automatically arranges nodes and edges using the dagre algorithm
 */

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  if (!nodes.length) return { nodes, edges };

  //create a new darge graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  //vertical or horizontal Layout
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
  });

  // Add nodes to the dagre graph with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  //Add edges to the dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Apply the calculated positions to our nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    if (nodeWithPosition) {
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 90,
          y: nodeWithPosition.y - 40,
        },
      };
    }
    return node;
  });

  return { nodes: layoutedNodes, edges };
};
