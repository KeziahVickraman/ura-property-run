import { DistrictDefinition } from '../types/property';

export const SINGAPORE_DISTRICTS: DistrictDefinition[] = [
  // CCR (Core Central Region)
  {
    district: 'D01',
    name: 'Raffles Place, Marina Bay, Boat Quay',
    region: 'CCR',
    postalSectors: ['01', '02', '03', '04', '05', '06'],
    description: 'Financial district, waterfront luxury residential residences & heritage conservation shophouses.'
  },
  {
    district: 'D02',
    name: 'Tanjong Pagar, Chinatown, Anson',
    region: 'CCR',
    postalSectors: ['07', '08'],
    description: 'CBD edge, high-rise skyscrapers, historic Chinatown enclaves, and chic city apartments.'
  },
  {
    district: 'D06',
    name: 'City Hall, High Street, Beach Road',
    region: 'CCR',
    postalSectors: ['17'],
    description: 'Civic district, arts and heritage hub, premier central shopping malls.'
  },
  {
    district: 'D09',
    name: 'Orchard, Cairnhill, River Valley',
    region: 'CCR',
    postalSectors: ['22', '23'],
    description: 'Singapore\'s premier luxury shopping boulevard, prestigious ultra-high-net-worth residences.'
  },
  {
    district: 'D10',
    name: 'Tanglin, Holland, Bukit Timah',
    region: 'CCR',
    postalSectors: ['24', '25', '26', '27'],
    description: 'Good Class Bungalow (GCB) zones, embassies, top schools, and lush leafy estates.'
  },
  {
    district: 'D11',
    name: 'Newton, Novena, Dunearn',
    region: 'CCR',
    postalSectors: ['28', '29', '30'],
    description: 'Medical health hub, premier schools corridor, Newton Food Centre and central condominiums.'
  },

  // RCR (Rest of Central Region)
  {
    district: 'D03',
    name: 'Queenstown, Tiong Bahru, Alexandra',
    region: 'RCR',
    postalSectors: ['14', '15', '16'],
    description: 'Art Deco heritage cafes, Singapore\'s first satellite town, city-fringe living.'
  },
  {
    district: 'D04',
    name: 'HarbourFront, Telok Blangah, Sentosa',
    region: 'RCR',
    postalSectors: ['09', '10'],
    description: 'Sentosa Cove oceanfront villas, Keppel Bay marina condos, Mount Faber greenery.'
  },
  {
    district: 'D05',
    name: 'Buona Vista, West Coast, Clementi',
    region: 'RCR',
    postalSectors: ['11', '12', '13'],
    description: 'one-north innovation hub, National University of Singapore (NUS) belt.'
  },
  {
    district: 'D07',
    name: 'Bugis, Rochor, Middle Road',
    region: 'RCR',
    postalSectors: ['18', '19'],
    description: 'Vibrant cultural, culinary, and commercial arts quarter with new mixed mega-developments.'
  },
  {
    district: 'D08',
    name: 'Little India, Farrer Park, Serangoon Rd',
    region: 'RCR',
    postalSectors: ['20', '21'],
    description: 'Rich ethnic heritage enclave, medical centers, vibrant street-level commerce.'
  },
  {
    district: 'D12',
    name: 'Balestier, Toa Payoh, Serangoon',
    region: 'RCR',
    postalSectors: ['31', '32', '33'],
    description: 'Central city-fringe mature estates with famed local dining and historical landmarks.'
  },
  {
    district: 'D13',
    name: 'Macpherson, Braddell, Potong Pasir',
    region: 'RCR',
    postalSectors: ['34', '35', '36', '37'],
    description: 'Bidadari rejuvenation belt, peaceful city fringe with excellent MRT connectivity.'
  },
  {
    district: 'D14',
    name: 'Geylang, Paya Lebar, Eunos',
    region: 'RCR',
    postalSectors: ['38', '39', '40', '41'],
    description: 'Paya Lebar commercial sub-regional hub, vibrant east-fringe living.'
  },
  {
    district: 'D15',
    name: 'Katong, Joo Chiat, Marine Parade, East Coast',
    region: 'RCR',
    postalSectors: ['42', '43', '44', '45'],
    description: 'Peranakan heritage, East Coast Park beachside lifestyle, highly coveted private residential belt.'
  },
  {
    district: 'D20',
    name: 'Bishan, Ang Mo Kio, Thomson',
    region: 'RCR',
    postalSectors: ['56', '57'],
    description: 'Central nature parks (MacRitchie, Lower Peirce), elite schools, popular landed & condo estates.'
  },

  // OCR (Outside Central Region)
  {
    district: 'D16',
    name: 'Bedok, Upper East Coast, Bayshore',
    region: 'OCR',
    postalSectors: ['46', '47', '48'],
    description: 'Upcoming Bayshore transformation, established eastern coastal condominiums.'
  },
  {
    district: 'D17',
    name: 'Loyang, Changi',
    region: 'OCR',
    postalSectors: ['49', '50'],
    description: 'Changi Aviation Hub, coastal seaside living, peaceful rustic eastern enclave.'
  },
  {
    district: 'D18',
    name: 'Tampines, Pasir Ris',
    region: 'OCR',
    postalSectors: ['51', '52'],
    description: 'Regional financial & lifestyle hub of the East, parks and beaches.'
  },
  {
    district: 'D19',
    name: 'Serangoon Garden, Hougang, Punggol, Sengkang',
    region: 'OCR',
    postalSectors: ['53', '54', '55', '82'],
    description: 'Punggol Digital District, Serangoon chomp chomp food haven, high transaction volume.'
  },
  {
    district: 'D21',
    name: 'Upper Bukit Timah, Clementi Park, Ulu Pandan',
    region: 'OCR',
    postalSectors: ['58', '59'],
    description: 'Lush greenery, nature reserves, Rail Corridor, prestigious quiet condominiums.'
  },
  {
    district: 'D22',
    name: 'Jurong, Boon Lay, Tuas',
    region: 'OCR',
    postalSectors: ['60', '61', '62', '63', '64'],
    description: 'Jurong Lake District (Singapore\'s 2nd CBD), high growth potential, lakeside leisure.'
  },
  {
    district: 'D23',
    name: 'Bukit Batok, Bukit Panjang, Choa Chu Kang',
    region: 'OCR',
    postalSectors: ['65', '66', '67', '68'],
    description: 'Green corridors, quarries, nature parks, affordable private residential options.'
  },
  {
    district: 'D24',
    name: 'Lim Chu Kang, Tengah',
    region: 'OCR',
    postalSectors: ['69', '70', '71'],
    description: 'Tengah Forest Town, Singapore\'s first car-free eco-town in development.'
  },
  {
    district: 'D25',
    name: 'Kranji, Woodgrove, Woodlands',
    region: 'OCR',
    postalSectors: ['72', '73'],
    description: 'Woodlands Regional Centre, RTS Link cross-border gateway to Johor Bahru.'
  },
  {
    district: 'D26',
    name: 'Mandai, Upper Thomson, Springleaf',
    region: 'OCR',
    postalSectors: ['77', '78'],
    description: 'Mandai wildlife reserve, peaceful landed enclaves, nature reservoir corridors.'
  },
  {
    district: 'D27',
    name: 'Yishun, Sembawang',
    region: 'OCR',
    postalSectors: ['75', '76'],
    description: 'Hot springs, northern waterfront development, family-friendly private enclaves.'
  },
  {
    district: 'D28',
    name: 'Seletar, Yio Chu Kang',
    region: 'OCR',
    postalSectors: ['79', '80'],
    description: 'Seletar Aerospace Park, colonial black-and-white bungalows, tranquil cafe lifestyle.'
  }
];

export const REGION_METADATA = {
  CCR: {
    code: 'CCR',
    name: 'Core Central Region',
    description: 'High-end luxury districts including Orchard, Marina Bay, Sentosa, and Bukit Timah.',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  RCR: {
    code: 'RCR',
    name: 'Rest of Central Region',
    description: 'City fringe districts including East Coast, Queenstown, Novena, and Kallang.',
    color: 'sky',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
  },
  OCR: {
    code: 'OCR',
    name: 'Outside Central Region',
    description: 'Suburban districts including Jurong, Woodlands, Tampines, and Punggol.',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  }
} as const;

export const PROPERTY_TYPES = [
  'Condominium',
  'Apartment',
  'Executive Condominium',
  'Detached House',
  'Semi-Detached House',
  'Terrace House',
  'Good Class Bungalow'
] as const;

export const TENURE_TYPES = [
  'Freehold',
  '999-Year Leasehold',
  '99-Year Leasehold',
  'Custom Leasehold'
] as const;

export const SALE_TYPES = [
  'New Sale',
  'Resale',
  'Sub Sale'
] as const;
