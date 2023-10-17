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

    return res.status(201).json(vendor);
  } catch (error) {
    console.log("POST_CREATE_VENDOR", error);
    res.status(500).json("Internal Server Error");
  }
};

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await Vendor.find();

    if (!vendors) {
      return res.status(400).json("No vendors exists");
    }

    return res.status(200).json(vendors);
  } catch (error) {
    console.log("GET_VENDORS", error);
    return res.status(500).json("Internal Server Error");
  }
};

export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById({ _id: id });

    console.log("vendor : ", vendor);

    if (!vendor) {
      return res.status(401).json("Vendor Not Found");
    }

    res.status(200).json(id);
  } catch (error) {
    console.log("GET_VENDORS_BY_ID", error);
    return res.status(500).json("Internal Server Error");
  }
};
