import mongoose, { Document, Schema } from "mongoose";

interface deliveryUserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: number;
  verified: boolean;
  password: string;
  pincode: string;
  salt: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
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
    pincode: { type: String, required: true },
    verified: { type: Boolean },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean, default: false },
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
      },
    },
  }
);

const DeliveryUser = mongoose.model<deliveryUserInterface>("deliveryUser", deliveryUserSchema);

export { DeliveryUser };
