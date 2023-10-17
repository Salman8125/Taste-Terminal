import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../types/auth-type";
import { VerifySignature } from "../utility/encrypt-data";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const validate = await VerifySignature(req);

  if (validate) {
    next();
  } else {
    return res.json({ message: "User Not Authorized" });
  }
};
