import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, BarChart3, Trash2, ArrowRight } from 'lucide-react';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress?: number;
  error?: string;
  type: string;
}

const DataImport: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        status: 'idle' as FileStatus,
        type: file.type || getFileTypeFromName(file.name)
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        status: 'idle' as FileStatus,
        type: file.type || getFileTypeFromName(file.name)
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };

  const getFileTypeFromName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv') return 'text/csv';
    if (extension === 'xlsx' || extension === 'xls') return 'application/vnd.ms-excel';
    if (extension === 'json') return 'application/json';
    
    return 'application/octet-stream';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('csv')) return <File size={24} className="text-green-500" />;
    if (fileType.includes('excel')) return <File size={24} className="text-emerald-500" />;
    if (fileType.includes('json')) return <File size={24} className="text-amber-500" />;
    return <File size={24} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const processFiles = () => {
    // Update file statuses to simulate processing
    setFiles(files.map(file => ({
      ...file,
      status: 'uploading',
      progress: 0
    })));

    // Simulate processing with progress updates
    files.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          
          // Simulate some files succeeding and some failing for demo purposes
          const status = Math.random() > 0.2 ? 'success' : 'error';
          const error = status === 'error' ? 'Error processing file format' : undefined;
          
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id ? { ...f, status, progress, error } : f
            )
          );
        } else {
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 200 + index * 100); // Stagger the updates for visual effect
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Data Import</h1>
        <button 
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={files.length === 0}
          onClick={processFiles}
        >
          <BarChart3 size={16} />
          <span>Process Files</span>
        </button>
      </div>

      {/* File Drop Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
          <UploadCloud size={24} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">Drag & Drop Files</h3>
        <p className="text-sm text-gray-500 mt-2 mb-4">or click to browse files from your computer</p>
        
        <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
          <span>Browse Files</span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileInputChange} 
            multiple 
            accept=".csv,.xls,.xlsx,.json" 
          />
        </label>
        
        <p className="text-xs text-gray-500 mt-4">
          Supported file types: CSV, Excel (XLS, XLSX), JSON
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Files ({files.length})</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {files.map(file => (
              <li key={file.id} className="px-6 py-4 flex items-center">
                <div className="mr-4">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {file.status === 'idle' && (
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      {file.status === 'uploading' && (
                        <div className="flex items-center">
                          <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{Math.round(file.progress || 0)}%</span>
                        </div>
                      )}
                      
                      {file.status === 'success' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-xs">Processed</span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle size={16} className="mr-1" />
                          <span className="text-xs">{file.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {file.status === 'success' && (
                    <div className="mt-2 flex items-center">
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                        View Results <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Import Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Encoding</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="utf-8">UTF-8</option>
                <option value="ascii">ASCII</option>
                <option value="latin1">Latin-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CSV Delimiter</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
              </select>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="header-row" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="header-row" className="ml-2 block text-sm text-gray-700">
                First row contains headers
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Field Mapping</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select how to map source fields to destination fields
          </p>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="auto-map" 
              name="mapping-type"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              defaultChecked
            />
            <label htmlFor="auto-map" className="ml-2 block text-sm text-gray-700">
              Auto-map fields
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input 
              type="radio" 
              id="manual-map" 
              name="mapping-type"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="manual-map" className="ml-2 block text-sm text-gray-700">
              Manual field mapping
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Data Processing</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="trim-whitespace" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="trim-whitespace" className="ml-2 block text-sm text-gray-700">
                Trim whitespace from fields
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="skip-empty" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="skip-empty" className="ml-2 block text-sm text-gray-700">
                Skip empty rows
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="validate-sku" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="validate-sku" className="ml-2 block text-sm text-gray-700">
                Validate SKU formats
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="auto-match" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="auto-match" className="ml-2 block text-sm text-gray-700">
                Auto-match SKUs to MSKUs
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;