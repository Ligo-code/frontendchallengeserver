export interface FieldType {
  id: string;
  name: string;
  type: string;
}

export interface FormType {
  id: string;
  name: string;
  fields?: FieldType[];
}

export interface PrefillMapping {
  targetFieldId: string;
  sourceFormId: string;
  sourceFieldId: string;
}

export interface PrefillConfig {
  formId: string;
  mappings: PrefillMapping[];
  enabled: boolean;
}
