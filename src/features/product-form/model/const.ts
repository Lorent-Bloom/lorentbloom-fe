import type { TProductFormSchema } from "./schema";

export const PRODUCT_FORM_DEFAULT_VALUES: TProductFormSchema = {
  name: "",
  description: "",
  short_description: "",
  category_id: "",
  subcategory_id: "",
  sub_subcategory_id: "",
  city: "",
  manufacturer: "",
  price: 1,
  quantity: 1, // Default to 1 so products are in stock by default
  images: [],
  is_active: 1, // 1 = Active, 2 = Disabled
};
