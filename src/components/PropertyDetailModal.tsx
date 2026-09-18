import React from 'react';
import { 
  X, 
  MapPin, 
  Calculator, 
  Terminal, 
  Layers, 
  FileText
} from 'lucide-react';
import { PropertyTransaction } from '../types/property';
import { REGION_METADATA, SINGAPORE_DISTRICTS } from '../data/singaporeDistricts';
import { calculateBsd } from '../services/propertyApi';

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
  const regionMeta = REGION_METADATA[property.region] || {
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const bsdResult = calculateBsd(property.priceSgd);

  const formatUnitPrice = (tx: PropertyTransaction) => {
    const finalVal = unitMeasurement === 'PSM' ? tx.unitPricePsm : tx.unitPricePsf;
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
              <span className="text-xs text-slate-400 block mb-1">Transacted Price (SGD)</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono">
                S$ {property.priceSgd.toLocaleString('en-SG')}
              </div>
              {property.nettPrice && (
                <span className="text-xs text-emerald-400 mt-1 block font-mono">
                  Developer Nett Price: S$ {property.nettPrice.toLocaleString('en-SG')}
                </span>
              )}
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Unit Price ({unitMeasurement})</span>
              <div className="text-xl font-bold text-white font-mono">
                {formatUnitPrice(property)}
                <span className="text-xs text-slate-400 font-normal ml-1">/{unitMeasurement.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Official URA Key Property Specs */}
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
              <span className="text-slate-400 block text-[11px] mb-1">Floor Range</span>
              <span className="font-semibold text-slate-200 font-mono">{property.floorRange || '-'}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Floor Area</span>
              <span className="font-semibold text-slate-200 font-mono">
                {property.areaSqft.toLocaleString()} sqft ({property.areaSqm} sqm)
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Contract Date</span>
              <span className="font-semibold text-slate-200 font-mono">{property.contractDateDisplay}</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] mb-1">Units Transacted</span>
              <span className="font-semibold text-slate-200 font-mono">
                {property.noOfUnits} unit{property.noOfUnits > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Singapore Buyer's Stamp Duty (BSD) Calculation */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Statutory Buyer's Stamp Duty (BSD)</span>
              </div>
              <span className="font-mono font-bold text-emerald-300 text-sm">
                S$ {bsdResult.totalBsd.toLocaleString('en-SG')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
              {bsdResult.breakdown.map((b, idx) => (
                <div key={idx} className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                  <div className="text-slate-400 text-[10px]">{b.tier}</div>
                  <div className="font-mono text-slate-200 font-medium mt-0.5">
                    {b.rate} &rarr; S$ {b.amount.toLocaleString('en-SG')}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Calculated using statutory IRAS residential tiers (up to 6% for amounts above S$3,000,000). Additional Buyer's Stamp Duty (ABSD) may also apply depending on citizenship and property count.
            </p>
          </div>

          {/* Raw Endpoint Schema Representation */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>URA PMI_Resi_Transaction Record</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">service=PMI_Resi_Transaction</span>
            </div>
            <pre className="p-2.5 bg-slate-900/90 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
{JSON.stringify({
  project: property.projectName,
  street: property.street,
  marketSegment: property.region,
  transaction: {
    area: String(property.areaSqm),
    floorRange: property.floorRange,
    noOfUnits: String(property.noOfUnits),
    contractDate: property.contractDate.replace('-', '').slice(2, 4) + property.contractDate.replace('-', '').slice(4, 6) || '0125',
    typeOfSale: property.typeOfSale === 'New Sale' ? '1' : property.typeOfSale === 'Sub Sale' ? '2' : '3',
    price: String(property.priceSgd),
    propertyType: property.propertyType,
    district: property.district.replace('D', ''),
    tenure: property.tenure,
    ...(property.nettPrice ? { nettPrice: String(property.nettPrice) } : {})
  }
}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Endpoint Specifications</span>
          </button>

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
