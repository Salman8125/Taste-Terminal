export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface loginVendorInput {
  email: string;
  password: string;
}

export interface VendorSignaturePayload {
  _id: string;
  name: string;
  email: string;
  foodType: string[];
}

export interface VendorUpdateProfileInput {
  name: string;
  foodType: string[];
  address: string;
  phone: string;
}
