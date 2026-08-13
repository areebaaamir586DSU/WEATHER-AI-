import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, CloudRain, AlertTriangle, Activity, TrendingUp, TrendingDown, Minus, Zap, BarChart3 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  iconBg: string;
  change?: number;
  subtitle?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  bgGradient,
  iconBg,
  change,
  subtitle,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

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
      className={`stat-card group ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-gray-900 count-animate">
              {typeof value === 'number' ? displayValue.toFixed(1) : value}
            </p>
            {unit && <p className="text-sm font-semibold text-gray-500">{unit}</p>}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${
              change > 0 ? 'text-green-600' : 
              change < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : change < 0 ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              <span>{Math.abs(change).toFixed(1)}% from last week</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${iconBg} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative gradient bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`}></div>
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        title="Active Stations"
        value={stats.active_stations}
        icon={<Activity className="h-6 w-6 text-white" />}
        color="climate"
        bgGradient="bg-gradient-to-r from-climate-500 to-emerald-500"
        iconBg="bg-gradient-to-br from-climate-400 to-climate-600"
        subtitle="Worldwide"
        delay={0}
      />
      <StatCard
        title="Avg Temperature"
        value={stats.global_avg_temperature}
        unit="°C"
        icon={<Thermometer className="h-6 w-6 text-white" />}
        color="orange"
        bgGradient="bg-gradient-to-r from-orange-400 to-red-500"
        iconBg="bg-gradient-to-br from-orange-400 to-red-500"
        subtitle="Global average"
        delay={1}
      />
      <StatCard
        title="Avg Humidity"
        value={stats.global_avg_humidity}
        unit="%"
        icon={<Droplets className="h-6 w-6 text-white" />}
        color="blue"
        bgGradient="bg-gradient-to-r from-blue-400 to-cyan-500"
        iconBg="bg-gradient-to-br from-blue-400 to-cyan-500"
        subtitle="Current level"
        delay={2}
      />
      <StatCard
        title="Air Quality"
        value={Math.round(stats.global_avg_aqi)}
        icon={<Wind className="h-6 w-6 text-white" />}
        color="purple"
        bgGradient="bg-gradient-to-r from-purple-400 to-pink-500"
        iconBg="bg-gradient-to-br from-purple-400 to-pink-500"
        subtitle="AQI Index"
        delay={3}
      />
      <StatCard
        title="Active Alerts"
        value={stats.active_alerts}
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        color="red"
        bgGradient="bg-gradient-to-r from-red-400 to-rose-500"
        iconBg="bg-gradient-to-br from-red-400 to-rose-500"
        subtitle="Critical"
        delay={4}
      />
      <StatCard
        title="Data Points"
        value={(stats.total_data_points / 1000).toFixed(1) + 'K'}
        icon={<CloudRain className="h-6 w-6 text-white" />}
        color="cyan"
        bgGradient="bg-gradient-to-r from-cyan-400 to-teal-500"
        iconBg="bg-gradient-to-br from-cyan-400 to-teal-500"
        subtitle="Collected"
        delay={5}
      />
    </div>
  );
};

export default StatsOverview;
