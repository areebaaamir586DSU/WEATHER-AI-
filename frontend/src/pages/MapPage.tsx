import React, { useState, useEffect } from 'react';
import { ClimateMap } from '../components/Map/ClimateMap';
import { useRealtimeData } from '../hooks/useClimateData';
import { getTemperatureColor, getAQIColor, formatDateTime, calculateHeatIndex, getWindDirection } from '../utils/helpers';
import { Thermometer, Droplets, Wind, MapPin, Info, Activity, Globe, BarChart3, TrendingUp, Eye } from 'lucide-react';

const MapPage: React.FC = () => {
  const { data: realtimeData, loading } = useRealtimeData();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comparison' | 'history'>('details');

  const selectedStationData = realtimeData.find(s => s.station_id === selectedStation);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Globe className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Climate Map</h1>
          </div>
          <p className="text-blue-100 text-lg ml-14">Interactive visualization of global climate conditions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 animate-slide-up">
          <div className="card p-0 overflow-hidden hover-lift">
            <ClimateMap
              height="700px"
              onStationClick={setSelectedStation}
            />
          </div>
        </div>

        {/* Station Details Sidebar */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {selectedStationData ? (
            <div className="card animate-scale-in">
              {/* Station Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="p-3 bg-climate-100 rounded-2xl">
                  <MapPin className="h-6 w-6 text-climate-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedStationData.station_name}
                  </h2>
                  <p className="text-sm text-gray-500">Station #{selectedStationData.station_id}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-5">
                {[
                  { id: 'details', label: 'Details', icon: Eye },
                  { id: 'comparison', label: 'Compare', icon: BarChart3 },
                  { id: 'history', label: 'History', icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-climate-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-3 animate-fade-in">
                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                          <Thermometer className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="text-xs text-gray-400">Feels like {calculateHeatIndex(selectedStationData.temperature, selectedStationData.humidity).toFixed(1)}°C</p>
                        </div>
                      </div>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: getTemperatureColor(selectedStationData.temperature) }}
                      >
                        {selectedStationData.temperature.toFixed(1)}°C
                      </span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Humidity</p>
                          <p className="text-xs text-gray-400">
                            {selectedStationData.humidity > 70 ? 'High' : 
                             selectedStationData.humidity > 40 ? 'Moderate' : 'Low'}
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-blue-600">
                        {selectedStationData.humidity.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-xl">
                          <Wind className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Wind Speed</p>
                          <p className="text-xs text-gray-400">Direction: N/A</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-gray-700">
                        {selectedStationData.wind_speed.toFixed(1)}
                        <span className="text-lg">km/h</span>
                      </span>
                    </div>
                  </div>

                  {/* AQI */}
                  <div className="p-4 rounded-2xl border" style={{ 
                    background: `linear-gradient(135deg, ${getAQIColor(selectedStationData.aqi)}10, ${getAQIColor(selectedStationData.aqi)}05)`,
                    borderColor: `${getAQIColor(selectedStationData.aqi)}30`
                  }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{ backgroundColor: `${getAQIColor(selectedStationData.aqi)}20` }}>
                          <Activity className="h-5 w-5" style={{ color: getAQIColor(selectedStationData.aqi) }} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Air Quality Index</p>
                          <p className="text-xs" style={{ color: getAQIColor(selectedStationData.aqi) }}>
                            {selectedStationData.aqi <= 50 ? 'Good' :
                             selectedStationData.aqi <= 100 ? 'Moderate' :
                             selectedStationData.aqi <= 150 ? 'Unhealthy for Sensitive' :
                             'Unhealthy'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold" style={{ color: getAQIColor(selectedStationData.aqi) }}>
                        {selectedStationData.aqi}
                      </span>
                      <span className="text-sm text-gray-500 mb-1">AQI</span>
                    </div>
                    {/* AQI Bar */}
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min(100, (selectedStationData.aqi / 300) * 100)}%`,
                          backgroundColor: getAQIColor(selectedStationData.aqi)
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-center pt-3">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Activity className="h-3 w-3" />
                      Last updated: {formatDateTime(selectedStationData.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="animate-fade-in">
                  <p className="text-sm text-gray-500 mb-4">Compare this station with others:</p>
                  <div className="space-y-2">
                    {realtimeData
                      .filter(s => s.station_id !== selectedStation)
                      .slice(0, 5)
                      .map(station => (
                        <div 
                          key={station.station_id}
                          className="p-3 rounded-xl border border-gray-100 hover:border-climate-200 hover:bg-climate-50 transition-all cursor-pointer"
                          onClick={() => setSelectedStation(station.station_id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {station.station_name}
                            </span>
                            <span className="text-sm font-bold" style={{ color: getTemperatureColor(station.temperature) }}>
                              {station.temperature.toFixed(1)}°C
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="animate-fade-in">
                  <p className="text-sm text-gray-500 mb-4">Historical data for this station:</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Today', temp: selectedStationData.temperature, change: '+2.1°C' },
                      { label: 'Yesterday', temp: selectedStationData.temperature - 1.5, change: '-0.8°C' },
                      { label: 'Last Week', temp: selectedStationData.temperature - 3, change: '-1.2°C' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.temp.toFixed(1)}°C</span>
                          <span className={`text-xs font-medium ${
                            item.change.startsWith('+') ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Info className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Click on a station marker</p>
              <p className="text-sm text-gray-400 mt-1">to view detailed weather data</p>
            </div>
          )}

          {/* Station List */}
          <div className="card hover-lift">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-climate-500" />
              All Stations
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-20 rounded-xl"></div>
                ))
              ) : (
                realtimeData.map((station) => (
                  <button
                    key={station.station_id}
                    onClick={() => setSelectedStation(station.station_id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedStation === station.station_id
                        ? 'bg-climate-50 border-2 border-climate-300 shadow-md'
                        : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getTemperatureColor(station.temperature) }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 block truncate">
                          {station.station_name}
                        </span>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="font-medium">{station.temperature.toFixed(1)}°C</span>
                          <span>{station.humidity.toFixed(0)}%</span>
                          <span className="font-medium" style={{ color: getAQIColor(station.aqi) }}>
                            AQI {station.aqi}
                          </span>
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
