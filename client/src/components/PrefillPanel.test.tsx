import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import PrefillPanel from './PrefillPanel';


// Create simple mock implementations that avoid jest.Mock typing issues
jest.mock('../services/api', () => {
  return {
    fetchFormFields: () => Promise.resolve([
      { id: 'email', name: 'Email', type: 'email' },
      { id: 'name', name: 'Name', type: 'text' }
    ]),
    fetchAvailableForms: () => Promise.resolve([
      { 
        id: 'form-b', 
        name: 'Form B',
        fields: [{ id: 'username', name: 'Username', type: 'text' }]
      }
    ])
  };
});

describe('PrefillPanel', () => {
  // Mock data for tests
  const mockNode = {
    id: 'form-a',
    type: 'form',
    data: { label: 'Form A' },
    position: { x: 0, y: 0 }
  };
  
  // Define mock functions for props
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('renders the panel with title', async () => {
    render(
      <PrefillPanel 
        node={mockNode} 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
      />
    );
    
    // @ts-ignore - Ignore type error for jest-dom matcher
    expect(screen.getByText('Prefill')).toBeInTheDocument();
  });
  
  test('toggle enables fields section', async () => {
    render(
      <PrefillPanel 
        node={mockNode} 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
      />
    );
    
    // Toggle should be unchecked by default
    const toggleCheckbox = screen.getByRole('checkbox');
    // @ts-ignore - Ignore type error for jest-dom matcher
    expect(toggleCheckbox).not.toBeChecked();
    
    // Enable the toggle
    fireEvent.click(toggleCheckbox);
    // @ts-ignore - Ignore type error for jest-dom matcher
    expect(toggleCheckbox).toBeChecked();
    
    // Check that fields section appears
    await waitFor(() => {
      // @ts-ignore - Ignore type error for jest-dom matcher
      expect(screen.getByText('Available fields to prefill')).toBeInTheDocument();
    });
  });
  
  test('calls onClose when close button is clicked', async () => {
    render(
      <PrefillPanel 
        node={mockNode} 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
      />
    );
    
    // Find and click the close button (× in the top right)
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('saves configuration when Save button is clicked', async () => {
    render(
      <PrefillPanel 
        node={mockNode} 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
      />
    );
    
    // Enable prefill
    const toggleCheckbox = screen.getByRole('checkbox');
    fireEvent.click(toggleCheckbox);
    
    // Wait for fields to load
    await waitFor(() => {
      // @ts-ignore - Ignore type error for jest-dom matcher
      expect(screen.getByText('Available fields to prefill')).toBeInTheDocument();
    });
    
    // Find and click the save button
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    // Check that onSave is called with correct parameters
    expect(mockOnSave).toHaveBeenCalledWith({
      formId: 'form-a',
      mappings: [],
      enabled: true
    });
  });
});