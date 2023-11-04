import express from "express";
import { Authenticate } from "../middlewares/common-auth";
import { DeliverUserLogin, DeliverUserSignup, DeliveryUserProfile, DeliveryUserStatus, EditDeliveryUserProfile } from "../controllers/delivery-user-controller";

const deliverUserRouter = express.Router();

deliverUserRouter.post("/signup", DeliverUserSignup);
deliverUserRouter.post("/login", DeliverUserLogin);

deliverUserRouter.use(Authenticate);

deliverUserRouter.put("/status", DeliveryUserStatus);

deliverUserRouter.get("/profile", DeliveryUserProfile);
deliverUserRouter.patch("/edit-profile", EditDeliveryUserProfile);

export { deliverUserRouter };
