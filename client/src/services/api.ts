// src/services/api.ts
import axios from 'axios';
import { GraphData } from '../types/graph';
import { FieldType, FormType, PrefillConfig, DataSourceGroup, DataSourceField } from '../types/prefill';
import { getDirectDependencies, getTransitiveDependencies } from './dependencyService';

// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  TENANT_ID: '123',
  BLUEPRINT_ID: 'bp_456'
};

export const fetchGraph = async (): Promise<GraphData> => {
  try{
    const { TENANT_ID, BLUEPRINT_ID, BASE_URL } = API_CONFIG;
    
    const url = `${BASE_URL}/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch graph data:', error);
    throw error;
  }
};

export const fetchFormFields = async (formId: string): Promise<FieldType[]> => {
  try {
    // For development/testing - use mock data
    // In production, uncomment the axios code and comment out the mock data
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('Fetching fields for form:', formId);

        // Extract the form identifier from the longer ID
    // The format appears to be form-{identifier}
    const formIdParts = formId.split('-');
    const shortFormId = formIdParts.length > 1 ? `form-${formIdParts[1]}` : formId;
    
    const fieldsByForm: Record<string, FieldType[]> = {
      'form-a': [
        { id: 'email', name: 'Email', type: 'email' },
        { id: 'name', name: 'Name', type: 'text' },
        { id: 'age', name: 'Age', type: 'number' }
      ],
      'form-b': [
        { id: 'email', name: 'Email', type: 'email' },
        { id: 'address', name: 'Address', type: 'textarea' }
      ],
      'form-a4750667': [
        { id: 'email', name: 'Email', type: 'email' },
        { id: 'address', name: 'Address', type: 'textarea' }
      ],
      'form-c': [
        { id: 'title', name: 'Title', type: 'text' },
        { id: 'description', name: 'Description', type: 'textarea' }
      ],
      'form-d': [
        { id: 'phone', name: 'Phone', type: 'tel' },
        { id: 'website', name: 'Website', type: 'url' }
      ],
      'form-e': [
        { id: 'category', name: 'Category', type: 'select' },
        { id: 'priority', name: 'Priority', type: 'select' }
      ]
    };
    
    // First try the exact ID
    if (fieldsByForm[formId]) {
      return fieldsByForm[formId];
    }
    
    // Then try with the short form ID
    if (fieldsByForm[shortFormId]) {
      return fieldsByForm[shortFormId];
    }
    
    // If that doesn't work, try to match by prefix
    const matchingFormId = Object.keys(fieldsByForm).find(key => formId.startsWith(key));
    if (matchingFormId) {
      return fieldsByForm[matchingFormId];
    }
    
    // Finally, provide default fields if no match is found
    console.log('No matching form found, returning default fields');
    return [
      { id: 'default-field-1', name: 'Default Field 1', type: 'text' },
      { id: 'default-field-2', name: 'Default Field 2', type: 'text' }
    ];
    /* Production implementation
    const { TENANT_ID, BLUEPRINT_ID, BASE_URL } = API_CONFIG;
    const url = `${BASE_URL}/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/nodes/${formId}/form-fields`;
    const response = await axios.get<FieldType[]>(url);
    return response.data;
    */
  } catch (error) {
    console.error('Failed to fetch form fields:', error);
    throw error;
  }
};

export const fetchAvailableForms = async (): Promise<FormType[]> => {
  try {
    // For development/testing - use mock data
    // In production, uncomment the axios code and comment out the mock data
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const forms: FormType[] = [
      { 
        id: 'form-a', 
        name: 'Form A',
        fields: [
          { id: 'email', name: 'Email', type: 'email' },
          { id: 'name', name: 'Name', type: 'text' },
          { id: 'age', name: 'Age', type: 'number' }
        ]
      },
      { 
        id: 'form-b', 
        name: 'Form B',
        fields: [
          { id: 'email', name: 'Email', type: 'email' },
          { id: 'address', name: 'Address', type: 'textarea' }
        ]
      },
      { 
        id: 'form-c', 
        name: 'Form C',
        fields: [
          { id: 'title', name: 'Title', type: 'text' },
          { id: 'description', name: 'Description', type: 'textarea' }
        ]
      }
    ];
    
    return forms;
    
    /* Production implementation
    const { TENANT_ID, BASE_URL } = API_CONFIG;
    const url = `${BASE_URL}/${TENANT_ID}/forms`;
    const response = await axios.get<FormType[]>(url);
    return response.data;
    */
  } catch (error) {
    console.error('Failed to fetch available forms:', error);
    throw error;
  }
};

// Save prefill configuration
export const savePrefillConfig = async (config: PrefillConfig): Promise<{success: boolean}> => {
  try {
    // For development/testing - use mock implementation
    // In production, uncomment the axios code
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Saved prefill config for form ${config.formId}:`, config);
    
    // Save the config to the in-memory storage
    if (!window.prefillConfigs) {
      window.prefillConfigs = {};
    }
    window.prefillConfigs[config.formId] = config;
    
    return { success: true };
    
    /* Production implementation
    const { TENANT_ID, BLUEPRINT_ID, BASE_URL } = API_CONFIG;
    const url = `${BASE_URL}/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/prefill-config`;
    const response = await axios.post(url, config);
    return response.data;
    */
  } catch (error) {
    console.error('Failed to save prefill config:', error);
    throw error;
  }
};

// Fetch existing prefill config for a form
export const fetchPrefillConfig = async (formId: string): Promise<PrefillConfig | null> => {
  try {
    // For development/testing - use mock implementation
    // In production, uncomment the axios code
    
    // Mock implementation
    // Create a simple in-memory storage for prefill configs
    // This should be a more persistent storage in a real app
    if (!window.prefillConfigs) {
      window.prefillConfigs = {};
    }
    
    // Return the saved config if it exists
    return window.prefillConfigs[formId] || null;
    
    /* Production implementation
    const { TENANT_ID, BLUEPRINT_ID, BASE_URL } = API_CONFIG;
    const url = `${BASE_URL}/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/nodes/${formId}/prefill-config`;
    
    try {
      const response = await axios.get<PrefillConfig>(url);
      return response.data;
    } catch (error) {
      // If 404, return null (no config exists yet)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
    */
  } catch (error) {
    console.error('Failed to fetch prefill config:', error);
    throw error;
  }
};

export const fetchAvailableDataSources = async (formId: string): Promise<DataSourceGroup[]> => {
  try {
    // In a real application, this would be an API request
    // For demonstration, we're using mocks with the existing data
    
    const graph = await fetchGraph();
    
    // Get dependencies
    const directDeps = getDirectDependencies(graph, formId);
    const transitiveDeps = getTransitiveDependencies(graph, formId)
      .filter(id => !directDeps.includes(id));
    
    console.log('Direct dependencies:', directDeps);
    console.log('Transitive dependencies:', transitiveDeps);
    
    // Form the data sources structure
    const sources: DataSourceGroup[] = [
      {
        id: 'direct-forms',
        name: 'Direct Dependencies',
        type: 'form',
        children: await Promise.all(directDeps.map(async depId => {
          const fields = await fetchFormFields(depId);
          return {
            id: depId,
            name: `Form ${depId.split('-')[1]?.toUpperCase() || depId}`,
            type: 'form',
            fields: fields.map(field => ({
              id: field.id,
              name: field.name,
              path: `${depId}.${field.id}`
            }))
          };
        }))
      },
      {
        id: 'transitive-forms',
        name: 'Transitive Dependencies',
        type: 'form',
        children: await Promise.all(transitiveDeps.map(async depId => {
          const fields = await fetchFormFields(depId);
          return {
            id: depId,
            name: `Form ${depId.split('-')[1]?.toUpperCase() || depId}`,
            type: 'form',
            fields: fields.map(field => ({
              id: field.id,
              name: field.name,
              path: `${depId}.${field.id}`
            }))
          };
        }))
      },
      // Other source groups remain the same
      {
        id: 'action',
        name: 'Action Properties',
        type: 'global',
        fields: [
          { id: 'id', name: 'ID', path: 'action.id' },
          { id: 'timestamp', name: 'Timestamp', path: 'action.timestamp' },
          { id: 'status', name: 'Status', path: 'action.status' },
          { id: 'created_by', name: 'Created By', path: 'action.created_by' },
          { id: 'updated_at', name: 'Last Updated', path: 'action.updated_at' }
        ]
      },
      {
        id: 'client',
        name: 'Client Organisation Properties',
        type: 'global',
        fields: [
          { id: 'name', name: 'Organisation Name', path: 'client.name' },
          { id: 'industry', name: 'Industry', path: 'client.industry' },
          { id: 'address', name: 'Address', path: 'client.address' },
          { id: 'contact_email', name: 'Contact Email', path: 'client.contact_email' },
          { id: 'phone', name: 'Phone Number', path: 'client.phone' }
        ]
      }
    ];
    
    return sources;
  } catch (error) {
    console.error('Failed to fetch available data sources:', error);
    throw error;
  }
};