import mongoose, { Document, Schema } from "mongoose";

interface OrderInterface extends Document {
  verified: boolean;
  totalPrice: number;
  items: any[];
  orderDate: Date;
  paymentMethod: string;
  paymentResponce: string;
  orderStatus: string;
}

const orderSchema = new Schema(
  {
    totalPrice: { type: Number, required: true },
    verified: { type: Boolean, required: true },
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
