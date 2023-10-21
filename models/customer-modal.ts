import mongoose, { Document, Schema } from "mongoose";

interface customerInterface extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  salt: string;
  otp: string;
  otp_expiry: Date;
}

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
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
    phone: { type: String },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    otp: { type: String },
    otp_expiry: { type: String },
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
