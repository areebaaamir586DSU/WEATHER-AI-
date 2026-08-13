import React, { useState } from 'react';
import { Alert } from '../../services/api';
import { formatDate, getSeverityBadgeClass } from '../../utils/helpers';
import {
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Bell,
  Shield,
  Zap,
} from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: number) => void;
  compact?: boolean;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'heatwave':
    case 'cold_snap':
      return <Thermometer className="h-5 w-5" />;
    case 'flood':
    case 'drought':
      return <Droplets className="h-5 w-5" />;
    case 'storm':
      return <Wind className="h-5 w-5" />;
    case 'air_quality':
      return <CloudRain className="h-5 w-5" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const getAlertColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    case 'medium': return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    case 'high': return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
    case 'critical': return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
    default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
  }
};

const getIconBg = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-600';
    case 'medium': return 'bg-yellow-100 text-yellow-600';
    case 'high': return 'bg-orange-100 text-orange-600';
    case 'critical': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border p-5 ${getAlertColor(alert.severity)} ${
      !alert.is_active ? 'opacity-60' : ''
    } transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${getIconBg(alert.severity)} transform transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-md`}>
          {getAlertIcon(alert.alert_type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900">{alert.title}</h4>
            <span className={getSeverityBadgeClass(alert.severity)}>
              {alert.severity}
            </span>
            {!alert.is_active && (
              <span className="badge bg-gray-100 text-gray-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Resolved
              </span>
            )}
          </div>
          
          {!compact && (
            <>
              <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">{alert.message}</p>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-gray-500 hover:text-climate-600 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Show more details
                  </>
                )}
              </button>
              
              {isExpanded && (
                <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Bell className="h-3.5 w-3.5 text-climate-500" />
                    <span>Alert Type: <span className="font-semibold text-gray-700 capitalize">{alert.alert_type.replace('_', ' ')}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Shield className="h-3.5 w-3.5 text-purple-500" />
                    <span>Severity: <span className="font-semibold text-gray-700 capitalize">{alert.severity}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    <span>Created: <span className="font-semibold text-gray-700">{formatDate(alert.created_at)}</span></span>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(alert.created_at)}
            </span>
            {!compact && (
              <span className="capitalize flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                {alert.alert_type.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
        
        {alert.is_active && onResolve && (
          <button
            onClick={() => onResolve(alert.id)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-white rounded-2xl border-2 border-gray-200 hover:bg-climate-50 hover:border-climate-400 hover:text-climate-600 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <CheckCircle className="h-4 w-4" />
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

interface AlertListProps {
  alerts: Alert[];
  onResolve?: (id: number) => void;
  compact?: boolean;
  limit?: number;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onResolve,
  compact = false,
  limit,
}) => {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  if (displayAlerts.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-float">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <p className="text-gray-700 font-bold text-lg">All Clear!</p>
        <p className="text-sm text-gray-400 mt-1">No active alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayAlerts.map((alert, index) => (
        <div
          key={alert.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <AlertCard
            alert={alert}
            onResolve={onResolve}
            compact={compact}
          />
        </div>
      ))}
    </div>
  );
};

interface AlertStatsProps {
  alerts: Alert[];
}

export const AlertStats: React.FC<AlertStatsProps> = ({ alerts }) => {
  const activeAlerts = alerts.filter(a => a.is_active);
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const highCount = activeAlerts.filter(a => a.severity === 'high').length;
  const mediumCount = activeAlerts.filter(a => a.severity === 'medium').length;
  const lowCount = activeAlerts.filter(a => a.severity === 'low').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            {criticalCount > 0 && <div className="absolute inset-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>}
          </div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Critical</p>
        </div>
        <p className="text-3xl font-bold text-red-700">{criticalCount}</p>
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">High</p>
        </div>
        <p className="text-3xl font-bold text-orange-700">{highCount}</p>
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Medium</p>
        </div>
        <p className="text-3xl font-bold text-yellow-700">{mediumCount}</p>
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Low</p>
        </div>
        <p className="text-3xl font-bold text-green-700">{lowCount}</p>
      </div>
    </div>
  );
};

export default AlertCard;
