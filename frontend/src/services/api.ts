import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  region: string;
  country: string;
  is_active: boolean;
  created_at: string;
}

export interface ClimateData {
  id: number;
  station_id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  precipitation: number;
  aqi: number;
  pm25: number;
  pm10: number;
  co2: number;
  uv_index: number;
  visibility: number;
  cloud_cover: number;
}

export interface Alert {
  id: number;
  station_id: number;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface RealtimeData {
  station_id: number;
  station_name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  aqi: number;
  timestamp: string;
}

export interface TrendData {
  period: string;
  avg_temperature: number;
  avg_humidity: number;
  total_precipitation: number;
  avg_aqi: number;
  avg_wind_speed: number;
  data_points: number;
}

export interface AnomalyData {
  station_id: number;
  station_name: string;
  timestamp: string;
  parameter: string;
  value: number;
  expected_range_min: number;
  expected_range_max: number;
  deviation: number;
}

export interface MapLayer {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      station_id: number;
      station_name: string;
      region: string;
      value: number;
      parameter: string;
      timestamp: string;
    };
  }>;
}

export interface StatsSummary {
  active_stations: number;
  total_data_points: number;
  active_alerts: number;
  latest_update: string;
  global_avg_temperature: number;
  global_avg_humidity: number;
  global_avg_aqi: number;
}

export const climateApi = {
  // Stations
  getStations: (params?: { region?: string; country?: string }) =>
    api.get<Station[]>('/stations', { params }),

  getStation: (id: number) =>
    api.get<Station>(`/stations/${id}`),

  // Climate Data
  getClimateData: (stationId: number, params?: { start_date?: string; end_date?: string; limit?: number }) =>
    api.get<ClimateData[]>(`/stations/${stationId}/climate-data`, { params }),

  // Realtime
  getRealtimeData: () =>
    api.get<RealtimeData[]>('/realtime'),

  // Map Layers
  getMapLayer: (layerType: string) =>
    api.get<MapLayer>(`/map/layers/${layerType}`),

  // Alerts
  getAlerts: (params?: { station_id?: number; severity?: string; is_active?: boolean }) =>
    api.get<Alert[]>('/alerts', { params }),

  resolveAlert: (alertId: number) =>
    api.put(`/alerts/${alertId}/resolve`),

  // Analytics
  getTrends: (params?: { station_id?: number; period?: string; days?: number }) =>
    api.get<TrendData[]>('/analytics/trends', { params }),

  getAnomalies: (params?: { station_id?: number; days?: number; threshold?: number }) =>
    api.get<AnomalyData[]>('/analytics/anomalies', { params }),

  getComparativeAnalysis: (stationIds: number[], days?: number) =>
    api.get('/analytics/compare', { params: { station_ids: stationIds.join(','), days } }),

  // Stats
  getStatsSummary: () =>
    api.get<StatsSummary>('/stats/summary'),
};

export default api;
