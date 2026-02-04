export type { RentedProduct, RentedProductsResult } from "./api/model/entity";
export type {
  GetRentedProductsInput,
  UpdateRentalInput,
} from "./api/model/action";
export {
  getRentedProducts,
  getRentedProduct,
  updateRental,
  cancelRental,
} from "./api/action/server";
