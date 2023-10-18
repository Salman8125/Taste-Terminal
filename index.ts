import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

import { adminRouter } from "./routes/admin-routes";
import { vendorRouter } from "./routes/vendor-routes";
import { connect } from "./config/db-connection";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

connect();

app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);

app.use("/", (req, res) => {
  res.json("Listing to Server");
});

app.listen(8080, () => {
  console.clear();
  console.log("App is running");
});
