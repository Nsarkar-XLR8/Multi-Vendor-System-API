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
  files: Express.Multer.File[],
  regionImg?: Express.Multer.File,
) => {
  const regionName = payload.region.trim();

  // 🔍 check if region exists
  const existingRegion = await category.findOne({
    region: { $regex: `^${regionName}$`, $options: "i" },
  });

  // Helper: map files by fieldname
  const filesMap: { [key: string]: Express.Multer.File } = {};
  files.forEach((f) => {
    filesMap[f.fieldname] = f;
  });

  // Upload productType images
  const categoriesWithImages = await Promise.all(
    payload.categories.map(async (cat, index) => {
      const fileKey = `categories[${index}][productTypeImage]`;
      const productFile = filesMap[fileKey];
      if (!productFile)
        throw new AppError(
          `ProductType image missing for ${cat.productType}`,
          400,
        );

      const uploaded = await uploadToCloudinary(
        productFile.path,
        "product-type-img",
      );

      return {
        productType: cat.productType,
        productName: cat.productName,
        productImage: {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        },
      };
    }),
  );

  // 🟢 CASE 1: Region exists → just push new productTypes
  if (existingRegion) {
    for (const cat of categoriesWithImages) {
      const alreadyProductType = existingRegion.categories.find(
        (c) => c.productType.toLowerCase() === cat.productType.toLowerCase(),
      );
      if (alreadyProductType) {
        throw new AppError(
          `Product type '${cat.productType}' already exists in ${regionName}`,
          409,
        );
      }
      existingRegion.categories.push(cat);
    }
    await existingRegion.save();
    return existingRegion;
  }

  // 🟢 CASE 2: New region → region image required
  if (!regionImg)
    throw new AppError("Region image is required for new region", 400);

  const uploadedRegionImage = await uploadToCloudinary(
    regionImg.path,
    "region-img",
  );

  const slug = generateShopSlug(regionName);
  const regionInput = regionName.toLowerCase();
  const mappedRegion = regionMap[regionInput] || regionName;

  const countryList = countries
    .filter(
      (c) =>
        c.subregion?.toLowerCase() === mappedRegion.toLowerCase() ||
        c.region?.toLowerCase() === mappedRegion.toLowerCase(),
    )
    .map((c) => c.name.common);

  // Create new region with productTypes
  const result = await category.create({
    region: regionName,
    slug,
    categories: categoriesWithImages,
    country: countryList,
    regionImage: {
      url: uploadedRegionImage.secure_url,
      public_id: uploadedRegionImage.public_id,
    },
  });

  return result;
};


interface IGetCategoriesParams {
  page: number;
  limit: number;
  region?: string;
  productType?: string;
}

const getCategories = async ({
  page,
  limit,
  region,
  productType,
}: IGetCategoriesParams) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, any> = {};

  if (region) {
    filter.region = { $regex: new RegExp(`^${region}$`, "i") };
  }

  const [data, total] = await Promise.all([
    category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    category.countDocuments(filter),
  ]);

  const totalPage = Math.ceil(total / limit);

  let allProductTypes: string[] = [];
  let allProductNames: string[] = [];

  // ✅ If region filter exists
  if (region && data.length > 0) {
    const regionData = data[0];

    if (productType) {
      // 🎯 Filter by specific productType
      const foundCategory = regionData.categories.find(
        (c: any) => c.productType.toLowerCase() === productType.toLowerCase(),
      );

      if (foundCategory) {
        allProductTypes = [foundCategory.productType];
        allProductNames = foundCategory.productName;
      }
    } else {
      // 🎯 Only region filter → return all productTypes + all productNames

      allProductTypes = regionData.categories.map((c: any) => c.productType);

      allProductNames = regionData.categories.flatMap(
        (c: any) => c.productName,
      );
    }
  }

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    filters: {
      productTypes: allProductTypes,
      productNames: allProductNames,
    },
  };
};


const updateCategory = async (
  id: string,
  payload: ICategory,
  files: Express.Multer.File[],
) => {
  const isCategory = await category.findById(id);
  if (!isCategory) {
    throw new AppError("Category not found", 404);
  }

  // 🔹 map files by fieldname
  const filesMap: { [key: string]: Express.Multer.File } = {};
  files.forEach((f) => {
    filesMap[f.fieldname] = f;
  });

  // 🔹 Update regionImage if provided
  if (filesMap["regionImage"]) {
    if (isCategory.regionImage?.public_id) {
      await deleteFromCloudinary(isCategory.regionImage.public_id);
    }
    const uploadedRegion = await uploadToCloudinary(
      filesMap["regionImage"].path,
      "region-img",
    );
    payload.regionImage = {
      url: uploadedRegion.secure_url,
      public_id: uploadedRegion.public_id,
    };
  }

  // 🔹 Update existing categories or add new categories
  if (payload.categories && payload.categories.length > 0) {
    for (let i = 0; i < payload.categories.length; i++) {
      const cat = payload.categories[i];
      const fileKey = `categories[${i}][productTypeImage]`;
      const productFile = filesMap[fileKey];

      // Upload image if file provided
      if (productFile) {
        const uploaded = await uploadToCloudinary(
          productFile.path,
          "product-type-img",
        );
        cat.productImage = {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      } else if (!cat.productImage) {
        throw new AppError(`Product image missing for ${cat.productType}`, 400);
      }

      // Check if productType already exists in this region
      const existProductType = isCategory.categories.find(
        (c) => c.productType.toLowerCase() === cat.productType.toLowerCase(),
      );

      if (existProductType) {
        // Update existing productType
        existProductType.productName = cat.productName;
        if (cat.productImage) existProductType.productImage = cat.productImage;
      } else {
        // Add new productType
        isCategory.categories.push(cat);
      }
    }
  }

  // 🔹 Update region name and slug
  if (payload.region) {
    const isExistRegion = await category.findOne({
      _id: { $ne: id },
      region: { $regex: `^${payload.region}$`, $options: "i" },
    });
    if (isExistRegion) {
      throw new AppError(`${payload.region} already exists`, 409);
    }
    isCategory.region = payload.region;
    isCategory.slug = generateShopSlug(payload.region);

    // Update countries
    const regionInput = payload.region.trim().toLowerCase();
    const mappedRegion = regionMap[regionInput] || payload.region;
    isCategory.country = countries
      .filter(
        (c) =>
          c.subregion?.toLowerCase() === mappedRegion.toLowerCase() ||
          c.region?.toLowerCase() === mappedRegion.toLowerCase(),
      )
      .map((c) => c.name.common);
  }

  // 🔹 Save updated category
  await isCategory.save();

  return isCategory;
};

const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
};

export default categoryService;
