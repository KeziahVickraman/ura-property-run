import React, { useState } from 'react';
import { 
  Building2, 
  ArrowUpDown, 
  ExternalLink, 
  Download, 
  Terminal, 
  Database, 
  Copy, 
  Check, 
  Code, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  PropertyTransaction, 
  PropertyFilterState, 
  SingaporeRegion 
} from '../types/property';
import { REGION_METADATA } from '../data/singaporeDistricts';

interface TransactionsTableProps {
  transactions: PropertyTransaction[] | null;
  totalCount: number;
  isLoading: boolean;
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  unitMeasurement: 'PSF' | 'PSM';
  onSelectProperty: (property: PropertyTransaction) => void;
  onOpenApiModal: () => void;
  onLoadMockPreview: () => void;
  isMockActive?: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  totalCount,
  isLoading,
  filters,
  setFilters,
  unitMeasurement,
  onSelectProperty,
  onOpenApiModal,
  onLoadMockPreview,
  isMockActive,
}) => {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSort = (field: PropertyFilterState['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X GET "https://YOUR_BACKEND_URL/api/v1/properties/transactions?region=CCR&district=D09&page=1&pageSize=20" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const formatPriceSgd = (val: number) => {
    return `S$ ${val.toLocaleString('en-SG')}`;
  };

  const formatUnitPrice = (psfVal: number) => {
    const finalVal = unitMeasurement === 'PSM' ? Math.round(psfVal * 10.7639) : psfVal;
    return `S$ ${finalVal.toLocaleString('en-SG')}`;
  };

  const getRegionBadge = (region: SingaporeRegion) => {
    const meta = REGION_METADATA[region];
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${meta.badgeClass}`}
      >
        {region}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));

  // Awaiting Data / Empty State
  const isAwaitingData = !transactions || transactions.length === 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* Table Header Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Singapore Private Residential Transactions
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {isAwaitingData ? 'Placeholder Ready' : `${totalCount} records`}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual sales contracts across Condominiums, Apartments &amp; Landed Homes
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={onOpenApiModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-colors"
            title="Inspect API contract and connect your backend"
          >
            <Terminal className="w-3.5 h-3.5 text-rose-400" />
            <span>Endpoint: GET /transactions</span>
          </button>
        </div>
      </div>

      {/* Main Table View */}
      {isAwaitingData && !isLoading ? (
        /* Empty / Placeholder State */
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
            <Database className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
            Awaiting Singapore Property Backend Feed
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
            The frontend is configured with ready-to-use API integration placeholders for Singapore private property records. Connect your backend service or preview sample schema structures below.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={onOpenApiModal}
              className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm shadow-rose-500/30 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Connect Backend API Endpoint</span>
            </button>

            <button
              onClick={onLoadMockPreview}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Preview Schema Test Mock</span>
            </button>
          </div>

          {/* Target Endpoint & Contract Preview Box */}
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GET
                </span>
                <code className="text-xs font-mono text-slate-300">
                  /api/v1/properties/transactions
                </code>
              </div>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied cURL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              Expected JSON Payload schema for Singapore private property records:
            </p>

            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`{
  "totalCount": 3410,
  "page": 1,
  "pageSize": 20,
  "data": [
    {
      "id": "tx-sg-09-001",
      "contractDate": "2025-02-10",
      "projectName": "THE MARQ ON PATERSON HILL",
      "street": "Paterson Hill",
      "district": "D09",
      "region": "CCR",
      "propertyType": "Condominium",
      "tenure": "Freehold",
      "areaSqft": 3100,
      "areaSqm": 288,
      "priceSgd": 13950000,
      "unitPricePsf": 4500,
      "floorRange": "16 to 20",
      "typeOfSale": "Resale"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      ) : (
        /* Populated Transactions Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th
                  onClick={() => handleSort('contractDate')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('projectName')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Project &amp; Street</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 font-medium">District &amp; Region</th>
                <th className="py-3 px-4 font-medium">Type &amp; Tenure</th>
                <th className="py-3 px-4 font-medium">Floor Level</th>
                <th
                  onClick={() => handleSort('areaSqft')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Area</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unitPricePsf')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{unitMeasurement}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priceSgd')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Price (SGD)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-center">Sale Type</th>
                <th className="py-3 px-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions?.map((item) => (
                <tr
                  key={item.id}
                  id={`transaction-row-${item.id}`}
                  onClick={() => onSelectProperty(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Contract Date */}
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {item.contractDate}
                  </td>

                  {/* Project Name & Street */}
                  <td className="py-3 px-4">
                    <div className="font-sans font-semibold text-slate-100 group-hover:text-rose-300 transition-colors">
                      {item.projectName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      {item.street}
                    </div>
                  </td>

                  {/* District & Region */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{item.district}</span>
                      {getRegionBadge(item.region)}
                    </div>
                  </td>

                  {/* Property Type & Tenure */}
                  <td className="py-3 px-4 whitespace-nowrap font-sans">
                    <div className="text-slate-200 font-medium">{item.propertyType}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.tenure}</div>
                  </td>

                  {/* Floor Level */}
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {item.floorRange || 'N/A'}
                  </td>

                  {/* Floor Area (sqft / sqm) */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="text-slate-200 font-medium">
                      {item.areaSqft.toLocaleString()} sqft
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ({item.areaSqm} sqm)
                    </div>
                  </td>

                  {/* Unit Price (PSF or PSM) */}
                  <td className="py-3 px-4 text-right font-bold text-slate-100 whitespace-nowrap">
                    {formatUnitPrice(item.unitPricePsf)}
                  </td>

                  {/* Transacted Price (SGD) */}
                  <td className="py-3 px-4 text-right font-extrabold text-rose-300 whitespace-nowrap">
                    {formatPriceSgd(item.priceSgd)}
                  </td>

                  {/* Sale Type */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                        item.typeOfSale === 'New Sale'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : item.typeOfSale === 'Resale'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.typeOfSale}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProperty(item);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Inspect Transaction Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar (when data exists) */}
      {!isAwaitingData && (
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div>
            Showing Page <span className="text-white font-bold">{filters.page}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span> ({totalCount} total results)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page <= 1}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
              disabled={filters.page >= totalPages}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
