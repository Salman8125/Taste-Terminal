"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRouter = void 0;
const express_1 = __importDefault(require("express"));
const vendor_controller_1 = require("../controllers/vendor-controller");
const common_auth_1 = require("../middlewares/common-auth");
const multer_1 = __importDefault(require("multer"));
const vendorRouter = express_1.default.Router();
exports.vendorRouter = vendorRouter;
const imageStoreage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + Math.round(Math.random() * 1e9) + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStoreage }).array("image", 10);
vendorRouter.post("/login", vendor_controller_1.login);
vendorRouter.use(common_auth_1.Authenticate);
vendorRouter.get("/profile", vendor_controller_1.getVendorProfile);
vendorRouter.patch("/updateprofile", vendor_controller_1.updateVendorProfile);
vendorRouter.patch("/updateservice", vendor_controller_1.updateVendorService);
vendorRouter.patch("/coverimages", images, vendor_controller_1.updateVendorCoverImage);
vendorRouter.patch("/food", images, vendor_controller_1.Addfood);
vendorRouter.get("/foods", vendor_controller_1.getFoods);
