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
exports.getFoods = exports.Addfood = exports.updateVendorService = exports.updateVendorProfile = exports.updateVendorCoverImage = exports.getVendorProfile = exports.login = void 0;
const vendor_modal_1 = require("../models/vendor-modal");
const encrypt_data_1 = require("../utility/encrypt-data");
const food_modal_1 = require("../models/food-modal");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingVendor = yield vendor_modal_1.Vendor.findOne({ email });
        if (!existingVendor) {
            return res.status(401).json("No Vendor Exist By That Email");
        }
        const validatePassword = yield (0, encrypt_data_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (!validatePassword) {
            return res.status(400).json("Login Credential Invalid");
        }
        const generateSignature = yield (0, encrypt_data_1.GenerateSignature)({ _id: existingVendor.id, name: existingVendor.name, email: existingVendor.email, foodType: existingVendor.foodType }, process.env.JWT_SECRET);
        return res.status(200).json(generateSignature);
    }
    catch (error) {
        console.log("GET_LOGIN_VENDOR", error);
        return res.status(500).json("Internal Server error");
    }
});
exports.login = login;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const vendor = yield vendor_modal_1.Vendor.findById(user._id);
        if (!vendor) {
        }
        return res.status(200).json(vendor);
    }
    catch (error) {
        console.log("GET_PROFILE_VENDOR", error);
        return res.status(500).json("Internal Server error");
    }
});
exports.getVendorProfile = getVendorProfile;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const files = req.files;
        const vendor = yield vendor_modal_1.Vendor.findById(user._id);
        if (!vendor) {
            return res.status(400).json("Vendor Not Found");
        }
        const images = files.map((file) => file.filename);
        vendor.coverImages.push(...images);
        const savedResult = yield vendor.save();
        return res.status(200).json(savedResult);
    }
    catch (error) {
        console.log("PATCH_PROFILE__VENDOR", error);
        return res.status(500).json("Internal Server error");
    }
});
exports.updateVendorCoverImage = updateVendorCoverImage;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, phone, foodType } = req.body;
        if (!name || !address || !phone || !foodType) {
            return res.status(400).json("Missing Fields");
        }
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const existingVendor = yield vendor_modal_1.Vendor.findById(user._id);
        if (!existingVendor) {
            return res.status(400).json("Vendor info not found");
        }
        existingVendor.name = name;
        existingVendor.address = address;
        existingVendor.phone = phone;
        existingVendor.foodType = foodType;
        const savedVendor = yield existingVendor.save();
        return res.status(200).json(savedVendor);
    }
    catch (error) {
        console.log("PATCH_PROFILE__VENDOR", error);
        return res.status(500).json("Internal Server error");
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const existingVendor = yield vendor_modal_1.Vendor.findById(user._id);
        if (!existingVendor) {
            return res.status(400).json("Vendor info not found");
        }
        existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
        const savedVendor = yield existingVendor.save();
        res.status(200).json(savedVendor);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server error");
    }
});
exports.updateVendorService = updateVendorService;
const Addfood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorId, name, description, category, price, readyTime, foodType } = req.body;
        if (!vendorId || !name || !description || !category || !price || !readyTime || !foodType) {
            return res.status(400).json("Missing Fields");
        }
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const vendor = yield vendor_modal_1.Vendor.findById(user._id);
        if (!vendor) {
            return res.status(400).json("Vendor Info Not Found");
        }
        const files = req.files;
        const images = files.map((file) => file.filename);
        const createdFood = yield food_modal_1.Food.create({
            vendorId,
            name,
            description,
            category,
            price,
            readyTime,
            foodType,
            rating: 0,
            images: images,
        });
        vendor.foods.push(createdFood);
        const result = yield vendor.save();
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server error");
    }
});
exports.Addfood = Addfood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un Authorised");
        }
        const foods = yield food_modal_1.Food.find({ vendorId: user._id });
        if (!foods) {
            return res.status(400).json("Foods Info Not Found");
        }
        return res.status(200).json(foods);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server error");
    }
});
exports.getFoods = getFoods;
