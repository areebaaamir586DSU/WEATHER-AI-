import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
};

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm');
};

export const getTemperatureColor = (temp: number): string => {
  if (temp < 0) return '#3b82f6';
  if (temp < 10) return '#06b6d4';
  if (temp < 20) return '#22c55e';
  if (temp < 30) return '#f59e0b';
  if (temp < 40) return '#f97316';
  return '#ef4444';
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#a855f7';
  return '#7f1d1d';
};

export const getAQICategory = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getSeverityBadgeClass = (severity: string): string => {
  switch (severity) {
    case 'low': return 'badge-low';
    case 'medium': return 'badge-medium';
    case 'high': return 'badge-high';
    case 'critical': return 'badge-critical';
    default: return 'badge bg-gray-100 text-gray-800';
  }
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const calculateHeatIndex = (temperature: number, humidity: number): number => {
  if (temperature < 27) return temperature;
  const hi = -8.7847 + 1.6114 * temperature + 2.3385 * humidity - 0.1461 * temperature * humidity
    - 0.0068 * temperature ** 2 - 0.0548 * humidity ** 2
    + 0.0013 * temperature ** 2 * humidity + 0.0008 * temperature * humidity ** 2
    - 0.00001 * temperature ** 2 * humidity ** 2;
  return Math.round(hi * 10) / 10;
};

export const getUVIndexLevel = (uv: number): { level: string; color: string } => {
  if (uv <= 2) return { level: 'Low', color: '#22c55e' };
  if (uv <= 5) return { level: 'Moderate', color: '#f59e0b' };
  if (uv <= 7) return { level: 'High', color: '#f97316' };
  if (uv <= 10) return { level: 'Very High', color: '#ef4444' };
  return { level: 'Extreme', color: '#a855f7' };
};

export const getVisibilityLevel = (vis: number): { level: string; color: string } => {
  if (vis >= 10) return { level: 'Excellent', color: '#22c55e' };
  if (vis >= 5) return { level: 'Good', color: '#06b6d4' };
  if (vis >= 2) return { level: 'Moderate', color: '#f59e0b' };
  return { level: 'Poor', color: '#ef4444' };
};
