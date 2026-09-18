import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Building, 
  BarChart3, 
  Flame, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight,
  Database
} from 'lucide-react';
import { MarketAggregateStats } from '../types/property';

interface MetricCardsProps {
  stats: MarketAggregateStats | null;
  unitMeasurement: 'PSF' | 'PSM';
  onOpenApiModal: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  stats,
  unitMeasurement,
  onOpenApiModal,
}) => {
  const isAwaitingData = !stats || stats.averagePsf === null;

  // Convert PSF to PSM if selected (1 sqm = 10.7639 sqft)
  const formatUnitPrice = (psfVal: number | null) => {
    if (psfVal === null || psfVal === undefined) return null;
    const finalVal = unitMeasurement === 'PSM' ? Math.round(psfVal * 10.7639) : psfVal;
    return `S$ ${finalVal.toLocaleString()}`;
  };

  const formatPriceSgd = (val: number | null) => {
    if (val === null || val === undefined) return null;
    if (val >= 1000000) {
      return `S$ ${(val / 1000000).toFixed(2)}M`;
    }
    return `S$ ${val.toLocaleString()}`;
  };

  const cards = [
    {
      id: 'metric-avg-psf',
      title: `Islandwide Average ${unitMeasurement}`,
      value: formatUnitPrice(stats?.averagePsf ?? null),
      subtitle: unitMeasurement === 'PSF' ? 'Per square foot transacted' : 'Per square metre transacted',
      change: stats?.quarterlyChangePct,
      changeLabel: 'vs Prev Quarter',
      icon: TrendingUp,
      accentColor: 'rose',
      endpoint: '/api/v1/properties/stats → averagePsf',
      schemaType: 'number (SGD)',
    },
    {
      id: 'metric-median-price',
      title: 'Median Transacted Price',
      value: formatPriceSgd(stats?.medianPriceSgd ?? null),
      subtitle: 'Typical private home quantum',
      change: stats?.annualChangePct,
      changeLabel: 'YoY Growth',
      icon: Coins,
      accentColor: 'emerald',
      endpoint: '/api/v1/properties/stats → medianPriceSgd',
      schemaType: 'number (SGD)',
    },
    {
      id: 'metric-volume',
      title: 'Sales Volume',
      value: stats?.totalTransactions ? `${stats.totalTransactions.toLocaleString()} units` : null,
      subtitle: 'Recorded private transactions',
      change: null,
      changeLabel: 'Period Total',
      icon: BarChart3,
      accentColor: 'sky',
      endpoint: '/api/v1/properties/stats → totalTransactions',
      schemaType: 'integer (count)',
    },
    {
      id: 'metric-ccr-benchmark',
      title: `CCR Prime Benchmark (${unitMeasurement})`,
      value: formatUnitPrice(stats?.ccrAvgPsf ?? null),
      subtitle: 'Core Central (D09, D10, D11, Sentosa)',
      change: null,
      changeLabel: 'Luxury Segment',
      icon: Flame,
      accentColor: 'purple',
      endpoint: '/api/v1/properties/stats → ccrAvgPsf',
      schemaType: 'number (SGD)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 sm:p-5 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-slate-300 group-hover:text-rose-400 transition-colors">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Metric Value or Awaiting Placeholder */}
              <div className="mt-1 min-h-[38px] flex items-baseline">
                {card.value ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                      {card.value}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {unitMeasurement}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono text-slate-600 font-bold tracking-wider">
                      --
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Database className="w-2.5 h-2.5" />
                      Awaiting Feed
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Meta & Endpoint Trace */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              {card.change !== null && card.change !== undefined ? (
                <div className="flex items-center gap-1 font-mono font-medium">
                  {card.change >= 0 ? (
                    <span className="text-emerald-400 flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      +{card.change}%
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      {card.change}%
                    </span>
                  )}
                  <span className="text-slate-500">{card.changeLabel}</span>
                </div>
              ) : (
                <span className="text-slate-500 truncate max-w-[150px]">
                  {card.subtitle}
                </span>
              )}

              {/* Endpoint Schema Hint Tag */}
              <button
                type="button"
                onClick={onOpenApiModal}
                className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                title={`Expected API contract: ${card.endpoint}`}
              >
                <span>{card.schemaType}</span>
                <Info className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
