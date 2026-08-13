import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker, Tooltip } from 'react-leaflet';
import { climateApi, RealtimeData, MapLayer } from '../../services/api';
import { getTemperatureColor, getAQIColor, getSeverityBadgeClass, formatDateTime } from '../../utils/helpers';
import { Thermometer, Droplets, Wind, MapPin, Info, Maximize2, Minimize2, Layers, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ClimateMapProps {
  layerType?: string;
  showStations?: boolean;
  height?: string;
  onStationClick?: (stationId: number) => void;
}

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

export const ClimateMap: React.FC<ClimateMapProps> = ({
  layerType = 'temperature',
  showStations = true,
  height = '600px',
  onStationClick,
}) => {
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [mapLayer, setMapLayer] = useState<MapLayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState(layerType);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>('light');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realtimeRes, layerRes] = await Promise.all([
          climateApi.getRealtimeData(),
          climateApi.getMapLayer(selectedLayer),
        ]);
        setRealtimeData(realtimeRes.data);
        setMapLayer(layerRes.data);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedLayer]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [realtimeRes, layerRes] = await Promise.all([
        climateApi.getRealtimeData(),
        climateApi.getMapLayer(selectedLayer),
      ]);
      setRealtimeData(realtimeRes.data);
      setMapLayer(layerRes.data);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMarkerColor = (value: number, parameter: string): string => {
    switch (parameter) {
      case 'temperature': return getTemperatureColor(value);
      case 'aqi': return getAQIColor(value);
      case 'humidity': return `hsl(200, ${Math.min(100, value)}%, 50%)`;
      case 'wind': return `hsl(${Math.min(360, value * 5)}, 70%, 50%)`;
      default: return '#6b7280';
    }
  };

  const getMarkerRadius = (value: number, parameter: string, isHovered: boolean): number => {
    const baseRadius = (() => {
      switch (parameter) {
        case 'temperature': return Math.max(8, Math.min(18, Math.abs(value) / 2));
        case 'aqi': return Math.max(8, Math.min(20, value / 15));
        case 'humidity': return Math.max(8, Math.min(14, value / 8));
        case 'wind': return Math.max(8, Math.min(16, value / 2));
        default: return 10;
      }
    })();
    return isHovered ? baseRadius * 1.3 : baseRadius;
  };

  const layers = [
    { id: 'temperature', name: 'Temperature', icon: '🌡️', color: 'from-orange-400 to-red-500' },
    { id: 'humidity', name: 'Humidity', icon: '💧', color: 'from-blue-400 to-cyan-500' },
    { id: 'aqi', name: 'Air Quality', icon: '🌬️', color: 'from-purple-400 to-pink-500' },
    { id: 'wind', name: 'Wind Speed', icon: '💨', color: 'from-gray-400 to-slate-500' },
    { id: 'precipitation', name: 'Precipitation', icon: '🌧️', color: 'from-cyan-400 to-blue-500' },
  ];

  const mapStyles = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl" style={{ height }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-climate-200 border-t-climate-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-climate-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading map data...</p>
          <p className="text-sm text-gray-400 mt-1">Fetching real-time climate information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Layer Selector */}
        <div className="flex flex-wrap gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedLayer === layer.id
                  ? `bg-gradient-to-r ${layer.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <span className="text-lg">{layer.icon}</span>
              {layer.name}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Map Style Selector */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            {[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
              { id: 'satellite', label: 'Satellite' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setMapStyle(style.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mapStyle === style.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height, width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={mapStyles[mapStyle]}
          />
          {mapLayer?.features.map((feature) => {
            const { coordinates } = feature.geometry;
            const { value, parameter, station_name, station_id } = feature.properties;
            const isHovered = hoveredStation === station_id;
            return (
              <CircleMarker
                key={station_id}
                center={[coordinates[1], coordinates[0]]}
                radius={getMarkerRadius(value, parameter, isHovered)}
                fillColor={getMarkerColor(value, parameter)}
                color={isHovered ? '#fff' : 'rgba(255,255,255,0.8)'}
                weight={isHovered ? 3 : 2}
                opacity={1}
                fillOpacity={isHovered ? 1 : 0.8}
                eventHandlers={{
                  click: () => onStationClick?.(station_id),
                  mouseover: () => setHoveredStation(station_id),
                  mouseout: () => setHoveredStation(null),
                }}
                className="interactive-marker"
              >
                <Tooltip 
                  direction="top" 
                  offset={[0, -10]}
                  opacity={1}
                  className="custom-tooltip"
                >
                  <div className="p-2 min-w-[180px]">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{station_name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 capitalize flex items-center gap-1">
                          {parameter === 'temperature' && '🌡️'}
                          {parameter === 'humidity' && '💧'}
                          {parameter === 'aqi' && '🌬️'}
                          {parameter === 'wind' && '💨'}
                          {parameter === 'precipitation' && '🌧️'}
                          {parameter}:
                        </span>
                        <span className="font-bold" style={{ color: getMarkerColor(value, parameter) }}>
                          {value.toFixed(1)}
                          {parameter === 'temperature' ? '°C' : 
                           parameter === 'humidity' ? '%' : 
                           parameter === 'wind' ? ' km/h' : 
                           parameter === 'aqi' ? '' : ' mm'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="p-3 min-w-[220px]">
                    <h3 className="font-bold text-gray-900 mb-2">{station_name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Thermometer className="h-3 w-3" /> Temperature
                        </span>
                        <span className="font-bold" style={{ color: getTemperatureColor(value) }}>
                          {value.toFixed(1)}°C
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onStationClick?.(station_id)}
                      className="w-full mt-3 py-2 bg-climate-500 text-white rounded-lg text-sm font-medium hover:bg-climate-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-climate-500" />
          Legend - {layers.find(l => l.id === selectedLayer)?.name}
        </h4>
        <div className="flex flex-wrap gap-4 text-xs">
          {selectedLayer === 'temperature' && (
            <>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">&lt; 0°C (Freezing)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-cyan-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">0-10°C (Cold)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">10-20°C (Cool)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">20-30°C (Warm)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">30-40°C (Hot)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">&gt; 40°C (Extreme)</span>
              </div>
            </>
          )}
          {selectedLayer === 'aqi' && (
            <>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Good (0-50)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Moderate (51-100)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Sensitive (101-150)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Unhealthy (151+)</span>
              </div>
            </>
          )}
          {selectedLayer === 'humidity' && (
            <>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Very Dry (&lt;20%)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Dry (20-40%)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Comfortable (40-60%)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="font-medium text-gray-700">Humid (&gt;60%)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimateMap;
