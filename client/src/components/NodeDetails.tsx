import React from "react";
import { Node } from "reactflow";

interface NodeDetailsProps {
  node: Node | null;
  onClose: () => void;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: "20px",
        top: "20px",
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "300px",
        zIndex: 999,
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{node.data.label}</h3>
      <p style={{ margin: "5px 0" }}>
        <strong>Type:</strong> {node.data.type || "Not specified"}
      </p>
      <p style={{ margin: "5px 0" }}>
        <strong>ID:</strong> {node.id}
      </p>
      <p style={{ margin: "5px 0" }}>
        <strong>Position:</strong> x={Math.round(node.position.x)}, y=
        {Math.round(node.position.y)}
      </p>

      <button
        style={{
          padding: "8px 12px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default NodeDetails;