import { StatusCodes } from "http-status-codes";
import countries from "world-countries";
import AppError from "../../errors/AppError";
import generateShopSlug from "../../middleware/generateShopSlug";
import { ICategory } from "./category.interface";
import category from "./category.model";
import { regionMap } from "../../lib/globalType";

// const createCategory = async (payload: ICategory) => {
//   const isExistRegion = await category.findOne({
//     name: { $regex: `^${payload.region}$`, $options: "i" },
//   });

//   if (isExistRegion) {
//     throw new AppError(
//       `${payload.region} category already exists`,
//       StatusCodes.CONFLICT
//     );
//   }

//   const isExistProductType = await category.findOne({
//     name: { $regex: `^${payload.productType}$`, $options: "i" },
//   });

//   if (isExistProductType) {
//     throw new AppError(
//       `${payload.productType} category already exists ${payload.region}`,
//       StatusCodes.CONFLICT
//     );
//   }

//   const slug = generateShopSlug(payload.region || payload.productType || "");

//   const result = await category.create({
//     ...payload,
//     slug,
//   });

//   return result;
// };

const createCategory = async (payload: ICategory) => {
  // Check if region already exists
  const isExistRegion = await category.findOne({
    region: { $regex: `^${payload.region}$`, $options: "i" },
  });

  if (isExistRegion) {
    throw new AppError(
      `${payload.region} category already exists`,
      StatusCodes.CONFLICT
    );
  }

  // Check if productType already exists
  const isExistProductType = await category.findOne({
    productType: { $regex: `^${payload.productType}$`, $options: "i" },
  });

  if (isExistProductType) {
    throw new AppError(
      `${payload.productType} category already exists in ${payload.region}`,
      StatusCodes.CONFLICT
    );
  }

  // Generate slug
  const slug = generateShopSlug(payload.region || payload.productType || "");

  // 1️⃣ Normalize input
  const regionInput = payload.region?.toLowerCase().trim() || "";

  // 2️⃣ Map to correct region/subregion name
  const mappedRegion = regionMap[regionInput] || payload.region;

  // 3️⃣ Find countries dynamically
  const countryList = countries
    .filter(
      (c) =>
        c.subregion === mappedRegion || // check subregion first
        c.region === mappedRegion // then check region
    )
    .map((c) => c.name.common);

  // 4️⃣ Create category
  const result = await category.create({
    ...payload,
    slug,
    country: countryList,
  });

  return result;
};

const getCategories = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    category.countDocuments(),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const updateCategory = async (id: string, payload: ICategory) => {
  const isCategory = await category.findById(id);
  if (!isCategory) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }

  if (payload.productName) {
    payload.slug = generateShopSlug(
      payload.region || payload.productType || ""
    );
  }

  const result = await category.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategory = async (id: string) => {
  throw new AppError(
    "Here some logic part will be added don't worry",
    StatusCodes.BAD_REQUEST
  );

  const isCategory = await category.findById(id);
  if (!isCategory) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }

  await category.findByIdAndDelete(id);
};

const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

export default categoryService;
