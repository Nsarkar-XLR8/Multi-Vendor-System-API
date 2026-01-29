import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import supplierSettlementService from "./supplierSettlement.service";

const getAllSupplierSettlements = catchAsync(async (req, res) => {
  const result = await supplierSettlementService.getAllSupplierSettlements();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier Settlements retrieved successfully",
    data: result,
  });
});

const supplierSettlementController = {
  getAllSupplierSettlements,
};

export default supplierSettlementController;
