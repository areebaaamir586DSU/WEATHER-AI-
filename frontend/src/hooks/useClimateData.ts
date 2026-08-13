import { useState, useEffect, useCallback } from 'react';
import { climateApi, RealtimeData, Station, Alert, TrendData, AnomalyData, StatsSummary } from '../services/api';

export const useRealtimeData = (refreshInterval: number = 30000) => {
  const [data, setData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await climateApi.getRealtimeData();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch realtime data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
};

export const useStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await climateApi.getStations();
        setStations(response.data);
      } catch (err) {
        setError('Failed to fetch stations');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  return { stations, loading, error };
};

export const useAlerts = (isActive?: boolean) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await climateApi.getAlerts({ is_active: isActive });
      setAlerts(response.data);
    } catch (err) {
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, [isActive]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const resolveAlert = async (alertId: number) => {
    try {
      await climateApi.resolveAlert(alertId);
      fetchAlerts();
    } catch (err) {
      setError('Failed to resolve alert');
    }
  };

  return { alerts, loading, error, refetch: fetchAlerts, resolveAlert };
};

export const useTrends = (stationId?: number, period: string = 'monthly', days: number = 365) => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await climateApi.getTrends({ station_id: stationId, period, days });
        setTrends(response.data);
      } catch (err) {
        setError('Failed to fetch trends');
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [stationId, period, days]);

  return { trends, loading, error };
};

export const useAnomalies = (stationId?: number, days: number = 30) => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await climateApi.getAnomalies({ station_id: stationId, days });
        setAnomalies(response.data);
      } catch (err) {
        setError('Failed to fetch anomalies');
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, [stationId, days]);

  return { anomalies, loading, error };
};

export const useStatsSummary = () => {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await climateApi.getStatsSummary();
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useMapLayer = (layerType: string) => {
  const [layerData, setLayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayer = async () => {
      try {
        const response = await climateApi.getMapLayer(layerType);
        setLayerData(response.data);
      } catch (err) {
        setError('Failed to fetch map layer');
      } finally {
        setLoading(false);
      }
    };
    fetchLayer();
  }, [layerType]);

  return { layerData, loading, error };
};
