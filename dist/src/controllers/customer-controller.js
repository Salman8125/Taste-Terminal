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
exports.UpdateCustomerProfile = exports.CustomerProfile = exports.getOtp = exports.CustomerVerification = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const customer_modal_1 = require("../models/customer-modal");
const encrypt_data_1 = require("../utility/encrypt-data");
const notification_utility_1 = require("../utility/notification-utility");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phone } = req.body;
        if (!email || !phone || !password) {
            return res.status(400).json("Missing Fields");
        }
        const checkCustomer = yield customer_modal_1.Customer.findOne({ email: email });
        if (checkCustomer) {
            return res.status(400).json("Email Already Exists");
        }
        const salt = yield (0, encrypt_data_1.GenerateSalt)();
        const hashedPassword = yield (0, encrypt_data_1.GeneratePassword)(password, salt);
        const { otp, expiry } = (0, notification_utility_1.GenerateOtp)();
        const result = yield customer_modal_1.Customer.create({
            email,
            password: hashedPassword,
            phone,
            firstName: "",
            lastName: "",
            otp: otp,
            otp_expiry: expiry,
            verified: false,
            address: "",
            salt: salt,
            lat: 0,
            lng: 0,
        });
        if (!result) {
            return res.status(400).json("Something went wrong");
        }
        yield (0, notification_utility_1.onRequestOTP)(otp, phone);
        const signature = yield (0, encrypt_data_1.GenerateSignature)({
            _id: result.id,
            email: email,
            phone: phone,
        }, process.env.JWT_SECRET);
        return res.status(200).json({ signature, verified: result.verified, email: result.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("Missing Credentials");
        }
        const result = yield customer_modal_1.Customer.findOne({ email: email });
        if (!result) {
            return res.status(400).json("User Not Found");
        }
        const validation = yield (0, encrypt_data_1.ValidatePassword)(password, result.password, result.salt);
        if (!validation) {
            return res.status(400).json("Incorrect Credentials");
        }
        const signature = yield (0, encrypt_data_1.GenerateSignature)({
            _id: result.id,
            email: email,
            phone: result.phone,
        }, process.env.JWT_SECRET);
        return res.status(200).json({ signature, email: result.email, phone: result.phone });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un authorized");
        }
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json("OTP is Missing");
        }
        const result = yield customer_modal_1.Customer.findById(user._id);
        if (!result) {
            return res.status(400).json("User Not Found");
        }
        if (result.otp === parseInt(otp) && result.otp_expiry >= new Date()) {
            result.verified = true;
            yield result.save();
            const signature = yield (0, encrypt_data_1.GenerateSignature)({
                _id: result.id,
                email: result.email,
                phone: result.phone,
            }, process.env.JWT_SECRET);
            return res.status(200).json({ signature, email: result.email, phone: result.phone });
        }
        return res.status(400).json("OTP Validation Failed");
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.CustomerVerification = CustomerVerification;
const getOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json("Un authorized");
        }
        const result = yield customer_modal_1.Customer.findById(user._id);
        if (!result) {
            return res.status(400).json("Customer Not Found");
        }
        const { otp, expiry } = (0, notification_utility_1.GenerateOtp)();
        result.otp = otp;
        result.otp_expiry = expiry;
        yield result.save();
        yield (0, notification_utility_1.onRequestOTP)(otp, result.phone);
        return res.status(200).json("OTP Sent");
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.getOtp = getOtp;
const CustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        if (!customer) {
            return res.status(400).json("Un Authorized");
        }
        const profile = yield customer_modal_1.Customer.findById(customer._id);
        if (!profile) {
            return res.status(400).json("Profile Not FOund!!");
        }
        return res.status(200).json(profile);
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.CustomerProfile = CustomerProfile;
const UpdateCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        if (!customer) {
            return res.status(400).json("Un Authorized!!");
        }
        const { firstName, lastName, address } = req.body;
        if (!firstName || !lastName || !address) {
            return res.status(400).json("Missing Fields");
        }
        const profile = yield customer_modal_1.Customer.findById(customer._id);
        if (!profile) {
            return res.status(400).json("Invalid ID");
        }
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;
        yield profile.save();
        return res.status(200).json(profile);
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server Error");
    }
});
exports.UpdateCustomerProfile = UpdateCustomerProfile;
