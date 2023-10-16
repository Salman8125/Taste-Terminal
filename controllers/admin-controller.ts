import { NextFunction, Request, Response } from "express";

import { CreateVendorInput } from "../types/vendor-type";
import { Vendor } from "../models/vendor-modal";
import { GeneratePassword, GenerateSalt } from "../utility/encrypt-data";

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, ownerName, email, phone, pincode, password, address, foodType } = <CreateVendorInput>req.body;

    const checkVendor = await Vendor.findOne({ email });

    if (checkVendor) {
      return res.status(401).json("Vendor Already Exists");
    }

    const salt = await GenerateSalt();
    const hashedPaaaword = await GeneratePassword(password, salt);

    const vendor = await Vendor.create({
      name,
      ownerName,
      email,
      phone,
      pincode,
      password: hashedPaaaword,
      address,
      foodType,
      salt: salt,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
    });

    return res.json(vendor);
  } catch (error) {
    console.log("VENDOR_CREATE_POST", error);
    res.status(500).json("Internal Server Error");
  }
};

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {};

export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {};
