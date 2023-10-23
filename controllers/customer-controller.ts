import { NextFunction, Request, Response } from "express";
import { CreateCustomerInput, CustomerLoginInputs, UpdateCustomerInputs } from "../types/customer-types";
import { Customer } from "../models/customer-modal";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility/encrypt-data";
import { GenerateOtp, onRequestOTP } from "../utility/notification-utility";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone } = <CreateCustomerInput>req.body;

    if (!email || !phone || !password) {
      return res.status(400).json("Missing Fields");
    }

    const checkCustomer = await Customer.findOne({ email: email });

    if (checkCustomer) {
      return res.status(400).json("Email Already Exists");
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const result = await Customer.create({
      email,
      password: hashedPassword,
      phone,
      firstName: "",
      lastName: "",
      otp: otp,
      otp_expiry: expiry,
      verified: false,
      address: "",
      salt: salt,
      lat: 0,
      lng: 0,
    });

    if (!result) {
      return res.status(400).json("Something went wrong");
    }

    await onRequestOTP(otp, phone);

    const signature = await GenerateSignature(
      {
        _id: result.id,
        email: email,
        phone: phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature, verified: result.verified, email: result.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = <CustomerLoginInputs>req.body;

    if (!email || !password) {
      return res.status(400).json("Missing Credentials");
    }

    const result = await Customer.findOne({ email: email });

    if (!result) {
      return res.status(400).json("User Not Found");
    }

    const validation = await ValidatePassword(password, result.password, result.salt);

    if (!validation) {
      return res.status(400).json("Incorrect Credentials");
    }

    const signature = await GenerateSignature(
      {
        _id: result.id,
        email: email,
        phone: result.phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature, email: result.email, phone: result.phone });
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un authorized");
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json("OTP is Missing");
    }

    const result = await Customer.findById(user._id);

    if (!result) {
      return res.status(400).json("User Not Found");
    }

    if (result.otp === parseInt(otp) && result.otp_expiry >= new Date()) {
      result.verified = true;

      await result.save();

      const signature = await GenerateSignature(
        {
          _id: result.id,
          email: result.email,
          phone: result.phone,
        },
        process.env.JWT_SECRET!
      );

      return res.status(200).json({ signature, email: result.email, phone: result.phone });
    }

    return res.status(400).json("OTP Validation Failed");
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const getOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un authorized");
    }

    const result = await Customer.findById(user._id);

    if (!result) {
      return res.status(400).json("Customer Not Found");
    }

    const { otp, expiry } = GenerateOtp();

    result.otp = otp;
    result.otp_expiry = expiry;

    await result.save();
    await onRequestOTP(otp, result.phone);

    return res.status(200).json("OTP Sent");
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(400).json("Un Authorized");
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json("Profile Not FOund!!");
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(400).json("Un Authorized!!");
    }

    const { firstName, lastName, address } = <UpdateCustomerInputs>req.body;

    if (!firstName || !lastName || !address) {
      return res.status(400).json("Missing Fields");
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json("Invalid ID");
    }

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};
