import { NextFunction, Request, Response } from "express";
import { Vendor } from "../models/vendor-modal";
import { foodDoc } from "../models/food-modal";
import { Offer } from "../models/offer-model";

export const FoodAvaliblity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
      .sort([["rating", "desc"]])
      .populate("foods");

    if (result.length === 0) {
      return res.status(400).json("No Found found in your area");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const TopResturants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode })
      .sort([["rating", "desc"]])
      .limit(10);

    if (result.length === 0) {
      return res.status(400).json("No Found found in your area");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const FastDeliveryFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).populate("foods");

    if (result.length === 0) {
      return res.status(400).json("Not found in your area");
    }

    const foodResults: any = [];

    result.map((vandor) => {
      const foods = vandor.foods as [foodDoc];

      foodResults.push(...foods.filter((food) => food.readyTime <= 30));
    });

    if (foodResults.length === 0) {
      return res.status(200).json("No data found!!");
    }

    return res.status(200).json(foodResults);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode }).populate("foods");

    if (result.length === 0) {
      return res.status(400).json("Not found in your area");
    }

    const foodResults: any = [];

    result.map((vandor) => {
      const foods = vandor.foods as [foodDoc];
      foodResults.push(...foods);
    });

    if (foodResults.length === 0) {
      return res.status(200).json("No data found!!");
    }

    return res.status(200).json(foodResults);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const ResturantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resturantId = req.params.resturantId;

    const result = await Vendor.findById(resturantId);

    if (!result) {
      return res.status(400).json("Data not found!");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const ShoppingGetOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pincode = req.params.pincode;

    if (!pincode) {
      return res.status(400).json("Pincode is Requirreed");
    }

    const Offers = await Offer.find({ pincode: pincode });

    if (!Offer) {
      return res.status(400).json("Offer Not Found");
    }

    return res.status(200).json(Offer);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};
