import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
  PrefillMapping,
  PrefillConfig,
  FormType,
  FieldType,
} from "../types/prefill";
import { fetchFormFields, fetchAvailableForms } from "../services/api";

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
  const [formFields, setFormFields] = useState<any[]>([]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [mappings, setMappings] = useState<PrefillMapping[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

    loadFields();
    loadForms();
  }, [node]);

  if (!node) return null;

  const handleAddMapping = (
    targetFieldId: string,
    sourceFormId: string,
    sourceFieldId: string
  ) => {
    // Проверяем, есть ли уже маппинг для этого поля
    const existingIndex = mappings.findIndex(
      (m) => m.targetFieldId === targetFieldId
    );

    if (existingIndex >= 0) {
      // Обновляем существующий маппинг
      const newMappings = [...mappings];
      newMappings[existingIndex] = {
        targetFieldId,
        sourceFormId,
        sourceFieldId,
      };
      setMappings(newMappings);
    } else {
      // new mapping
      setMappings([
        ...mappings,
        { targetFieldId, sourceFormId, sourceFieldId },
      ]);
    }

    setSelectedField(null);
    setSelectedForm(null);
    setShowDropdown(false);
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

    const sourceForm = availableForms.find(
      (form: FormType) => form.id === mapping.sourceFormId
    );

    const sourceField = sourceForm?.fields?.find(
      (field: FieldType) => field.id === mapping.sourceFieldId
    );

    return sourceForm && sourceField
      ? `${sourceForm.name} > ${sourceField.name}`
      : null;
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
        right: "20px",
        top: "20px",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "400px",
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
                    onClick={() => {
                      setSelectedField(field.id);
                      setShowDropdown(true);
                    }}
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

              {selectedField === field.id && showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    width: "100%",
                    background: "white",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    <strong>Select source form</strong>
                  </div>

                  {availableForms.map((form) => (
                    <div
                      key={form.id}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        backgroundColor:
                          selectedForm === form.id ? "#f5f5f5" : "white",
                      }}
                      onClick={() => setSelectedForm(form.id)}
                    >
                      {form.name}

                      {selectedForm === form.id && form.fields && (
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                          {form.fields.map((sourceField: any) => (
                            <div
                              key={sourceField.id}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                backgroundColor: "#f9f9f9",
                                margin: "5px 0",
                                borderRadius: "4px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddMapping(
                                  field.id,
                                  form.id,
                                  sourceField.id
                                );
                              }}
                            >
                              {sourceField.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
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
    </div>
  );
};

export default PrefillPanel;
