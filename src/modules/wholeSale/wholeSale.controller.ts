import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import wholeSaleService from "./wholeSale.service";

const addInWholeSale = catchAsync(async (req, res) => {
  const result = await wholeSaleService.addWholeSale(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Product added in ${result.type} successfully`,
    data: result,
  });
});

const getAllWholeSale = catchAsync(async (req, res) => {
  const { type, page = "1", limit = "10" } = req.query;

  const result = await wholeSaleService.getAllWholeSale({
    type: type as string,
    page: Number(page),
    limit: Number(limit),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Wholesale retrieved successfully",
    data: result,
  });
});


const wholeSaleController = {
  addInWholeSale,
  getAllWholeSale,
};

export default wholeSaleController;
