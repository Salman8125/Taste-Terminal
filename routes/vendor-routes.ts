import express, { NextFunction, Request, Response } from "express";
import { getVendorProfile, login, updateVendorProfile, updateVendorService } from "../controllers/vendor-controller";
import { Authenticate } from "../middlewares/common-auth";

const vendorRouter = express.Router();

vendorRouter.post("/login", login);

vendorRouter.use(Authenticate);

vendorRouter.get("/profile", getVendorProfile);
vendorRouter.patch("/updateprofile", updateVendorProfile);
vendorRouter.patch("/updateservice", updateVendorService);

export { vendorRouter };
