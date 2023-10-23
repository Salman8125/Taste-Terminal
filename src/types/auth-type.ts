import { CustomerSignaturePayload } from "./customer-types";
import { VendorSignaturePayload } from "./vendor-type";

export type AuthPayload = VendorSignaturePayload | CustomerSignaturePayload;
