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
  Snowflake,
  Sun,
} from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: number) => void;
  compact?: boolean;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'heatwave': return <Sun className="h-5 w-5" />;
    case 'cold_snap': return <Snowflake className="h-5 w-5" />;
    case 'flood': return <Droplets className="h-5 w-5" />;
    case 'drought': return <Droplets className="h-5 w-5" />;
    case 'storm': return <Wind className="h-5 w-5" />;
    case 'air_quality': return <CloudRain className="h-5 w-5" />;
    default: return <AlertTriangle className="h-5 w-5" />;
  }
};

const getAlertStyles = (severity: string) => {
  switch (severity) {
    case 'low':
      return {
        bg: 'from-emerald-500/[0.08] to-cyan-500/[0.04]',
        border: 'border-emerald-500/20',
        iconBg: 'bg-emerald-500/15 text-emerald-400',
        glow: 'shadow-emerald-500/5',
      };
    case 'medium':
      return {
        bg: 'from-amber-500/[0.08] to-yellow-500/[0.04]',
        border: 'border-amber-500/20',
        iconBg: 'bg-amber-500/15 text-amber-400',
        glow: 'shadow-amber-500/5',
      };
    case 'high':
      return {
        bg: 'from-orange-500/[0.08] to-red-500/[0.04]',
        border: 'border-orange-500/20',
        iconBg: 'bg-orange-500/15 text-orange-400',
        glow: 'shadow-orange-500/5',
      };
    case 'critical':
      return {
        bg: 'from-red-500/[0.1] to-rose-500/[0.05]',
        border: 'border-red-500/25',
        iconBg: 'bg-red-500/15 text-red-400',
        glow: 'shadow-red-500/10',
      };
    default:
      return {
        bg: 'from-slate-500/[0.08] to-gray-500/[0.04]',
        border: 'border-slate-500/20',
        iconBg: 'bg-slate-500/15 text-slate-400',
        glow: 'shadow-slate-500/5',
      };
  }
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = getAlertStyles(alert.severity);

  return (
    <div className={`rounded-2xl border bg-gradient-to-r ${styles.bg} ${styles.border} ${
      !alert.is_active ? 'opacity-50' : ''
    } transition-all duration-300 hover:shadow-xl ${styles.glow}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6`}>
            {getAlertIcon(alert.alert_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white text-sm">{alert.title}</h4>
              <span className={getSeverityBadgeClass(alert.severity)}>
                {alert.severity}
              </span>
              {!alert.is_active && (
                <span className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Resolved
                </span>
              )}
            </div>

            {!compact && (
              <>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{alert.message}</p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
                {isExpanded && (
                  <div className="mt-4 p-4 bg-white/[0.03] rounded-2xl space-y-3 animate-fade-in-up border border-white/[0.04]">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Bell className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Type: <span className="font-semibold text-slate-300 capitalize">{alert.alert_type.replace('_', ' ')}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Shield className="h-3.5 w-3.5 text-purple-400" />
                      <span>Severity: <span className="font-semibold text-slate-300 capitalize">{alert.severity}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span>Created: <span className="font-semibold text-slate-300">{formatDate(alert.created_at)}</span></span>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
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
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-white/[0.06] text-slate-300 rounded-2xl border border-white/[0.08] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 flex-shrink-0"
            >
              <CheckCircle className="h-4 w-4" />
              Resolve
            </button>
          )}
        </div>
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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-float border border-emerald-500/10">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>
        <p className="text-white font-bold text-lg">All Clear!</p>
        <p className="text-sm text-slate-400 mt-1">No active alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert, index) => (
        <div
          key={alert.id}
          className="animate-fade-in-up opacity-0"
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

  const stats = [
    { label: 'Critical', count: criticalCount, gradient: 'from-red-500/10 to-rose-500/5', border: 'border-red-500/15', dot: 'bg-red-400', text: 'text-red-400', pulse: criticalCount > 0 },
    { label: 'High', count: highCount, gradient: 'from-orange-500/10 to-amber-500/5', border: 'border-orange-500/15', dot: 'bg-orange-400', text: 'text-orange-400', pulse: false },
    { label: 'Medium', count: mediumCount, gradient: 'from-amber-500/10 to-yellow-500/5', border: 'border-amber-500/15', dot: 'bg-amber-400', text: 'text-amber-400', pulse: false },
    { label: 'Low', count: lowCount, gradient: 'from-emerald-500/10 to-cyan-500/5', border: 'border-emerald-500/15', dot: 'bg-emerald-400', text: 'text-emerald-400', pulse: false },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.border} hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <div className={`w-2.5 h-2.5 rounded-full ${stat.dot}`}></div>
              {stat.pulse && <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${stat.dot} animate-ping opacity-50`}></div>}
            </div>
            <p className={`text-[10px] font-bold ${stat.text} uppercase tracking-wider`}>{stat.label}</p>
          </div>
          <p className={`text-3xl font-bold ${stat.text}`}>{stat.count}</p>
        </div>
      ))}
    </div>
  );
};

export default AlertCard;
