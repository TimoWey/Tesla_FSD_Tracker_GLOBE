/**
 * Custom hook for managing Google Sheets data fetching
 * Provides data, loading state, error handling, and refresh functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchFSDData } from '../services/googleSheetsService';

export const useGoogleSheets = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFSDData();
      setData(result.fsdData);
      setLastUpdated(result.lastUpdated);
      
      console.log('✅ FSD data loaded successfully:', {
        countries: Object.keys(result.fsdData).length,
        lastUpdated: result.lastUpdated
      });
    } catch (err) {
      console.error('❌ Failed to load FSD data:', err);
      setError(err.message || 'Failed to load FSD data');
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
    isLoading: loading,
    hasError: !!error,
    hasData: Object.keys(data).length > 0
  };
};
