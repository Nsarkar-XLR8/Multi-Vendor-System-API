import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import reportsService from "./reports.service";

const getTopBuyers = catchAsync(async (req, res) => {
  const result = await reportsService.getTopBuyers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Top Buyers retrieved successfully",
    data: result,
  });
});

const reportsController = {
  getTopBuyers,
};

export default reportsController;
