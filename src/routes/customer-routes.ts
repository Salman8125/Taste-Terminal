import express from "express";
import { Authenticate } from "../middlewares/common-auth";
import { CreateOrder, CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerification, GetOrderById, GetOrders, UpdateCustomerProfile, getOtp } from "../controllers/customer-controller";

const customerRouter = express.Router();

customerRouter.post("/signup", CustomerSignUp);
customerRouter.post("/login", CustomerLogin);

customerRouter.use(Authenticate);

customerRouter.patch("/verify", CustomerVerification);
customerRouter.patch("/otp", getOtp);
customerRouter.get("/profile", CustomerProfile);
customerRouter.patch("/update-profile", UpdateCustomerProfile);

customerRouter.post("/create-order", CreateOrder);
customerRouter.get("/orders", GetOrders);
customerRouter.get("/order/:id", GetOrderById);

export { customerRouter };
