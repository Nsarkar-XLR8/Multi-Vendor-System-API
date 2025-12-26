import { Types } from "mongoose";

export interface IProductImage {
  public_id: string;
  url: string;
}

export interface IProductVariant {
  label: string; 
  price: number;
  stock: number;
  sku?: string;
  unit: string;
  minOrderQty?: number;
}

export interface ISEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface IProduct {
  _id?: Types.ObjectId;
  supplierId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  images: IProductImage[];
  regionCategory: Types.ObjectId;
  productType: string;
  variants: IProductVariant[];
  priceFrom?: number;
  shelfLife?: string;
  originCountry?: string;
  isHalal: boolean;
  isOrganic: boolean;
  isFrozen?: boolean;
  seo: ISEO;
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}
