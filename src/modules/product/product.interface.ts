export interface IProduct {
  name: string;
  description: string;
  slug: string;
  images: {
    public_id: string;
    url: string;
  }[];
  stock: number;
  inStock: boolean;
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  isApproved: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}
