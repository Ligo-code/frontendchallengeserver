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
  sourceType: 'form' | 'action' | 'client' | 'other';
  sourcePath: string; // Path to source, e.g., "form-b.email" or "action.timestamp"
}

export interface PrefillConfig {
  formId: string;
  mappings: PrefillMapping[];
  enabled: boolean;
}

export interface DataSourceField {
  id: string;
  name: string;
  path: string; // Full path to the field including hierarchy
}

export interface DataSourceGroup {
  id: string;
  name: string;
  type: 'form' | 'global' | 'other';
  fields?: DataSourceField[];
  children?: DataSourceGroup[];
}
