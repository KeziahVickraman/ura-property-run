import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Layers
} from 'lucide-react';
import { MarketTrendPoint } from '../types/property';

interface MarketAnalyticsProps {
  trends: MarketTrendPoint[];
  unitMeasurement: 'PSF' | 'PSM';
}

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  trends,
  unitMeasurement,
}) => {
  const unitFactor = unitMeasurement === 'PSM' ? 10.7639 : 1;

  const chartData = React.useMemo(() => {
    if (!trends || trends.length === 0) return [];
    return trends.map((t) => ({
      period: t.period,
      label: t.periodLabel || t.period,
      overall: t.overallPsf ? Math.round(t.overallPsf * unitFactor) : null,
      ccr: t.ccrPsf ? Math.round(t.ccrPsf * unitFactor) : null,
      rcr: t.rcrPsf ? Math.round(t.rcrPsf * unitFactor) : null,
      ocr: t.ocrPsf ? Math.round(t.ocrPsf * unitFactor) : null,
      volume: t.volume || 0,
    }));
  }, [trends, unitFactor]);

  // Max and min for SVG scaling
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
    if (min === Infinity) min = 1000;
    if (max === 0) max = 3000;
    return {
      maxVal: Math.ceil(max * 1.08),
      minVal: Math.floor(min * 0.92),
    };
  }, [chartData]);

  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const getY = (val: number | null) => {
    if (val === null) return innerHeight + padding.top;
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return innerHeight - ratio * innerHeight + padding.top;
  };

  const getX = (idx: number) => {
    if (chartData.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (idx / (chartData.length - 1)) * innerWidth;
  };

  const generatePath = (key: 'overall' | 'ccr' | 'rcr' | 'ocr') => {
    if (chartData.length === 0) return '';
    const validPoints = chartData
      .map((d, i) => (d[key] !== null ? `${getX(i)},${getY(d[key])}` : null))
      .filter(Boolean);
    if (validPoints.length === 0) return '';
    return `M ${validPoints.join(' L ')}`;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              Singapore Residential Price &amp; Volume Trends
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Computed from Endpoint
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Historical price distribution and transacted volumes derived strictly from contract dates in the URA PMI_Resi_Transaction feed.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-500 rounded-full"></span>
            <span className="text-slate-300">Overall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-purple-400 rounded-full"></span>
            <span className="text-slate-400">CCR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-400 rounded-full"></span>
            <span className="text-slate-400">RCR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400 rounded-full"></span>
            <span className="text-slate-400">OCR</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
            Unit Price Trajectory ({unitMeasurement}) by Market Segment
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Range: S${minVal.toLocaleString('en-SG')} - S${maxVal.toLocaleString('en-SG')}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[600px]"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + innerHeight * (1 - pct);
              const val = Math.round(minVal + (maxVal - minVal) * pct);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    ${val.toLocaleString('en-SG')}
                  </text>
                </g>
              );
            })}

            {/* Lines */}
            <path
              d={generatePath('ocr')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <path
              d={generatePath('rcr')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <path
              d={generatePath('ccr')}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <path
              d={generatePath('overall')}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
            />

            {/* Data Points */}
            {chartData.map((d, i) => {
              const x = getX(i);
              return (
                <g key={i}>
                  {/* Overall Dot */}
                  {d.overall !== null && (
                    <circle
                      cx={x}
                      cy={getY(d.overall)}
                      r="4"
                      fill="#f43f5e"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  )}

                  {/* Period X Axis Label */}
                  <text
                    x={x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Period Aggregations Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
            Period Summary Table
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="py-2.5 px-4 font-medium">Contract Period</th>
                <th className="py-2.5 px-4 font-medium text-right">Transactions</th>
                <th className="py-2.5 px-4 font-medium text-right">Overall Avg ({unitMeasurement})</th>
                <th className="py-2.5 px-4 font-medium text-right text-purple-300">CCR Avg</th>
                <th className="py-2.5 px-4 font-medium text-right text-sky-300">RCR Avg</th>
                <th className="py-2.5 px-4 font-medium text-right text-amber-300">OCR Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {chartData.map((row) => (
                <tr key={row.period} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{row.label}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{row.volume} units</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-bold">
                    {row.overall ? `S$ ${row.overall.toLocaleString('en-SG')}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.ccr ? `S$ ${row.ccr.toLocaleString('en-SG')}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.rcr ? `S$ ${row.rcr.toLocaleString('en-SG')}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.ocr ? `S$ ${row.ocr.toLocaleString('en-SG')}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
