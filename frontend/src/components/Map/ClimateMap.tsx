import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Tooltip } from 'react-leaflet';
import { climateApi, RealtimeData, MapLayer } from '../../services/api';
import { getTemperatureColor, getAQIColor } from '../../utils/helpers';
import { Thermometer, RefreshCw, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ClimateMapProps {
  layerType?: string;
  showStations?: boolean;
  height?: string;
  onStationClick?: (stationId: number) => void;
}

export const ClimateMap: React.FC<ClimateMapProps> = ({
  layerType = 'temperature',
  height = '600px',
  onStationClick,
}) => {
  const [mapLayer, setMapLayer] = useState<MapLayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState(layerType);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>('dark');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const layerRes = await climateApi.getMapLayer(selectedLayer);
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
      const layerRes = await climateApi.getMapLayer(selectedLayer);
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
    { id: 'temperature', name: 'Temperature', icon: '🌡️', gradient: 'from-orange-500 to-red-500' },
    { id: 'humidity', name: 'Humidity', icon: '💧', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'aqi', name: 'Air Quality', icon: '🌬️', gradient: 'from-purple-500 to-pink-500' },
    { id: 'wind', name: 'Wind', icon: '💨', gradient: 'from-slate-400 to-slate-500' },
    { id: 'precipitation', name: 'Rain', icon: '🌧️', gradient: 'from-cyan-500 to-blue-500' },
  ];

  const mapStyles = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl" style={{ height, background: 'rgba(17, 24, 39, 0.5)' }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-white/10 border-t-emerald-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-400/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-5 text-slate-400 font-medium text-sm">Loading map data...</p>
          <p className="text-xs text-slate-600 mt-1">Fetching real-time climate information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedLayer === layer.id
                  ? `bg-gradient-to-r ${layer.gradient} text-white shadow-lg`
                  : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <span>{layer.icon}</span>
              <span className="hidden sm:inline">{layer.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/[0.04] rounded-xl border border-white/[0.06] p-0.5">
            {['light', 'dark', 'satellite'].map((style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all capitalize ${
                  mapStyle === style
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.08] transition-all disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
        <MapContainer center={[20, 0]} zoom={2} style={{ height, width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
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
                color={isHovered ? '#ffffff' : 'rgba(255,255,255,0.6)'}
                weight={isHovered ? 3 : 1.5}
                opacity={1}
                fillOpacity={isHovered ? 1 : 0.8}
                eventHandlers={{
                  click: () => onStationClick?.(station_id),
                  mouseover: () => setHoveredStation(station_id),
                  mouseout: () => setHoveredStation(null),
                }}
                className="interactive-marker"
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="p-2 min-w-[160px]">
                    <h3 className="font-bold text-white text-xs mb-1">{station_name}</h3>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 capitalize">{parameter}</span>
                      <span className="font-bold" style={{ color: getMarkerColor(value, parameter) }}>
                        {value.toFixed(1)}{parameter === 'temperature' ? '°C' : parameter === 'humidity' ? '%' : parameter === 'wind' ? ' km/h' : parameter === 'aqi' ? '' : ' mm'}
                      </span>
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="p-3 min-w-[200px]" style={{ background: 'rgba(17, 24, 39, 0.95)', color: '#f1f5f9', borderRadius: '12px' }}>
                    <h3 className="font-bold text-sm mb-2">{station_name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp</span>
                      <span className="font-bold" style={{ color: getTemperatureColor(value) }}>{value.toFixed(1)}°C</span>
                    </div>
                    <button
                      onClick={() => onStationClick?.(station_id)}
                      className="w-full mt-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
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
      <div className="card">
        <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          Legend - {layers.find(l => l.id === selectedLayer)?.name}
        </h4>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {selectedLayer === 'temperature' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/[0.08] rounded-lg border border-blue-500/10"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-slate-300">&lt; 0°C</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/[0.08] rounded-lg border border-cyan-500/10"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-slate-300">0-10°C</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/10"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-300">10-20°C</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/[0.08] rounded-lg border border-amber-500/10"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-slate-300">20-30°C</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/[0.08] rounded-lg border border-orange-500/10"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-slate-300">30-40°C</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/[0.08] rounded-lg border border-red-500/10"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-slate-300">&gt; 40°C</span></div>
            </>
          )}
          {selectedLayer === 'aqi' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/10"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-300">Good (0-50)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/[0.08] rounded-lg border border-amber-500/10"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-slate-300">Moderate (51-100)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/[0.08] rounded-lg border border-orange-500/10"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-slate-300">Sensitive (101-150)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/[0.08] rounded-lg border border-red-500/10"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-slate-300">Unhealthy (151+)</span></div>
            </>
          )}
          {selectedLayer === 'humidity' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/[0.08] rounded-lg border border-red-500/10"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-slate-300">&lt; 20%</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/[0.08] rounded-lg border border-orange-500/10"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-slate-300">20-40%</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/10"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-300">40-60%</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/[0.08] rounded-lg border border-blue-500/10"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-slate-300">&gt; 60%</span></div>
            </>
          )}
          {selectedLayer === 'wind' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/10"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-300">Calm (&lt;10)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/[0.08] rounded-lg border border-cyan-500/10"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-slate-300">Moderate (10-20)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/[0.08] rounded-lg border border-amber-500/10"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-slate-300">Strong (20-30)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/[0.08] rounded-lg border border-red-500/10"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-slate-300">Extreme (&gt;30)</span></div>
            </>
          )}
          {selectedLayer === 'precipitation' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/10"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-300">None (0)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/[0.08] rounded-lg border border-cyan-500/10"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-slate-300">Light (0-5)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/[0.08] rounded-lg border border-blue-500/10"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-slate-300">Moderate (5-15)</span></div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/[0.08] rounded-lg border border-purple-500/10"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-slate-300">Heavy (&gt;15)</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimateMap;
