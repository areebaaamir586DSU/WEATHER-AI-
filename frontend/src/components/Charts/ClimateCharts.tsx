import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendData, ClimateData } from '../../services/api';

interface TemperatureChartProps {
  data: TrendData[];
  height?: number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: '°C', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="avg_temperature" 
            stroke="#f97316" 
            strokeWidth={2}
            fill="url(#tempGradient)" 
            name="Avg Temperature"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface HumidityChartProps {
  data: TrendData[];
  height?: number;
}

export const HumidityChart: React.FC<HumidityChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Humidity Trends</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            domain={[0, 100]}
            label={{ value: '%', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="avg_humidity" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#humidityGradient)" 
            name="Avg Humidity"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PrecipitationChartProps {
  data: TrendData[];
  height?: number;
}

export const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitation</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar 
            dataKey="total_precipitation" 
            fill="#06b6d4"
            name="Total Precipitation"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AQIChartProps {
  data: TrendData[];
  height?: number;
}

export const AQIChart: React.FC<AQIChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Air Quality Index</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="avg_aqi" 
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#a855f7', strokeWidth: 2 }}
            name="Avg AQI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MultiParameterChartProps {
  data: TrendData[];
  height?: number;
}

export const MultiParameterChart: React.FC<MultiParameterChartProps> = ({ data, height = 400 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Parameter Overview</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="avg_temperature" 
            stroke="#f97316"
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="avg_humidity" 
            stroke="#3b82f6"
            strokeWidth={2}
            name="Humidity (%)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="avg_aqi" 
            stroke="#a855f7"
            strokeWidth={2}
            name="AQI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StationComparisonChartProps {
  data: Record<number, {
    avg_temperature: number;
    avg_humidity: number;
    avg_aqi: number;
    total_precipitation: number;
  }>;
  stations: Array<{ id: number; name: string }>;
  height?: number;
}

export const StationComparisonChart: React.FC<StationComparisonChartProps> = ({
  data,
  stations,
  height = 300,
}) => {
  const chartData = stations
    .filter(s => data[s.id])
    .map(s => ({
      name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
      temperature: data[s.id].avg_temperature,
      humidity: data[s.id].avg_humidity,
      aqi: data[s.id].avg_aqi,
    }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Comparison</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            stroke="#9ca3af"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="temperature" fill="#f97316" name="Temp (°C)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="humidity" fill="#3b82f6" name="Humidity (%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="aqi" fill="#a855f7" name="AQI" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  TemperatureChart,
  HumidityChart,
  PrecipitationChart,
  AQIChart,
  MultiParameterChart,
  StationComparisonChart,
};
