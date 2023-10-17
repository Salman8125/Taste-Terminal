import { NextFunction, Request, Response } from "express";
import { VendorUpdateProfileInput, loginVendorInput } from "../types/vendor-type";
import { Vendor } from "../models/vendor-modal";
import { GenerateSignature, ValidatePassword } from "../utility/encrypt-data";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = <loginVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email });

    if (!existingVendor) {
      return res.status(401).json("No Vendor Exist By That Email");
    }

    const validatePassword = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

    if (!validatePassword) {
      return res.status(400).json("Login Credential Invalid");
    }

    const generateSignature = await GenerateSignature(
      { _id: existingVendor.id, name: existingVendor.name, email: existingVendor.email, foodType: existingVendor.foodType },
      process.env.JWT_SECRET!
    );

    return res.status(200).json(generateSignature);
  } catch (error) {
    console.log("GET_LOGIN_VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
    }

    return res.status(200).json(vendor);
  } catch (error) {
    console.log("GET_PROFILE_VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, address, phone, foodType } = <VendorUpdateProfileInput>req.body;

    if (!name || !address || !phone || !foodType) {
      return res.status(400).json("Missing Fields");
    }

    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(400).json("Vendor info not found");
    }

    existingVendor.name = name;
    existingVendor.address = address;
    existingVendor.phone = phone;
    existingVendor.foodType = foodType;

    const savedVendor = await existingVendor.save();

    return res.status(200).json(savedVendor);
  } catch (error) {
    console.log("PATCH_PROFILE__VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(400).json("Vendor info not found");
    }

    existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

    const savedVendor = await existingVendor.save();

    res.status(200).json(savedVendor);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};
