import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import Subscription from './subscription.model'
import sendEmail from '../../utils/sendEmail';

const createSubscription = async (email: string) => {
  const isSubscribe = await Subscription.findOne({ email });

  if (isSubscribe) {
    throw new AppError("This email is already subscribed!", StatusCodes.CONFLICT);
  }
  const result = await Subscription.create({ email });
  return result;

};


const getAllSubscriptionFromDb = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Subscription.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Subscription.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    result,
  };
};

const sendBulkEmail = async (subject: string, html: string) => {
  const subscribers = await Subscription.find({}, "email");

  
  
  // We use Promise.all to send emails in parallel for better performance
  const emailPromises = subscribers.map((sub) =>
    sendEmail({
      to: sub.email,
      subject,
      html,
    })
  );

  const results = await Promise.all(emailPromises);
  return results;
};

const sendIndividualEmail = async (id: string, subject: string, html: string) => {
  const subscriber = await Subscription.findById(id);
  if (!subscriber) throw new AppError("Subscription not found", 404);
  
  return await sendEmail({
    to: subscriber.email,
    subject,
    html: html,
  });
};

const deleteSubcriptionFromDb = async (id: string) => {
  return await Subscription.findByIdAndDelete(id);
}

const subscriptionService = {
  createSubscription,
  getAllSubscriptionFromDb,
  deleteSubcriptionFromDb,
  sendBulkEmail,
  sendIndividualEmail
};

export default subscriptionService;
