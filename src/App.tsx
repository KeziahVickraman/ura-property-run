import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  PropertyFilterState, 
  PropertyTransaction 
} from './types/property';
import { 
  fetchUraTransactions, 
  calculateMarketStats, 
  generateDistrictSummaries, 
  generateMarketTrends 
} from './services/propertyApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'districts' | 'analytics' | 'api-hub'>('transactions');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [unitMeasurement, setUnitMeasurement] = useState<'PSF' | 'PSM'>('PSF');
  const [selectedProperty, setSelectedProperty] = useState<PropertyTransaction | null>(null);

  // Active dataset state from URA endpoint
  const [rawTransactions, setRawTransactions] = useState<PropertyTransaction[]>([]);
  const [currentBatch, setCurrentBatch] = useState<number>(1);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Fetch transactions from the serverless URA endpoint
  const loadUraData = useCallback(async (batchNum: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchUraTransactions(batchNum);
      setRawTransactions(res.transactions);
      setIsLive(res.isLive);
    } catch (err: any) {
      console.error('Failed to fetch URA transactions:', err);
      setErrorMessage(err?.message || 'Failed to connect to URA transactions feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUraData(currentBatch);
  }, [currentBatch, loadUraData]);

  const handleBatchChange = (b: number) => {
    setCurrentBatch(b);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    loadUraData(currentBatch);
  };

  // Derive aggregate stats directly from loaded URA dataset
  const stats = useMemo(() => {
    return calculateMarketStats(rawTransactions);
  }, [rawTransactions]);

  // Derive district benchmarks directly from loaded URA dataset
  const districtSummaries = useMemo(() => {
    return generateDistrictSummaries(rawTransactions);
  }, [rawTransactions]);

  // Derive market trends directly from loaded URA dataset
  const marketTrends = useMemo(() => {
    return generateMarketTrends(rawTransactions);
  }, [rawTransactions]);

  // Filter and sort transactions strictly based on active filter criteria
  const filteredTransactions = useMemo(() => {
    let result = [...rawTransactions];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter((t) => 
        t.projectName.toLowerCase().includes(q) ||
        t.street.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q)
      );
    }

    if (filters.selectedRegion !== 'ALL') {
      result = result.filter((t) => t.region === filters.selectedRegion);
    }

    if (filters.selectedDistrict !== 'ALL') {
      result = result.filter((t) => t.district === filters.selectedDistrict);
    }

    if (filters.selectedPropertyType !== 'ALL') {
      result = result.filter((t) => t.propertyType === filters.selectedPropertyType);
    }

    if (filters.selectedTenure !== 'ALL') {
      result = result.filter((t) => t.tenure === filters.selectedTenure);
    }

    if (filters.selectedSaleType !== 'ALL') {
      result = result.filter((t) => t.typeOfSale === filters.selectedSaleType);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[filters.sortBy as keyof PropertyTransaction];
      let valB: any = b[filters.sortBy as keyof PropertyTransaction];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return filters.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [rawTransactions, filters]);

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

  const handleSelectDistrictFromExplorer = (districtCode: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedDistrict: districtCode,
      selectedRegion: 'ALL',
      page: 1,
    }));
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white font-sans">
      {/* Top Main Navigation Header */}
      <Header
        isLive={isLive}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onRefreshData={handleRefresh}
        isLoading={isLoading}
        unitMeasurement={unitMeasurement}
        setUnitMeasurement={setUnitMeasurement}
      />

      {/* Active URA Service & Batch Status Banner */}
      <ApiStatusBanner
        isLive={isLive}
        batch={currentBatch}
        totalRecords={rawTransactions.length}
        isLoading={isLoading}
        onSelectBatch={handleBatchChange}
        onRefresh={handleRefresh}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error message banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={handleRefresh}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium ml-3"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dynamic Key Metric Cards derived from URA dataset */}
        <MetricCards
          stats={stats}
          unitMeasurement={unitMeasurement}
          onOpenApiModal={() => setIsApiModalOpen(true)}
        />

        {/* Tab 1: Private Property Transactions */}
        {activeTab === 'transactions' && (
          <section className="space-y-4">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredTransactions.length}
            />

            <TransactionsTable
              transactions={filteredTransactions}
              totalCount={filteredTransactions.length}
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
              unitMeasurement={unitMeasurement}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onResetFilters={handleResetFilters}
            />
          </section>
        )}

        {/* Tab 2: Singapore Postal Districts (D01-D28) */}
        {activeTab === 'districts' && (
          <section>
            <DistrictExplorer
              districtSummaries={districtSummaries}
              selectedRegion={filters.selectedRegion}
              onSelectDistrict={handleSelectDistrictFromExplorer}
              unitMeasurement={unitMeasurement}
            />
          </section>
        )}

        {/* Tab 3: Market Analytics & Trends */}
        {activeTab === 'analytics' && (
          <section>
            <MarketAnalytics
              trends={marketTrends}
              unitMeasurement={unitMeasurement}
            />
          </section>
        )}

        {/* Tab 4: API Endpoint Specifications */}
        {activeTab === 'api-hub' && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                URA Data Service Architecture (PMI_Resi_Transaction)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Direct integration with Urban Redevelopment Authority (URA) Real Estate Information System.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono text-emerald-400 font-bold block">
                  1. insertNewToken
                </span>
                <p className="text-slate-400">
                  Each day, trade the <code className="text-slate-300">AccessKey</code> for today&apos;s daily token:
                </p>
                <code className="block p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-300 break-all">
                  GET https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1
                  <br />
                  Header &rarr; AccessKey: &lt;URA_ACCESS_KEY&gt;
                </code>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono text-sky-400 font-bold block">
                  2. invokeUraDS (PMI_Resi_Transaction)
                </span>
                <p className="text-slate-400">
                  Data calls send BOTH headers, <code className="text-slate-300">AccessKey</code> and <code className="text-slate-300">Token</code>:
                </p>
                <code className="block p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-300 break-all">
                  GET https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&amp;batch=1
                  <br />
                  Headers &rarr; AccessKey &amp; Token
                </code>
              </div>
            </div>

            <button
              onClick={() => setIsApiModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors"
            >
              Open Interactive Endpoint Tester
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Powered by Singapore Urban Redevelopment Authority (URA) Data Service</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>service=PMI_Resi_Transaction</span>
            <span>&bull;</span>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="text-rose-400 hover:underline"
            >
              Endpoint Specs
            </button>
          </div>
        </div>
      </footer>

      {/* Property Transaction Detail Modal with Stamp Duty & Raw URA Payload */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          unitMeasurement={unitMeasurement}
          onOpenApiModal={() => {
            setSelectedProperty(null);
            setIsApiModalOpen(true);
          }}
        />
      )}

      {/* URA Endpoint Specifications & Testing Modal */}
      <ApiIntegrationModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        currentBatch={currentBatch}
      />
    </div>
  );
}
