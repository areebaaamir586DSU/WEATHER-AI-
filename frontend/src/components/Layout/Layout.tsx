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
  Sun,
  Moon,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-climate-400 to-emerald-500' },
  { name: 'Map View', href: '/map', icon: Map, color: 'from-blue-400 to-indigo-500' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-purple-400 to-pink-500' },
  { name: 'Alerts', href: '/alerts', icon: Bell, color: 'from-red-400 to-rose-500' },
  { name: 'Stations', href: '/stations', icon: Globe, color: 'from-orange-400 to-amber-500' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-gray-200/50 border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="p-2.5 bg-gradient-to-br from-climate-500 to-emerald-500 rounded-2xl shadow-lg shadow-climate-500/30 group-hover:shadow-climate-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-climate-600 via-emerald-500 to-teal-500">
                    Climate Monitor
                  </span>
                  <span className="hidden sm:block text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                    Global Weather Intelligence
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl`}></div>
                    )}
                    <item.icon className={`h-4 w-4 relative z-10 ${
                      isActive ? `bg-clip-text text-transparent bg-gradient-to-r ${item.color}` : ''
                    }`} />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-gray-400 relative z-10" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Live Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-xs font-bold text-green-700">LIVE</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-climate-500 to-emerald-500 rounded-2xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Navigation</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                    {item.name}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Live Status */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700">System Online</p>
                  <p className="text-xs text-green-600">Real-time monitoring active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-climate-500 to-emerald-500 rounded-xl">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">
                Climate Monitoring & Mapping System
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time data from 20 stations
              </span>
              <span>•</span>
              <span>Updated every 30 seconds</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
