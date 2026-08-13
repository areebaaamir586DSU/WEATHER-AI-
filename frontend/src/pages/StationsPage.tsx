import React, { useState } from 'react';
import { useStations, useRealtimeData } from '../hooks/useClimateData';
import { getTemperatureColor, getAQIColor, formatDateTime } from '../utils/helpers';
import { MapPin, Thermometer, Droplets, Wind, Search, Globe } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weather Stations</h1>
        <p className="text-gray-500 mt-1">{stations.length} monitoring stations worldwide</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations by name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="min-w-[200px]">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input-field"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stationsLoading || realtimeLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : (
          filteredStations.map((station) => {
            const realtime = getStationRealtime(station.id);
            return (
              <div
                key={station.id}
                className="card-hover group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-climate-600" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-climate-600 transition-colors">
                        {station.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {station.region}, {station.country}
                    </div>
                  </div>
                  <span className={`badge ${station.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {station.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {realtime ? (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <Thermometer className="h-4 w-4" style={{ color: getTemperatureColor(realtime.temperature) }} />
                      <div>
                        <p className="text-xs text-gray-500">Temp</p>
                        <p className="font-medium" style={{ color: getTemperatureColor(realtime.temperature) }}>
                          {realtime.temperature.toFixed(1)}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Humidity</p>
                        <p className="font-medium text-blue-600">{realtime.humidity.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Wind</p>
                        <p className="font-medium text-gray-700">{realtime.wind_speed.toFixed(1)} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${getAQIColor(realtime.aqi)}15` }}>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: getAQIColor(realtime.aqi) }}
                      />
                      <div>
                        <p className="text-xs text-gray-500">AQI</p>
                        <p className="font-medium" style={{ color: getAQIColor(realtime.aqi) }}>
                          {realtime.aqi}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-400 text-sm">
                    No realtime data available
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {realtime ? formatDateTime(realtime.timestamp) : 'N/A'}
                  </span>
                  <Link
                    to={`/map?station=${station.id}`}
                    className="text-sm text-climate-600 hover:text-climate-700 font-medium"
                  >
                    View on Map →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredStations.length === 0 && !stationsLoading && (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No stations found matching your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default StationsPage;
