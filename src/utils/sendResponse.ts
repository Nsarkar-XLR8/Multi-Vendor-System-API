import { Response } from "express";

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  analytics?: any;
  meta?: TMeta;
  recentOrders?: any;
  filters?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    data: data.data,
    analytics: data.analytics,
    meta: data?.meta,
    recentOrders: data?.recentOrders,
    filters: data?.filters,
  });
};

export default sendResponse;
