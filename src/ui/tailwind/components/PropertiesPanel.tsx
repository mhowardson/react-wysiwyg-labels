import React from 'react'
import { HiCog8Tooth as Settings, HiArrowPath as RotateCw, HiRectangleStack as Layers, HiSwatch as Palette, HiOutlineType as Type, HiChartBar as BarChart3 } from 'react-icons/hi2'

interface Element {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  properties: Record<string, any>
}

interface PropertiesPanelProps {
  element?: Element
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element }) => {
  if (!element) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Properties</h3>
        </div>
        <p className="text-gray-500 text-center py-8">Select an element to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Properties</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position & Size</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Width</label>
              <input
                type="number"
                value={Math.round(element.width)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Height</label>
              <input
                type="number"
                value={Math.round(element.height)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {element.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Properties</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Content</label>
                <textarea
                  value={element.properties?.text || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter text content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={element.properties?.fontSize || 12}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <input
                    type="color"
                    value={element.properties?.color || '#000000'}
                    className="w-full h-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertiesPanel