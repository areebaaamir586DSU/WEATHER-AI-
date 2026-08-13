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
import { AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<number | undefined>(undefined);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [days, setDays] = useState(365);

  const { trends, loading: trendsLoading } = useTrends(selectedStation, period, days);
  const { anomalies, loading: anomaliesLoading } = useAnomalies(selectedStation, 30);
  const { stations, loading: stationsLoading } = useStations();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Climate Analytics</h1>
        <p className="text-gray-500 mt-1">Historical trends and anomaly detection</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
            <select
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            >
              <option value="">All Stations</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input-field"
            >
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={180}>Last 6 Months</option>
              <option value={365}>Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendsLoading ? (
          <>
            <div className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
            <div className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
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
      {!trendsLoading && <MultiParameterChart data={trends} />}

      {/* Anomalies Section */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Detected Anomalies</h2>
          <span className="badge bg-orange-100 text-orange-800">
            {anomalies.length} found
          </span>
        </div>

        {anomaliesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-20"></div>
            ))}
          </div>
        ) : anomalies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>No significant anomalies detected in the selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Station</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Parameter</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expected Range</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Deviation</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.slice(0, 20).map((anomaly, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {anomaly.station_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(anomaly.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge bg-purple-100 text-purple-800 capitalize">
                        {anomaly.parameter}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {anomaly.value.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {anomaly.expected_range_min.toFixed(1)} - {anomaly.expected_range_max.toFixed(1)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          anomaly.deviation > 0 ? 'text-red-600' : 'text-blue-600'
                        }`}
                      >
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
