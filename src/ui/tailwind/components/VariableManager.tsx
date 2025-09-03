import React, { useState } from 'react';
import { HiPlus as PlusIcon, HiPencil as EditIcon, HiTrash as TrashIcon, HiOutlineType as TypeIcon, HiCalendarDays as CalendarIcon, HiHashtag as HashIcon, HiQrCode as QrCodeIcon } from 'react-icons/hi2';

const VARIABLE_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BARCODE: 'barcode'
};

const VARIABLE_TYPE_ICONS = {
  [VARIABLE_TYPES.TEXT]: TypeIcon,
  [VARIABLE_TYPES.NUMBER]: HashIcon,
  [VARIABLE_TYPES.DATE]: CalendarIcon,
  [VARIABLE_TYPES.BARCODE]: QrCodeIcon
};

const VariableManager = ({
  variables = [],
  onAdd,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: VARIABLE_TYPES.TEXT,
    value: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: VARIABLE_TYPES.TEXT,
      value: '',
      description: ''
    });
    setEditingVariable(null);
  };

  const handleOpenModal = (variable = null) => {
    if (variable) {
      setFormData({ ...variable });
      setEditingVariable(variable);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (formData.name.trim()) {
      const variableData = {
        ...formData,
        name: formData.name.trim(),
        id: editingVariable ? editingVariable.id : `var_${Date.now()}`
      };

      if (editingVariable) {
        onEdit && onEdit(variableData);
      } else {
        onAdd && onAdd(variableData);
      }

      handleCloseModal();
    }
  };

  const handleDelete = (variable) => {
    if (window.confirm(`Are you sure you want to delete variable "${variable.name}"?`)) {
      onDelete && onDelete(variable.id);
    }
  };

  const getDefaultValue = (type) => {
    switch (type) {
      case VARIABLE_TYPES.NUMBER:
        return '0';
      case VARIABLE_TYPES.DATE:
        return new Date().toISOString().split('T')[0];
      case VARIABLE_TYPES.BARCODE:
        return '1234567890';
      default:
        return '';
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      value: prev.value || getDefaultValue(newType)
    }));
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Variables</h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          title="Add new variable"
        >
          <PlusIcon size={16} />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {variables.map((variable) => {
          const IconComponent = VARIABLE_TYPE_ICONS[variable.type];
          
          return (
            <div
              key={variable.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-blue-600">
                  <IconComponent size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {`{{${variable.name}}}`}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      {variable.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Value: <span className="font-mono">{variable.value}</span>
                  </p>
                  {variable.description && (
                    <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(variable)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Edit variable"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(variable)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete variable"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {variables.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No variables defined yet</p>
            <p className="text-sm mt-1">Click Add to create your first variable</p>
          </div>
        )}
      </div>

      {/* Variable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingVariable ? 'Edit Variable' : 'Add Variable'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variable Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., customerName, orderDate"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={VARIABLE_TYPES.TEXT}>Text</option>
                  <option value={VARIABLE_TYPES.NUMBER}>Number</option>
                  <option value={VARIABLE_TYPES.DATE}>Date</option>
                  <option value={VARIABLE_TYPES.BARCODE}>Barcode</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Value
                </label>
                {formData.type === VARIABLE_TYPES.DATE ? (
                  <input
                    type="date"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={formData.type === VARIABLE_TYPES.NUMBER ? 'number' : 'text'}
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${formData.type} value`}
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingVariable ? 'Update' : 'Add'} Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { VARIABLE_TYPES };
export default VariableManager;