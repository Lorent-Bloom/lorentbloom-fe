// Export entity types
export type { CustomerAddress, CustomerRegion } from "./api/model/entity";

// Export action types
export type { CustomerAddressInput } from "./api/model/action";

// Export server actions
export {
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "./api/action/server";
