import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import wishlistService from "./wishlist.service";

const addToWishlist = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { productId } = req.body;
  const result = await wishlistService.addToWishlist(email, productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product added to wishlist successfully",
    data: result,
  });
});

const getWishlist = catchAsync(async (req, res) => {});

const wishlistController = {
  addToWishlist,
  getWishlist,
};

export default wishlistController;
