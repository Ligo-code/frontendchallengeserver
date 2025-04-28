import axios from 'axios';
import { GraphData } from '../types/graph';

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
