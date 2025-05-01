import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
  PrefillMapping,
  PrefillConfig,
  FormType,
  FieldType,
  DataSourceField,
} from "../types/prefill";
import { fetchFormFields, fetchAvailableForms, fetchPrefillConfig} from "../services/api";
import DataSourceModal from "./nodes/DataSourceModal";

interface PrefillPanelProps {
  node: Node | null;
  onClose: () => void;
  onSave: (config: PrefillConfig) => void;
}

const PrefillPanel: React.FC<PrefillPanelProps> = ({
  node,
  onClose,
  onSave,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [formFields, setFormFields] = useState<FieldType[]>([]);
  const [availableForms, setAvailableForms] = useState<FormType[]>([]);
  const [selectedTargetField, setSelectedTargetField] = useState<string | null>(
    null
  );
  const [mappings, setMappings] = useState<PrefillMapping[]>([]);
  const [showDataSourceModal, setShowDataSourceModal] =
    useState<boolean>(false);

  useEffect(() => {
    // loading form fields
    const loadFields = async () => {
      if (node) {
        try {
          const fields = await fetchFormFields(node.id);
          setFormFields(fields);
        } catch (error) {
          console.error("Error loading form fields:", error);
        }
      }
    };

    const loadForms = async () => {
      try {
        const forms = await fetchAvailableForms();
        setAvailableForms(forms);
      } catch (error) {
        console.error("Error loading available forms:", error);
      }
    };

    const loadPrefillConfig = async () => {
      if (node) {
        try {
          const config = await fetchPrefillConfig(node.id);
          if (config) {
            setEnabled(config.enabled);
            setMappings(config.mappings);
          }
        } catch (error) {
          console.error("Error loading prefill config:", error);
        }
      }
    };

    loadFields();
    loadForms();
    loadPrefillConfig();
  }, [node]);

  if (!node) return null;

  const handleMapField = (fieldId: string) => {
    setSelectedTargetField(fieldId);
    setShowDataSourceModal(true);
  };

  const handleSourceFieldSelected = (sourceField: DataSourceField) => {
    if (selectedTargetField) {
      // Extract source type from path
      const pathParts = sourceField.path.split(".");
      const sourceType =
        pathParts[0] === "form"
          ? "form"
          : pathParts[0] === "action"
          ? "action"
          : pathParts[0] === "client"
          ? "client"
          : "other";

      // Create new mapping
      const newMapping: PrefillMapping = {
        targetFieldId: selectedTargetField,
        sourceType,
        sourcePath: sourceField.path,
      };

      // Update mappings list
      const existingIndex = mappings.findIndex(
        (m) => m.targetFieldId === selectedTargetField
      );

      if (existingIndex >= 0) {
        const newMappings = [...mappings];
        newMappings[existingIndex] = newMapping;
        setMappings(newMappings);
      } else {
        setMappings([...mappings, newMapping]);
      }
    }

    setShowDataSourceModal(false);
    setSelectedTargetField(null);
  };

  const handleRemoveMapping = (fieldId: string) => {
    setMappings(
      mappings.filter(
        (mapping: PrefillMapping) => mapping.targetFieldId !== fieldId
      )
    );
  };

  const getMappingInfo = (fieldId: string) => {
    const mapping = mappings.find(
      (mapping: PrefillMapping) => mapping.targetFieldId === fieldId
    );
    if (!mapping) return null;
  
    // For form sources
    if (mapping.sourceType === "form") {
      const pathParts = mapping.sourcePath.split(".");
      if (pathParts.length >= 2) {
        const formId = pathParts[0];
        const fieldId = pathParts[1];
  
        // If it's a full form ID with UUID format, display it as is
        if (formId.includes("-")) {
          return `${formId}.${fieldId}`;
        }
  
        // Otherwise try to get the form name
        const sourceForm = availableForms.find(
          (form: FormType) => form.id === formId
        );
  
        const sourceField = sourceForm?.fields?.find(
          (field: FieldType) => field.id === fieldId
        );
  
        return sourceForm && sourceField
          ? `${sourceForm.name} > ${sourceField.name}`
          : null;
      }
    }
  
    // For other source types
    if (mapping.sourceType === "action") {
      return `Action > ${mapping.sourcePath.split(".")[1]}`;
    }
  
    if (mapping.sourceType === "client") {
      return `Client > ${mapping.sourcePath.split(".")[1]}`;
    }
  
    return mapping.sourcePath;
  };

  const handleSave = () => {
    onSave({
      formId: node.id,
      mappings: mappings,
      enabled: enabled,
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "20px",
        top: "20px",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "300px",
        zIndex: 999,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Prefill</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "10px" }}>
            Enable prefill for this form
          </span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
        </label>
      </div>

      {enabled && (
        <div>
          <h3>Available fields to prefill</h3>
          <div style={{ marginBottom: "10px", color: "#667" }}>
            Debug: {formFields.length} fields loaded
          </div>

          {formFields.map((field) => (
            <div
              key={field.id}
              style={{
                padding: "15px",
                border: "1px solid #eee",
                borderRadius: "4px",
                marginBottom: "15px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{field.name}</strong> ({field.type})
                </div>

                {getMappingInfo(field.id) ? (
                  <button
                    onClick={() => handleRemoveMapping(field.id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#f44336",
                    }}
                  >
                    &times;
                  </button>
                ) : (
                  <button
                    onClick={() => handleMapField(field.id)}
                    style={{
                      padding: "5px 10px",
                      background: "#4285f4",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Map Field
                  </button>
                )}
              </div>

              {getMappingInfo(field.id) && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "#4caf50",
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Mapped from: {getMappingInfo(field.id)}
                </div>
              )}
            </div>
          ))}

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                background: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {showDataSourceModal && selectedTargetField && (
        <DataSourceModal
          formId={node.id}
          onSelect={handleSourceFieldSelected}
          onCancel={() => setShowDataSourceModal(false)}
        />
      )}
    </div>
  );
};

export default PrefillPanel;
