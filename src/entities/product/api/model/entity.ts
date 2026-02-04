// Product entity types based on Adobe Commerce/Magento GraphQL API

export interface Reservation {
  from_date: string;
  to_date: string;
}

export interface ProductCustomer {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Money {
  value: number;
  currency: string;
}

export interface ProductPrice {
  regular_price: Money;
  final_price?: Money;
  discount?: {
    amount_off: number;
    percent_off: number;
  };
}

export interface PriceRange {
  minimum_price: ProductPrice;
  maximum_price?: ProductPrice;
}

export interface ProductImage {
  url: string;
  label: string | null;
}

// Configurable product types
export interface ConfigurableAttributeOption {
  uid: string;
  label: string;
  value_index: number;
}

export interface ConfigurableProductOption {
  uid: string;
  attribute_code: string;
  label: string;
  values: ConfigurableAttributeOption[];
}

export interface ConfigurableVariant {
  attributes: Array<{
    code: string;
    value_index: number;
  }>;
  product: {
    uid: string;
    sku: string;
    name: string;
    stock_status: "IN_STOCK" | "OUT_OF_STOCK";
  };
}

export interface Product {
  id: number;
  uid: string;
  sku: string;
  name: string;
  url_key: string;
  price_range: PriceRange;
  image: ProductImage | null;
  small_image: ProductImage | null;
  thumbnail: ProductImage | null;
  short_description?: {
    html: string;
  } | null;
  city?: number | null;
  city_name?: string | null;
  configurable_options?: ConfigurableProductOption[];
  variants?: ConfigurableVariant[];
  reservations?: Reservation[];
  rental_quantity?: number | null;
  customer?: ProductCustomer | null;
  __typename: string;
}

export interface ProductAttributeSortInput {
  name?: "ASC" | "DESC";
  price?: "ASC" | "DESC";
  position?: "ASC" | "DESC";
  created_at?: "ASC" | "DESC";
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface AggregationOption {
  label: string;
  value: string;
  count: number;
}

export interface Aggregation {
  attribute_code: string;
  label: string;
  count: number;
  options: AggregationOption[];
}

export interface ProductsResult {
  items: Product[];
  page_info: PageInfo;
  total_count: number;
  aggregations?: Aggregation[];
}

// Extended types for Product Detail page
export interface MediaGalleryEntry {
  url: string;
  label: string | null;
  position: number;
  disabled: boolean;
}

export interface ProductReview {
  average_rating: number;
  ratings_breakdown: Array<{
    name: string;
    value: string;
  }>;
}

export interface CustomAttribute {
  attribute_code: string;
  label: string;
  value: string;
}

export interface StockStatus {
  stock_status: "IN_STOCK" | "OUT_OF_STOCK";
  only_x_left_in_stock?: number | null;
}

export interface ProductDetail extends Product {
  description?: {
    html: string;
  } | null;
  media_gallery?: MediaGalleryEntry[];
  rating_summary?: number;
  review_count?: number;
  reviews?: ProductReview;
  stock_status?: "IN_STOCK" | "OUT_OF_STOCK";
  rental_quantity?: number | null;
  only_x_left_in_stock?: number | null;
  manufacturer?: string | null;
  meta_description?: string | null;
  meta_keyword?: string | null;
  custom_attributes?: CustomAttribute[];
  related_products?: Product[];
  upsell_products?: Product[];
  crosssell_products?: Product[];
  configurable_options?: ConfigurableProductOption[];
  variants?: ConfigurableVariant[];
  reservations?: Reservation[];
}
