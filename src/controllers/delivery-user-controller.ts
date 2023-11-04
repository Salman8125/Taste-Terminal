import { NextFunction, Request, Response } from "express";
import { DeliveryUserInput, DeliveryUserUpdateInputs } from "../types/deliveryUser-types";
import { DeliveryUser } from "../models/delivery-user-modal";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility/encrypt-data";

export const DeliverUserSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone, firstName, lastName, address, pincode } = <DeliveryUserInput>req.body;

    if (!email || !password || !firstName || !lastName || !address || !phone || !pincode) {
      return res.status(400).json("Missing Fields");
    }

    const existingUser = await DeliveryUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json("User Already Exists");
    }

    const salt = await GenerateSalt();

    const hashedPassword = await GeneratePassword(password, salt);

    const user = await DeliveryUser.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      salt: salt,
      address: address,
      phone: phone,
      isAvailable: false,
      verified: false,
      pincode: pincode,
      lat: 0,
      lng: 0,
    });

    if (!user) {
      return res.status(400).json("Unable To Create User");
    }

    const signature = await GenerateSignature(
      {
        _id: user._id,
        email: email,
        phone: phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature: signature, email: user.email, phone: phone, isAvailable: user.isAvailable, verified: user.verified });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const DeliverUserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Missing Fields");
    }

    const user = await DeliveryUser.findOne({ email });

    if (!user) {
      return res.status(400).json("Incorrect Credentials");
    }

    const verifyPassword = await ValidatePassword(password, user.password, user.salt);

    if (!verifyPassword) {
      return res.status(400).json("Incorrect Credentials");
    }

    const signature = await GenerateSignature(
      {
        _id: user._id,
        email: email,
        phone: user.phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature: signature, email: user.email, phone: user.phone, isAvailable: user.isAvailable, verified: user.verified });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const DeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliveryUser = req.user;

    if (!deliveryUser) {
      return res.status(400).json("Unauthorized");
    }

    const user = await DeliveryUser.findById(deliveryUser._id);

    if (!user) {
      return res.status(400).json("User Not Found!");
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const EditDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized!!");
    }

    const { firstName, lastName, address } = <DeliveryUserUpdateInputs>req.body;

    if (!firstName || !lastName || !address) {
      return res.status(400).json("Missing Fields");
    }

    const profile = await DeliveryUser.findById(user._id);

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

export const DeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliveryUser = req.user;

    if (!deliveryUser) {
      return res.status(400).json("Unauthorized");
    }

    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json("Missing Fields!");
    }

    const user = await DeliveryUser.findById(deliveryUser._id);

    if (!user) {
      return res.status(400).json("User Not Found!");
    }

    if (lat && lng) {
      user.lat = lat;
      user.lng = lng;
    }

    user.isAvailable = !user.isAvailable;

    const result = await user.save();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};
