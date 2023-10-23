import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import { adminRouter } from "../routes/admin-routes";
import { vendorRouter } from "../routes/vendor-routes";
import { shopingRouter } from "../routes/shoping-routes";
import { customerRouter } from "../routes/customer-routes";

const expressApp = async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", adminRouter);
  app.use("/vendor", vendorRouter);
  app.use("/shoping", shopingRouter);
  app.use("/customer", customerRouter);

  return app;
};

export { expressApp };
