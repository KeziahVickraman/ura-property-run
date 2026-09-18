import React from 'react';
import { 
  Building2, 
  Terminal, 
  Settings2, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  SlidersHorizontal,
  MapPin,
  LineChart,
  Table
} from 'lucide-react';
import { ApiConfig } from '../types/property';

interface HeaderProps {
  apiConfig: ApiConfig;
  activeTab: 'transactions' | 'districts' | 'analytics' | 'api-hub';
  setActiveTab: (tab: 'transactions' | 'districts' | 'analytics' | 'api-hub') => void;
  onOpenApiModal: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  unitMeasurement: 'PSF' | 'PSM';
  setUnitMeasurement: (unit: 'PSF' | 'PSM') => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiConfig,
  activeTab,
  setActiveTab,
  onOpenApiModal,
  onRefreshData,
  isLoading,
  unitMeasurement,
  setUnitMeasurement,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 text-rose-400 shadow-sm shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-[9px] font-bold text-slate-300">
                SG
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  Singapore Private Property
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 hidden sm:inline-block">
                    PRICES
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Residential Transaction Benchmark &bull; CCR / RCR / OCR Price Tracking
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'transactions'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Transactions</span>
            </button>

            <button
              onClick={() => setActiveTab('districts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'districts'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Districts (D01–D28)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Market Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('api-hub')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'api-hub'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Integration</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unit Measurement Switcher: PSF vs PSM */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setUnitMeasurement('PSF')}
                className={`px-2 py-1 rounded transition-colors ${
                  unitMeasurement === 'PSF'
                    ? 'bg-slate-800 text-rose-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Per Square Foot (S$ PSF)"
              >
                S$ PSF
              </button>
              <button
                type="button"
                onClick={() => setUnitMeasurement('PSM')}
                className={`px-2 py-1 rounded transition-colors ${
                  unitMeasurement === 'PSM'
                    ? 'bg-slate-800 text-rose-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Per Square Metre (S$ PSM)"
              >
                S$ PSM
              </button>
            </div>

            {/* Refresh Feed Button */}
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors disabled:opacity-50"
              title="Refresh API Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
            </button>

            {/* Connection Status & Config Launcher */}
            <button
              onClick={onOpenApiModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                apiConfig.connected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-900/30'
              }`}
            >
              {apiConfig.connected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Backend Connected</span>
                  <span className="sm:hidden">API OK</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="hidden sm:inline">API: Placeholder Active</span>
                  <span className="sm:hidden">API Ready</span>
                </>
              )}
              <Settings2 className="w-3.5 h-3.5 ml-0.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'districts'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Districts (D01-D28)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('api-hub')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'api-hub'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            API Hub
          </button>
        </div>
      </div>
    </header>
  );
};
