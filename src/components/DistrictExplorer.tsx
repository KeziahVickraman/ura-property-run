import React, { useState } from 'react';
import { 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Building,
  Coins
} from 'lucide-react';
import { DistrictSummary, SingaporeRegion } from '../types/property';
import { SINGAPORE_DISTRICTS, REGION_METADATA } from '../data/singaporeDistricts';

interface DistrictExplorerProps {
  districtSummaries: DistrictSummary[];
  selectedRegion: 'ALL' | SingaporeRegion;
  onSelectDistrict: (districtCode: string) => void;
  unitMeasurement: 'PSF' | 'PSM';
}

export const DistrictExplorer: React.FC<DistrictExplorerProps> = ({
  districtSummaries,
  selectedRegion,
  onSelectDistrict,
  unitMeasurement,
}) => {
  const [regionFilter, setRegionFilter] = useState<'ALL' | SingaporeRegion>(selectedRegion);

  const filteredDistricts = SINGAPORE_DISTRICTS.filter((d) => {
    if (regionFilter === 'ALL') return true;
    return d.region === regionFilter;
  });

  // Map summaries by district code
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

  const formatPriceSgd = (val: number | null | undefined) => {
    if (val === null || val === undefined) return null;
    if (val >= 1000000) {
      return `S$ ${(val / 1000000).toFixed(2)}M`;
    }
    return `S$ ${val.toLocaleString('en-SG')}`;
  };

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
            Aggregated statistics derived directly from the loaded URA PMI_Resi_Transaction records across Core Central (CCR), Rest of Central (RCR), and Outside Central (OCR).
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
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((d) => {
          const summary = summaryMap.get(d.district);
          const regionMeta = REGION_METADATA[d.region] || {
            badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          };
          const hasTransactions = summary && (summary.transactionCount ?? 0) > 0;

          return (
            <div
              key={d.district}
              id={`district-card-${d.district}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-white group-hover:text-rose-400 transition-colors">
                        {d.district}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${regionMeta.badgeClass}`}>
                        {d.region}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                      {d.name}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                    {hasTransactions ? `${summary.transactionCount} lodged` : '0 lodged'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {d.description}
                </p>

                {/* Metrics Breakdown from Endpoint */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg {unitMeasurement}</span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {hasTransactions && summary.averagePsf ? (
                        formatUnitPrice(summary.averagePsf)
                      ) : (
                        <span className="text-slate-400">In other batches</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Median Price</span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {hasTransactions && summary.medianPriceSgd ? (
                        formatPriceSgd(summary.medianPriceSgd)
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Top Projects */}
                {hasTransactions && summary.topProjects && summary.topProjects.length > 0 && (
                  <div className="mb-3 text-[11px]">
                    <span className="text-slate-400 text-[10px] block mb-1 font-mono">
                      Recorded Projects:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {summary.topProjects.map((p, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] truncate max-w-[200px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectDistrict(d.district)}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-800/70 hover:bg-rose-600/90 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <span>Filter {d.district} Transactions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
