import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { VendorSignaturePayload } from "../types/vendor-type";
import { Request } from "express";
import { AuthPayload } from "../types/auth-type";

export const GenerateSalt = async () => {
  return await bcrypt.genSaltSync(10);
};

export const GeneratePassword = async (password: any, salt: any) => {
  return await bcrypt.hashSync(password, salt);
};

export const GenerateSignature = async (payload: AuthPayload, secret: string) => {
  return await jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const VerifySignature = async (req: Request) => {
  const token = req.get("Authorization");

  if (token) {
    try {
      const payload = (await jwt.verify(token.split(" ")[1], process.env.JWT_SECRET!)) as AuthPayload;
      req.user = payload;
      return true;
    } catch (error) {
      console.log("JWT Error : ", error);
      return false;
    }
  }

  return false;
};

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
