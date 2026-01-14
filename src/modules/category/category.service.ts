import { StatusCodes } from "http-status-codes";
import countries from "world-countries";
import AppError from "../../errors/AppError";
import { regionMap } from "../../lib/globalType";
import generateShopSlug from "../../middleware/generateShopSlug";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import { ICategory } from "./category.interface";
import category from "./category.model";

const createCategory = async (
  payload: ICategory,
  productImg?: Express.Multer.File,
  regionImg?: Express.Multer.File
) => {
  if (!productImg || !regionImg) {
    throw new AppError(
      "Both product image and region image are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const uploadedProductImage = await uploadToCloudinary(
    productImg.path,
    "product-img"
  );

  const uploadedRegionImage = await uploadToCloudinary(
    regionImg.path,
    "region-img"
  );

  const isExistRegion = await category.findOne({
    region: { $regex: `^${payload.region}$`, $options: "i" },
  });

  if (isExistRegion) {
    throw new AppError(
      `${payload.region} already added as a region. Please add a different region`,
      StatusCodes.CONFLICT
    );
  }

  const isExistProductType = await category.findOne({
    productType: { $regex: `^${payload.productType}$`, $options: "i" },
    region: { $regex: `^${payload.region}$`, $options: "i" },
  });

  if (isExistProductType) {
    throw new AppError(
      "You already added this product type in this region",
      StatusCodes.CONFLICT
    );
  }

  const slug = generateShopSlug(payload.region || payload.productType || "");
  const regionInput = payload.region?.trim().toLowerCase() || "";
  const mappedRegion: string = regionMap[regionInput] || payload.region || "";

  const countryList = countries
    .filter(
      (c) =>
        (c.subregion &&
          c.subregion.toLowerCase() === mappedRegion.toLowerCase()) ||
        (c.region && c.region.toLowerCase() === mappedRegion.toLowerCase())
    )
    .map((c) => c.name.common);

  const result = await category.create({
    ...payload,
    slug,
    country: countryList,
    productImage: {
      url: uploadedProductImage.secure_url,
      public_id: uploadedProductImage.public_id,
    },
    regionImage: {
      url: uploadedRegionImage.secure_url,
      public_id: uploadedRegionImage.public_id,
    },
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

const updateCategory = async (
  id: string,
  payload: ICategory,
  productImg?: Express.Multer.File,
  regionImg?: Express.Multer.File
) => {
  const isCategory = await category.findById(id);
  if (!isCategory) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }

  if (productImg) {
    if (isCategory.productImage?.public_id) {
      await deleteFromCloudinary(isCategory.productImage.public_id);
    }

    const uploaded = await uploadToCloudinary(productImg.path, "product-img");
    payload.productImage = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
  }

  if (regionImg) {
    if (isCategory.regionImage?.public_id) {
      await deleteFromCloudinary(isCategory.regionImage.public_id);
    }

    const uploaded = await uploadToCloudinary(regionImg.path, "region-img");
    payload.regionImage = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
  }

  if (payload.region) {
    const isExistRegion = await category.findOne({
      _id: { $ne: id },
      region: { $regex: `^${payload.region}$`, $options: "i" },
    });

    if (isExistRegion) {
      throw new AppError(
        `${payload.region} already added as a region`,
        StatusCodes.CONFLICT
      );
    }
  }

  if (payload.productType && payload.region) {
    const isExistProductType = await category.findOne({
      _id: { $ne: id },
      productType: {
        $regex: `^${payload.productType}$`,
        $options: "i",
      },
      region: {
        $regex: `^${payload.region}$`,
        $options: "i",
      },
    });

    if (isExistProductType) {
      throw new AppError(
        "You already added this product type in this region",
        StatusCodes.CONFLICT
      );
    }
  }

  if (payload.region || payload.productType) {
    payload.slug = generateShopSlug(
      payload.region || payload.productType || ""
    );
  }

  if (payload.region) {
    const regionInput = payload.region.trim().toLowerCase();
    const mappedRegion = regionMap[regionInput] || payload.region;

    payload.country = countries
      .filter(
        (c) =>
          c.subregion?.toLowerCase() === mappedRegion.toLowerCase() ||
          c.region?.toLowerCase() === mappedRegion.toLowerCase()
      )
      .map((c) => c.name.common);
  }

  const result = await category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

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
