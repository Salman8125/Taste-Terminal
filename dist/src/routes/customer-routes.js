"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_auth_1 = require("../middlewares/common-auth");
const customer_controller_1 = require("../controllers/customer-controller");
const customerRouter = express_1.default.Router();
exports.customerRouter = customerRouter;
customerRouter.post("/signup", customer_controller_1.CustomerSignUp);
customerRouter.post("/login", customer_controller_1.CustomerLogin);
customerRouter.use(common_auth_1.Authenticate);
customerRouter.patch("/verify", customer_controller_1.CustomerVerification);
customerRouter.patch("/otp", customer_controller_1.getOtp);
customerRouter.get("/profile", customer_controller_1.CustomerProfile);
customerRouter.patch("/update-profile", customer_controller_1.UpdateCustomerProfile);
