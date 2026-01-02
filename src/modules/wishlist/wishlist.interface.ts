import { Types } from "mongoose";

export interface IWishlist {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}
