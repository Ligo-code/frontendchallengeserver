import React, { useState, useEffect } from 'react';
import { DataSourceGroup, DataSourceField } from '../../types/prefill';
import { fetchAvailableDataSources } from '../../services/api';
import './DataSourceModal.css';

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
  const [selectedField, setSelectedField] = useState<DataSourceField | null>(null);
  
  useEffect(() => {
    const loadSources = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailableDataSources(formId);
        setSources(data);
        
        // Auto-expand the first group for better UX
        if (data.length > 0) {
          setExpandedGroups(new Set([data[0].id]));
        }
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
  
  const filterSources = (sources: DataSourceGroup[], term: string): DataSourceGroup[] => {
    if (!term) return sources;
    
    return sources
      .map(group => {
        const filteredFields = group.fields
          ? group.fields.filter(field => 
              field.name.toLowerCase().includes(term.toLowerCase()))
          : undefined;
        
        const filteredChildren = group.children
          ? filterSources(group.children, term)
          : undefined;
        
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
  
  const handleFieldClick = (field: DataSourceField) => {
    setSelectedField(field);
  };
  
  const handleSelectClick = () => {
    if (selectedField) {
      onSelect(selectedField);
    }
  };
  
  const renderGroup = (group: DataSourceGroup, level = 0) => {
    const isExpanded = expandedGroups.has(group.id);
    
    return (
      <div 
        key={`group-${group.id}`} 
        className={`data-source-group ${level > 0 ? 'child-group' : ''}`}
      >
        <div 
          className="group-header" 
          onClick={() => toggleGroup(group.id)}
        >
          <span className="expand-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
          <span>{group.name}</span>
        </div>
        
        {isExpanded && (
          <div className="group-content">
            {group.fields && group.fields.map(field => (
              <div 
                key={`field-${group.id}-${field.id}`} 
                className={`field-item ${selectedField && selectedField.id === field.id && selectedField.path === field.path ? 'selected' : ''}`}
                onClick={() => handleFieldClick(field)}
              >
                {field.name}
              </div>
            ))}
            
            {group.children && group.children.map((child, index) => renderGroup({
              ...child,
              id: `${child.id}-${index}`
            }, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="data-source-modal">
      <div className="modal-content">
        <div className="modal-header">
          Select data element to map
        </div>
        
        <div className="modal-body">
          <div className="available-data">
            Available data
          </div>
          
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sources-container">
            {loading ? (
              <div className="loading">Loading data sources...</div>
            ) : filteredSources.length > 0 ? (
              <div className="source-list">
                {filteredSources.map(source => renderGroup(source))}
              </div>
            ) : (
              <div className="no-results">No matching data sources found</div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="select-button" 
            onClick={handleSelectClick}
            disabled={!selectedField}
          >
            SELECT
          </button>
          <button 
            className="cancel-button" 
            onClick={onCancel}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceModal;