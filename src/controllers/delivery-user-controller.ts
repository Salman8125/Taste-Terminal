import { NextFunction, Request, Response } from "express";

export const DeliverUserSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};
