import React, { useState } from 'react';
import {
  TemperatureChart,
  HumidityChart,
  PrecipitationChart,
  AQIChart,
  MultiParameterChart,
} from '../components/Charts/ClimateCharts';
import { useTrends, useAnomalies, useStations } from '../hooks/useClimateData';
import { formatDate } from '../utils/helpers';
import { AlertTriangle, TrendingUp, Calendar, Filter, BarChart3 } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<number | undefined>(undefined);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [days, setDays] = useState(365);

  const { trends, loading: trendsLoading } = useTrends(selectedStation, period, days);
  const { anomalies, loading: anomaliesLoading } = useAnomalies(selectedStation, 30);
  const { stations } = useStations();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 noise-overlay">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/[0.07] rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/[0.07] rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/15 flex items-center justify-center">
            <BarChart3 className="h-7 w-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Climate Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Historical trends and anomaly detection</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card animate-fade-in-up opacity-0 stagger-1">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Filters</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Station</label>
            <select
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            >
              <option value="">All Stations</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>{station.name}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="input-field">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Time Range</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="input-field">
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={180}>Last 6 Months</option>
              <option value={365}>Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up opacity-0 stagger-2">
        {trendsLoading ? (
          <>
            <div className="card"><div className="skeleton h-6 w-1/3 mb-4"></div><div className="skeleton h-64"></div></div>
            <div className="card"><div className="skeleton h-6 w-1/3 mb-4"></div><div className="skeleton h-64"></div></div>
          </>
        ) : (
          <>
            <TemperatureChart data={trends} />
            <HumidityChart data={trends} />
            <PrecipitationChart data={trends} />
            <AQIChart data={trends} />
          </>
        )}
      </div>

      {/* Multi-Parameter Overview */}
      {!trendsLoading && (
        <div className="animate-fade-in-up opacity-0 stagger-3">
          <MultiParameterChart data={trends} />
        </div>
      )}

      {/* Anomalies Section */}
      <div className="card animate-fade-in-up opacity-0 stagger-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/15 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Detected Anomalies</h2>
            <p className="text-xs text-slate-500">{anomalies.length} found in selected period</p>
          </div>
        </div>

        {anomaliesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl"></div>)}
          </div>
        ) : anomalies.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No significant anomalies detected</p>
            <p className="text-xs text-slate-600 mt-1">All readings are within expected ranges</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Station</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parameter</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Range</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deviation</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.slice(0, 20).map((anomaly, index) => (
                  <tr key={index} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-white text-xs">{anomaly.station_name}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{formatDate(anomaly.timestamp)}</td>
                    <td className="py-3 px-4">
                      <span className="badge bg-purple-500/15 text-purple-400 border border-purple-500/20 capitalize text-[10px]">{anomaly.parameter}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white text-xs">{anomaly.value.toFixed(1)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{anomaly.expected_range_min.toFixed(1)} - {anomaly.expected_range_max.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold text-xs ${anomaly.deviation > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(2)}σ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
