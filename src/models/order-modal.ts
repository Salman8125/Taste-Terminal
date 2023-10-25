import mongoose, { Document, Schema } from "mongoose";

interface OrderInterface extends Document {
  verified: boolean;
  vendorId: string;
  totalPrice: number;
  items: any[];
  orderDate: Date;
  paymentMethod: string;
  paymentResponce: string;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  appliedOffers: string;
  offerId: string;
  readyTime: string;
}

const orderSchema = new Schema(
  {
    totalPrice: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    vendorId: { type: String, required: true },
    items: [
      {
        food: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "food",
        },
        unit: { type: Number, required: true },
      },
    ],
    orderDate: { type: Date },
    paymentMethod: { type: String },
    paymentResponce: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: String },
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

const Order = mongoose.model<OrderInterface>("order", orderSchema);

export { Order };
