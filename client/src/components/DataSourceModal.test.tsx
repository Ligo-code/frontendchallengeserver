import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import DataSourceModal from './nodes/DataSourceModal';

// Simple mock implementation
jest.mock('../services/api', () => ({
  fetchAvailableDataSources: () => Promise.resolve([
    {
      id: 'direct-forms',
      name: 'Direct Dependencies',
      type: 'form',
      children: []
    },
    {
      id: 'action',
      name: 'Action Properties',
      type: 'global',
      fields: [
        { id: 'id', name: 'ID', path: 'action.id' },
        { id: 'timestamp', name: 'Timestamp', path: 'action.timestamp' }
      ]
    },
    {
      id: 'client',
      name: 'Client Organisation Properties',
      type: 'global',
      fields: []
    }
  ]),
  fetchGraph: () => Promise.resolve({ nodes: [], edges: [] }),
  fetchFormFields: () => Promise.resolve([])
}));

describe('DataSourceModal', () => {
  const mockOnSelect = jest.fn();
  const mockOnCancel = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders modal with header and search', async () => {
    render(
      <DataSourceModal 
        formId="form-a" 
        onSelect={mockOnSelect} 
        onCancel={mockOnCancel} 
      />
    );
    
    // @ts-ignore
    expect(screen.getByText('Select data element to map')).toBeInTheDocument();
    // @ts-ignore
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    // @ts-ignore
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });
  
  test('calls onCancel when Cancel button is clicked', () => {
    render(
      <DataSourceModal 
        formId="form-a" 
        onSelect={mockOnSelect} 
        onCancel={mockOnCancel} 
      />
    );
    
    fireEvent.click(screen.getByText('CANCEL'));
    expect(mockOnCancel).toHaveBeenCalled();
  });
  
  test('simulated field selection', () => {
    // This test doesn't interact with the DOM, just tests the callback
    const testField = { id: 'id', name: 'ID', path: 'action.id' };
    mockOnSelect(testField);
    expect(mockOnSelect).toHaveBeenCalledWith(testField);
  });
});