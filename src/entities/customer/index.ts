export { getCustomerClient } from "./api/action/client";
export {
  createCustomer,
  signInCustomer,
  getCustomer,
  logoutCustomer,
  updateCustomerName,
  updateCustomerEmail,
  changeCustomerPassword,
  clearExpiredToken,
  updateCustomerAttributes,
  confirmEmail,
} from "./api/action/server";
export type { Customer, CustomAttribute } from "./api/model/entity";
export { useCheckAuth } from "./lib/useCheckAuth";
export {
  getCustomAttributeValue,
  buildCustomAttributesInput,
} from "./lib/customAttributes";
