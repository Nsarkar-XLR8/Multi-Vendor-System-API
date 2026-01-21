import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Order from "../order/order.model";
import { User } from "../user/user.model";
import { IPayment } from "./payment.interface";

const createPayment = async (payload: IPayment, email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Account not found", StatusCodes.NOT_FOUND);
  }

  if (user.isVerified === false) {
    throw new AppError("Please verify your account", StatusCodes.FORBIDDEN);
  }

  if (user.isSuspended === true) {
    throw new AppError(
      "Account has been suspended.Contact support for help",
      StatusCodes.FORBIDDEN,
    );
  }

  // Proceed with payment creation logic here
  const order = await Order.findOne({ _id: payload.orderId, userId: user._id });
  if (!order) {
    throw new AppError("Order not found", StatusCodes.NOT_FOUND);
  }
};

const paymentService = {
  createPayment,
};

export default paymentService;
