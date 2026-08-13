import React, { useState } from 'react';
import { useStations, useRealtimeData } from '../hooks/useClimateData';
import { getTemperatureColor, getAQIColor, formatDateTime } from '../utils/helpers';
import { MapPin, Thermometer, Droplets, Wind, Search, Globe, Radio, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const StationsPage: React.FC = () => {
  const { stations, loading: stationsLoading } = useStations();
  const { data: realtimeData, loading: realtimeLoading } = useRealtimeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const regions = [...new Set(stations.map((s) => s.region))].sort();

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || station.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getStationRealtime = (stationId: number) => {
    return realtimeData.find((r) => r.station_id === stationId);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 noise-overlay">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/[0.07] rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/15 flex items-center justify-center">
            <Radio className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Weather Stations</h1>
            <p className="text-slate-400 text-sm mt-1">{stations.length} monitoring stations worldwide</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card animate-fade-in-up opacity-0 stagger-1">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="min-w-[180px]">
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="input-field">
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stationsLoading || realtimeLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-2/3 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-1/3"></div>
              </div>
            </div>
          ))
        ) : (
          filteredStations.map((station, index) => {
            const realtime = getStationRealtime(station.id);
            return (
              <div
                key={station.id}
                className="card group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${Math.min(index, 15) * 0.04}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors truncate">
                        {station.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{station.region}, {station.country}</span>
                    </div>
                  </div>
                  <span className={`badge text-[9px] ${station.is_active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'}`}>
                    {station.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {realtime ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-orange-500/[0.06] border border-orange-500/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Thermometer className="h-3 w-3" style={{ color: getTemperatureColor(realtime.temperature) }} />
                        <span className="text-[10px] text-slate-500 font-medium">Temp</span>
                      </div>
                      <p className="text-sm font-bold" style={{ color: getTemperatureColor(realtime.temperature) }}>
                        {realtime.temperature.toFixed(1)}°C
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Droplets className="h-3 w-3 text-blue-400" />
                        <span className="text-[10px] text-slate-500 font-medium">Humidity</span>
                      </div>
                      <p className="text-sm font-bold text-blue-400">{realtime.humidity.toFixed(0)}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Wind className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500 font-medium">Wind</span>
                      </div>
                      <p className="text-sm font-bold text-slate-300">{realtime.wind_speed.toFixed(1)} km/h</p>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ background: `${getAQIColor(realtime.aqi)}08`, borderColor: `${getAQIColor(realtime.aqi)}20` }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAQIColor(realtime.aqi) }} />
                        <span className="text-[10px] text-slate-500 font-medium">AQI</span>
                      </div>
                      <p className="text-sm font-bold" style={{ color: getAQIColor(realtime.aqi) }}>{realtime.aqi}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-4 bg-white/[0.02] rounded-xl text-center text-slate-600 text-xs border border-white/[0.04]">
                    No realtime data available
                  </div>
                )}

                <div className="mt-3.5 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">
                    {realtime ? formatDateTime(realtime.timestamp) : 'N/A'}
                  </span>
                  <Link
                    to={`/map?station=${station.id}`}
                    className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    Map <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredStations.length === 0 && !stationsLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/[0.04] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
            <MapPin className="h-8 w-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-sm">No stations found</p>
          <p className="text-xs text-slate-600 mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default StationsPage;
