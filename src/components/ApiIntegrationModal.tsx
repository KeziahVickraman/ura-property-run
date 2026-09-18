import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Server, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  ShieldCheck
} from 'lucide-react';

interface ApiIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBatch: number;
}

export const ApiIntegrationModal: React.FC<ApiIntegrationModalProps> = ({
  isOpen,
  onClose,
  currentBatch,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunLiveTest = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch(`/api/transactions?batch=${currentBatch}&service=PMI_Resi_Transaction`);
      const json = await res.json();
      setTestResponse({
        ok: res.ok,
        status: res.status,
        payload: json,
      });
    } catch (e: any) {
      setTestResponse({
        ok: false,
        status: 500,
        error: e?.message || 'Network error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const curlLocal = `curl -X GET "http://localhost:3000/api/transactions?batch=${currentBatch}&service=PMI_Resi_Transaction" \\
  -H "Accept: application/json"`;

  const curlUraToken = `# Step 1: Obtain daily token from URA
curl -X GET "https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1" \\
  -H "AccessKey: $URA_ACCESS_KEY"`;

  const curlUraData = `# Step 2: Invoke dataset with BOTH AccessKey and daily Token
curl -X GET "https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=${currentBatch}" \\
  -H "AccessKey: $URA_ACCESS_KEY" \\
  -H "Token: $URA_DAILY_TOKEN"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                URA Data Service Endpoint Specifications
              </h2>
              <p className="text-xs text-slate-400">
                Service: <code className="text-rose-400 font-mono">PMI_Resi_Transaction</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          {/* Architecture Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                Official 2-Step URA Data Handshake
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                Handled automatically by /api/transactions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 font-bold block">1. Daily Token Trading</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Trades <code className="text-slate-300">AccessKey</code> once per day at URA token endpoint to obtain the active session token.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-sky-400 font-bold block">2. Dataset Invocation</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calls <code className="text-slate-300">invokeUraDS</code> sending <strong className="text-slate-200">BOTH</strong> AccessKey and Token in request headers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Local Endpoint Call */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 font-mono">
                GET /api/transactions?batch={currentBatch}
              </span>
              <button
                onClick={handleRunLiveTest}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isTesting ? 'Fetching...' : 'Test Endpoint Now'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto">
                {curlLocal}
              </pre>
              <button
                onClick={() => handleCopy('local', curlLocal)}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              >
                {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Test Result Box */}
            {testResponse && (
              <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={testResponse.ok ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    Status: {testResponse.status} {testResponse.ok ? 'OK' : 'Error'}
                  </span>
                  <span className="text-slate-400">
                    {testResponse.payload?.Result?.length || 0} project clusters returned
                  </span>
                </div>
                <pre className="max-h-48 overflow-y-auto p-2 bg-slate-900/90 rounded text-[10px] font-mono text-slate-300">
                  {JSON.stringify(testResponse.payload, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Upstream Direct URA cURL specs */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="font-semibold text-slate-200">
              Direct Upstream URA cURL Commands
            </span>

            <div className="space-y-2">
              <div className="relative">
                <pre className="p-2.5 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {curlUraToken}
                </pre>
                <button
                  onClick={() => handleCopy('token', curlUraToken)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                >
                  {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="relative">
                <pre className="p-2.5 bg-slate-950 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {curlUraData}
                </pre>
                <button
                  onClick={() => handleCopy('data', curlUraData)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                >
                  {copiedKey === 'data' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
