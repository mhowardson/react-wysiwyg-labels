import React, { useState } from 'react';
import { HiClipboardDocument as CopyIcon, HiArrowDownTray as DownloadIcon } from 'react-icons/hi2';

const CodePreview = ({
  elements = [],
  labelSize = { width: 400, height: 300 },
  onExport,
  className = ''
}) => {
  const [activeFormat, setActiveFormat] = useState('ZPL');
  const [code, setCode] = useState('');

  const formats = ['ZPL', 'EPL', 'DPL'];

  const generateCode = (format) => {
    if (!onExport) return '';
    
    const generatedCode = onExport(elements, labelSize, format);
    setCode(generatedCode);
    return generatedCode;
  };

  const handleFormatChange = (format) => {
    setActiveFormat(format);
    generateCode(format);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    
    const extension = activeFormat.toLowerCase();
    const filename = `label_code.${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    generateCode(activeFormat);
  }, [elements, labelSize, activeFormat]);

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Code Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!code}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Copy code"
          >
            <CopyIcon size={16} />
            Copy
          </button>
          <button
            onClick={handleDownload}
            disabled={!code}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Download code"
          >
            <DownloadIcon size={16} />
            Download
          </button>
        </div>
      </div>

      {/* Format Selector */}
      <div className="flex border-b border-gray-200 mb-4">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => handleFormatChange(format)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeFormat === format
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
          {code || (
            <span className="text-gray-500 italic">
              {elements.length === 0 
                ? 'Add elements to your label to see generated code'
                : 'Click on a format tab to generate code'
              }
            </span>
          )}
        </pre>
      </div>

      {/* Format Info */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="font-medium">{activeFormat} Format:</span>
          <span>
            {activeFormat === 'ZPL' && 'Zebra Programming Language - for Zebra printers'}
            {activeFormat === 'EPL' && 'Eltron Programming Language - for legacy Eltron printers'}
            {activeFormat === 'DPL' && 'Datamax Programming Language - for Datamax printers'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;