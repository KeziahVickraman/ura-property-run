import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  MapPin, 
  Building, 
  Key, 
  Tag, 
  Filter
} from 'lucide-react';
import { 
  PropertyFilterState, 
  SingaporeRegion, 
  PropertyType, 
  TenureType, 
  SaleType 
} from '../types/property';
import { 
  SINGAPORE_DISTRICTS, 
  PROPERTY_TYPES, 
  TENURE_TYPES, 
  SALE_TYPES 
} from '../data/singaporeDistricts';

interface FilterBarProps {
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  onResetFilters: () => void;
  totalResultsCount?: number | null;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onResetFilters,
  totalResultsCount,
}) => {
  // Filter districts dropdown based on selected region
  const availableDistricts = React.useMemo(() => {
    if (filters.selectedRegion === 'ALL') {
      return SINGAPORE_DISTRICTS;
    }
    return SINGAPORE_DISTRICTS.filter((d) => d.region === filters.selectedRegion);
  }, [filters.selectedRegion]);

  const handleRegionChange = (region: 'ALL' | SingaporeRegion) => {
    setFilters((prev) => ({
      ...prev,
      selectedRegion: region,
      // If currently selected district does not belong to the new region, reset to ALL
      selectedDistrict:
        region === 'ALL'
          ? prev.selectedDistrict
          : SINGAPORE_DISTRICTS.find((d) => d.district === prev.selectedDistrict && d.region === region)
          ? prev.selectedDistrict
          : 'ALL',
      page: 1,
    }));
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedRegion !== 'ALL' ||
    filters.selectedDistrict !== 'ALL' ||
    filters.selectedPropertyType !== 'ALL' ||
    filters.selectedTenure !== 'ALL' ||
    filters.selectedSaleType !== 'ALL';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Top Row: Search Input + Region Segment Selector */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="property-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value, page: 1 }))}
            placeholder="Search condo name, street (e.g. Marina One, Paterson Hill, D09, Orchard)..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '', page: 1 }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Singapore Region Segments: ALL, CCR, RCR, OCR */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
          {(['ALL', 'CCR', 'RCR', 'OCR'] as const).map((region) => {
            const isSelected = filters.selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => handleRegionChange(region)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? region === 'CCR'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : region === 'RCR'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                      : region === 'OCR'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {region === 'ALL'
                  ? 'All Regions'
                  : region === 'CCR'
                  ? 'CCR (Core Central)'
                  : region === 'RCR'
                  ? 'RCR (Rest of Central)'
                  : 'OCR (Outside Central)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Specific Singapore Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1 text-xs">
        {/* District Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>Postal District</span>
          </label>
          <select
            id="filter-district-select"
            value={filters.selectedDistrict}
            onChange={(e) => setFilters((prev) => ({ ...prev, selectedDistrict: e.target.value, page: 1 }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="ALL">All Districts (D01 – D28)</option>
            {availableDistricts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district} &ndash; {d.name.split(',')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Building className="w-3 h-3 text-sky-400" />
            <span>Property Type</span>
          </label>
          <select
            id="filter-property-type-select"
            value={filters.selectedPropertyType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                selectedPropertyType: e.target.value as 'ALL' | PropertyType,
                page: 1,
              }))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="ALL">All Property Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Land Tenure */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Key className="w-3 h-3 text-amber-400" />
            <span>Tenure</span>
          </label>
          <select
            id="filter-tenure-select"
            value={filters.selectedTenure}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                selectedTenure: e.target.value as 'ALL' | TenureType,
                page: 1,
              }))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="ALL">All Tenures</option>
            {TENURE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sale Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-purple-400" />
            <span>Sale Type</span>
          </label>
          <select
            id="filter-sale-type-select"
            value={filters.selectedSaleType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                selectedSaleType: e.target.value as 'ALL' | SaleType,
                page: 1,
              }))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="ALL">All Sales (New/Resale/Sub)</option>
            {SALE_TYPES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        <div className="flex items-end col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
          <button
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className="w-full h-8 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
