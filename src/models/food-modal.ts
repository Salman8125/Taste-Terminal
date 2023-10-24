import mongoose, { Document, Schema } from "mongoose";

export interface foodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  readyTime: number;
  price: number;
  rating: number;
  images: string[];
}

const foodSchema = new Schema(
  {
    vendorId: { type: String },
    name: { type: String, required: true },
    description: { type: String, requires: true },
    category: { type: String },
    readyTime: { type: Number },
    rating: { type: String },
    price: { type: Number, required: true },
    foodType: { type: [String], required: true },
    images: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(req, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Food = mongoose.model<foodDoc>("food", foodSchema);

export { Food };
