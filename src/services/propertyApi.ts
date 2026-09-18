/**
 * Singapore Private Property API Client & Integration Service
 * Placeholder service designed to connect with any Singapore Real Estate Backend (e.g., URA API proxy, custom Express/Go/FastAPI service).
 */

import {
  ApiConfig,
  ApiResponse,
  DistrictSummary,
  MarketAggregateStats,
  MarketTrendPoint,
  PropertyFilterState,
  PropertyTransaction,
  SingaporeRegion,
} from '../types/property';

const STORAGE_KEY_CONFIG = 'sg_property_api_config';

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: '/api/v1/properties',
  apiKey: '',
  authHeaderName: 'Authorization',
  timeoutMs: 8000,
  connected: false,
  status: 'idle',
  lastPingTime: null,
  lastPingLatencyMs: null,
  lastErrorMessage: null,
};

export class PropertyApiService {
  private config: ApiConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ApiConfig>): ApiConfig {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    return this.getConfig();
  }

  private loadConfig(): ApiConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_API_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default
    }
    return { ...DEFAULT_API_CONFIG };
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch {
      // ignore local storage error
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.config.apiKey) {
      headers[this.config.authHeaderName || 'Authorization'] = this.config.apiKey.startsWith('Bearer ')
        ? this.config.apiKey
        : `Bearer ${this.config.apiKey}`;
    }
    return headers;
  }

  /**
   * Test connection to the configured backend API
   */
  public async testConnection(customUrl?: string, customKey?: string): Promise<{
    ok: boolean;
    status: number;
    latencyMs: number;
    message: string;
    endpoint: string;
    payload?: unknown;
  }> {
    const targetUrl = (customUrl || this.config.baseUrl).replace(/\/$/, '') + '/health';
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const headers = this.getHeaders();
      if (customKey) {
        headers[this.config.authHeaderName] = `Bearer ${customKey}`;
      }

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = await response.text();
      }

      const ok = response.ok;
      this.updateConfig({
        connected: ok,
        status: ok ? 'connected' : 'error',
        lastPingTime: new Date().toISOString(),
        lastPingLatencyMs: latencyMs,
        lastErrorMessage: ok ? null : `HTTP ${response.status}: ${response.statusText}`,
      });

      return {
        ok,
        status: response.status,
        latencyMs,
        message: ok ? 'Backend handshake successful' : `Server responded with status ${response.status}`,
        endpoint: targetUrl,
        payload,
      };
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';

      this.updateConfig({
        connected: false,
        status: 'error',
        lastPingTime: new Date().toISOString(),
        lastPingLatencyMs: latencyMs,
        lastErrorMessage: errorMessage,
      });

      return {
        ok: false,
        status: 0,
        latencyMs,
        message: errorMessage,
        endpoint: targetUrl,
      };
    }
  }

  /**
   * Fetch aggregate market statistics from GET /api/v1/properties/stats
   */
  public async fetchMarketStats(filters?: Partial<PropertyFilterState>): Promise<ApiResponse<MarketAggregateStats>> {
    const params = new URLSearchParams();
    if (filters?.selectedRegion && filters.selectedRegion !== 'ALL') {
      params.append('region', filters.selectedRegion);
    }
    if (filters?.selectedDistrict && filters.selectedDistrict !== 'ALL') {
      params.append('district', filters.selectedDistrict);
    }
    if (filters?.selectedPropertyType && filters.selectedPropertyType !== 'ALL') {
      params.append('propertyType', filters.selectedPropertyType);
    }

    const endpoint = `${this.config.baseUrl.replace(/\/$/, '')}/stats${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        success: true,
        data: data.data || data,
        timestamp: new Date().toISOString(),
        endpoint,
      };
    } catch (err) {
      // By default when no backend is attached, return empty placeholder structure
      return {
        success: false,
        data: null,
        message: err instanceof Error ? err.message : 'Backend not connected',
        timestamp: new Date().toISOString(),
        endpoint,
      };
    }
  }

  /**
   * Fetch transaction list from GET /api/v1/properties/transactions
   */
  public async fetchTransactions(filters?: Partial<PropertyFilterState>): Promise<ApiResponse<PropertyTransaction[]>> {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append('q', filters.searchQuery);
    if (filters?.selectedRegion && filters.selectedRegion !== 'ALL') params.append('region', filters.selectedRegion);
    if (filters?.selectedDistrict && filters.selectedDistrict !== 'ALL') params.append('district', filters.selectedDistrict);
    if (filters?.selectedPropertyType && filters.selectedPropertyType !== 'ALL') params.append('propertyType', filters.selectedPropertyType);
    if (filters?.selectedTenure && filters.selectedTenure !== 'ALL') params.append('tenure', filters.selectedTenure);
    if (filters?.selectedSaleType && filters.selectedSaleType !== 'ALL') params.append('typeOfSale', filters.selectedSaleType);
    if (filters?.minPsf) params.append('minPsf', filters.minPsf.toString());
    if (filters?.maxPsf) params.append('maxPsf', filters.maxPsf.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const endpoint = `${this.config.baseUrl.replace(/\/$/, '')}/transactions${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      return {
        success: true,
        data: json.data || json,
        totalCount: json.totalCount ?? (Array.isArray(json) ? json.length : 0),
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 20,
        timestamp: new Date().toISOString(),
        endpoint,
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        totalCount: 0,
        message: err instanceof Error ? err.message : 'Backend not connected',
        timestamp: new Date().toISOString(),
        endpoint,
      };
    }
  }

  /**
   * Fetch district price index summaries from GET /api/v1/properties/districts
   */
  public async fetchDistrictSummaries(region?: SingaporeRegion | 'ALL'): Promise<ApiResponse<DistrictSummary[]>> {
    const params = new URLSearchParams();
    if (region && region !== 'ALL') params.append('region', region);

    const endpoint = `${this.config.baseUrl.replace(/\/$/, '')}/districts${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        success: true,
        data: json.data || json,
        timestamp: new Date().toISOString(),
        endpoint,
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        message: err instanceof Error ? err.message : 'Backend not connected',
        timestamp: new Date().toISOString(),
        endpoint,
      };
    }
  }

  /**
   * Fetch quarterly market trends from GET /api/v1/properties/trends
   */
  public async fetchMarketTrends(): Promise<ApiResponse<MarketTrendPoint[]>> {
    const endpoint = `${this.config.baseUrl.replace(/\/$/, '')}/trends`;

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        success: true,
        data: json.data || json,
        timestamp: new Date().toISOString(),
        endpoint,
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        message: err instanceof Error ? err.message : 'Backend not connected',
        timestamp: new Date().toISOString(),
        endpoint,
      };
    }
  }

  /**
   * Sample schema generator for testing purposes (Optional toggle in the UI so the developer can see the format)
   */
  public getSampleSchemaDefinition() {
    return {
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/properties/health',
          description: 'Healthcheck and API readiness ping',
          responseExample: {
            status: 'healthy',
            region: 'ap-southeast-1',
            service: 'singapore-property-api',
            version: '1.0.0',
            timestamp: '2025-02-15T08:30:00Z',
          },
        },
        {
          method: 'GET',
          path: '/api/v1/properties/stats',
          description: 'Market overview statistics across Singapore private residential sectors',
          queryParams: ['region (CCR|RCR|OCR)', 'district (D01-D28)', 'propertyType'],
          responseExample: {
            averagePsf: 2380,
            medianPriceSgd: 2150000,
            totalTransactions: 3410,
            highestPsf: 5850,
            lowestPsf: 1120,
            ccrAvgPsf: 3120,
            rcrAvgPsf: 2450,
            ocrAvgPsf: 1780,
            quarterlyChangePct: 1.4,
            annualChangePct: 4.8,
            lastUpdated: '2025-02-15T00:00:00Z',
          },
        },
        {
          method: 'GET',
          path: '/api/v1/properties/transactions',
          description: 'Paginated list of Singapore private residential property sales',
          queryParams: ['q', 'region', 'district', 'propertyType', 'tenure', 'typeOfSale', 'minPsf', 'maxPsf', 'page', 'pageSize', 'sortBy', 'sortOrder'],
          responseExample: {
            data: [
              {
                id: 'tx-sg-09-001',
                contractDate: '2025-02-10',
                projectName: 'THE MARQ ON PATERSON HILL',
                street: 'Paterson Hill',
                district: 'D09',
                region: 'CCR',
                propertyType: 'Condominium',
                tenure: 'Freehold',
                areaSqft: 3100,
                areaSqm: 288,
                priceSgd: 13950000,
                unitPricePsf: 4500,
                unitPricePsm: 48437,
                floorRange: '16 to 20',
                typeOfSale: 'Resale',
                completionYear: 2011,
                postalCode: '238567',
              }
            ],
            totalCount: 3410,
            page: 1,
            pageSize: 20,
          },
        },
        {
          method: 'GET',
          path: '/api/v1/properties/districts',
          description: 'District level median price and average PSF aggregations',
          queryParams: ['region'],
          responseExample: [
            {
              district: 'D09',
              name: 'Orchard, Cairnhill, River Valley',
              region: 'CCR',
              averagePsf: 3250,
              medianPriceSgd: 3400000,
              transactionCount: 280,
              topProjects: ['The Marq', 'Cairnhill 16', 'Klimt Cairnhill'],
            }
          ],
        },
        {
          method: 'GET',
          path: '/api/v1/properties/trends',
          description: 'Quarterly PSF price trends for CCR, RCR, OCR, and islandwide',
          responseExample: [
            { period: '2024-Q1', overallPsf: 2280, ccrPsf: 3010, rcrPsf: 2360, ocrPsf: 1710, volume: 820 },
            { period: '2024-Q2', overallPsf: 2310, ccrPsf: 3050, rcrPsf: 2390, ocrPsf: 1730, volume: 890 },
            { period: '2024-Q3', overallPsf: 2345, ccrPsf: 3090, rcrPsf: 2420, ocrPsf: 1750, volume: 840 },
            { period: '2024-Q4', overallPsf: 2380, ccrPsf: 3120, rcrPsf: 2450, ocrPsf: 1780, volume: 860 },
          ],
        },
        {
          method: 'GET',
          path: '/api/token',
          description: 'Step 1: Trade AccessKey for today\'s daily URA Token (https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1)',
          headers: ['AccessKey'],
          responseExample: {
            status: 'Success',
            token: 'eyJhbGciOi...',
            dateKey: '2025-02-15',
            cached: false,
          },
        },
        {
          method: 'GET',
          path: '/api/transactions',
          description: 'Step 2: Invoke URA PMI_Resi_Transaction sending BOTH AccessKey and Token headers',
          queryParams: ['service', 'batch'],
          headers: ['AccessKey'],
          responseExample: {
            Status: 'Success',
            Result: [
              {
                street: 'CAIRNHILL ROAD',
                project: 'THE RITZ-CARLTON RESIDENCES',
                marketSegment: 'CCR',
                transaction: [
                  {
                    area: '263',
                    floorRange: '31-35',
                    contractDate: '0125',
                    price: '10380000',
                    propertyType: 'Condominium',
                    district: '09',
                    tenure: 'Freehold',
                  }
                ]
              }
            ],
          },
        },
      ],
    };
  }
}

export const propertyApi = new PropertyApiService();
