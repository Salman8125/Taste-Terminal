import mongoose, { Document, Schema } from "mongoose";

interface customerInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  verified: boolean;
  password: string;
  salt: string;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
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
    phone: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
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

const Customer = mongoose.model("customer", customerSchema);

export { Customer };