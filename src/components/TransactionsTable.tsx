import React from 'react';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  FilterX, 
  RotateCcw
} from 'lucide-react';
import { 
  PropertyTransaction, 
  PropertyFilterState, 
  SingaporeRegion 
} from '../types/property';
import { REGION_METADATA } from '../data/singaporeDistricts';

interface TransactionsTableProps {
  transactions: PropertyTransaction[];
  totalCount: number;
  isLoading: boolean;
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  unitMeasurement: 'PSF' | 'PSM';
  onSelectProperty: (property: PropertyTransaction) => void;
  onResetFilters: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  totalCount,
  isLoading,
  filters,
  setFilters,
  unitMeasurement,
  onSelectProperty,
  onResetFilters,
}) => {
  const handleSort = (field: PropertyFilterState['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const formatPriceSgd = (val: number) => {
    return `S$ ${val.toLocaleString('en-SG')}`;
  };

  const formatUnitPrice = (tx: PropertyTransaction) => {
    const val = unitMeasurement === 'PSM' ? tx.unitPricePsm : tx.unitPricePsf;
    return `S$ ${val.toLocaleString('en-SG')}`;
  };

  const getRegionBadge = (region: SingaporeRegion) => {
    const meta = REGION_METADATA[region] || {
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    };
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${meta.badgeClass}`}
      >
        {region}
      </span>
    );
  };

  const getSaleTypeBadge = (saleType: string) => {
    if (saleType === 'New Sale') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          New Sale
        </span>
      );
    }
    if (saleType === 'Sub Sale') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
          Sub Sale
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
        Resale
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const currentPage = Math.min(filters.page, totalPages);
  const startIndex = (currentPage - 1) * filters.pageSize;
  const pageTransactions = transactions.slice(startIndex, startIndex + filters.pageSize);

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
              {totalCount} transacted records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dataset from URA Data Service (PMI_Resi_Transaction)
          </p>
        </div>

        {/* Units / Page size controls */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Showing {pageTransactions.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + filters.pageSize, totalCount)} of {totalCount}</span>
        </div>
      </div>

      {/* Main Table View */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="p-8 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/40 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : pageTransactions.length === 0 ? (
        /* Filter Empty State */
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
            No Transactions Match Your Filter Criteria
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Try resetting your search query, price ranges, or district selection.
          </p>
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Live Transactions Table strictly based on endpoint availability */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th
                  onClick={() => handleSort('contractDate')}
                  className="py-3 px-3 font-medium cursor-pointer hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Contract Date</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('projectName')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Project Name</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium">Street</th>
                <th className="py-3 px-2 font-medium">District</th>
                <th className="py-3 px-2 font-medium">Segment</th>
                <th className="py-3 px-3 font-medium">Property Type</th>
                <th className="py-3 px-3 font-medium">Tenure</th>
                <th className="py-3 px-2 font-medium whitespace-nowrap">Floor</th>
                <th
                  onClick={() => handleSort('areaSqft')}
                  className="py-3 px-3 font-medium cursor-pointer hover:text-white text-right whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Area</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unitPricePsf')}
                  className="py-3 px-3 font-medium cursor-pointer hover:text-white text-right whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{unitMeasurement === 'PSM' ? 'Price ($PSM)' : 'Price ($PSF)'}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priceSgd')}
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white text-right whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Transacted Price</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium text-center">Type of Sale</th>
                <th className="py-3 px-2 font-medium text-center">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {pageTransactions.map((item) => (
                <tr
                  key={item.id}
                  id={`transaction-row-${item.id}`}
                  onClick={() => onSelectProperty(item)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Contract Date */}
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {item.contractDateDisplay}
                  </td>

                  {/* Project Name */}
                  <td className="py-3 px-4">
                    <span className="font-sans font-semibold text-slate-100 group-hover:text-rose-400 transition-colors">
                      {item.projectName}
                    </span>
                  </td>

                  {/* Street */}
                  <td className="py-3 px-3 text-slate-400 font-sans whitespace-nowrap">
                    {item.street}
                  </td>

                  {/* Postal District */}
                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="font-bold text-slate-200">{item.district}</span>
                  </td>

                  {/* Market Segment */}
                  <td className="py-3 px-2 whitespace-nowrap">
                    {getRegionBadge(item.region)}
                  </td>

                  {/* Property Type */}
                  <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-200">
                    {item.propertyType}
                  </td>

                  {/* Tenure */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {item.tenure}
                  </td>

                  {/* Floor Level */}
                  <td className="py-3 px-2 text-slate-300 whitespace-nowrap">
                    {item.floorRange}
                  </td>

                  {/* Floor Area */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="text-slate-200 font-medium">
                      {item.areaSqft.toLocaleString()} sqft
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.areaSqm} sqm
                    </div>
                  </td>

                  {/* Unit Price (PSF or PSM) */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="text-rose-400 font-semibold">
                      {formatUnitPrice(item)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {unitMeasurement === 'PSM' ? '/sqm' : '/sqft'}
                    </span>
                  </td>

                  {/* Transacted Price */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="text-slate-100 font-bold text-sm">
                      {formatPriceSgd(item.priceSgd)}
                    </span>
                    {item.nettPrice && (
                      <span className="text-[10px] text-emerald-400 block">
                        Nett: {formatPriceSgd(item.nettPrice)}
                      </span>
                    )}
                  </td>

                  {/* Sale Type */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getSaleTypeBadge(item.typeOfSale)}
                  </td>

                  {/* No. of Units */}
                  <td className="py-3 px-2 text-center text-slate-400 whitespace-nowrap">
                    {item.noOfUnits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Rows per page:</span>
            <select
              value={filters.pageSize}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))
              }
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
