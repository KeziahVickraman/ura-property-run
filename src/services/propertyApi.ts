/**
 * Singapore Private Property API Client
 * Exclusively integrated with the URA PMI_Resi_Transaction Data Service endpoint (/api/transactions)
 */

import {
  DistrictSummary,
  MarketAggregateStats,
  MarketTrendPoint,
  PropertyTransaction,
  SaleType,
  SingaporeRegion,
} from '../types/property';
import { SINGAPORE_DISTRICTS } from '../data/singaporeDistricts';

/**
 * Parses URA contractDate (e.g. "0125", "1224", "2025-01") into formatted representations
 */
export function formatUraContractDate(rawDate: string): { isoPeriod: string; display: string } {
  if (!rawDate) return { isoPeriod: '2025-01', display: 'Jan 2025' };

  // If already YYYY-MM
  if (rawDate.includes('-')) {
    const [year, month] = rawDate.split('-');
    const mNum = parseInt(month, 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      isoPeriod: `${year}-${month.padStart(2, '0')}`,
      display: `${months[mNum - 1] || month} ${year}`,
    };
  }

  // URA standard format is MMYY (e.g. "0125" -> month 01, year 2025)
  if (rawDate.length === 4) {
    const mm = rawDate.slice(0, 2);
    const yy = rawDate.slice(2, 4);
    const year = `20${yy}`;
    const mNum = parseInt(mm, 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[mNum - 1] || mm;
    return {
      isoPeriod: `${year}-${mm}`,
      display: `${monthName} ${year}`,
    };
  }

  return { isoPeriod: rawDate, display: rawDate };
}

/**
 * Normalizes URA type of sale code
 * 1 = New Sale
 * 2 = Sub Sale
 * 3 = Resale
 */
export function mapUraSaleType(rawType: string): SaleType {
  if (rawType === '1' || rawType?.toLowerCase() === 'new sale') return 'New Sale';
  if (rawType === '2' || rawType?.toLowerCase() === 'sub sale') return 'Sub Sale';
  return 'Resale';
}

/**
 * Normalizes URA district string to "D01".."D28"
 */
export function formatDistrictCode(rawDistrict: string | number): string {
  const clean = String(rawDistrict || '').replace(/^D/i, '').trim();
  const num = parseInt(clean, 10);
  if (isNaN(num) || num < 1 || num > 28) return 'D09';
  return `D${String(num).padStart(2, '0')}`;
}

/**
 * Normalizes raw URA PMI_Resi_Transaction response into standard PropertyTransaction list
 */
export function transformUraResponse(uraPayload: any): {
  transactions: PropertyTransaction[];
  isLive: boolean;
  batch: number;
} {
  const resultList = uraPayload?.Result || [];
  const isLive = !!uraPayload?.isLive;
  const batch = Number(uraPayload?.batch) || 1;
  const transactions: PropertyTransaction[] = [];

  let index = 0;
  for (const projectItem of resultList) {
    const projectName = projectItem.project || 'Private Residential Property';
    const street = projectItem.street || '';
    const region: SingaporeRegion = projectItem.marketSegment || 'CCR';
    const xCoord = projectItem.x;
    const yCoord = projectItem.y;

    const txList = Array.isArray(projectItem.transaction) ? projectItem.transaction : [];

    for (const tx of txList) {
      index++;
      const areaSqm = parseFloat(tx.area) || 0;
      const areaSqft = Math.round(areaSqm * 10.7639) || 0;
      const priceSgd = parseFloat(tx.price) || 0;

      const unitPricePsf = areaSqft > 0 ? Math.round(priceSgd / areaSqft) : 0;
      const unitPricePsm = areaSqm > 0 ? Math.round(priceSgd / areaSqm) : 0;

      const { isoPeriod, display } = formatUraContractDate(tx.contractDate);
      const district = formatDistrictCode(tx.district);
      const typeOfSale = mapUraSaleType(tx.typeOfSale);
      const propertyType = tx.propertyType || 'Condominium';
      const tenure = tx.tenure || 'Freehold';
      const floorRange = tx.floorRange || '-';
      const noOfUnits = parseInt(tx.noOfUnits, 10) || 1;
      const nettPrice = tx.nettPrice ? parseFloat(tx.nettPrice) : undefined;

      transactions.push({
        id: `ura-${batch}-${index}-${projectName.replace(/\s+/g, '_')}-${priceSgd}`,
        contractDate: isoPeriod,
        contractDateDisplay: display,
        projectName,
        street,
        district,
        region,
        propertyType,
        tenure,
        areaSqm,
        areaSqft,
        priceSgd,
        unitPricePsf,
        unitPricePsm,
        floorRange,
        typeOfSale,
        noOfUnits,
        nettPrice,
        x: xCoord,
        y: yCoord,
      });
    }
  }

  // Sort descending by contractDate and price
  transactions.sort((a, b) => {
    if (b.contractDate !== a.contractDate) {
      return b.contractDate.localeCompare(a.contractDate);
    }
    return b.priceSgd - a.priceSgd;
  });

  return { transactions, isLive, batch };
}

/**
 * Calculates aggregate market statistics purely from transacted records in the endpoint
 */
export function calculateMarketStats(transactions: PropertyTransaction[]): MarketAggregateStats {
  if (!transactions || transactions.length === 0) {
    return {
      averagePsf: null,
      medianPriceSgd: null,
      totalTransactions: 0,
      highestPsf: null,
      lowestPsf: null,
      ccrAvgPsf: null,
      rcrAvgPsf: null,
      ocrAvgPsf: null,
      newSaleCount: 0,
      resaleCount: 0,
      lastUpdated: null,
    };
  }

  const validPsfs = transactions.map((t) => t.unitPricePsf).filter((p) => p > 0);
  const avgPsf = validPsfs.length > 0 ? Math.round(validPsfs.reduce((a, b) => a + b, 0) / validPsfs.length) : null;
  const highestPsf = validPsfs.length > 0 ? Math.max(...validPsfs) : null;
  const lowestPsf = validPsfs.length > 0 ? Math.min(...validPsfs) : null;

  // Median Price
  const sortedPrices = [...transactions.map((t) => t.priceSgd).filter((p) => p > 0)].sort((a, b) => a - b);
  let medianPrice: number | null = null;
  if (sortedPrices.length > 0) {
    const mid = Math.floor(sortedPrices.length / 2);
    medianPrice = sortedPrices.length % 2 === 0
      ? Math.round((sortedPrices[mid - 1] + sortedPrices[mid]) / 2)
      : sortedPrices[mid];
  }

  // Region averages
  const ccrPsfs = transactions.filter((t) => t.region === 'CCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);
  const rcrPsfs = transactions.filter((t) => t.region === 'RCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);
  const ocrPsfs = transactions.filter((t) => t.region === 'OCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);

  const ccrAvgPsf = ccrPsfs.length > 0 ? Math.round(ccrPsfs.reduce((a, b) => a + b, 0) / ccrPsfs.length) : null;
  const rcrAvgPsf = rcrPsfs.length > 0 ? Math.round(rcrPsfs.reduce((a, b) => a + b, 0) / rcrPsfs.length) : null;
  const ocrAvgPsf = ocrPsfs.length > 0 ? Math.round(ocrPsfs.reduce((a, b) => a + b, 0) / ocrPsfs.length) : null;

  const newSaleCount = transactions.filter((t) => t.typeOfSale === 'New Sale').length;
  const resaleCount = transactions.filter((t) => t.typeOfSale === 'Resale').length;

  return {
    averagePsf: avgPsf,
    medianPriceSgd: medianPrice,
    totalTransactions: transactions.length,
    highestPsf,
    lowestPsf,
    ccrAvgPsf,
    rcrAvgPsf,
    ocrAvgPsf,
    newSaleCount,
    resaleCount,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Calculates district summaries directly from transacted records
 */
export function calculateDistrictSummaries(transactions: PropertyTransaction[]): DistrictSummary[] {
  return SINGAPORE_DISTRICTS.map((def) => {
    const inDistrict = transactions.filter((t) => t.district === def.district);
    const validPsfs = inDistrict.map((t) => t.unitPricePsf).filter((p) => p > 0);
    const avgPsf = validPsfs.length > 0 ? Math.round(validPsfs.reduce((a, b) => a + b, 0) / validPsfs.length) : null;

    const prices = inDistrict.map((t) => t.priceSgd).filter((p) => p > 0).sort((a, b) => a - b);
    let medianPrice: number | null = null;
    if (prices.length > 0) {
      const mid = Math.floor(prices.length / 2);
      medianPrice = prices.length % 2 === 0 ? Math.round((prices[mid - 1] + prices[mid]) / 2) : prices[mid];
    }

    // Top projects
    const projectCounts = new Map<string, number>();
    for (const t of inDistrict) {
      projectCounts.set(t.projectName, (projectCounts.get(t.projectName) || 0) + 1);
    }
    const topProjects = Array.from(projectCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    return {
      district: def.district,
      name: def.name,
      region: def.region,
      averagePsf: avgPsf,
      medianPriceSgd: medianPrice,
      transactionCount: inDistrict.length,
      topProjects,
    };
  });
}

/**
 * Calculates monthly / quarterly time trend points from transactions
 */
export function calculateMarketTrends(transactions: PropertyTransaction[]): MarketTrendPoint[] {
  if (!transactions || transactions.length === 0) return [];

  // Group by contractDate (YYYY-MM)
  const groups = new Map<string, PropertyTransaction[]>();
  for (const t of transactions) {
    if (!groups.has(t.contractDate)) {
      groups.set(t.contractDate, []);
    }
    groups.get(t.contractDate)!.push(t);
  }

  // Sort periods ascending
  const sortedPeriods = Array.from(groups.keys()).sort();

  return sortedPeriods.map((period) => {
    const list = groups.get(period)!;
    const validPsfs = list.map((t) => t.unitPricePsf).filter((p) => p > 0);
    const overallPsf = validPsfs.length > 0 ? Math.round(validPsfs.reduce((a, b) => a + b, 0) / validPsfs.length) : null;

    const ccr = list.filter((t) => t.region === 'CCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);
    const rcr = list.filter((t) => t.region === 'RCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);
    const ocr = list.filter((t) => t.region === 'OCR' && t.unitPricePsf > 0).map((t) => t.unitPricePsf);

    const ccrPsf = ccr.length > 0 ? Math.round(ccr.reduce((a, b) => a + b, 0) / ccr.length) : null;
    const rcrPsf = rcr.length > 0 ? Math.round(rcr.reduce((a, b) => a + b, 0) / rcr.length) : null;
    const ocrPsf = ocr.length > 0 ? Math.round(ocr.reduce((a, b) => a + b, 0) / ocr.length) : null;

    const sampleTx = list[0];
    const periodLabel = sampleTx?.contractDateDisplay || period;

    return {
      period,
      periodLabel,
      overallPsf,
      ccrPsf,
      rcrPsf,
      ocrPsf,
      volume: list.length,
    };
  });
}

/**
 * Fetches transaction records from the URA PMI_Resi_Transaction endpoint
 */
export async function fetchUraTransactions(batch = 1): Promise<{
  transactions: PropertyTransaction[];
  isLive: boolean;
  batch: number;
  rawResponse: any;
}> {
  const url = `/api/transactions?batch=${batch}&service=PMI_Resi_Transaction`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: HTTP ${res.status}`);
  }

  const json = await res.json();
  const { transactions, isLive, batch: parsedBatch } = transformUraResponse(json);

  return {
    transactions,
    isLive,
    batch: parsedBatch,
    rawResponse: json,
  };
}

export { calculateDistrictSummaries as generateDistrictSummaries };
export { calculateMarketTrends as generateMarketTrends };

/**
 * Computes Singapore IRAS Buyer's Stamp Duty (BSD) on residential transactions
 */
export function calculateBsd(price: number): { totalBsd: number; breakdown: Array<{ tier: string; rate: string; amount: number }> } {
  let remaining = price;
  let totalBsd = 0;
  const breakdown: Array<{ tier: string; rate: string; amount: number }> = [];

  const tiers = [
    { cap: 180000, rate: 0.01, rateLabel: '1%', tierLabel: 'First $180,000' },
    { cap: 180000, rate: 0.02, rateLabel: '2%', tierLabel: 'Next $180,000 ($180k - $360k)' },
    { cap: 640000, rate: 0.03, rateLabel: '3%', tierLabel: 'Next $640,000 ($360k - $1M)' },
    { cap: 500000, rate: 0.04, rateLabel: '4%', tierLabel: 'Next $500,000 ($1M - $1.5M)' },
    { cap: 1500000, rate: 0.05, rateLabel: '5%', tierLabel: 'Next $1,500,000 ($1.5M - $3M)' },
    { cap: Infinity, rate: 0.06, rateLabel: '6%', tierLabel: 'Amounts exceeding $3,000,000' },
  ];

  for (const t of tiers) {
    if (remaining <= 0) break;
    const taxableInTier = Math.min(remaining, t.cap);
    const tax = taxableInTier * t.rate;
    totalBsd += tax;
    breakdown.push({
      tier: t.tierLabel,
      rate: t.rateLabel,
      amount: Math.round(tax),
    });
    remaining -= taxableInTier;
  }

  return {
    totalBsd: Math.round(totalBsd),
    breakdown,
  };
}
