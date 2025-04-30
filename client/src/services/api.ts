// src/services/api.ts
import axios from 'axios';
import { GraphData } from '../types/graph';
import { FieldType, FormType, PrefillConfig } from '../types/prefill';

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
    
    return fieldsByForm[formId] || [];
    
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
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Fetching prefill config for form: ${formId}`);
    
    // Return null to simulate no existing config
    return null;
    
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