import express, { NextFunction, Request, Response } from "express";

const vendorRouter = express.Router();

vendorRouter.get("/", (req: Request, res: Response, nest: NextFunction) => {
  res.json("Hello from vendor routes");
});

export { vendorRouter };
