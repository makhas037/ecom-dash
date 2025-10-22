import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Trash2, Eye, Check, Database, FolderOpen, Download, X, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../api/axios.config';

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appliedDatasetId, setAppliedDatasetId] = useState(null);
  const userId = 'demo-user'; // Replace with actual user ID from auth

  useEffect(() => {
    loadDatasets();
    loadAppliedDataset();
  }, []);

  const loadDatasets = async () => {
    try {
      const response = await axiosInstance.get(`/datasets/${userId}`);
      setDatasets(response.data.datasets);
    } catch (error) {
      console.error('Load datasets error:', error);
      toast.error('Failed to load datasets');
    }
  };

  const loadAppliedDataset = async () => {
    try {
      const response = await axiosInstance.get(`/datasets/${userId}/applied`);
      if (response.data.dataset) {
        setAppliedDatasetId(response.data.dataset.id);
      }
    } catch (error) {
      console.error('Load applied dataset error:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    const uploadToast = toast.loading('Uploading dataset...');

    try {
      const response = await axiosInstance.post(
        `/datasets/${userId}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      toast.success('Dataset uploaded successfully!', { id: uploadToast });
      await loadDatasets();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Upload failed', { id: uploadToast });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  const handleViewDataset = async (dataset) => {
    setSelectedDataset(dataset);
    setLoading(true);
    setShowModal(true);

    try {
      const response = await axiosInstance.get(`/datasets/${userId}/${dataset.id}/data?limit=100`);
      setDatasetData(response.data);
    } catch (error) {
      console.error('View dataset error:', error);
      toast.error('Failed to load dataset data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDataset = async (datasetId) => {
    const applyToast = toast.loading('Applying dataset...');

    try {
      await axiosInstance.post(`/datasets/${userId}/${datasetId}/apply`);
      setAppliedDatasetId(datasetId);
      toast.success('Dataset applied! Dashboard will now use this data.', { id: applyToast });
      await loadDatasets();
    } catch (error) {
      console.error('Apply dataset error:', error);
      toast.error('Failed to apply dataset', { id: applyToast });
    }
  };

  const handleDeleteDataset = async (datasetId) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) return;

    const deleteToast = toast.loading('Deleting dataset...');

    try {
      await axiosInstance.delete(`/datasets/${userId}/${datasetId}`);
      toast.success('Dataset deleted successfully', { id: deleteToast });
      await loadDatasets();
      if (appliedDatasetId === datasetId) {
        setAppliedDatasetId(null);
      }
    } catch (error) {
      console.error('Delete dataset error:', error);
      toast.error('Failed to delete dataset', { id: deleteToast });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Database className="mr-3 text-purple-600" size={32} />
          My Datasets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload and manage your custom datasets for analytics
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`mb-8 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 text-purple-600" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {isDragActive ? 'Drop your dataset here' : 'Upload Dataset'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Drag & drop your file here, or click to browse
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <File className="mr-1" size={16} />
            CSV, Excel, JSON
          </span>
          <span>•</span>
          <span>Max 50MB</span>
        </div>
        <button
          type="button"
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Choose from Device
        </button>
      </div>

      {/* Datasets Grid */}
      {datasets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No datasets uploaded yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your first dataset to see the best results in analytics
          </p>
          <button
            onClick={() => document.querySelector('input[type="file"]').click()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Upload Your First Dataset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all relative"
            >
              {/* Applied Badge */}
              {dataset.is_applied && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <Check size={14} className="mr-1" />
                    Applied
                  </span>
                </div>
              )}

              {/* Dataset Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <File className="text-purple-600 dark:text-purple-400" size={24} />
              </div>

              {/* Dataset Info */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {dataset.dataset_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {dataset.description || 'No description provided'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rows</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dataset.row_count?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Columns</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dataset.column_count || 0}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <File size={14} className="mr-2" />
                  {formatFileSize(dataset.file_size)}
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Database size={14} className="mr-2" />
                  {new Date(dataset.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDataset(dataset)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </button>
                {!dataset.is_applied ? (
                  <button
                    onClick={() => handleApplyDataset(dataset.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <Check size={16} className="mr-2" />
                    Apply
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg cursor-not-allowed flex items-center justify-center"
                  >
                    <Check size={16} className="mr-2" />
                    Active
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDataset(dataset.id)}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dataset View Modal */}
      {showModal && selectedDataset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDataset.dataset_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {datasetData ? `${datasetData.total.toLocaleString()} rows × ${datasetData.dataset.columnCount} columns` : 'Loading...'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDataset(null);
                  setDatasetData(null);
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dataset...</p>
                  </div>
                </div>
              ) : datasetData ? (
                <>
                  {/* Dataset Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {datasetData.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Columns</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {datasetData.dataset.columnCount}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">File Size</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatFileSize(selectedDataset.file_size)}
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {selectedDataset.file_type?.split('/')[1]?.toUpperCase() || 'DATA'}
                      </p>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          {datasetData.dataset.columns.map((col, idx) => (
                            <th key={idx} className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {datasetData.preview.map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                            {datasetData.dataset.columns.map((col, colIdx) => (
                              <td key={colIdx} className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {row[col]?.toString() || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {datasetData.total > 10 && (
                      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Showing first 10 of {datasetData.total.toLocaleString()} rows
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDataset(null);
                  setDatasetData(null);
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <div className="flex space-x-3">
                {!selectedDataset.is_applied && (
                  <button
                    onClick={() => {
                      handleApplyDataset(selectedDataset.id);
                      setShowModal(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Apply to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;
