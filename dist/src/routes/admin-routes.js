"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin-controller");
const adminRouter = express_1.default.Router();
exports.adminRouter = adminRouter;
adminRouter.get("/vendors", admin_controller_1.getVendors);
adminRouter.get("/vendor/:id", admin_controller_1.getVendorById);
adminRouter.post("/vendor", admin_controller_1.createVendor);
