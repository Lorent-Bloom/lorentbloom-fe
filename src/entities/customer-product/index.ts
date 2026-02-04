// Public API for customer-product entity
export {
  getCustomerProducts,
  getCustomerProduct,
  createCustomerProduct,
  updateCustomerProduct,
  deleteCustomerProduct,
  toggleProductStatus,
} from "./api/action/server";

export type {
  CustomerProduct,
  CustomerProductsResult,
  ProductStatus,
  ProductApprovalStatus,
} from "./api/model/entity";

export type {
  GetCustomerProductsInput,
  CreateProductInput,
  UpdateProductInput,
  ProductAttributeSortInput,
  SortEnum,
} from "./api/model/action";
