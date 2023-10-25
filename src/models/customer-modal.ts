import mongoose, { Document, Schema } from "mongoose";

interface customerInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: number;
  verified: boolean;
  password: string;
  salt: string;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  orders: any[];
  cart: any[];
}

const customerSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: any) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    address: { type: String },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    otp: { type: Number },
    otp_expiry: { type: Date, default: new Date() },
    verified: { type: Boolean },
    lat: { type: Number },
    lng: { type: Number },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password;
        delete ret.salt;
        delete ret.otp;
        delete ret.otp_expiry;
      },
    },
  }
);

const Customer = mongoose.model<customerInterface>("customer", customerSchema);

export { Customer };
