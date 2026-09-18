import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  MapPin, 
  Terminal, 
  Database, 
  Sparkles, 
  Layers, 
  RefreshCw, 
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Header } from './components/Header';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { MetricCards } from './components/MetricCards';
import { FilterBar } from './components/FilterBar';
import { TransactionsTable } from './components/TransactionsTable';
import { DistrictExplorer } from './components/DistrictExplorer';
import { MarketAnalytics } from './components/MarketAnalytics';
import { ApiIntegrationModal } from './components/ApiIntegrationModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';

import { 
  ApiConfig, 
  DistrictSummary, 
  MarketAggregateStats, 
  MarketTrendPoint, 
  PropertyFilterState, 
  PropertyTransaction, 
  SingaporeRegion 
} from './types/property';
import { propertyApi } from './services/propertyApi';
import { 
  SAMPLE_MOCK_DISTRICTS, 
  SAMPLE_MOCK_STATS, 
  SAMPLE_MOCK_TRANSACTIONS, 
  SAMPLE_MOCK_TRENDS 
} from './data/mockSchemaData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'districts' | 'analytics' | 'api-hub'>('transactions');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [unitMeasurement, setUnitMeasurement] = useState<'PSF' | 'PSM'>('PSF');
  const [selectedProperty, setSelectedProperty] = useState<PropertyTransaction | null>(null);

  // API Config state
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => propertyApi.getConfig());

  // Real backend data states: default is null as instructed:
  // "Do not include any data as of now, I will connect to the backend after for now, but include placeholders for the API integration."
  const [stats, setStats] = useState<MarketAggregateStats | null>(null);
  const [transactions, setTransactions] = useState<PropertyTransaction[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [districtSummaries, setDistrictSummaries] = useState<DistrictSummary[] | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrendPoint[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isMockActive, setIsMockActive] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: '',
    selectedRegion: 'ALL',
    selectedDistrict: 'ALL',
    selectedPropertyType: 'ALL',
    selectedTenure: 'ALL',
    selectedSaleType: 'ALL',
    minPsf: null,
    maxPsf: null,
    minPrice: null,
    maxPrice: null,
    unitMeasurement: 'PSF',
    sortBy: 'contractDate',
    sortOrder: 'desc',
    page: 1,
    pageSize: 15,
  });

  // Load data from configured backend API
  const loadDataFromApi = useCallback(async () => {
    // If mock preview mode is active, filter mock data locally
    if (isMockActive) {
      let filtered = [...SAMPLE_MOCK_TRANSACTIONS];
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.projectName.toLowerCase().includes(q) ||
            t.street.toLowerCase().includes(q) ||
            t.district.toLowerCase().includes(q)
        );
      }
      if (filters.selectedRegion !== 'ALL') {
        filtered = filtered.filter((t) => t.region === filters.selectedRegion);
      }
      if (filters.selectedDistrict !== 'ALL') {
        filtered = filtered.filter((t) => t.district === filters.selectedDistrict);
      }
      if (filters.selectedPropertyType !== 'ALL') {
        filtered = filtered.filter((t) => t.propertyType === filters.selectedPropertyType);
      }
      if (filters.selectedTenure !== 'ALL') {
        filtered = filtered.filter((t) => t.tenure === filters.selectedTenure);
      }
      if (filters.selectedSaleType !== 'ALL') {
        filtered = filtered.filter((t) => t.typeOfSale === filters.selectedSaleType);
      }

      // Sort
      filtered.sort((a, b) => {
        let valA = a[filters.sortBy as keyof PropertyTransaction];
        let valB = b[filters.sortBy as keyof PropertyTransaction];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return filters.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });

      setTransactions(filtered);
      setTotalCount(filtered.length);
      setStats(SAMPLE_MOCK_STATS);
      setDistrictSummaries(SAMPLE_MOCK_DISTRICTS);
      setMarketTrends(SAMPLE_MOCK_TRENDS);
      return;
    }

    // Try fetching from configured backend API
    setIsLoading(true);
    try {
      const [statsRes, txRes, districtsRes, trendsRes] = await Promise.all([
        propertyApi.fetchMarketStats(filters),
        propertyApi.fetchTransactions(filters),
        propertyApi.fetchDistrictSummaries(filters.selectedRegion),
        propertyApi.fetchMarketTrends(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        setStats(null);
      }

      if (txRes.success && txRes.data) {
        setTransactions(txRes.data);
        setTotalCount(txRes.totalCount || txRes.data.length);
      } else {
        setTransactions(null);
        setTotalCount(0);
      }

      if (districtsRes.success && districtsRes.data) {
        setDistrictSummaries(districtsRes.data);
      } else {
        setDistrictSummaries(null);
      }

      if (trendsRes.success && trendsRes.data) {
        setMarketTrends(trendsRes.data);
      } else {
        setMarketTrends(null);
      }
    } catch {
      // In case of error / no server, state remains null (expectant placeholder)
      setStats(null);
      setTransactions(null);
      setTotalCount(0);
      setDistrictSummaries(null);
      setMarketTrends(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isMockActive]);

  useEffect(() => {
    loadDataFromApi();
  }, [loadDataFromApi]);

  // Handlers
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedRegion: 'ALL',
      selectedDistrict: 'ALL',
      selectedPropertyType: 'ALL',
      selectedTenure: 'ALL',
      selectedSaleType: 'ALL',
      minPsf: null,
      maxPsf: null,
      minPrice: null,
      maxPrice: null,
      unitMeasurement,
      sortBy: 'contractDate',
      sortOrder: 'desc',
      page: 1,
      pageSize: 15,
    });
  };

  const handleSelectDistrict = (districtCode: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedDistrict: districtCode,
      page: 1,
    }));
    setActiveTab('transactions');
  };

  const handleSaveApiConfig = (newConfig: Partial<ApiConfig>) => {
    const updated = propertyApi.updateConfig(newConfig);
    setApiConfig(updated);
    loadDataFromApi();
  };

  const handleToggleMockPreview = () => {
    if (isMockActive) {
      // Revert to empty awaiting state
      setIsMockActive(false);
      setStats(null);
      setTransactions(null);
      setTotalCount(0);
      setDistrictSummaries(null);
      setMarketTrends(null);
    } else {
      // Load sample schema preview
      setIsMockActive(true);
      setStats(SAMPLE_MOCK_STATS);
      setTransactions(SAMPLE_MOCK_TRANSACTIONS);
      setTotalCount(SAMPLE_MOCK_TRANSACTIONS.length);
      setDistrictSummaries(SAMPLE_MOCK_DISTRICTS);
      setMarketTrends(SAMPLE_MOCK_TRENDS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Header */}
      <Header
        apiConfig={apiConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onRefreshData={loadDataFromApi}
        isLoading={isLoading}
        unitMeasurement={unitMeasurement}
        setUnitMeasurement={setUnitMeasurement}
      />

      {/* API Status Banner */}
      <ApiStatusBanner
        apiConfig={apiConfig}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onLoadMockPreview={handleToggleMockPreview}
        isMockActive={isMockActive}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Market KPI Metric Cards */}
        <MetricCards
          stats={stats}
          unitMeasurement={unitMeasurement}
          onOpenApiModal={() => setIsApiModalOpen(true)}
        />

        {/* View Switcher Output */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
              totalResultsCount={totalCount}
            />

            <TransactionsTable
              transactions={transactions}
              totalCount={totalCount}
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
              unitMeasurement={unitMeasurement}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onOpenApiModal={() => setIsApiModalOpen(true)}
              onLoadMockPreview={handleToggleMockPreview}
              isMockActive={isMockActive}
            />
          </div>
        )}

        {activeTab === 'districts' && (
          <DistrictExplorer
            districtSummaries={districtSummaries}
            selectedRegion={filters.selectedRegion}
            onSelectDistrict={handleSelectDistrict}
            onOpenApiModal={() => setIsApiModalOpen(true)}
            unitMeasurement={unitMeasurement}
          />
        )}

        {activeTab === 'analytics' && (
          <MarketAnalytics
            trends={marketTrends}
            onOpenApiModal={() => setIsApiModalOpen(true)}
            unitMeasurement={unitMeasurement}
          />
        )}

        {activeTab === 'api-hub' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-rose-400" />
                  API Integration Hub &amp; Backend Endpoints
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Use this terminal workbench to configure your private property backend server, verify connectivity, and inspect complete REST JSON contracts.
                </p>
              </div>

              <button
                onClick={() => setIsApiModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Open Full API Config Modal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Inlined quick reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Target Endpoints Summary
                </h3>
                <ul className="space-y-2 text-xs font-mono">
                  <li className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span>GET /api/v1/properties/health</span>
                    <span className="text-[10px] text-emerald-400">Ping</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span>GET /api/v1/properties/stats</span>
                    <span className="text-[10px] text-sky-400">KPIs &amp; Averages</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span>GET /api/v1/properties/transactions</span>
                    <span className="text-[10px] text-rose-400">Sales Records</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span>GET /api/v1/properties/districts</span>
                    <span className="text-[10px] text-amber-400">D01-D28 Index</span>
                  </li>
                  <li className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span>GET /api/v1/properties/trends</span>
                    <span className="text-[10px] text-purple-400">Quarterly Series</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Connecting Your Backend Later
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    As requested, this app initializes with empty data feeds and placeholders. When your Singapore real estate backend (e.g., URA Real Estate API proxy, Express/Node, FastAPI, or cloud database) is ready:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                    <li>Open <strong>API Integration Hub</strong> in the top right.</li>
                    <li>Enter your server URL (e.g. <code className="font-mono text-rose-300">http://localhost:8000/api</code>).</li>
                    <li>Click <strong>Ping / Test Connection</strong> to verify handshake.</li>
                    <li>Click <strong>Save Endpoint Config</strong> &ndash; transactions will stream in immediately!</li>
                  </ol>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Schema verification:
                  </span>
                  <button
                    onClick={handleToggleMockPreview}
                    className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isMockActive ? 'Reset to Awaiting Feed' : 'Test Schema Mock Preview'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Singapore Private Residential Property Price Tracker</span>
            <span>&bull;</span>
            <span className="text-slate-400">Ready for Backend Integration</span>
          </div>
          <div>
            CCR / RCR / OCR Market Benchmarks &bull; Currency: Singapore Dollar (S$)
          </div>
        </div>
      </footer>

      {/* API Integration & Credentials Modal */}
      <ApiIntegrationModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        apiConfig={apiConfig}
        onSaveConfig={handleSaveApiConfig}
        onLoadMockPreview={handleToggleMockPreview}
        onClearMockPreview={handleToggleMockPreview}
        isMockActive={isMockActive}
      />

      {/* Property Transaction Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        unitMeasurement={unitMeasurement}
        onOpenApiModal={() => {
          setSelectedProperty(null);
          setIsApiModalOpen(true);
        }}
      />
    </div>
  );
}
