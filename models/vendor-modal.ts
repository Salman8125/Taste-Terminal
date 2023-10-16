import mongoose, { Document, Schema } from "mongoose";

interface vendorInterface extends Document {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: String[];
  rating: string;
  //   foods: any;
}

const vendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
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
    password: { type: String, required: true, minLength: 8 },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: String },
    // foods: [
    //   {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: "food",
    //   },
    // ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.salt;
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Vendor = mongoose.model<vendorInterface>("vendor", vendorSchema);

export { Vendor };
