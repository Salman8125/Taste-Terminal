import mongooose, { Schema, Document } from "mongoose";

export interface TransactionDocs extends Document {
  customer: string;
  vendor: string;
  order: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

const TransactionSchema = new Schema(
  {
    customer: String,
    vendor: String,
    order: String,
    orderValue: Number,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymenResponce: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updateAt;
      },
    },
  }
);

const Transaction = mongooose.model<TransactionDocs>("transaction", TransactionSchema);

export { Transaction };
