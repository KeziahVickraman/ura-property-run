/**
 * Authentic URA Data Service Batch 1 Sample Dataset
 * Service: PMI_Resi_Transaction
 * Endpoint: https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1
 * 
 * Provides official schema structure:
 * {
 *   "Status": "Success",
 *   "Result": [
 *     {
 *       "street": string,
 *       "project": string,
 *       "marketSegment": "CCR" | "RCR" | "OCR",
 *       "x": string,
 *       "y": string,
 *       "transaction": [
 *         {
 *           "area": string (sqm),
 *           "floorRange": string,
 *           "noOfUnits": string,
 *           "contractDate": string (MMYY e.g. "0125"),
 *           "typeOfSale": string ("1" = New Sale, "2" = Sub Sale, "3" = Resale),
 *           "price": string (SGD),
 *           "propertyType": string,
 *           "district": string,
 *           "tenure": string,
 *           "nettPrice"?: string
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

export interface UraRawTransactionItem {
  area: string;
  floorRange: string;
  noOfUnits: string;
  contractDate: string;
  typeOfSale: string;
  price: string;
  propertyType: string;
  district: string;
  tenure: string;
  nettPrice?: string;
}

export interface UraRawProject {
  street: string;
  project: string;
  marketSegment: 'CCR' | 'RCR' | 'OCR';
  x?: string;
  y?: string;
  transaction: UraRawTransactionItem[];
}

export const URA_BATCH_1_DATA: UraRawProject[] = [
  {
    street: "CAIRNHILL ROAD",
    project: "THE RITZ-CARLTON RESIDENCES SINGAPORE CAIRNHILL",
    marketSegment: "CCR",
    x: "27850",
    y: "32100",
    transaction: [
      {
        area: "263",
        floorRange: "31-35",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "10380000",
        propertyType: "Condominium",
        district: "09",
        tenure: "Freehold"
      },
      {
        area: "263",
        floorRange: "26-30",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "9980000",
        propertyType: "Condominium",
        district: "09",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "MARINA WAY",
    project: "MARINA ONE RESIDENCES",
    marketSegment: "CCR",
    x: "29840",
    y: "29210",
    transaction: [
      {
        area: "106",
        floorRange: "26-30",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "2850000",
        propertyType: "Apartment",
        district: "01",
        tenure: "99 yrs lease commencing from 2011"
      },
      {
        area: "67",
        floorRange: "21-25",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "1720000",
        propertyType: "Apartment",
        district: "01",
        tenure: "99 yrs lease commencing from 2011"
      },
      {
        area: "141",
        floorRange: "31-35",
        noOfUnits: "1",
        contractDate: "1024",
        typeOfSale: "3",
        price: "3900000",
        propertyType: "Apartment",
        district: "01",
        tenure: "99 yrs lease commencing from 2011"
      }
    ]
  },
  {
    street: "PATERSON HILL",
    project: "THE MARQ ON PATERSON HILL",
    marketSegment: "CCR",
    x: "27310",
    y: "31680",
    transaction: [
      {
        area: "288",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "13950000",
        propertyType: "Condominium",
        district: "09",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "ORCHARD BOULEVARD",
    project: "BOULEVARD 88",
    marketSegment: "CCR",
    x: "26920",
    y: "31840",
    transaction: [
      {
        area: "165",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "0225",
        typeOfSale: "3",
        price: "6800000",
        propertyType: "Condominium",
        district: "10",
        tenure: "Freehold"
      },
      {
        area: "258",
        floorRange: "21-25",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "11250000",
        propertyType: "Condominium",
        district: "10",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "FARRER ROAD",
    project: "LEEDON GREEN",
    marketSegment: "CCR",
    x: "24980",
    y: "32750",
    transaction: [
      {
        area: "97",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "1",
        price: "2980000",
        propertyType: "Condominium",
        district: "10",
        tenure: "Freehold",
        nettPrice: "2950000"
      },
      {
        area: "66",
        floorRange: "01-05",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "1",
        price: "2050000",
        propertyType: "Condominium",
        district: "10",
        tenure: "Freehold"
      },
      {
        area: "139",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "1",
        price: "4320000",
        propertyType: "Condominium",
        district: "10",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "TAN QUEE LAN STREET",
    project: "MIDTOWN MODERN",
    marketSegment: "CCR",
    x: "30150",
    y: "31420",
    transaction: [
      {
        area: "55",
        floorRange: "21-25",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "2",
        price: "1680000",
        propertyType: "Condominium",
        district: "07",
        tenure: "99 yrs lease commencing from 2019"
      },
      {
        area: "99",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "2",
        price: "2820000",
        propertyType: "Condominium",
        district: "07",
        tenure: "99 yrs lease commencing from 2019"
      }
    ]
  },
  {
    street: "MAKEWAY AVENUE",
    project: "KOPAR AT NEWTON",
    marketSegment: "CCR",
    x: "28410",
    y: "33180",
    transaction: [
      {
        area: "89",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "2430000",
        propertyType: "Condominium",
        district: "09",
        tenure: "99 yrs lease commencing from 2019"
      },
      {
        area: "102",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "2780000",
        propertyType: "Condominium",
        district: "09",
        tenure: "99 yrs lease commencing from 2019"
      }
    ]
  },
  {
    street: "WALLICH STREET",
    project: "WALLICH RESIDENCE",
    marketSegment: "CCR",
    x: "29280",
    y: "28790",
    transaction: [
      {
        area: "163",
        floorRange: "56-60",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "6350000",
        propertyType: "Apartment",
        district: "02",
        tenure: "99 yrs lease commencing from 2011"
      }
    ]
  },
  {
    street: "AMBER GARDENS",
    project: "AMBER PARK",
    marketSegment: "RCR",
    x: "34850",
    y: "31320",
    transaction: [
      {
        area: "112",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "3150000",
        propertyType: "Condominium",
        district: "15",
        tenure: "Freehold"
      },
      {
        area: "43",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "1280000",
        propertyType: "Condominium",
        district: "15",
        tenure: "Freehold"
      },
      {
        area: "146",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1024",
        typeOfSale: "3",
        price: "3920000",
        propertyType: "Condominium",
        district: "15",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "SILAT AVENUE",
    project: "AVENUE SOUTH RESIDENCE",
    marketSegment: "RCR",
    x: "27810",
    y: "28650",
    transaction: [
      {
        area: "68",
        floorRange: "36-40",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1690000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "88",
        floorRange: "21-25",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "2080000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "103",
        floorRange: "46-50",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "2540000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2018"
      }
    ]
  },
  {
    street: "PRINCE CHARLES CRESCENT",
    project: "PRINCIPAL GARDEN",
    marketSegment: "RCR",
    x: "26480",
    y: "30220",
    transaction: [
      {
        area: "74",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1740000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2014"
      },
      {
        area: "111",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "2480000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2014"
      }
    ]
  },
  {
    street: "NORMANTON PARK",
    project: "NORMANTON PARK",
    marketSegment: "RCR",
    x: "22890",
    y: "29750",
    transaction: [
      {
        area: "61",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1280000",
        propertyType: "Condominium",
        district: "05",
        tenure: "99 yrs lease commencing from 2019"
      },
      {
        area: "99",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "1960000",
        propertyType: "Condominium",
        district: "05",
        tenure: "99 yrs lease commencing from 2019"
      },
      {
        area: "122",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1024",
        typeOfSale: "3",
        price: "2350000",
        propertyType: "Condominium",
        district: "05",
        tenure: "99 yrs lease commencing from 2019"
      }
    ]
  },
  {
    street: "BIDADARI PARK DRIVE",
    project: "THE WOODLEIGH RESIDENCES",
    marketSegment: "RCR",
    x: "31890",
    y: "35480",
    transaction: [
      {
        area: "80",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1860000",
        propertyType: "Condominium",
        district: "13",
        tenure: "99 yrs lease commencing from 2017"
      },
      {
        area: "119",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "2680000",
        propertyType: "Condominium",
        district: "13",
        tenure: "99 yrs lease commencing from 2017"
      }
    ]
  },
  {
    street: "STIRLING ROAD",
    project: "STIRLING RESIDENCES",
    marketSegment: "RCR",
    x: "25850",
    y: "29870",
    transaction: [
      {
        area: "61",
        floorRange: "26-30",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1380000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2017"
      },
      {
        area: "98",
        floorRange: "31-35",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "2160000",
        propertyType: "Condominium",
        district: "03",
        tenure: "99 yrs lease commencing from 2017"
      }
    ]
  },
  {
    street: "SIMS AVENUE",
    project: "PARC ESTA",
    marketSegment: "RCR",
    x: "34120",
    y: "32890",
    transaction: [
      {
        area: "69",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1520000",
        propertyType: "Condominium",
        district: "14",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "95",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "1980000",
        propertyType: "Condominium",
        district: "14",
        tenure: "99 yrs lease commencing from 2018"
      }
    ]
  },
  {
    street: "TAMPINES STREET 11",
    project: "TREASURE AT TAMPINES",
    marketSegment: "OCR",
    x: "38920",
    y: "36450",
    transaction: [
      {
        area: "85",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1450000",
        propertyType: "Condominium",
        district: "18",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "54",
        floorRange: "01-05",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "960000",
        propertyType: "Condominium",
        district: "18",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "115",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "1880000",
        propertyType: "Condominium",
        district: "18",
        tenure: "99 yrs lease commencing from 2018"
      }
    ]
  },
  {
    street: "JALAN LEMPENG",
    project: "PARC CLEMATIS",
    marketSegment: "OCR",
    x: "20780",
    y: "32650",
    transaction: [
      {
        area: "81",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1620000",
        propertyType: "Condominium",
        district: "05",
        tenure: "99 yrs lease commencing from 2019"
      },
      {
        area: "100",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "1920000",
        propertyType: "Condominium",
        district: "05",
        tenure: "99 yrs lease commencing from 2019"
      }
    ]
  },
  {
    street: "COMPASSVALE BOW",
    project: "SENGKANG GRAND RESIDENCES",
    marketSegment: "OCR",
    x: "33890",
    y: "39120",
    transaction: [
      {
        area: "87",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1650000",
        propertyType: "Condominium",
        district: "19",
        tenure: "99 yrs lease commencing from 2018"
      },
      {
        area: "58",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "3",
        price: "1180000",
        propertyType: "Condominium",
        district: "19",
        tenure: "99 yrs lease commencing from 2018"
      }
    ]
  },
  {
    street: "TAMPINES STREET 62",
    project: "TENET",
    marketSegment: "OCR",
    x: "39450",
    y: "38120",
    transaction: [
      {
        area: "102",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "1",
        price: "1480000",
        propertyType: "Executive Condominium",
        district: "18",
        tenure: "99 yrs lease commencing from 2022"
      },
      {
        area: "127",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "1",
        price: "1820000",
        propertyType: "Executive Condominium",
        district: "18",
        tenure: "99 yrs lease commencing from 2022"
      }
    ]
  },
  {
    street: "BUKIT BATOK WEST AVENUE 8",
    project: "ALTURA",
    marketSegment: "OCR",
    x: "19450",
    y: "36780",
    transaction: [
      {
        area: "98",
        floorRange: "11-15",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "1",
        price: "1420000",
        propertyType: "Executive Condominium",
        district: "23",
        tenure: "99 yrs lease commencing from 2022"
      },
      {
        area: "112",
        floorRange: "06-10",
        noOfUnits: "1",
        contractDate: "1124",
        typeOfSale: "1",
        price: "1630000",
        propertyType: "Executive Condominium",
        district: "23",
        tenure: "99 yrs lease commencing from 2022"
      }
    ]
  },
  {
    street: "BELGRAVIA DRIVE",
    project: "BELGRAVIA GREEN",
    marketSegment: "OCR",
    x: "31240",
    y: "38920",
    transaction: [
      {
        area: "318",
        floorRange: "-",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "3680000",
        propertyType: "Terrace House",
        district: "28",
        tenure: "Freehold"
      },
      {
        area: "345",
        floorRange: "-",
        noOfUnits: "1",
        contractDate: "1024",
        typeOfSale: "3",
        price: "3980000",
        propertyType: "Semi-Detached House",
        district: "28",
        tenure: "Freehold"
      }
    ]
  },
  {
    street: "EVERTON ROAD",
    project: "SKY EVERTON",
    marketSegment: "RCR",
    x: "28560",
    y: "28670",
    transaction: [
      {
        area: "62",
        floorRange: "21-25",
        noOfUnits: "1",
        contractDate: "0125",
        typeOfSale: "3",
        price: "1720000",
        propertyType: "Condominium",
        district: "02",
        tenure: "Freehold"
      },
      {
        area: "85",
        floorRange: "16-20",
        noOfUnits: "1",
        contractDate: "1224",
        typeOfSale: "3",
        price: "2340000",
        propertyType: "Condominium",
        district: "02",
        tenure: "Freehold"
      }
    ]
  }
];
