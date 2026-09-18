import React from 'react';
import { 
  Database, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Radio
} from 'lucide-react';

interface ApiStatusBannerProps {
  isLive: boolean;
  batch: number;
  totalRecords: number;
  isLoading: boolean;
  onSelectBatch: (batch: number) => void;
  onRefresh: () => void;
  onOpenApiModal: () => void;
}

export const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({
  isLive,
  batch,
  totalRecords,
  isLoading,
  onSelectBatch,
  onRefresh,
  onOpenApiModal,
}) => {
  return (
    <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Active Endpoint & Status Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span className="font-semibold">
              {isLive ? 'URA Live Stream Active' : 'URA PMI_Resi_Transaction Active'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              GET /api/transactions?batch={batch}
            </code>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-300 font-medium">{totalRecords} transacted records</span>
          </div>
        </div>

        {/* Right: Batch Switcher & Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* URA Batch Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            <span className="px-1.5 text-slate-400">Batch:</span>
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                onClick={() => onSelectBatch(b)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  batch === b
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-mono disabled:opacity-50"
            title="Refresh transactions from URA Data Service"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
            <span className="hidden xs:inline">Reload</span>
          </button>

          {/* Endpoint Contract Modal */}
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors text-xs font-mono"
            title="Inspect URA Endpoint Specifications and cURL commands"
          >
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">API Contract</span>
          </button>
        </div>
      </div>
    </div>
  );
};
