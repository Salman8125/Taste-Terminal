import express from "express";
import { Authenticate } from "../middlewares/common-auth";
import { CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerification, UpdateCustomerProfile, getOtp } from "../controllers/customer-controller";

const customerRouter = express.Router();

customerRouter.post("/signup", CustomerSignUp);
customerRouter.post("/login", CustomerLogin);

customerRouter.use(Authenticate);

customerRouter.patch("/verify", CustomerVerification);
customerRouter.post("/otp", getOtp);
customerRouter.get("/profile", CustomerProfile);
customerRouter.patch("/update-profile", UpdateCustomerProfile);

export { customerRouter };
