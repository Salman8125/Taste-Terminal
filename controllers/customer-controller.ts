import { NextFunction, Request, Response } from "express";
import { CreateCustomerInput } from "../types/customer-types";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone } = <CreateCustomerInput>req.body;

    if (!email || !phone || !password) {
      return res.status(400).json("Missing Fields");
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const getOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};
