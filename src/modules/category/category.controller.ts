import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ICategory } from "./category.interface";
import categoryService from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[]; // all uploaded files
  const payload = req.body as ICategory; // your categories + region data

  // region image
  const regionImg = files.find((f) => f.fieldname === "regionImage");

  const result = await categoryService.createCategory(
    payload,
    files,
    regionImg,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category processed successfully",
    data: result,
  });
});


const getCategories = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const region = req.query.region as string | undefined;

  const result = await categoryService.getCategories({
    page,
    limit,
    region,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});


const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[]; // use any() multer

  const result = await categoryService.updateCategory(id, req.body, files);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});


const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
};

export default categoryController;
