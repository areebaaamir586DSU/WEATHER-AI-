import React, { useState } from 'react';
import { AlertList, AlertStats } from '../components/Alerts/AlertCard';
import { useAlerts, useStations } from '../hooks/useClimateData';
import { Bell, Filter, Shield } from 'lucide-react';

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
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 noise-overlay">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-500/[0.07] rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/[0.07] rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/15 flex items-center justify-center">
            <Bell className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Climate Alerts</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor and manage climate-related warnings</p>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <AlertStats alerts={alerts} />

      {/* Filters */}
      <div className="card animate-fade-in-up opacity-0 stagger-1">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Filters</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
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
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Severity</label>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="input-field">
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Station</label>
            <select value={filterStation || ''} onChange={(e) => setFilterStation(e.target.value ? Number(e.target.value) : undefined)} className="input-field">
              <option value="">All Stations</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>{station.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="card animate-fade-in-up opacity-0 stagger-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Alert History</h2>
              <p className="text-xs text-slate-500">{filteredAlerts.length} alerts</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl"></div>)}
          </div>
        ) : (
          <AlertList alerts={filteredAlerts} onResolve={resolveAlert} />
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
