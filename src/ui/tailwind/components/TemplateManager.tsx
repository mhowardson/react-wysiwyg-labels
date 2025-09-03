import React, { useState } from 'react';
import { HiSave as SaveIcon, HiFolderOpen as FolderOpenIcon, HiTrash as TrashIcon, HiPlus as PlusIcon } from 'react-icons/hi2';

const TemplateManager = ({
  templates = [],
  onSave,
  onLoad,
  onDelete,
  currentTemplate,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSave = () => {
    if (templateName.trim() && onSave) {
      onSave({
        name: templateName.trim(),
        description: templateDescription.trim(),
        timestamp: new Date().toISOString()
      });
      setTemplateName('');
      setTemplateDescription('');
      setIsModalOpen(false);
    }
  };

  const handleLoad = (template) => {
    if (onLoad) {
      onLoad(template);
    }
  };

  const handleDelete = (templateId) => {
    if (onDelete && window.confirm('Are you sure you want to delete this template?')) {
      onDelete(templateId);
    }
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          title="Save current template"
        >
          <SaveIcon size={16} />
          Save
        </button>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{template.name}</h4>
              {template.description && (
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(template.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoad(template)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                title="Load template"
              >
                <FolderOpenIcon size={16} />
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                title="Delete template"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No templates saved yet</p>
            <p className="text-sm mt-1">Click Save to create your first template</p>
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template description (optional)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!templateName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;