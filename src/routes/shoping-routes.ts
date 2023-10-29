import express from "express";
import { FastDeliveryFoods, FoodAvaliblity, ResturantById, SearchFoods, TopResturants } from "../controllers/shoping-controller";

const shopingRouter = express.Router();

shopingRouter.get("/foods-available/:pincode", FoodAvaliblity);
shopingRouter.get("/top-resturants/:pincode", TopResturants);
shopingRouter.get("/foods-30-min/:pincode", FastDeliveryFoods);
shopingRouter.get("/searchfoods/:pincode", SearchFoods);
shopingRouter.get("/find-resturant/:resturantId", ResturantById);

shopingRouter.get("offers/:pincode");


export { shopingRouter };
