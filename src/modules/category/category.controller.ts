import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ICategory } from "./category.interface";
import categoryService from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[]; // all uploaded files
  const payload = req.body as ICategory;

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
  const productType = req.query.productType as string | undefined;

  const result = await categoryService.getCategories({
    page,
    limit,
    region,
    productType,
  });


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All categories retrieved successfully",
    data: result.data,
    meta: result.meta,
    filters: result.filters,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];

  const result = await categoryService.updateCategory(id, req.body, files);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});


const getCategoryRegion = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryRegion();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All category regions retrieved successfully",
    data: result,
  });
});





const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  getCategoryRegion,
};

export default categoryController;
