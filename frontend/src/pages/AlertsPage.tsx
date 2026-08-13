import React, { useState } from 'react';
import { AlertList, AlertStats } from '../components/Alerts/AlertCard';
import { useAlerts, useStations } from '../hooks/useClimateData';
import { Bell, Filter } from 'lucide-react';

const AlertsPage: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(true);
  const [filterStation, setFilterStation] = useState<number | undefined>(undefined);

  const { alerts, loading, resolveAlert } = useAlerts(filterActive);
  const { stations } = useStations();

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity && alert.severity !== filterSeverity) return false;
    if (filterStation && alert.station_id !== filterStation) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Climate Alerts</h1>
        <p className="text-gray-500 mt-1">Monitor and manage climate-related warnings</p>
      </div>

      {/* Alert Statistics */}
      <AlertStats alerts={alerts} />

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterActive === undefined ? '' : filterActive ? 'active' : 'resolved'}
              onChange={(e) => {
                if (e.target.value === '') setFilterActive(undefined);
                else setFilterActive(e.target.value === 'active');
              }}
              className="input-field"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="input-field"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
            <select
              value={filterStation || ''}
              onChange={(e) => setFilterStation(e.target.value ? Number(e.target.value) : undefined)}
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
        </div>
      </div>

      {/* Alert List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-climate-600" />
            <h2 className="text-lg font-semibold text-gray-900">Alert History</h2>
          </div>
          <span className="text-sm text-gray-500">
            {filteredAlerts.length} alerts
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-24"></div>
            ))}
          </div>
        ) : (
          <AlertList alerts={filteredAlerts} onResolve={resolveAlert} />
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
