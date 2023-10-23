import express from "express";
import { Addfood, getFoods, getVendorProfile, login, updateVendorCoverImage, updateVendorProfile, updateVendorService } from "../controllers/vendor-controller";
import { Authenticate } from "../middlewares/common-auth";
import multer from "multer";

const vendorRouter = express.Router();

const imageStoreage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + Math.round(Math.random() * 1e9) + file.originalname);
  },
});

const images = multer({ storage: imageStoreage }).array("image", 10);

vendorRouter.post("/login", login);

vendorRouter.use(Authenticate);

vendorRouter.get("/profile", getVendorProfile);
vendorRouter.patch("/updateprofile", updateVendorProfile);
vendorRouter.patch("/updateservice", updateVendorService);
vendorRouter.patch("/coverimages", images, updateVendorCoverImage);

vendorRouter.patch("/food", images, Addfood);
vendorRouter.get("/foods", getFoods);

export { vendorRouter };
