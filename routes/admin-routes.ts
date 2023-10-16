import express, { NextFunction, Request, Response } from "express";
import { createVendor, getVendorById, getVendors } from "../controllers/admin-controller";

const adminRouter = express.Router();

adminRouter.get("/vendors", getVendors);
adminRouter.get("/vendor/:id", getVendorById);
adminRouter.post("/vendor", createVendor);

export { adminRouter };
