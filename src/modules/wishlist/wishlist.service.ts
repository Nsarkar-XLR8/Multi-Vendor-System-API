import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Product from "../product/product.model";
import { User } from "../user/user.model";
import Wishlist from "./wishlist.model";

const addToWishlist = async (email: string, productId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Your account does not exist", StatusCodes.NOT_FOUND);
  }

  const isProductExist = await Product.findById(productId);
  if (!isProductExist) {
    throw new AppError("Product not found", StatusCodes.NOT_FOUND);
  }

  const result = await Wishlist.create({ userId: user._id, productId });
  return result;
};

const getWishlist = async () => {};

const wishlistService = {
  addToWishlist,
  getWishlist,
};

export default wishlistService;
