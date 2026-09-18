/**
 * Singapore Private Property Types & API Contracts
 */

export type SingaporeRegion = 'CCR' | 'RCR' | 'OCR';

export interface DistrictDefinition {
  district: string; // e.g. "D01", "D09"
  name: string; // e.g. "Raffles Place, Marina Bay", "Orchard, Cairnhill, River Valley"
  region: SingaporeRegion;
  postalSectors: string[]; // e.g. ["01", "02", "03", "04", "05", "06"]
  description: string;
}

export type PropertyType =
  | 'Condominium'
  | 'Apartment'
  | 'Executive Condominium'
  | 'Detached House'
  | 'Semi-Detached House'
  | 'Terrace House'
  | 'Good Class Bungalow';

export type TenureType =
  | 'Freehold'
  | '999-Year Leasehold'
  | '99-Year Leasehold'
  | 'Custom Leasehold';

export type SaleType = 'New Sale' | 'Resale' | 'Sub Sale';

export interface PropertyTransaction {
  id: string;
  contractDate: string; // ISO date string e.g. "2025-02-15"
  projectName: string;
  street: string;
  district: string; // e.g. "D09"
  region: SingaporeRegion;
  propertyType: PropertyType;
  tenure: TenureType;
  areaSqft: number;
  areaSqm: number;
  priceSgd: number;
  unitPricePsf: number;
  unitPricePsm: number;
  floorRange: string; // e.g. "16 to 20", "01 to 05"
  typeOfSale: SaleType;
  completionYear?: number | string; // e.g. 2024 or "Uncompleted"
  postalCode?: string;
  developer?: string;
  unitsInProject?: number;
}

export interface MarketAggregateStats {
  averagePsf: number | null;
  medianPriceSgd: number | null;
  totalTransactions: number | null;
  highestPsf: number | null;
  lowestPsf: number | null;
  ccrAvgPsf: number | null;
  rcrAvgPsf: number | null;
  ocrAvgPsf: number | null;
  quarterlyChangePct: number | null;
  annualChangePct: number | null;
  lastUpdated: string | null;
}

export interface DistrictSummary {
  district: string;
  name: string;
  region: SingaporeRegion;
  averagePsf: number | null;
  medianPriceSgd: number | null;
  transactionCount: number | null;
  topProjects: string[];
}

export interface MarketTrendPoint {
  period: string; // e.g. "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"
  overallPsf: number | null;
  ccrPsf: number | null;
  rcrPsf: number | null;
  ocrPsf: number | null;
  volume: number | null;
}

export interface PropertyFilterState {
  searchQuery: string;
  selectedRegion: 'ALL' | SingaporeRegion;
  selectedDistrict: string; // 'ALL' or 'D01'..'D28'
  selectedPropertyType: 'ALL' | PropertyType;
  selectedTenure: 'ALL' | TenureType;
  selectedSaleType: 'ALL' | SaleType;
  minPsf?: number | null;
  maxPsf?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  unitMeasurement: 'PSF' | 'PSM';
  sortBy: 'contractDate' | 'priceSgd' | 'unitPricePsf' | 'areaSqft' | 'projectName';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  message?: string;
  timestamp: string;
  endpoint: string;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  authHeaderName: string;
  timeoutMs: number;
  connected: boolean;
  status: 'idle' | 'testing' | 'connected' | 'error';
  lastPingTime: string | null;
  lastPingLatencyMs: number | null;
  lastErrorMessage: string | null;
}
