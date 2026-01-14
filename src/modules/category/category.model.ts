import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new Schema<ICategory>(
  {
    region: { type: String, required: false },
    slug: { type: String, unique: true },
    productType: { type: String, required: false },
    productName: { type: [String], required: false },
    productImage: {
      public_id: { type: String },
      url: { type: String },
    },
    regionImage: {
      public_id: { type: String },
      url: { type: String },
    },
    country: { type: [String], required: false },
  },
  { timestamps: true, versionKey: false }
);

const category = model<ICategory>("Category", CategorySchema);

export default category;
