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
} from 'recharts';
import { TrendData } from '../../services/api';

const tooltipStyle = {
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(20px)',
  color: '#f1f5f9',
  fontSize: '12px',
  padding: '10px 14px',
};

const axisStyle = { fontSize: 11, fill: '#64748b' };
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(255, 255, 255, 0.04)' };

interface TemperatureChartProps {
  data: TrendData[];
  height?: number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/15 flex items-center justify-center">
          <span className="text-lg">🌡️</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Temperature Trends</h3>
          <p className="text-xs text-slate-500">Average temperature over time</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 11 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="avg_temperature" stroke="#f97316" strokeWidth={2.5} fill="url(#tempGrad)" name="Temperature" dot={false} activeDot={{ r: 5, fill: '#f97316', stroke: '#0a0e1a', strokeWidth: 2 }} />
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/15 flex items-center justify-center">
          <span className="text-lg">💧</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Humidity Trends</h3>
          <p className="text-xs text-slate-500">Average humidity levels</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 11 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="avg_humidity" stroke="#3b82f6" strokeWidth={2.5} fill="url(#humGrad)" name="Humidity" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0a0e1a', strokeWidth: 2 }} />
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/15 flex items-center justify-center">
          <span className="text-lg">🌧️</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Precipitation</h3>
          <p className="text-xs text-slate-500">Total rainfall measurements</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} label={{ value: 'mm', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 11 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="total_precipitation" fill="url(#precipGrad)" name="Precipitation" radius={[6, 6, 0, 0]} />
          <defs>
            <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
            </linearGradient>
          </defs>
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/15 flex items-center justify-center">
          <span className="text-lg">🌬️</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Air Quality Index</h3>
          <p className="text-xs text-slate-500">AQI measurements over time</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="avg_aqi" stroke="#a855f7" strokeWidth={2.5} dot={false} name="AQI" activeDot={{ r: 5, fill: '#a855f7', stroke: '#0a0e1a', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MultiParameterChartProps {
  data: TrendData[];
  height?: number;
}

export const MultiParameterChart: React.FC<MultiParameterChartProps> = ({ data, height = 380 }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Multi-Parameter Overview</h3>
          <p className="text-xs text-slate-500">Combined metrics visualization</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Line yAxisId="left" type="monotone" dataKey="avg_temperature" stroke="#f97316" strokeWidth={2} name="Temperature (°C)" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="avg_humidity" stroke="#3b82f6" strokeWidth={2} name="Humidity (%)" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="avg_aqi" stroke="#a855f7" strokeWidth={2} name="AQI" dot={false} />
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
      name: s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name,
      temperature: data[s.id].avg_temperature,
      humidity: data[s.id].avg_humidity,
      aqi: data[s.id].avg_aqi,
    }));

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/15 flex items-center justify-center">
          <span className="text-lg">📈</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Station Comparison</h3>
          <p className="text-xs text-slate-500">Comparing metrics across stations</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Bar dataKey="temperature" fill="#f97316" name="Temp (°C)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="humidity" fill="#3b82f6" name="Humidity (%)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="aqi" fill="#a855f7" name="AQI" radius={[6, 6, 0, 0]} />
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
