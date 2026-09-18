import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  BarChart3, 
  Flame, 
  ArrowUpRight,
  ShieldCheck
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
  const formatUnitPrice = (psfVal: number | null) => {
    if (psfVal === null || psfVal === undefined) return '—';
    const finalVal = unitMeasurement === 'PSM' ? Math.round(psfVal * 10.7639) : psfVal;
    return `S$ ${finalVal.toLocaleString('en-SG')}`;
  };

  const formatPriceSgd = (val: number | null) => {
    if (val === null || val === undefined) return '—';
    if (val >= 1000000) {
      return `S$ ${(val / 1000000).toFixed(2)}M`;
    }
    return `S$ ${val.toLocaleString('en-SG')}`;
  };

  const cards = [
    {
      id: 'metric-avg-psf',
      title: `Average ${unitMeasurement}`,
      value: formatUnitPrice(stats?.averagePsf ?? null),
      subtitle: unitMeasurement === 'PSF' ? 'Per square foot transacted' : 'Per square metre transacted',
      badge: stats?.rcrAvgPsf ? `RCR: ${formatUnitPrice(stats.rcrAvgPsf)}` : null,
      icon: TrendingUp,
      accentBorder: 'border-rose-500/30',
      accentBg: 'bg-rose-500/10 text-rose-400',
    },
    {
      id: 'metric-median-price',
      title: 'Median Price',
      value: formatPriceSgd(stats?.medianPriceSgd ?? null),
      subtitle: 'Transacted private home quantum',
      badge: stats?.newSaleCount ? `${stats.newSaleCount} New Sales` : null,
      icon: Coins,
      accentBorder: 'border-emerald-500/30',
      accentBg: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'metric-volume',
      title: 'Total Transactions',
      value: stats?.totalTransactions ? `${stats.totalTransactions.toLocaleString()} units` : '—',
      subtitle: 'Recorded in URA dataset',
      badge: stats?.resaleCount ? `${stats.resaleCount} Resales` : null,
      icon: BarChart3,
      accentBorder: 'border-sky-500/30',
      accentBg: 'bg-sky-500/10 text-sky-400',
    },
    {
      id: 'metric-ccr-benchmark',
      title: `CCR Prime Benchmark`,
      value: formatUnitPrice(stats?.ccrAvgPsf ?? null),
      subtitle: 'Core Central Region (D09, D10, D01)',
      badge: stats?.highestPsf ? `Peak: ${formatUnitPrice(stats.highestPsf)}` : null,
      icon: Flame,
      accentBorder: 'border-purple-500/30',
      accentBg: 'bg-purple-500/10 text-purple-400',
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
            className={`bg-slate-900/80 border border-slate-800 hover:${card.accentBorder} rounded-xl p-4 transition-all duration-200 shadow-xs flex flex-col justify-between`}
          >
            <div>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.accentBg}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {card.value}
              </div>

              {/* Subtitle */}
              <p className="text-xs text-slate-400 mt-1">
                {card.subtitle}
              </p>
            </div>

            {/* Bottom Tag */}
            {card.badge && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 font-medium">{card.badge}</span>
                <span className="text-[10px] text-slate-400">URA PMI</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
