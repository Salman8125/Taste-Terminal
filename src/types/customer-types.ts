export interface CreateCustomerInput {
  phone: number;
  email: string;
  password: string;
}

export interface CustomerSignaturePayload {
  _id: string;
  email: string;
  phone: number;
}

export interface CustomerLoginInputs {
  email: string;
  password: string;
}
export interface UpdateCustomerInputs {
  firstName: string;
  lastName: string;
  address: string;
}

export interface CartInputs {
  _id: string;
  unit: number;
}
