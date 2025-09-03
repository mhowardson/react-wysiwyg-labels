import React, { useState, useRef } from 'react';
import { HiArrowUpTray as UploadIcon, HiPhoto as ImageIcon, HiX as XIcon } from 'react-icons/hi2';

const ImageUploader = ({
  onImageSelect,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert(`Please select a valid image file. Accepted types: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      alert(`File size too large. Maximum size: ${Math.round(maxFileSize / (1024 * 1024))}MB`);
      return;
    }

    // Create file reader for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        file,
        dataUrl: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      setPreview(imageData);
      onImageSelect && onImageSelect(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect && onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Upload</h3>
      
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
          />
          
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Drop your image here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Maximum size: {Math.round(maxFileSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={preview.dataUrl}
              alt={preview.name}
              className="w-full h-48 object-contain bg-gray-50"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <XIcon size={16} />
            </button>
          </div>
          
          {/* Image Info */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <ImageIcon className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate" title={preview.name}>
                {preview.name}
              </p>
              <p className="text-sm text-gray-600">
                {formatFileSize(preview.size)} • {preview.type.split('/')[1].toUpperCase()}
              </p>
            </div>
          </div>
          
          {/* Upload Another */}
          <button
            onClick={handleClick}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Upload Different Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;