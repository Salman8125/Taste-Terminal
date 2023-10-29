import mongoose, { Document, Schema } from "mongoose";

interface offerInterface extends Document {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: string;
}

const vendorSchema = new Schema(
  {
    offerType: { type: String, require: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
    title: { type: String, require: true },
    description: { type: String, requirre: true },
    minValue: { type: String, require: true },
    offerAmount: { type: String, require: true },
    startValidity: Date,
    endValidity: Date,
    promoCode: { type: String, require: true },
    promoType: { type: String, require: true },
    bank: [{ type: String, require: true }],
    bins: [{ type: String, require: true }],
    pincode: { type: String, require: true },
    isActive: Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Offer = mongoose.model<offerInterface>("offer", vendorSchema);

export { Offer };
