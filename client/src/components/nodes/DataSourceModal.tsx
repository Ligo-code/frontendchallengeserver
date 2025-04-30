import React, { useState, useEffect } from 'react';
import { DataSourceGroup, DataSourceField } from '../../types/prefill';
import { fetchAvailableDataSources } from '../../services/api';

interface DataSourceModalProps {
  formId: string;
  onSelect: (field: DataSourceField) => void;
  onCancel: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ formId, onSelect, onCancel }) => {
  const [sources, setSources] = useState<DataSourceGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const loadSources = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailableDataSources(formId);
        setSources(data);
      } catch (error) {
        console.error('Error loading data sources:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSources();
  }, [formId]);
  
  const toggleGroup = (groupId: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(groupId)) {
      newSet.delete(groupId);
    } else {
      newSet.add(groupId);
    }
    setExpandedGroups(newSet);
  };
  
  // Function to filter sources based on search term
  const filterSources = (sources: DataSourceGroup[], term: string): DataSourceGroup[] => {
    if (!term) return sources;
    
    return sources
      .map(group => {
        // Filter fields in the group
        const filteredFields = group.fields
          ? group.fields.filter(field => 
              field.name.toLowerCase().includes(term.toLowerCase()))
          : undefined;
        
        // Filter child groups
        const filteredChildren = group.children
          ? filterSources(group.children, term)
          : undefined;
        
        // Include the group if it has matching fields or child groups
        if ((filteredFields && filteredFields.length > 0) || 
            (filteredChildren && filteredChildren.length > 0)) {
          return {
            ...group,
            fields: filteredFields,
            children: filteredChildren
          };
        }
        
        return null;
      })
      .filter(Boolean) as DataSourceGroup[];
  };
  
  const filteredSources = filterSources(sources, searchTerm);
  
  // Render a group and its contents
  const renderGroup = (group: DataSourceGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    
    return (
      <div key={group.id} className="data-source-group" style={{ marginBottom: '10px' }}>
        <div 
          className="group-header" 
          onClick={() => toggleGroup(group.id)}
          style={{
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className="expand-icon" style={{ marginRight: '8px' }}>
            {isExpanded ? '▼' : '▶'}</span>
          <span style={{ fontWeight: 'bold' }}>{group.name}</span>
        </div>
        
        {isExpanded && (
          <div className="group-content" style={{ marginLeft: '15px', marginTop: '5px' }}>
            {group.fields && group.fields.map(field => (
              <div 
                key={field.id} 
                className="field-item"
                onClick={() => onSelect(field)}
                style={{
                  padding: '8px',
                  margin: '5px 0',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  border: '1px solid #eee'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              >
                {field.name}
              </div>
            ))}
            
            {group.children && group.children.map((child, index) => renderGroup({
            ...child,
            id: `${child.id}-${index}` // Ensure unique ID for each child
          }))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="data-source-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '80%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
        <h2>Select data element to map</h2>
        
        <div className="search-container" style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          />
        </div>
        
        <div className="sources-container">
          {loading ? (
            <div className="loading">Loading data sources...</div>
          ) : filteredSources.length > 0 ? (
            <div className="source-list">
              {filteredSources.map(renderGroup)}
            </div>
          ) : (
            <div className="no-results">No matching data sources found</div>
          )}
        </div>
        
        <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
        <button 
          className="cancel-button" 
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceModal;