"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResturantById = exports.SearchFoods = exports.FastDeliveryFoods = exports.TopResturants = exports.FoodAvaliblity = void 0;
const vendor_modal_1 = require("../models/vendor-modal");
const FoodAvaliblity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield vendor_modal_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([["rating", "desc"]])
            .populate("foods");
        if (result.length === 0) {
            return res.status(400).json("No Found found in your area");
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.FoodAvaliblity = FoodAvaliblity;
const TopResturants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield vendor_modal_1.Vendor.find({ pincode: pincode })
            .sort([["rating", "desc"]])
            .limit(10);
        if (result.length === 0) {
            return res.status(400).json("No Found found in your area");
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.TopResturants = TopResturants;
const FastDeliveryFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield vendor_modal_1.Vendor.find({ pincode: pincode, serviceAvailable: true }).populate("foods");
        if (result.length === 0) {
            return res.status(400).json("Not found in your area");
        }
        const foodResults = [];
        result.map((vandor) => {
            const foods = vandor.foods;
            foodResults.push(...foods.filter((food) => food.readyTime <= 30));
        });
        if (foodResults.length === 0) {
            return res.status(200).json("No data found!!");
        }
        return res.status(200).json(foodResults);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.FastDeliveryFoods = FastDeliveryFoods;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield vendor_modal_1.Vendor.find({ pincode: pincode }).populate("foods");
        if (result.length === 0) {
            return res.status(400).json("Not found in your area");
        }
        const foodResults = [];
        result.map((vandor) => {
            const foods = vandor.foods;
            foodResults.push(...foods);
        });
        if (foodResults.length === 0) {
            return res.status(200).json("No data found!!");
        }
        return res.status(200).json(foodResults);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.SearchFoods = SearchFoods;
const ResturantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resturantId = req.params.resturantId;
        const result = yield vendor_modal_1.Vendor.findById(resturantId);
        if (!result) {
            return res.status(400).json("Data not found!");
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.ResturantById = ResturantById;
