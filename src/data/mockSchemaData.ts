import { 
  PropertyTransaction, 
  MarketAggregateStats, 
  DistrictSummary, 
  MarketTrendPoint 
} from '../types/property';

export const SAMPLE_MOCK_STATS: MarketAggregateStats = {
  averagePsf: 2380,
  medianPriceSgd: 2150000,
  totalTransactions: 3410,
  highestPsf: 5850,
  lowestPsf: 1120,
  ccrAvgPsf: 3120,
  rcrAvgPsf: 2450,
  ocrAvgPsf: 1780,
  newSaleCount: 1420,
  resaleCount: 1990,
  lastUpdated: '2025-02-15',
};

export const SAMPLE_MOCK_TRANSACTIONS: PropertyTransaction[] = [
  {
    id: 'tx-sg-09-001',
    contractDate: '2025-02',
    contractDateDisplay: 'Feb 2025',
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
    noOfUnits: 1,
  },
  {
    id: 'tx-sg-01-002',
    contractDate: '2025-02',
    contractDateDisplay: 'Feb 2025',
    projectName: 'MARINA ONE RESIDENCES',
    street: 'Marina Way',
    district: 'D01',
    region: 'CCR',
    propertyType: 'Apartment',
    tenure: '99 yrs',
    areaSqft: 1119,
    areaSqm: 104,
    priceSgd: 2950000,
    unitPricePsf: 2636,
    unitPricePsm: 28373,
    floorRange: '26 to 30',
    typeOfSale: 'Resale',
    noOfUnits: 1,
  },
];

export const SAMPLE_MOCK_DISTRICTS: DistrictSummary[] = [
  {
    district: 'D09',
    name: 'Orchard, Cairnhill, River Valley',
    region: 'CCR',
    averagePsf: 2980,
    medianPriceSgd: 3400000,
    transactionCount: 38,
    topProjects: ['The Marq', 'Kopar At Newton'],
  },
];

export const SAMPLE_MOCK_TRENDS: MarketTrendPoint[] = [
  {
    period: '2024-03',
    periodLabel: 'Q1 2024',
    overallPsf: 2190,
    ccrPsf: 2980,
    rcrPsf: 2310,
    ocrPsf: 1680,
    volume: 820,
  },
  {
    period: '2024-06',
    periodLabel: 'Q2 2024',
    overallPsf: 2240,
    ccrPsf: 3040,
    rcrPsf: 2360,
    ocrPsf: 1710,
    volume: 890,
  },
];
