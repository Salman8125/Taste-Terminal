export interface DeliveryUserInput {
  firstName: string;
  lastName: string;
  address: string;
  phone: number;
  email: string;
  password: string;
  pincode: number;
}

export interface DeliveryUserSignaturePayload {
  _id: string;
  email: string;
  phone: number;
}

export interface DeliveryUserLoginInputs {
  email: string;
  password: string;
}

export interface DeliveryUserUpdateInputs {
  firstName: string;
  lastName: string;
  address: string;
}
