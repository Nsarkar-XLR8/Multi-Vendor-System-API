import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import subscriptionService from "./subscription.service";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await subscriptionService.createSubscription(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Thank you for the subscription",
    data: result,
  });
});

const getAllSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await subscriptionService.getAllSubscriptionFromDb(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscribers retrieved successfully!",
    meta: result.meta,
    data: result.result,
  });
});

const sendBulkEmail = catchAsync(async (req: Request, res: Response) => {
  const { subject, html } = req.body;

  if (!subject || !html) {
    throw new AppError(
      "Please provide both subject and html content",
      StatusCodes.BAD_REQUEST
    );
  }

  await subscriptionService.sendBulkEmail(subject, html);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Bulk emails sent successfully!",
  });
});

const sendIndividualEmail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, html } = req.body;

  if (!subject || !html) {
    throw new AppError(
      "Subject and HTML are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const result = await subscriptionService.sendIndividualEmail(
    id,
    subject,
    html
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Email sent to individual subscriber!",
    data: result,
  });
});

const deleteSubcription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subscriptionService.deleteSubcriptionFromDb(id);

  if (!result) {
    throw new AppError("Subscription not found", StatusCodes.NOT_FOUND);
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscription deleted successfully.",
    data: result,
  });
});

const subscriptionController = {
  createSubscription,
  getAllSubscription,
  deleteSubcription,
  sendBulkEmail,
  sendIndividualEmail,
};

export default subscriptionController;
