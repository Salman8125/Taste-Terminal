import { NextFunction, Request, Response } from "express";
import { VendorOfferInputs, VendorUpdateProfileInput, loginVendorInput } from "../types/vendor-type";
import { Vendor } from "../models/vendor-modal";
import { GenerateSignature, ValidatePassword } from "../utility/encrypt-data";
import { AddfoodsInput } from "../types/food-types";
import { Food } from "../models/food-modal";
import { Order } from "../models/order-modal";
import { Offer } from "../models/offer-model";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = <loginVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email });

    if (!existingVendor) {
      return res.status(401).json("No Vendor Exist By That Email");
    }

    const validatePassword = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

    if (!validatePassword) {
      return res.status(400).json("Login Credential Invalid");
    }

    const generateSignature = await GenerateSignature(
      { _id: existingVendor.id, name: existingVendor.name, email: existingVendor.email, foodType: existingVendor.foodType },
      process.env.JWT_SECRET!
    );

    return res.status(200).json(generateSignature);
  } catch (error) {
    console.log("GET_LOGIN_VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
    }

    return res.status(200).json(vendor);
  } catch (error) {
    console.log("GET_PROFILE_VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const updateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const files = req.files as [Express.Multer.File];

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(400).json("Vendor Not Found");
    }

    const images = files.map((file: Express.Multer.File) => file.filename);

    vendor.coverImages.push(...images);

    const savedResult = await vendor.save();

    return res.status(200).json(savedResult);
  } catch (error) {
    console.log("PATCH_PROFILE__VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, address, phone, foodType } = <VendorUpdateProfileInput>req.body;

    if (!name || !address || !phone || !foodType) {
      return res.status(400).json("Missing Fields");
    }

    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(400).json("Vendor info not found");
    }

    existingVendor.name = name;
    existingVendor.address = address;
    existingVendor.phone = phone;
    existingVendor.foodType = foodType;

    const savedVendor = await existingVendor.save();

    return res.status(200).json(savedVendor);
  } catch (error) {
    console.log("PATCH_PROFILE__VENDOR", error);
    return res.status(500).json("Internal Server error");
  }
};

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(400).json("Vendor info not found");
    }

    existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

    const savedVendor = await existingVendor.save();

    res.status(200).json(savedVendor);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const Addfood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendorId, name, description, category, price, readyTime, foodType } = <AddfoodsInput>req.body;

    if (!vendorId || !name || !description || !category || !price || !readyTime || !foodType) {
      return res.status(400).json("Missing Fields");
    }

    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(400).json("Vendor Info Not Found");
    }

    const files = req.files as [Express.Multer.File];

    const images = files.map((file: Express.Multer.File) => file.filename);

    const createdFood = await Food.create({
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

    const result = await vendor.save();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const foods = await Food.find({ vendorId: user._id });

    if (!foods) {
      return res.status(400).json("Foods Info Not Found");
    }

    return res.status(200).json(foods);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const order = await Order.find({ vendorId: user._id }).populate("items.food");

    if (!order) {
      return res.status(400).json("No Orders Found");
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Unauthorised");
    }

    const { id } = req.params;

    if (!id) {
      return res.status(200).json("Id is Required");
    }

    const order = await Order.findById(id).populate("items.food");

    if (!order) {
      return res.status(200).json("Order Not Found");
    }

    return res.status(200).json("");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const { id } = req.params;

    if (!id) {
      return res.status(200).json("Id is Required");
    }

    const { status, remarks, time } = req.body;

    if (!status || !remarks || !time) {
      return res.status(400).json("Missing Fields");
    }

    const order = await Order.findById(id).populate("items.food");

    if (!order) {
      return res.status(200).json("Order Not Found");
    }

    order.orderStatus = status;
    order.remarks = remarks;
    order.readyTime = time;

    const orderResult = await order.save();

    if (!orderResult) {
      return res.status(400).json("Unable to process order");
    }

    return res.status(200).json(orderResult);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Unauthorised");
    }

    const { title, startValidity, endValidity, description, pincode, offerType, offerAmount, promoCode, promoType, minValue, isActive, bins, bank } = <VendorOfferInputs>req.body;

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(400).json("Vendor Data Not Found");
    }

    if (!title || !pincode || !offerType || !offerAmount || !promoCode || !promoType || !minValue) {
      return res.status(400).json("Missing Fields");
    }

    const offer = await Offer.create({
      title,
      description,
      vendors: [vendor],
      startValidity,
      endValidity,
      offerType,
      offerAmount,
      promoType,
      promoCode,
      minValue,
      bank,
      bins,
      isActive,
      pincode,
    });

    return res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const offers = await Offer.find().populate("vendors");

    if (!offers) {
      return res.status(200).json("Offers Not Found");
    }

    let currentOffers = Array();

    offers.map((item) => {
      if (item.vendors) {
        item.vendors.map((vendor) => {
          if (vendor._id.toString() === user._id) {
            currentOffers.push(item);
          }
        });
      }

      if (item.offerType === "GENERIC") {
        currentOffers.push(item);
      }
    });

    return res.status(200).json(currentOffers);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const GetOfferById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Id Is Required");
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(400).json("Offer Not Found!");
    }

    return res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorised");
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Id Is Required");
    }

    const { title, description, startValidity, endValidity, pincode, offerAmount, offerType, minValue, promoType, promoCode, isActive, bank, bins } = <VendorOfferInputs>req.body;

    if (!title || !description || !pincode || !offerType || !offerAmount || !promoCode || !promoType || !minValue) {
      return res.status(400).json("Missing Fields");
    }

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(400).json("Vendor Not Found");
    }

    const currrentOffer = await Offer.findById(id);

    if (!currrentOffer) {
      return res.status(400).json("Offer Not Found");
    }

    currrentOffer.title = title;
    currrentOffer.description = description;
    currrentOffer.vendors = vendor._id;
    currrentOffer.startValidity = startValidity;
    currrentOffer.endValidity = endValidity;
    currrentOffer.pincode = pincode;
    currrentOffer.offerAmount = offerAmount;
    currrentOffer.offerType = offerType;
    currrentOffer.minValue = minValue;
    currrentOffer.promoType = promoType;
    currrentOffer.isActive = isActive;
    currrentOffer.bank = bank;
    currrentOffer.bins = bins;

    const offer = await currrentOffer.save();

    return res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server error");
  }
};
