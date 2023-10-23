"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopingRouter = void 0;
const express_1 = __importDefault(require("express"));
const shoping_controller_1 = require("../controllers/shoping-controller");
const shopingRouter = express_1.default.Router();
exports.shopingRouter = shopingRouter;
shopingRouter.get("/foods-available/:pincode", shoping_controller_1.FoodAvaliblity);
shopingRouter.get("/top-resturants/:pincode", shoping_controller_1.TopResturants);
shopingRouter.get("/foods-30-min/:pincode", shoping_controller_1.FastDeliveryFoods);
shopingRouter.get("/searchfoods/:pincode", shoping_controller_1.SearchFoods);
shopingRouter.get("/find-resturant/:resturantId", shoping_controller_1.ResturantById);
