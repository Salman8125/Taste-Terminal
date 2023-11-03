import express from "express";
import { Authenticate } from "../middlewares/common-auth";

const deliverUserRouter = express.Router();

deliverUserRouter.post("/signup");
deliverUserRouter.post("/login");

deliverUserRouter.use(Authenticate);

deliverUserRouter.put("/status");

deliverUserRouter.get("/profile");
deliverUserRouter.patch("/update-profile");

export { deliverUserRouter };
