import React from 'react';
import { 
  LineChart, 
  TrendingUp, 
  BarChart3, 
  Terminal, 
  Database, 
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MarketTrendPoint } from '../types/property';

interface MarketAnalyticsProps {
  trends: MarketTrendPoint[] | null;
  onOpenApiModal: () => void;
  unitMeasurement: 'PSF' | 'PSM';
}

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  trends,
  onOpenApiModal,
  unitMeasurement,
}) => {
  const isAwaitingTrends = !trends || trends.length === 0;

  // Multiplier for PSM conversion
  const unitFactor = unitMeasurement === 'PSM' ? 10.7639 : 1;

  // If trends data is populated, calculate chart bounds
  const chartData = React.useMemo(() => {
    if (!trends || trends.length === 0) return [];
    return trends.map((t) => ({
      period: t.period,
      overall: t.overallPsf ? Math.round(t.overallPsf * unitFactor) : null,
      ccr: t.ccrPsf ? Math.round(t.ccrPsf * unitFactor) : null,
      rcr: t.rcrPsf ? Math.round(t.rcrPsf * unitFactor) : null,
      ocr: t.ocrPsf ? Math.round(t.ocrPsf * unitFactor) : null,
      volume: t.volume,
    }));
  }, [trends, unitFactor]);

  // Find max & min values for SVG chart scaling
  const { maxVal, minVal } = React.useMemo(() => {
    if (chartData.length === 0) return { maxVal: 4000, minVal: 1000 };
    let max = 0;
    let min = Infinity;
    chartData.forEach((d) => {
      [d.overall, d.ccr, d.rcr, d.ocr].forEach((val) => {
        if (val !== null) {
          if (val > max) max = val;
          if (val < min) min = val;
        }
      });
    });
    return {
      maxVal: Math.ceil(max * 1.1),
      minVal: Math.floor(min * 0.9),
    };
  }, [chartData]);

  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const getY = (val: number | null) => {
    if (val === null) return innerHeight;
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return innerHeight - ratio * innerHeight + padding.top;
  };

  const getX = (idx: number) => {
    if (chartData.length <= 1) return padding.left;
    return padding.left + (idx / (chartData.length - 1)) * innerWidth;
  };

  const generatePath = (key: 'overall' | 'ccr' | 'rcr' | 'ocr') => {
    if (chartData.length === 0) return '';
    const points = chartData.map((d, i) => `${getX(i)},${getY(d[key])}`);
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              Singapore Private Residential Price Trends
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Quarterly Series
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Historical price index movement across Core Central Region (CCR), Rest of Central Region (RCR), and Outside Central Region (OCR).
          </p>
        </div>

        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-rose-400" />
          <span>Endpoint: GET /trends</span>
        </button>
      </div>

      {/* Main Trends Chart Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Median Price Index by Region ({unitMeasurement})
            </h3>
            <p className="text-xs text-slate-400">
              Quarterly price trajectories in Singapore Dollars (S$)
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-emerald-400"></span>
              <span className="text-slate-300">CCR (Luxury)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-sky-400"></span>
              <span className="text-slate-300">RCR (City Fringe)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-amber-400"></span>
              <span className="text-slate-300">OCR (Suburbs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-rose-400"></span>
              <span className="text-slate-300">Islandwide Overall</span>
            </div>
          </div>
        </div>

        {/* Chart View or Awaiting State */}
        {isAwaitingTrends ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-xs">
              <LineChart className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-bold text-white mb-1">
              Awaiting Market Trend Data Feed
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
              Historical quarterly time-series data is ready to connect via <code className="font-mono text-amber-300">GET /api/v1/properties/trends</code>. Connect your backend endpoint or verify using the sample schema.
            </p>

            <button
              onClick={onOpenApiModal}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Configure Trend API Connection</span>
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px]">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto text-xs font-mono">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = innerHeight - ratio * innerHeight + padding.top;
                  const val = Math.round(minVal + ratio * (maxVal - minVal));
                  return (
                    <g key={ratio}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        fill="#94a3b8"
                        textAnchor="end"
                        fontSize="10"
                      >
                        S${val.toLocaleString()}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Periods */}
                {chartData.map((d, i) => (
                  <text
                    key={d.period}
                    x={getX(i)}
                    y={svgHeight - 10}
                    fill="#94a3b8"
                    textAnchor="middle"
                    fontSize="11"
                  >
                    {d.period}
                  </text>
                ))}

                {/* Trend Lines */}
                <path d={generatePath('ccr')} fill="none" stroke="#34d399" strokeWidth="2.5" />
                <path d={generatePath('rcr')} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <path d={generatePath('ocr')} fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                <path d={generatePath('overall')} fill="none" stroke="#fb7185" strokeWidth="3" />

                {/* Data Points */}
                {chartData.map((d, i) => (
                  <g key={i}>
                    {d.ccr && <circle cx={getX(i)} cy={getY(d.ccr)} r="3.5" fill="#34d399" />}
                    {d.rcr && <circle cx={getX(i)} cy={getY(d.rcr)} r="3.5" fill="#38bdf8" />}
                    {d.ocr && <circle cx={getX(i)} cy={getY(d.ocr)} r="3.5" fill="#fbbf24" />}
                    {d.overall && <circle cx={getX(i)} cy={getY(d.overall)} r="4" fill="#fb7185" />}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Singapore Real Estate Market Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
            <Layers className="w-4 h-4" />
            <span>Core Central Region (CCR)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Districts 09, 10, 11, Marina Bay and Sentosa. Highest PSF pricing in Singapore, driven by ultra-high-net-worth investors, family offices, and luxury freehold developments.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
            <Layers className="w-4 h-4" />
            <span>Rest of Central Region (RCR)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            City fringe locations including Queenstown, East Coast, Novena, and Kallang. Balances proximity to the CBD with strong rental yields and appealing price quantum.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
            <Layers className="w-4 h-4" />
            <span>Outside Central Region (OCR)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Mass market suburban residential heartlands (Jurong, Tampines, Punggol, Woodlands). Significant transaction volume, strong home-buyer demand, and attractive entry pricing.
          </p>
        </div>
      </div>
    </div>
  );
};
