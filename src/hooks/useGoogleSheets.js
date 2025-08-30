/**
 * Simplified hook for managing Google Sheets data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchFSDData } from '../services/googleSheetsService';

export const useGoogleSheets = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFSDData();
      setData(result.fsdData);
    } catch (err) {
      setError(err.message || 'Failed to load FSD data');
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshData
  };
};
