export interface ICategory {
  region?: string;
  slug?: string;
  productImage: {
    public_id: string;
    url: string;
  };
  regionImage: {
    public_id: string;
    url: string;
  };
  productType?: string;
  productName?: string[];
  country?: string[];
}
