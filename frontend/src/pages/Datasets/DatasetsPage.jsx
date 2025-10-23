import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, Database, CheckCircle, Trash2, FileText, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DatasetsPage = () => {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [appliedDataset, setAppliedDataset] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load datasets
  const loadDatasets = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/datasets/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Datasets loaded:', response.data);
      setDatasets(response.data.datasets || []);
    } catch (error) {
      console.error('Load datasets error:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load datasets');
      }
    }
  };

  // Load applied dataset
  const loadAppliedDataset = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/datasets/${user.id}/applied`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Applied dataset:', response.data);
      setAppliedDataset(response.data.dataset);
    } catch (error) {
      console.error('Load applied dataset error:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDatasets();
      loadAppliedDataset();
    }
  }, [user]);

  // Upload dataset
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!user?.id || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    setLoading(true);
    const uploadToast = toast.loading('Uploading dataset...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/datasets/${user.id}/upload`, 
        formData, 
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Upload response:', response.data);
      toast.success('Dataset uploaded successfully!', { id: uploadToast });
      
      // Reload datasets immediately
      await loadDatasets();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload dataset', { id: uploadToast });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Apply dataset
  const applyDataset = async (datasetId) => {
    if (!user?.id) return;
    
    const applyToast = toast.loading('Applying dataset...');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/datasets/${user.id}/${datasetId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Dataset applied successfully!', { id: applyToast });
      await loadAppliedDataset();
      await loadDatasets();
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to apply dataset', { id: applyToast });
    }
  };

  // Delete dataset
  const deleteDataset = async (datasetId) => {
    if (!user?.id || !window.confirm('Are you sure you want to delete this dataset?')) return;

    const deleteToast = toast.loading('Deleting dataset...');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/datasets/${user.id}/${datasetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Dataset deleted successfully!', { id: deleteToast });
      await loadDatasets();
      
      if (appliedDataset?.id === datasetId) {
        setAppliedDataset(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete dataset', { id: deleteToast });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xlsx', '.xls']
    },
    maxSize: 10485760,
    multiple: false,
    disabled: loading
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Database className="mx-auto mb-4 text-purple-600" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be logged in to manage datasets
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Datasets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and manage your datasets for AI analysis • Logged in as <span className="font-semibold">{user?.name}</span>
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all mb-8 ${
          loading
            ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
            : isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <>
            <Loader className="mx-auto mb-4 text-blue-500 animate-spin" size={48} />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Uploading your dataset...
            </p>
          </>
        ) : (
          <>
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your dataset'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports CSV, JSON, XLSX files (max 10MB)
            </p>
          </>
        )}
      </div>

      {appliedDataset && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Currently Active Dataset
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {appliedDataset.dataset_name || appliedDataset.file_name || 'Unnamed Dataset'} • 
                  {appliedDataset.updated_at ? new Date(appliedDataset.updated_at).toLocaleDateString() : 'Recently applied'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {datasets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`p-6 rounded-xl border transition-all ${
                dataset.is_applied || (appliedDataset && appliedDataset.id === dataset.id)
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dataset.is_applied || (appliedDataset && appliedDataset.id === dataset.id)
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <FileText className={
                      dataset.is_applied || (appliedDataset && appliedDataset.id === dataset.id)
                        ? 'text-green-600' 
                        : 'text-blue-500'
                    } size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                      {dataset.dataset_name || dataset.file_name || 'Unnamed Dataset'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dataset.file_type || 'CSV'} • {dataset.file_size ? (dataset.file_size / 1024).toFixed(2) : '0'} KB
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Uploaded {dataset.created_at ? new Date(dataset.created_at).toLocaleDateString() : 'recently'}
              </div>

              <div className="flex space-x-2">
                {!(dataset.is_applied || (appliedDataset && appliedDataset.id === dataset.id)) && (
                  <button
                    onClick={() => applyDataset(dataset.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    Apply
                  </button>
                )}
                <button
                  onClick={() => deleteDataset(dataset.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete dataset"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No datasets yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Upload your first dataset to start analyzing with AI
          </p>
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;
