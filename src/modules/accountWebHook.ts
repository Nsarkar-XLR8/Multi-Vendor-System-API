// handlers/connectedAccountWebhookHandler.ts
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import stripeAccountHandlers from "./onboard/onboardingHandler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const connectedAccountWebhookHandler = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ONBOARDING_SECRET_KEY as string;

  if (!sig) {
    // console.error("❌ Missing stripe-signature header");
    throw new AppError(
      "Missing stripe-signature header",
      StatusCodes.BAD_REQUEST,
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      endpointSecret,
    );
    // console.log("✅ Webhook signature verified:", event.type);
  } catch (err: any) {
    // console.error("❌ Webhook signature verification failed:", err.message);
    throw new AppError(
      `Webhook Error: ${err.message}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  const { type, data, account: connectedAccountId } = event;

  try {
    // 1️ Connected account events (supplier onboarding / update)
    if (
      connectedAccountId &&
      stripeAccountHandlers[type as keyof typeof stripeAccountHandlers]
    ) {
      await stripeAccountHandlers[type as keyof typeof stripeAccountHandlers](
        data.object,
        connectedAccountId,
      );
      // console.log(`[Stripe] Handled connected account event: ${type}`);
    } else {
      // console.log(`[Stripe] No handler for event type: ${type}`);
      throw new AppError(
        `No handler for event type: ${type}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // 3️ Acknowledge receipt
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your account webhook was handled successfully",
    });
  } catch (error: any) {
    throw new AppError(
      `Webhook Error: ${error.message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
});
