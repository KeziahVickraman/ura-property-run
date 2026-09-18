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
  | string;

export type TenureType =
  | 'Freehold'
  | '999-Year Leasehold'
  | '99-Year Leasehold'
  | string;

export type SaleType = 'New Sale' | 'Resale' | 'Sub Sale';

/**
 * Normalized transaction record matching URA PMI_Resi_Transaction endpoint
 */
export interface PropertyTransaction {
  id: string;
  contractDate: string; // "YYYY-MM" or "MMYY"
  contractDateDisplay: string; // e.g. "Jan 2025"
  projectName: string; // URA "project"
  street: string; // URA "street"
  district: string; // URA "district" formatted as "D01".."D28"
  region: SingaporeRegion; // URA "marketSegment": CCR | RCR | OCR
  propertyType: string; // URA "propertyType"
  tenure: string; // URA "tenure"
  areaSqm: number; // URA "area" (sqm)
  areaSqft: number; // calculated areaSqm * 10.7639
  priceSgd: number; // URA "price"
  unitPricePsf: number; // calculated priceSgd / areaSqft
  unitPricePsm: number; // calculated priceSgd / areaSqm
  floorRange: string; // URA "floorRange" e.g. "31-35"
  typeOfSale: SaleType; // URA "typeOfSale": 1=New Sale, 2=Sub Sale, 3=Resale
  noOfUnits: number; // URA "noOfUnits"
  nettPrice?: number; // URA "nettPrice" if available
  x?: string | number; // SVY21 X
  y?: string | number; // SVY21 Y
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
  newSaleCount: number | null;
  resaleCount: number | null;
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
  period: string; // e.g. "2025-01", "2024-12"
  periodLabel: string; // e.g. "Jan 2025"
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
  selectedPropertyType: 'ALL' | string;
  selectedTenure: 'ALL' | string;
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

export interface ApiConfig {
  baseUrl: string;
  batch: number;
  isLive: boolean;
  connected: boolean;
  lastFetchTime: string | null;
  recordCount: number;
}

