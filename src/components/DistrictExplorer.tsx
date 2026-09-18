import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Terminal, 
  ExternalLink, 
  TrendingUp, 
  Coins, 
  Database,
  ArrowRight,
  Filter
} from 'lucide-react';
import { DistrictSummary, SingaporeRegion } from '../types/property';
import { SINGAPORE_DISTRICTS, REGION_METADATA } from '../data/singaporeDistricts';

interface DistrictExplorerProps {
  districtSummaries: DistrictSummary[] | null;
  selectedRegion: 'ALL' | SingaporeRegion;
  onSelectDistrict: (districtCode: string) => void;
  onOpenApiModal: () => void;
  unitMeasurement: 'PSF' | 'PSM';
}

export const DistrictExplorer: React.FC<DistrictExplorerProps> = ({
  districtSummaries,
  selectedRegion,
  onSelectDistrict,
  onOpenApiModal,
  unitMeasurement,
}) => {
  const [regionFilter, setRegionFilter] = useState<'ALL' | SingaporeRegion>(selectedRegion);

  const filteredDistricts = SINGAPORE_DISTRICTS.filter((d) => {
    if (regionFilter === 'ALL') return true;
    return d.region === regionFilter;
  });

  // Map backend summaries if available
  const summaryMap = React.useMemo(() => {
    const map = new Map<string, DistrictSummary>();
    if (districtSummaries) {
      for (const s of districtSummaries) {
        map.set(s.district, s);
      }
    }
    return map;
  }, [districtSummaries]);

  const formatUnitPrice = (psfVal: number | null | undefined) => {
    if (psfVal === null || psfVal === undefined) return null;
    const finalVal = unitMeasurement === 'PSM' ? Math.round(psfVal * 10.7639) : psfVal;
    return `S$ ${finalVal.toLocaleString('en-SG')}`;
  };

  const isAwaitingFeed = !districtSummaries || districtSummaries.length === 0;

  return (
    <div className="space-y-6">
      {/* Top District Header & Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              Singapore Postal Districts (D01 &ndash; D28)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              28 Districts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Singapore private residential properties are categorized into 28 postal districts across 3 official market segments: Core Central Region (CCR), Rest of Central Region (RCR), and Outside Central Region (OCR).
          </p>
        </div>

        {/* Region Filter Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0">
          {(['ALL', 'CCR', 'RCR', 'OCR'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                regionFilter === r
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* API Placeholder Note */}
      {isAwaitingFeed && (
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
            <span>
              District benchmark metrics awaiting backend API: <code className="font-mono text-amber-300">GET /api/v1/properties/districts</code>
            </span>
          </div>
          <button
            onClick={onOpenApiModal}
            className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View District Schema</span>
            <Terminal className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Grid of 28 Districts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDistricts.map((d) => {
          const summary = summaryMap.get(d.district);
          const meta = REGION_METADATA[d.region];

          return (
            <div
              key={d.district}
              id={`district-card-${d.district}`}
              className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
            >
              <div>
                {/* District Code & Region Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-white font-mono group-hover:text-rose-400 transition-colors">
                      {d.district}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${meta.badgeClass}`}
                    >
                      {d.region}
                    </span>
                  </div>

                  {/* Postal Sectors */}
                  <span className="text-[10px] font-mono text-slate-400" title="Postal sector prefixes">
                    Sector: {d.postalSectors.slice(0, 3).join(', ')}{d.postalSectors.length > 3 ? '...' : ''}
                  </span>
                </div>

                {/* District Name & Description */}
                <h3 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1" title={d.name}>
                  {d.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {d.description}
                </p>
              </div>

              {/* District Price Metrics Placeholder */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg {unitMeasurement}</span>
                    {summary?.averagePsf ? (
                      <span className="font-mono font-bold text-rose-300">
                        {formatUnitPrice(summary.averagePsf)}
                      </span>
                    ) : (
                      <span className="font-mono text-slate-400 text-xs flex items-center gap-1">
                        -- <span className="text-[9px] text-amber-500/70 font-mono">awaiting</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Tx Volume</span>
                    {summary?.transactionCount ? (
                      <span className="font-mono font-bold text-slate-200">
                        {summary.transactionCount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-mono text-slate-400 text-xs flex items-center gap-1">
                        -- <span className="text-[9px] text-amber-500/70 font-mono">awaiting</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Filter Main Feed with this District */}
                <button
                  type="button"
                  onClick={() => onSelectDistrict(d.district)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>View {d.district} Transactions</span>
                  <ArrowRight className="w-3 h-3 text-rose-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
