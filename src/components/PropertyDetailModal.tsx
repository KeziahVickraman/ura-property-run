import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Tag, 
  Key, 
  Maximize2, 
  Calculator, 
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { PropertyTransaction } from '../types/property';
import { REGION_METADATA, SINGAPORE_DISTRICTS } from '../data/singaporeDistricts';

interface PropertyDetailModalProps {
  property: PropertyTransaction | null;
  onClose: () => void;
  unitMeasurement: 'PSF' | 'PSM';
  onOpenApiModal: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  unitMeasurement,
  onOpenApiModal,
}) => {
  if (!property) return null;

  const districtInfo = SINGAPORE_DISTRICTS.find((d) => d.district === property.district);
  const regionMeta = REGION_METADATA[property.region];

  // Calculate Singapore Buyer's Stamp Duty (BSD) for residential properties
  // 1% on first $180,000
  // 2% on next $180,000
  // 3% on next $640,000
  // 4% on next $500,000
  // 5% on next $1,500,000
  // 6% on amount in excess of $3,000,000
  const calculateSingaporeBsd = (price: number) => {
    let bsd = 0;
    if (price <= 180000) {
      bsd = price * 0.01;
    } else if (price <= 360000) {
      bsd = 1800 + (price - 180000) * 0.02;
    } else if (price <= 1000000) {
      bsd = 5400 + (price - 360000) * 0.03;
    } else if (price <= 1500000) {
      bsd = 24600 + (price - 1000000) * 0.04;
    } else if (price <= 3000000) {
      bsd = 44600 + (price - 1500000) * 0.05;
    } else {
      bsd = 119600 + (price - 3000000) * 0.06;
    }
    return Math.round(bsd);
  };

  const estimatedBsd = calculateSingaporeBsd(property.priceSgd);

  const formatUnitPrice = (psfVal: number) => {
    const finalVal = unitMeasurement === 'PSM' ? Math.round(psfVal * 10.7639) : psfVal;
    return `S$ ${finalVal.toLocaleString('en-SG')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${regionMeta.badgeClass}`}>
                {property.region} &bull; {property.district}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {property.typeOfSale}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {property.projectName}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{property.street}</span>
              {districtInfo && (
                <span className="text-slate-400">({districtInfo.name.split(',')[0]})</span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Price Headline */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Transacted Sale Price</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono">
                S$ {property.priceSgd.toLocaleString('en-SG')}
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Unit Price ({unitMeasurement})</span>
              <div className="text-xl font-bold text-white font-mono">
                {formatUnitPrice(property.unitPricePsf)}
                <span className="text-xs text-slate-400 font-normal ml-1">/{unitMeasurement.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Key Property Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Property Type</span>
              <span className="font-semibold text-slate-200">{property.propertyType}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Tenure</span>
              <span className="font-semibold text-slate-200">{property.tenure}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Floor Level</span>
              <span className="font-semibold text-slate-200 font-mono">{property.floorRange || 'N/A'}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Floor Area</span>
              <span className="font-semibold text-slate-200 font-mono">
                {property.areaSqft.toLocaleString()} sqft ({property.areaSqm} sqm)
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Contract Date</span>
              <span className="font-semibold text-slate-200 font-mono">{property.contractDate}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Completion (TOP)</span>
              <span className="font-semibold text-slate-200 font-mono">
                {property.completionYear || 'Uncompleted'}
              </span>
            </div>
          </div>

          {/* Singapore Stamp Duty Calculation */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Estimated Singapore Buyer's Stamp Duty (BSD)</span>
              </div>
              <span className="font-mono font-bold text-emerald-300">
                S$ {estimatedBsd.toLocaleString('en-SG')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculated using statutory IRAS residential stamp duty tiers up to 6% for properties transacted in Singapore. Additional Buyer's Stamp Duty (ABSD) may apply based on residential status and property count.
            </p>
          </div>

          {/* API Trace Box */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>Record ID: {property.id}</span>
            </div>
            <button
              onClick={onOpenApiModal}
              className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Endpoint Specs</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
