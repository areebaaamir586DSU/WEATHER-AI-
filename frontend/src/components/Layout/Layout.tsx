import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Bell,
  Globe,
  Activity,
  Menu,
  X,
  ChevronRight,
  Waves,
  Sun,
  Moon,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, gradient: 'from-emerald-400 to-cyan-400' },
  { name: 'Map View', href: '/map', icon: Map, gradient: 'from-blue-400 to-indigo-400' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, gradient: 'from-purple-400 to-pink-400' },
  { name: 'Alerts', href: '/alerts', icon: Bell, gradient: 'from-orange-400 to-red-400' },
  { name: 'Stations', href: '/stations', icon: Globe, gradient: 'from-cyan-400 to-blue-400' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[72px] xl:w-[260px] flex-col glass-strong z-50 border-r border-white/[0.06]">
        {/* Logo */}
        <div className="p-4 xl:p-5 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <Activity className="h-5 w-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111827]">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50"></div>
              </div>
            </div>
            <div className="hidden xl:block">
              <span className="text-base font-bold gradient-text">Climate</span>
              <span className="text-[10px] block text-slate-500 font-medium tracking-wider uppercase mt-0.5">Monitoring System</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 xl:p-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 px-3 xl:px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                style={isActive ? { boxShadow: `0 8px 30px rgba(16, 185, 129, 0.15)` } : {}}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-20" style={{background: `linear-gradient(135deg, ${item.gradient.includes('emerald') ? '#10b981' : item.gradient.includes('blue') ? '#3b82f6' : item.gradient.includes('purple') ? '#8b5cf6' : item.gradient.includes('orange') ? '#f59e0b' : '#06b6d4'}, transparent)`}}></div>
                )}
                <item.icon className={`h-5 w-5 relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="hidden xl:block relative z-10 font-semibold text-sm">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto relative z-10 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 xl:p-4 border-t border-white/[0.06] space-y-3">
          {/* Live Status */}
          <div className="hidden xl:flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/[0.15]">
            <div className="pulse-dot flex-shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-emerald-400">LIVE</p>
              <p className="text-[10px] text-emerald-400/60">20 stations online</p>
            </div>
          </div>
          <div className="lg:flex xl:hidden items-center justify-center py-2">
            <div className="pulse-dot"></div>
          </div>

          {/* Time */}
          <div className="hidden xl:block text-center text-xs text-slate-500 font-mono">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">Climate Monitor</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-72 glass-strong border-l border-white/[0.06] transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 pt-20">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white font-semibold shadow-lg`
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[72px] xl:ml-[260px] pt-16 lg:pt-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
