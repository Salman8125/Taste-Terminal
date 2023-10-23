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
exports.getVendorById = exports.getVendors = exports.createVendor = void 0;
const vendor_modal_1 = require("../models/vendor-modal");
const encrypt_data_1 = require("../utility/encrypt-data");
const createVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerName, email, phone, pincode, password, address, foodType } = req.body;
        const checkVendor = yield vendor_modal_1.Vendor.findOne({ email });
        if (checkVendor) {
            return res.status(401).json("Vendor Already Exists");
        }
        const salt = yield (0, encrypt_data_1.GenerateSalt)();
        const hashedPaaaword = yield (0, encrypt_data_1.GeneratePassword)(password, salt);
        const vendor = yield vendor_modal_1.Vendor.create({
            name,
            ownerName,
            email,
            phone,
            pincode,
            password: hashedPaaaword,
            address,
            foodType,
            salt: salt,
            rating: 0,
            serviceAvailable: false,
            coverImages: [],
            foods: [],
        });
        return res.status(201).json(vendor);
    }
    catch (error) {
        console.log("POST_CREATE_VENDOR", error);
        res.status(500).json("Internal Server Error");
    }
});
exports.createVendor = createVendor;
const getVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendor_modal_1.Vendor.find();
        if (!vendors) {
            return res.status(400).json("No vendors exists");
        }
        return res.status(200).json(vendors);
    }
    catch (error) {
        console.log("GET_VENDORS", error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.getVendors = getVendors;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vendor = yield vendor_modal_1.Vendor.findById({ _id: id });
        console.log("vendor : ", vendor);
        if (!vendor) {
            return res.status(401).json("Vendor Not Found");
        }
        res.status(200).json(id);
    }
    catch (error) {
        console.log("GET_VENDORS_BY_ID", error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.getVendorById = getVendorById;
