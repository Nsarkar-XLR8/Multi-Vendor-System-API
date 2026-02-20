export const companyName = "Vendo Food";

// Add more mappings to regionMap for common variations
export const regionMap: Record<string, string> = {
  // Africa variations
  "east africa": "Eastern Africa",
  "eastern africa": "Eastern Africa",
  "west africa": "Western Africa",
  "western africa": "Western Africa",
  "north africa": "Northern Africa",
  "northern africa": "Northern Africa",
  "south africa": "Southern Africa", // Note: This is a country, but keeping as region
  "southern africa": "Southern Africa",
  "central africa": "Middle Africa",
  "middle africa": "Middle Africa",
  "african": "Africa", // Add mapping for "African"
  "africa": "Africa",
  "african food": "Africa", // Handle the specific case
  
  // Asia variations
  "southern asia": "Southern Asia",
  "south asia": "Southern Asia",
  "southeast asia": "Southeast Asia",
  "south east asia": "Southeast Asia",
  "eastern asia": "Eastern Asia",
  "east asia": "Eastern Asia",
  "western asia": "Western Asia",
  "west asia": "Western Asia",
  "asia": "Asia",
  "asian": "Asia",
  
  // Europe variations
  "northern europe": "Northern Europe",
  "north europe": "Northern Europe",
  "southern europe": "Southern Europe",
  "south europe": "Southern Europe",
  "eastern europe": "Eastern Europe",
  "east europe": "Eastern Europe",
  "western europe": "Western Europe",
  "west europe": "Western Europe",
  "europe": "Europe",
  "european": "Europe",
  
  // Americas variations
  "north america": "Americas",
  "south america": "Americas",
  "central america": "Central America",
  "caribbean": "Caribbean",
  "americas": "Americas",
  "american": "Americas",
  
  // Oceania variations
  "australia and new zealand": "Australia and New Zealand",
  "australia": "Australia and New Zealand",
  "new zealand": "Australia and New Zealand",
  "melanesia": "Melanesia",
  "micronesia": "Micronesia",
  "polynesia": "Polynesia",
  "oceania": "Oceania",
  
  "antarctica": "Antarctica",
};

// Helper: sanitize client input
export const sanitizeRegion = (region: string) => {
  return region
    .toLowerCase()
    .replace(/food|region|and|-/g, "") // remove unwanted words
    .replace(/\s+/g, " ") // replace multiple spaces with single space
    .trim();
};

export interface IGetWholesaleParams {
  type?: string;
  page?: number;
  limit?: number;
}

import { Types } from "mongoose";

export interface IWholesalePopulated {
  _id: Types.ObjectId;
  type: "case" | "pallet";
  caseItems?: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    discount?: number;
  }[];
  palletItems?: {
    palletName: string;
    items: {
      productId: Types.ObjectId;
      caseQuantity: number;
    }[];
    totalCases: number;
    price: number;
  }[];
}

export type OrderItemInput = {
  productId: Types.ObjectId;
  supplierId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  variantId?: Types.ObjectId;
  wholesaleId?: Types.ObjectId;
};
