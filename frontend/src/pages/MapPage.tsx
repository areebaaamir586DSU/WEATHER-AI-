import React, { useState } from 'react';
import { ClimateMap } from '../components/Map/ClimateMap';
import { useRealtimeData } from '../hooks/useClimateData';
import { getTemperatureColor, getAQIColor, formatDateTime, calculateHeatIndex } from '../utils/helpers';
import { Thermometer, Droplets, Wind, MapPin, Info, Activity, Globe, BarChart3, TrendingUp, Eye } from 'lucide-react';

const MapPage: React.FC = () => {
  const { data: realtimeData, loading } = useRealtimeData();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comparison' | 'history'>('details');

  const selectedStationData = realtimeData.find(s => s.station_id === selectedStation);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 noise-overlay">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/[0.07] rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/15 flex items-center justify-center">
            <Globe className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Climate Map</h1>
            <p className="text-slate-400 text-sm mt-1">Interactive visualization of global climate conditions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 animate-fade-in-up opacity-0 stagger-1">
          <div className="card p-0 overflow-hidden hover-lift">
            <ClimateMap height="650px" onStationClick={setSelectedStation} />
          </div>
        </div>

        {/* Station Details Sidebar */}
        <div className="space-y-4 animate-fade-in-up opacity-0 stagger-2">
          {selectedStationData ? (
            <div className="card animate-scale-in">
              {/* Station Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{selectedStationData.station_name}</h2>
                  <p className="text-xs text-slate-500">Station #{selectedStationData.station_id}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 mb-5 p-1 bg-white/[0.03] rounded-2xl border border-white/[0.04]">
                {[
                  { id: 'details', label: 'Details', icon: Eye },
                  { id: 'comparison', label: 'Compare', icon: BarChart3 },
                  { id: 'history', label: 'History', icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-3 animate-fade-in-up">
                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/[0.06] to-red-500/[0.03] border border-orange-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                          <Thermometer className="h-4 w-4 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Temperature</p>
                          <p className="text-[10px] text-slate-600">Feels like {calculateHeatIndex(selectedStationData.temperature, selectedStationData.humidity).toFixed(1)}°C</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold" style={{ color: getTemperatureColor(selectedStationData.temperature) }}>
                        {selectedStationData.temperature.toFixed(1)}°C
                      </span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/[0.06] to-cyan-500/[0.03] border border-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
                          <Droplets className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Humidity</p>
                          <p className="text-[10px] text-slate-600">
                            {selectedStationData.humidity > 70 ? 'High' : selectedStationData.humidity > 40 ? 'Moderate' : 'Low'}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-400">{selectedStationData.humidity.toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-500/[0.06] to-gray-500/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                          <Wind className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Wind Speed</p>
                          <p className="text-[10px] text-slate-600">Direction: N/A</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-slate-300">
                        {selectedStationData.wind_speed.toFixed(1)}<span className="text-sm"> km/h</span>
                      </span>
                    </div>
                  </div>

                  {/* AQI */}
                  <div className="p-4 rounded-2xl border" style={{ background: `linear-gradient(135deg, ${getAQIColor(selectedStationData.aqi)}08, ${getAQIColor(selectedStationData.aqi)}03)`, borderColor: `${getAQIColor(selectedStationData.aqi)}20` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getAQIColor(selectedStationData.aqi)}15` }}>
                          <Activity className="h-4 w-4" style={{ color: getAQIColor(selectedStationData.aqi) }} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Air Quality Index</p>
                          <p className="text-[10px]" style={{ color: getAQIColor(selectedStationData.aqi) }}>
                            {selectedStationData.aqi <= 50 ? 'Good' : selectedStationData.aqi <= 100 ? 'Moderate' : selectedStationData.aqi <= 150 ? 'Sensitive' : 'Unhealthy'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold" style={{ color: getAQIColor(selectedStationData.aqi) }}>{selectedStationData.aqi}</span>
                      <span className="text-xs text-slate-500 mb-1">AQI</span>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (selectedStationData.aqi / 300) * 100)}%`, backgroundColor: getAQIColor(selectedStationData.aqi) }}></div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                      <Activity className="h-2.5 w-2.5" /> {formatDateTime(selectedStationData.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="animate-fade-in-up space-y-2">
                  {realtimeData.filter(s => s.station_id !== selectedStation).slice(0, 5).map(station => (
                    <div key={station.station_id} className="p-3 rounded-xl border border-white/[0.04] hover:border-emerald-500/20 hover:bg-white/[0.03] transition-all cursor-pointer" onClick={() => setSelectedStation(station.station_id)}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-300 truncate">{station.station_name}</span>
                        <span className="text-xs font-bold" style={{ color: getTemperatureColor(station.temperature) }}>{station.temperature.toFixed(1)}°C</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="animate-fade-in-up space-y-2.5">
                  {[
                    { label: 'Today', temp: selectedStationData.temperature, change: '+2.1°C' },
                    { label: 'Yesterday', temp: selectedStationData.temperature - 1.5, change: '-0.8°C' },
                    { label: 'Last Week', temp: selectedStationData.temperature - 3, change: '-1.2°C' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.temp.toFixed(1)}°C</span>
                        <span className={`text-[10px] font-bold ${item.change.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-10">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float border border-white/[0.06]">
                <Info className="h-7 w-7 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-sm">Click a station marker</p>
              <p className="text-xs text-slate-600 mt-1">to view detailed weather data</p>
            </div>
          )}

          {/* Station List */}
          <div className="card">
            <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              All Stations
            </h3>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl"></div>)
              ) : (
                realtimeData.map((station) => (
                  <button
                    key={station.station_id}
                    onClick={() => setSelectedStation(station.station_id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      selectedStation === station.station_id
                        ? 'bg-emerald-500/[0.08] border border-emerald-500/20'
                        : 'hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getTemperatureColor(station.temperature) }}></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-white block truncate">{station.station_name}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                          <span className="font-medium">{station.temperature.toFixed(1)}°C</span>
                          <span>{station.humidity.toFixed(0)}%</span>
                          <span style={{ color: getAQIColor(station.aqi) }}>AQI {station.aqi}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
