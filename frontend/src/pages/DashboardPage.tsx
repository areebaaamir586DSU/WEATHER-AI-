import React, { useState, useEffect } from 'react';
import { StatsOverview } from '../components/Dashboard/StatsOverview';
import { ClimateMap } from '../components/Map/ClimateMap';
import { TemperatureChart, HumidityChart, AQIChart, MultiParameterChart } from '../components/Charts/ClimateCharts';
import { AlertList, AlertStats } from '../components/Alerts/AlertCard';
import { useStatsSummary, useRealtimeData, useAlerts, useTrends } from '../hooks/useClimateData';
import { Thermometer, Droplets, Wind, MapPin, ArrowRight, Activity, Globe, TrendingUp, Zap, ChevronRight, RefreshCw, Sun, CloudRain, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTemperatureColor, getAQIColor, formatDateTime } from '../utils/helpers';

const DashboardPage: React.FC = () => {
  const { stats, loading: statsLoading } = useStatsSummary();
  const { data: realtimeData, loading: realtimeLoading, refetch } = useRealtimeData();
  const { alerts, loading: alertsLoading } = useAlerts(true);
  const { trends, loading: trendsLoading } = useTrends(undefined, 'monthly', 180);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getWeatherEmoji = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 20) return '🌇';
    return '🌙';
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-10 text-white animate-fade-in">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        {/* Floating weather icons */}
        <div className="absolute top-4 right-20 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🌍</div>
        <div className="absolute bottom-4 right-40 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>⛅</div>
        <div className="absolute top-10 left-1/3 text-2xl animate-float" style={{ animationDelay: '2s' }}>🌡️</div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">{getWeatherEmoji()}</span>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Climate Dashboard
                </h1>
              </div>
              <p className="text-white/80 text-lg max-w-xl">
                Real-time global climate monitoring and analysis. Stay informed about weather conditions worldwide.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-300 font-medium border border-white/20"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <p className="text-white/60 text-sm">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="pulse-dot"></div>
              <span className="text-sm font-semibold">Live Updates</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">{stats?.active_stations || 0} Stations Online</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">{stats?.total_data_points?.toLocaleString() || 0} Data Points</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Global Average: {stats?.global_avg_temperature || 0}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Map and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card p-0 overflow-hidden hover-lift">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-climate-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-climate-100 rounded-2xl">
                    <Globe className="h-6 w-6 text-climate-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Global Climate Map</h2>
                    <p className="text-sm text-gray-500">Interactive visualization</p>
                  </div>
                </div>
                <Link
                  to="/map"
                  className="flex items-center gap-2 px-4 py-2 bg-climate-500 text-white rounded-xl hover:bg-climate-600 transition-all font-medium shadow-lg shadow-climate-500/30"
                >
                  View Full Map
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <ClimateMap height="450px" />
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-2xl">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Active Alerts</h2>
                  <p className="text-sm text-gray-500">Critical notifications</p>
                </div>
              </div>
              <Link
                to="/alerts"
                className="flex items-center gap-1 text-sm text-climate-600 hover:text-climate-700 font-semibold"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <AlertStats alerts={alerts} />
            <div className="mt-5 space-y-3">
              <AlertList alerts={alerts} onResolve={() => {}} compact limit={3} />
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="card bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white hover-lift relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="h-6 w-6" />
                <h3 className="font-bold text-lg">Climate Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5" />
                    <span className="text-sm font-medium">Avg Temperature</span>
                  </div>
                  <span className="font-bold text-xl">{stats?.global_avg_temperature || 0}°C</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5" />
                    <span className="text-sm font-medium">Avg Humidity</span>
                  </div>
                  <span className="font-bold text-xl">{stats?.global_avg_humidity || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5" />
                    <span className="text-sm font-medium">Air Quality</span>
                  </div>
                  <span className="font-bold text-xl">{stats?.global_avg_aqi || 0} AQI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        {trendsLoading ? (
          <>
            <div className="card">
              <div className="skeleton h-6 w-1/3 mb-4"></div>
              <div className="skeleton h-64"></div>
            </div>
            <div className="card">
              <div className="skeleton h-6 w-1/3 mb-4"></div>
              <div className="skeleton h-64"></div>
            </div>
          </>
        ) : (
          <>
            <div className="hover-lift">
              <TemperatureChart data={trends} />
            </div>
            <div className="hover-lift">
              <HumidityChart data={trends} />
            </div>
          </>
        )}
      </div>

      {/* Multi-Parameter Chart */}
      {!trendsLoading && (
        <div className="animate-slide-up hover-lift" style={{ animationDelay: '0.4s' }}>
          <MultiParameterChart data={trends} />
        </div>
      )}

      {/* Recent Stations Grid */}
      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="card hover-lift">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-climate-100 rounded-2xl">
                <MapPin className="h-6 w-6 text-climate-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Live Station Data</h2>
                <p className="text-sm text-gray-500">Real-time weather readings from monitoring stations</p>
              </div>
            </div>
            <Link
              to="/stations"
              className="flex items-center gap-2 px-4 py-2 bg-climate-500 text-white rounded-xl hover:bg-climate-600 transition-all font-medium shadow-lg shadow-climate-500/30"
            >
              View All Stations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realtimeLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl"></div>
              ))
            ) : (
              realtimeData.slice(0, 8).map((station, index) => (
                <div
                  key={station.station_id}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedStation === station.station_id
                      ? 'border-climate-500 bg-climate-50 shadow-xl scale-[1.02]'
                      : 'border-gray-100 bg-white hover:border-climate-200 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedStation(station.station_id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 rounded-full ${
                      station.aqi <= 50 ? 'bg-green-500' :
                      station.aqi <= 100 ? 'bg-yellow-500' :
                      station.aqi <= 150 ? 'bg-orange-500' : 'bg-red-500'
                    } animate-pulse shadow-lg`}></div>
                  </div>
                  
                  {/* Station header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-climate-100 to-emerald-100 rounded-xl group-hover:from-climate-200 group-hover:to-emerald-200 transition-all">
                      <MapPin className="h-5 w-5 text-climate-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm truncate pr-6">
                      {station.station_name}
                    </h3>
                  </div>
                  
                  {/* Weather data */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Thermometer className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-xs font-medium text-gray-500">Temp</span>
                      </div>
                      <span className="font-bold text-xl" style={{ color: getTemperatureColor(station.temperature) }}>
                        {station.temperature.toFixed(1)}°
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Droplets className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-gray-500">Humidity</span>
                      </div>
                      <span className="font-bold text-xl text-blue-600">
                        {station.humidity.toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Wind className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium text-gray-500">Wind</span>
                      </div>
                      <span className="font-bold text-xl text-gray-700">
                        {station.wind_speed.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ 
                      background: `linear-gradient(135deg, ${getAQIColor(station.aqi)}10, ${getAQIColor(station.aqi)}05)`,
                      borderColor: `${getAQIColor(station.aqi)}30`
                    }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getAQIColor(station.aqi) }}></div>
                        <span className="text-xs font-medium text-gray-500">AQI</span>
                      </div>
                      <span className="font-bold text-xl" style={{ color: getAQIColor(station.aqi) }}>
                        {station.aqi}
                      </span>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Activity className="h-3 w-3" />
                      Updated {formatDateTime(station.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
