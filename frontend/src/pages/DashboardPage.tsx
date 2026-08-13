import React, { useState, useEffect } from 'react';
import { StatsOverview } from '../components/Dashboard/StatsOverview';
import { ClimateMap } from '../components/Map/ClimateMap';
import { TemperatureChart, HumidityChart, MultiParameterChart } from '../components/Charts/ClimateCharts';
import { AlertList, AlertStats } from '../components/Alerts/AlertCard';
import { useStatsSummary, useRealtimeData, useAlerts, useTrends } from '../hooks/useClimateData';
import { Thermometer, Droplets, Wind, MapPin, ArrowRight, Activity, Globe, TrendingUp, Zap, ChevronRight, RefreshCw, Sun, CloudRain, Eye, Satellite, Radio } from 'lucide-react';
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: '🌅' };
    return { text: 'Good Night', icon: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 lg:p-10 noise-overlay">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/[0.07] rounded-full blur-[100px] animate-float"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/[0.04] rounded-full blur-[80px]"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-6 right-20 text-4xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>🌍</div>
        <div className="absolute bottom-6 right-40 text-3xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>⛅</div>
        <div className="absolute top-12 left-1/3 text-2xl animate-float opacity-30" style={{ animationDelay: '2.5s' }}>🌡️</div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl sm:text-5xl">{greeting.icon}</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {greeting.text}
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base mt-1">
                    Real-time global climate monitoring and analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-3 glass-card hover:bg-white/[0.06] transition-all duration-300 text-white rounded-2xl"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-semibold">Refresh</span>
              </button>
              <p className="text-slate-500 text-xs font-mono">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick stats pills */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/15">
              <div className="pulse-dot"></div>
              <span className="text-xs font-bold text-emerald-400">LIVE</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-full border border-white/[0.06]">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">{stats?.active_stations || 0} Stations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-full border border-white/[0.06]">
              <Activity className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">{stats?.total_data_points?.toLocaleString() || 0} Data Points</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-full border border-white/[0.06]">
              <Sun className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-medium text-slate-300">{stats?.global_avg_temperature || 0}°C Global Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Map and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 animate-fade-in-up opacity-0 stagger-1">
          <div className="card p-0 overflow-hidden hover-lift">
            <div className="p-5 border-b border-white/[0.06] bg-gradient-to-r from-emerald-500/[0.06] to-cyan-500/[0.03]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Global Climate Map</h2>
                    <p className="text-xs text-slate-500">Interactive visualization</p>
                  </div>
                </div>
                <Link
                  to="/map"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-semibold text-sm"
                >
                  Full Map
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <ClimateMap height="420px" />
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="space-y-5 animate-fade-in-up opacity-0 stagger-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Active Alerts</h2>
                  <p className="text-xs text-slate-500">{alerts.filter(a => a.is_active).length} active</p>
                </div>
              </div>
              <Link
                to="/alerts"
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <AlertStats alerts={alerts} />
            <div className="mt-4 space-y-3">
              <AlertList alerts={alerts} onResolve={() => {}} compact limit={3} />
            </div>
          </div>

          {/* Climate Insights Card */}
          <div className="card relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/15 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Climate Insights</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.04] hover:bg-white/[0.06] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-medium text-slate-300">Temperature</span>
                  </div>
                  <span className="font-bold text-sm text-white">{stats?.global_avg_temperature || 0}°C</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.04] hover:bg-white/[0.06] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-slate-300">Humidity</span>
                  </div>
                  <span className="font-bold text-sm text-white">{stats?.global_avg_humidity || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.04] hover:bg-white/[0.06] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wind className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-medium text-slate-300">Air Quality</span>
                  </div>
                  <span className="font-bold text-sm text-white">{stats?.global_avg_aqi || 0} AQI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up opacity-0 stagger-3">
        {trendsLoading ? (
          <>
            <div className="card"><div className="skeleton h-6 w-1/3 mb-4"></div><div className="skeleton h-64"></div></div>
            <div className="card"><div className="skeleton h-6 w-1/3 mb-4"></div><div className="skeleton h-64"></div></div>
          </>
        ) : (
          <>
            <div className="hover-lift"><TemperatureChart data={trends} /></div>
            <div className="hover-lift"><HumidityChart data={trends} /></div>
          </>
        )}
      </div>

      {/* Multi-Parameter Chart */}
      {!trendsLoading && (
        <div className="animate-fade-in-up opacity-0 stagger-4 hover-lift">
          <MultiParameterChart data={trends} />
        </div>
      )}

      {/* Live Station Data */}
      <div className="animate-fade-in-up opacity-0 stagger-5">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/15 flex items-center justify-center">
                <Radio className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Live Station Data</h2>
                <p className="text-xs text-slate-500">Real-time weather readings</p>
              </div>
            </div>
            <Link
              to="/stations"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-semibold text-sm"
            >
              All Stations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {realtimeLoading ? (
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl"></div>)
            ) : (
              realtimeData.slice(0, 8).map((station, index) => (
                <div
                  key={station.station_id}
                  className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedStation === station.station_id
                      ? 'border-emerald-500/40 bg-emerald-500/[0.06] shadow-lg shadow-emerald-500/5'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  }`}
                  onClick={() => setSelectedStation(station.station_id)}
                >
                  {/* Status dot */}
                  <div className="absolute top-3.5 right-3.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      station.aqi <= 50 ? 'bg-emerald-400' : station.aqi <= 100 ? 'bg-amber-400' : station.aqi <= 150 ? 'bg-orange-400' : 'bg-red-400'
                    }`}></div>
                  </div>

                  {/* Station name */}
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <h3 className="text-xs font-bold text-white truncate pr-4">{station.station_name}</h3>
                  </div>

                  {/* Weather grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-orange-500/[0.06] border border-orange-500/10">
                      <div className="flex items-center gap-1 mb-1">
                        <Thermometer className="h-3 w-3 text-orange-400" />
                        <span className="text-[10px] text-slate-500 font-medium">Temp</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: getTemperatureColor(station.temperature) }}>
                        {station.temperature.toFixed(1)}°
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/10">
                      <div className="flex items-center gap-1 mb-1">
                        <Droplets className="h-3 w-3 text-blue-400" />
                        <span className="text-[10px] text-slate-500 font-medium">Humid</span>
                      </div>
                      <span className="text-sm font-bold text-blue-400">{station.humidity.toFixed(0)}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-1 mb-1">
                        <Wind className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500 font-medium">Wind</span>
                      </div>
                      <span className="text-sm font-bold text-slate-300">{station.wind_speed.toFixed(1)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border" style={{ background: `${getAQIColor(station.aqi)}08`, borderColor: `${getAQIColor(station.aqi)}20` }}>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAQIColor(station.aqi) }}></div>
                        <span className="text-[10px] text-slate-500 font-medium">AQI</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: getAQIColor(station.aqi) }}>{station.aqi}</span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
                    <p className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Activity className="h-2.5 w-2.5" />
                      {formatDateTime(station.timestamp)}
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
