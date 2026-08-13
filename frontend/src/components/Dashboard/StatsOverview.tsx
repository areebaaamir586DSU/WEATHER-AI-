import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, CloudRain, AlertTriangle, Activity, TrendingUp, TrendingDown, Minus, Zap, BarChart3, Gauge } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  gradient: string;
  change?: number;
  subtitle?: string;
  delay?: number;
  glow?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  gradient,
  change,
  subtitle,
  delay = 0,
  glow,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (typeof value === 'number' && isVisible) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start * 10) / 10);
        }
      }, 16);
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value as number);
    }
  }, [value, isVisible]);

  return (
    <div
      className={`stat-card group opacity-0 ${isVisible ? 'animate-scale-in' : ''}`}
      style={{ animationDelay: `${delay * 0.08}s` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-bold text-white animate-count-up" style={{ animationDelay: `${delay * 0.1}s` }}>
              {typeof value === 'number' ? displayValue.toFixed(1) : value}
            </p>
            {unit && <p className="text-sm font-semibold text-slate-400">{unit}</p>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 mt-2.5 text-xs font-semibold ${
              change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {change > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : change < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              <span>{Math.abs(change).toFixed(1)}% from last week</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${gradient}`}
          style={glow ? { boxShadow: glow } : {}}
        >
          {icon}
        </div>
      </div>
      {/* Bottom gradient accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-b-2xl`}></div>
    </div>
  );
};

interface StatsOverviewProps {
  stats: {
    active_stations: number;
    total_data_points: number;
    active_alerts: number;
    global_avg_temperature: number;
    global_avg_humidity: number;
    global_avg_aqi: number;
  } | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      <StatCard
        title="Stations"
        value={stats.active_stations}
        icon={<Activity className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-emerald-500 to-cyan-500"
        subtitle="Worldwide"
        delay={0}
        glow="0 4px 20px rgba(16, 185, 129, 0.3)"
      />
      <StatCard
        title="Avg Temp"
        value={stats.global_avg_temperature}
        unit="°C"
        icon={<Thermometer className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-orange-500 to-red-500"
        subtitle="Global average"
        delay={1}
        glow="0 4px 20px rgba(245, 158, 11, 0.3)"
      />
      <StatCard
        title="Humidity"
        value={stats.global_avg_humidity}
        unit="%"
        icon={<Droplets className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
        subtitle="Current level"
        delay={2}
        glow="0 4px 20px rgba(59, 130, 246, 0.3)"
      />
      <StatCard
        title="Air Quality"
        value={Math.round(stats.global_avg_aqi)}
        icon={<Gauge className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        subtitle="AQI Index"
        delay={3}
        glow="0 4px 20px rgba(139, 92, 246, 0.3)"
      />
      <StatCard
        title="Alerts"
        value={stats.active_alerts}
        icon={<AlertTriangle className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-red-500 to-orange-500"
        subtitle="Active"
        delay={4}
        glow="0 4px 20px rgba(239, 68, 68, 0.3)"
      />
      <StatCard
        title="Data Points"
        value={(stats.total_data_points / 1000).toFixed(1) + 'K'}
        icon={<BarChart3 className="h-5 w-5 text-white" />}
        gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
        subtitle="Collected"
        delay={5}
        glow="0 4px 20px rgba(6, 182, 212, 0.3)"
      />
    </div>
  );
};

export default StatsOverview;
