import React from 'react';
import { Terminal, ArrowUpRight, Zap, Database, Code, CheckCircle } from 'lucide-react';
import { ApiConfig } from '../types/property';

interface ApiStatusBannerProps {
  apiConfig: ApiConfig;
  onOpenApiModal: () => void;
  onLoadMockPreview?: () => void;
  isMockActive?: boolean;
}

export const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({
  apiConfig,
  onOpenApiModal,
  onLoadMockPreview,
  isMockActive,
}) => {
  if (apiConfig.connected) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Connected to backend: <code className="font-mono text-emerald-200">{apiConfig.baseUrl}</code>
            </span>
            {apiConfig.lastPingLatencyMs && (
              <span className="text-emerald-400/80 font-mono">({apiConfig.lastPingLatencyMs}ms)</span>
            )}
          </div>
          <button
            onClick={onOpenApiModal}
            className="underline hover:text-emerald-100 flex items-center gap-1 font-medium"
          >
            Manage Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border-b border-amber-500/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-amber-300">API Integration Placeholders Ready</span>
            <span className="text-slate-400 mx-1.5">&bull;</span>
            <span className="text-slate-300">
              No backend connected yet. Ready to receive private property transactions, PSF aggregates, and district trends.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {onLoadMockPreview && (
            <button
              onClick={onLoadMockPreview}
              className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                isMockActive
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Toggle preview data to verify UI components without live backend"
            >
              <Code className="w-3 h-3 text-rose-400" />
              <span>{isMockActive ? 'Reset to Awaiting Feed' : 'Preview Schema Mock'}</span>
            </button>
          )}

          <button
            onClick={onOpenApiModal}
            className="px-3 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-colors font-medium flex items-center gap-1"
          >
            <span>Connect Backend API</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
