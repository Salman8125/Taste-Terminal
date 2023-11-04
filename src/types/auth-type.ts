import { CustomerSignaturePayload } from "./customer-types";
import { DeliveryUserSignaturePayload } from "./deliveryUser-types";
import { VendorSignaturePayload } from "./vendor-type";

export type AuthPayload = VendorSignaturePayload | CustomerSignaturePayload | DeliveryUserSignaturePayload;
