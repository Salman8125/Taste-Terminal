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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressApp = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const admin_routes_1 = require("../routes/admin-routes");
const vendor_routes_1 = require("../routes/vendor-routes");
const shoping_routes_1 = require("../routes/shoping-routes");
const customer_routes_1 = require("../routes/customer-routes");
const expressApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
    app.use("/admin", admin_routes_1.adminRouter);
    app.use("/vendor", vendor_routes_1.vendorRouter);
    app.use("/shoping", shoping_routes_1.shopingRouter);
    app.use("/customer", customer_routes_1.customerRouter);
    return app;
});
exports.expressApp = expressApp;
