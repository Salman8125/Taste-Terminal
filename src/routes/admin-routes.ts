import express, { NextFunction, Request, Response } from "express";
import { createVendor, DeliveryUserVerify, GetDeliveryUsers, GetTransaction, GetTransactionById, getVendorById, getVendors } from "../controllers/admin-controller";

const adminRouter = express.Router();

adminRouter.get("/vendors", getVendors);
adminRouter.get("/vendor/:id", getVendorById);
adminRouter.post("/vendor", createVendor);

adminRouter.get("/transactions", GetTransaction);
adminRouter.get("/transaction/:id", GetTransactionById);

adminRouter.get("/delivery", GetDeliveryUsers);
adminRouter.patch("/verify/:id", DeliveryUserVerify);

export { adminRouter };
