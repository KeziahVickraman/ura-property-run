import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Server, 
  Key, 
  Globe, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Code, 
  Save, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ApiConfig } from '../types/property';
import { propertyApi } from '../services/propertyApi';

interface ApiIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: ApiConfig;
  onSaveConfig: (newConfig: Partial<ApiConfig>) => void;
  onLoadMockPreview: () => void;
  onClearMockPreview: () => void;
  isMockActive?: boolean;
}

export const ApiIntegrationModal: React.FC<ApiIntegrationModalProps> = ({
  isOpen,
  onClose,
  apiConfig,
  onSaveConfig,
  onLoadMockPreview,
  onClearMockPreview,
  isMockActive,
}) => {
  const [baseUrl, setBaseUrl] = useState(apiConfig.baseUrl);
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [authHeaderName, setAuthHeaderName] = useState(apiConfig.authHeaderName);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    status: number;
    latencyMs: number;
    message: string;
    endpoint: string;
    payload?: unknown;
  } | null>(null);

  const [activeEndpointTab, setActiveEndpointTab] = useState<'transactions' | 'stats' | 'districts' | 'trends' | 'health' | 'ura'>('ura');
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await propertyApi.testConnection(baseUrl, apiKey);
      setTestResult(res);
      if (res.ok) {
        onSaveConfig({
          baseUrl,
          apiKey,
          authHeaderName,
          connected: true,
          status: 'connected',
        });
      }
    } catch (e) {
      setTestResult({
        ok: false,
        status: 0,
        latencyMs: 0,
        message: e instanceof Error ? e.message : 'Connection failed',
        endpoint: baseUrl,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      baseUrl,
      apiKey,
      authHeaderName,
    });
    onClose();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const endpoints = [
    {
      id: 'transactions',
      label: 'Transactions Feed',
      method: 'GET',
      path: '/transactions',
      fullPath: `${baseUrl.replace(/\/$/, '')}/transactions`,
      desc: 'Retrieves paginated Singapore private residential property sales transactions with multi-district filtering.',
      params: [
        { name: 'region', type: 'string', desc: 'CCR | RCR | OCR' },
        { name: 'district', type: 'string', desc: 'D01 to D28 (e.g. D09)' },
        { name: 'propertyType', type: 'string', desc: 'Condominium, Apartment, Landed, etc.' },
        { name: 'tenure', type: 'string', desc: 'Freehold, 99-Year Leasehold, etc.' },
        { name: 'typeOfSale', type: 'string', desc: 'New Sale, Resale, Sub Sale' },
        { name: 'q', type: 'string', desc: 'Search query for condo or street' },
        { name: 'page', type: 'number', desc: 'Pagination index (default: 1)' },
        { name: 'pageSize', type: 'number', desc: 'Items per page (default: 20)' },
      ],
      curl: `curl -X GET "${baseUrl.replace(/\/$/, '')}/transactions?region=CCR&district=D09&page=1&pageSize=20" \\
  -H "Accept: application/json" \\
  ${apiKey ? `-H "${authHeaderName}: Bearer ${apiKey}"` : '-H "Authorization: Bearer <YOUR_API_TOKEN>"'}`,
      sampleResponse: `{
  "success": true,
  "totalCount": 3410,
  "page": 1,
  "pageSize": 20,
  "data": [
    {
      "id": "tx-sg-09-001",
      "contractDate": "2025-02-10",
      "projectName": "THE MARQ ON PATERSON HILL",
      "street": "Paterson Hill",
      "district": "D09",
      "region": "CCR",
      "propertyType": "Condominium",
      "tenure": "Freehold",
      "areaSqft": 3100,
      "areaSqm": 288,
      "priceSgd": 13950000,
      "unitPricePsf": 4500,
      "unitPricePsm": 48437,
      "floorRange": "16 to 20",
      "typeOfSale": "Resale",
      "completionYear": 2011,
      "postalCode": "238567"
    }
  ]
}`,
    },
    {
      id: 'stats',
      label: 'Market KPI Stats',
      method: 'GET',
      path: '/stats',
      fullPath: `${baseUrl.replace(/\/$/, '')}/stats`,
      desc: 'Retrieves islandwide average PSF, median transacted price, luxury CCR benchmarks, and quarterly percentage changes.',
      params: [
        { name: 'region', type: 'string', desc: 'Filter stats by CCR / RCR / OCR' },
        { name: 'district', type: 'string', desc: 'Filter stats by specific D01-D28' },
      ],
      curl: `curl -X GET "${baseUrl.replace(/\/$/, '')}/stats" \\
  -H "Accept: application/json"`,
      sampleResponse: `{
  "success": true,
  "data": {
    "averagePsf": 2380,
    "medianPriceSgd": 2150000,
    "totalTransactions": 3410,
    "highestPsf": 5850,
    "lowestPsf": 1120,
    "ccrAvgPsf": 3120,
    "rcrAvgPsf": 2450,
    "ocrAvgPsf": 1780,
    "quarterlyChangePct": 1.4,
    "annualChangePct": 4.8,
    "lastUpdated": "2025-02-15T00:00:00Z"
  }
}`,
    },
    {
      id: 'districts',
      label: 'Districts Summary',
      method: 'GET',
      path: '/districts',
      fullPath: `${baseUrl.replace(/\/$/, '')}/districts`,
      desc: 'District-by-district benchmark averages (D01 through D28) and sales volume aggregations.',
      params: [{ name: 'region', type: 'string', desc: 'CCR, RCR, or OCR' }],
      curl: `curl -X GET "${baseUrl.replace(/\/$/, '')}/districts" \\
  -H "Accept: application/json"`,
      sampleResponse: `[
  {
    "district": "D09",
    "name": "Orchard, Cairnhill, River Valley",
    "region": "CCR",
    "averagePsf": 3250,
    "medianPriceSgd": 3400000,
    "transactionCount": 280,
    "topProjects": ["The Marq", "Cairnhill 16", "Klimt Cairnhill"]
  },
  {
    "district": "D15",
    "name": "Katong, Joo Chiat, Marine Parade",
    "region": "RCR",
    "averagePsf": 2480,
    "medianPriceSgd": 2300000,
    "transactionCount": 412,
    "topProjects": ["Amber Park", "Meyer Mansion", "Liv @ MB"]
  }
]`,
    },
    {
      id: 'trends',
      label: 'Price Trends',
      method: 'GET',
      path: '/trends',
      fullPath: `${baseUrl.replace(/\/$/, '')}/trends`,
      desc: 'Quarterly price index historical series comparing Core Central, City Fringe, and Outside Central Region.',
      params: [{ name: 'quarters', type: 'number', desc: 'Number of quarters (e.g. 8)' }],
      curl: `curl -X GET "${baseUrl.replace(/\/$/, '')}/trends" \\
  -H "Accept: application/json"`,
      sampleResponse: `[
  { "period": "2024-Q1", "overallPsf": 2280, "ccrPsf": 3010, "rcrPsf": 2360, "ocrPsf": 1710, "volume": 820 },
  { "period": "2024-Q2", "overallPsf": 2310, "ccrPsf": 3050, "rcrPsf": 2390, "ocrPsf": 1730, "volume": 890 },
  { "period": "2024-Q3", "overallPsf": 2345, "ccrPsf": 3090, "rcrPsf": 2420, "ocrPsf": 1750, "volume": 840 },
  { "period": "2024-Q4", "overallPsf": 2380, "ccrPsf": 3120, "rcrPsf": 2450, "ocrPsf": 1780, "volume": 860 }
]`,
    },
    {
      id: 'health',
      label: 'Health Check',
      method: 'GET',
      path: '/health',
      fullPath: `${baseUrl.replace(/\/$/, '')}/health`,
      desc: 'Simple service ping used to verify connectivity and network latency.',
      params: [],
      curl: `curl -X GET "${baseUrl.replace(/\/$/, '')}/health"`,
      sampleResponse: `{
  "status": "healthy",
  "service": "singapore-property-api",
  "version": "1.0.0"
}`,
    },
    {
      id: 'ura',
      label: 'URA Datasets (Serverless)',
      method: 'GET',
      path: '/api/transactions',
      fullPath: '/api/transactions?batch=1',
      desc: 'Serverless integration in /api. Step 1: trades AccessKey for today\'s daily Token. Step 2: invokes URA PMI_Resi_Transaction sending both AccessKey and Token headers.',
      params: [
        { name: 'batch', type: 'number (1-4)', desc: 'URA data batch index (default: 1)' },
        { name: 'service', type: 'string', desc: 'URA dataset name (default: PMI_Resi_Transaction)' },
      ],
      curl: `# 1. Trade AccessKey for today's token (handled automatically by /api/token)
curl -X GET "http://localhost:3000/api/token" \\
  -H "AccessKey: $URA_ACCESS_KEY"

# 2. Invoke URA dataset (sends AccessKey & Token behind the scenes)
curl -X GET "http://localhost:3000/api/transactions?batch=1" \\
  -H "AccessKey: $URA_ACCESS_KEY"`,
      sampleResponse: `{
  "Status": "Success",
  "Result": [
    {
      "street": "CAIRNHILL ROAD",
      "project": "THE RITZ-CARLTON RESIDENCES SINGAPORE CAIRNHILL",
      "marketSegment": "CCR",
      "transaction": [
        {
          "area": "263",
          "floorRange": "31-35",
          "noOfUnits": "1",
          "contractDate": "0125",
          "typeOfSale": "1",
          "price": "10380000",
          "propertyType": "Condominium",
          "district": "09",
          "tenure": "Freehold"
        }
      ]
    }
  ]
}`,
    },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === activeEndpointTab) || endpoints[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                Singapore Property API Integration Hub
              </h2>
              <p className="text-xs text-slate-400">
                Configure backend endpoints, authentication tokens, and inspect data contracts
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Backend Connection Settings */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Backend Connection Settings</span>
              </h3>

              {apiConfig.connected ? (
                <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Awaiting Backend
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Base URL */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">API Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="e.g. /api/v1/properties or http://localhost:8000/api"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
                <span className="text-[11px] text-slate-400">
                  Default placeholder is <code className="font-mono text-slate-300">/api/v1/properties</code>
                </span>
              </div>

              {/* API Key / Token */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">
                  Authentication Token / URA API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Bearer token or API key if required"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
                <span className="text-[11px] text-slate-400">
                  Appends as header <code className="font-mono text-slate-300">{authHeaderName}: Bearer ...</code>
                </span>
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing Handshake...' : 'Ping / Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Endpoint Config</span>
              </button>

              {/* Mock Preview Toggle Button */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={isMockActive ? onClearMockPreview : onLoadMockPreview}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    isMockActive
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Test how your data will render with sample schema values"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isMockActive ? 'Revert to Empty (Awaiting)' : 'Load Schema Test Data'}</span>
                </button>
              </div>
            </div>

            {/* Ping Feedback Output */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono mt-3 ${
                  testResult.ok
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">
                    {testResult.ok ? 'Connection Succeeded' : 'Connection Failed'}
                  </span>
                  <span>{testResult.latencyMs} ms &bull; Status: {testResult.status}</span>
                </div>
                <div className="text-[11px] opacity-90 break-all">
                  Target: {testResult.endpoint} &bull; {testResult.message}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Interactive API Contract & Endpoints Documentation */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-rose-400" />
              <span>Singapore Property API Placeholders &amp; Contracts</span>
            </h3>

            {/* Endpoint Tabs */}
            <div className="flex overflow-x-auto gap-1 border-b border-slate-800 pb-1 text-xs">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setActiveEndpointTab(ep.id as typeof activeEndpointTab)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    activeEndpointTab === ep.id
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1.5 opacity-80">{ep.method}</span>
                  <span>{ep.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Endpoint Contract Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {currentEndpoint.method}
                  </span>
                  <code className="text-xs sm:text-sm text-slate-100 font-semibold break-all">
                    {currentEndpoint.fullPath}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(currentEndpoint.curl)}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/70 border border-slate-700/60 self-start sm:self-auto transition-colors"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">cURL Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentEndpoint.desc}
              </p>

              {/* Query Parameters Table */}
              {currentEndpoint.params.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    Supported Query Parameters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {currentEndpoint.params.map((p) => (
                      <div
                        key={p.name}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2"
                      >
                        <span className="text-rose-400 font-bold shrink-0">{p.name}</span>
                        <span className="text-slate-400 text-[10px]">({p.type}):</span>
                        <span className="text-slate-300 text-[11px] font-sans truncate">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Response Preview */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Target Response JSON Format
                </h4>
                <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {currentEndpoint.sampleResponse}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono hidden sm:inline">
            Status: {apiConfig.connected ? 'Connected' : 'Placeholder Ready'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
