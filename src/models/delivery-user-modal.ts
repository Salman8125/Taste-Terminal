import mongoose, { Document, Schema } from "mongoose";

interface deliveryUserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: number;
  verified: boolean;
  password: string;
  salt: string;
  lat: number;
  lng: number;
}

const deliveryUserSchema = new Schema(
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
    verified: { type: Boolean },
    lat: { type: Number },
    lng: { type: Number },
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

const DeliveryUser = mongoose.model<deliveryUserInterface>("customer", deliveryUserSchema);

export { DeliveryUser };
