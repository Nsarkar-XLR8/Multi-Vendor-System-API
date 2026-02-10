export interface IImage {
  public_id: string;
  url: string;
}

// product type inside a region
export interface IProductCategory {
  productType: string;
  productName: string[];
  productImage: IImage;
}

// main category interface
export interface ICategory {
  region: string;
  slug: string;
  categories: IProductCategory[];
  productImage?: {
    public_id?: string;
    url?: string;
  };
  regionImage?: {
    public_id?: string;
    url?: string;
  };
  country?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
