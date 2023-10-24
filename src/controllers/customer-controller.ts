import { NextFunction, Request, Response } from "express";
import { CartInputs, CreateCustomerInput, CustomerLoginInputs, UpdateCustomerInputs } from "../types/customer-types";
import { Customer } from "../models/customer-modal";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility/encrypt-data";
import { GenerateOtp, onRequestOTP } from "../utility/notification-utility";
import { Order } from "../models/order-modal";
import { Food } from "../models/food-modal";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone } = <CreateCustomerInput>req.body;

    if (!email || !phone || !password) {
      return res.status(400).json("Missing Fields");
    }

    const checkCustomer = await Customer.findOne({ email: email });

    if (checkCustomer) {
      return res.status(400).json("Email Already Exists");
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const result = await Customer.create({
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
      orders: [],
      cart: [],
    });

    if (!result) {
      return res.status(400).json("Something went wrong");
    }

    await onRequestOTP(otp, phone);

    const signature = await GenerateSignature(
      {
        _id: result.id,
        email: email,
        phone: phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature, verified: result.verified, email: result.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = <CustomerLoginInputs>req.body;

    if (!email || !password) {
      return res.status(400).json("Missing Credentials");
    }

    const result = await Customer.findOne({ email: email });

    if (!result) {
      return res.status(400).json("User Not Found");
    }

    const validation = await ValidatePassword(password, result.password, result.salt);

    if (!validation) {
      return res.status(400).json("Incorrect Credentials");
    }

    const signature = await GenerateSignature(
      {
        _id: result.id,
        email: email,
        phone: result.phone,
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({ signature, email: result.email, phone: result.phone });
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un authorized");
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json("OTP is Missing");
    }

    const result = await Customer.findById(user._id);

    if (!result) {
      return res.status(400).json("User Not Found");
    }

    if (result.otp === parseInt(otp) && result.otp_expiry >= new Date()) {
      result.verified = true;

      await result.save();

      const signature = await GenerateSignature(
        {
          _id: result.id,
          email: result.email,
          phone: result.phone,
        },
        process.env.JWT_SECRET!
      );

      return res.status(200).json({ signature, email: result.email, phone: result.phone });
    }

    return res.status(400).json("OTP Validation Failed");
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const getOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un authorized");
    }

    const result = await Customer.findById(user._id);

    if (!result) {
      return res.status(400).json("Customer Not Found");
    }

    const { otp, expiry } = GenerateOtp();

    result.otp = otp;
    result.otp_expiry = expiry;

    await result.save();
    await onRequestOTP(otp, result.phone);

    return res.status(200).json("OTP Sent");
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(400).json("Un Authorized");
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json("Profile Not FOund!!");
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(400).json("Un Authorized!!");
    }

    const { firstName, lastName, address } = <UpdateCustomerInputs>req.body;

    if (!firstName || !lastName || !address) {
      return res.status(400).json("Missing Fields");
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json("Invalid ID");
    }

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }

    const customer = await Customer.findById(user._id);

    if (!customer) {
      return res.status(400).json("Un Authorized");
    }

    const cart = <CartInputs[]>req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json("Missing Inputs");
    }

    let totalPrice = 0.0;
    const cartItems = Array();

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    if (!foods || foods.length === 0) {
      return res.status(400).json("Foods Not Found");
    }

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          totalPrice = totalPrice + food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json("Cart items missing");
    }

    const currentOrder = await Order.create({
      totalPrice: totalPrice,
      items: cartItems,
      orderDate: new Date(),
      paidThrough: "COD",
      paymentResponse: "",
      orderStatus: "pending",
      verified: false,
    });

    if (currentOrder) {
      customer.orders.push(currentOrder);
      await customer.save();

      return res.status(200).json(currentOrder);
    }

    return res.status(400).json("Some Thing Went Wrong");
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }

    const customer = await Customer.findById(user._id).populate("orders");

    if (!customer) {
      return res.status(400).json("No Data Found Of This User");
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }

    const { id } = req.params;

    if (!id) {
      return res.status(200).json("Order Id is Required");
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(200).json("Order Not Found");
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const AddItemsToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }

    const customer = await Customer.findById(user._id).populate("cart.food");

    if (!customer) {
      return res.status(400).json("User Not Found");
    }

    const { _id, unit } = <CartInputs>req.body;

    if (!_id || !unit) {
      return res.status(200).json("Missing Fields");
    }

    let cartItems = Array();

    const food = await Food.findById(_id);

    if (!food) {
      return res.status(400).json("Food Not Found");
    }

    cartItems = customer.cart;

    let existingItem = cartItems.find((item) => item.food && item.food._id == _id);

    if (existingItem) {
      existingItem.unit = unit;
    } else {
      cartItems.push({ food, unit });
    }

    await customer.save();

    return res.status(200).json(customer.cart);
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const GetItemsFormCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};

export const DeleteItemsFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json("Un Authorized");
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json("Internal Server Error");
  }
};
