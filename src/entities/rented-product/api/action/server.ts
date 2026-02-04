"use server";

import { revalidatePath } from "next/cache";
import type {
  GetRentedProductsInput,
  UpdateRentalInput,
} from "../model/action";

// Mock data for demonstration (backend doesn't support rented products query yet)
// Using let instead of const to allow mutations that persist across server actions
// eslint-disable-next-line prefer-const
let MOCK_RENTED_PRODUCTS = [
  {
    id: "1",
    product_id: "100",
    product_sku: "RENT-CAM-001",
    product_name: "Canon EOS R5 Camera",
    product_image_url:
      "https://devapi.rently.com/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/c/a/camera.jpg",
    product_url_key: "canon-eos-r5-camera",
    rental_start_date: "2025-11-10T00:00:00Z",
    rental_end_date: "2025-11-17T00:00:00Z",
    quantity: 1,
    price_per_day: 89.99,
    total_price: 629.93,
    status: "active" as const,
    created_at: "2025-11-09T10:00:00Z",
    updated_at: "2025-11-09T10:00:00Z",
  },
  {
    id: "2",
    product_id: "101",
    product_sku: "RENT-BIKE-002",
    product_name: "Mountain Bike Pro",
    product_image_url:
      "https://devapi.rently.com/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/b/i/bike.jpg",
    product_url_key: "mountain-bike-pro",
    rental_start_date: "2025-11-05T00:00:00Z",
    rental_end_date: "2025-11-12T00:00:00Z",
    quantity: 2,
    price_per_day: 45.0,
    total_price: 630.0,
    status: "active" as const,
    created_at: "2025-11-04T08:00:00Z",
    updated_at: "2025-11-04T08:00:00Z",
  },
  {
    id: "3",
    product_id: "102",
    product_sku: "RENT-TENT-003",
    product_name: "Camping Tent 4-Person",
    product_image_url:
      "https://devapi.rently.com/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/t/e/tent.jpg",
    product_url_key: "camping-tent-4-person",
    rental_start_date: "2025-10-01T00:00:00Z",
    rental_end_date: "2025-10-15T00:00:00Z",
    quantity: 1,
    price_per_day: 35.5,
    total_price: 497.0,
    status: "completed" as const,
    created_at: "2025-09-30T09:00:00Z",
    updated_at: "2025-10-15T14:00:00Z",
  },
  {
    id: "4",
    product_id: "103",
    product_sku: "RENT-DRONE-004",
    product_name: "DJI Mavic 3 Pro Drone",
    product_image_url:
      "https://devapi.rently.com/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/d/r/drone.jpg",
    product_url_key: "dji-mavic-3-pro-drone",
    rental_start_date: "2025-09-15T00:00:00Z",
    rental_end_date: "2025-09-20T00:00:00Z",
    quantity: 1,
    price_per_day: 120.0,
    total_price: 600.0,
    status: "cancelled" as const,
    created_at: "2025-09-14T11:00:00Z",
    updated_at: "2025-09-16T16:00:00Z",
  },
  {
    id: "5",
    product_id: "104",
    product_sku: "RENT-LAPTOP-005",
    product_name: "MacBook Pro 16-inch",
    product_image_url:
      "https://devapi.rently.com/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/l/a/laptop.jpg",
    product_url_key: "macbook-pro-16-inch",
    rental_start_date: "2025-11-08T00:00:00Z",
    rental_end_date: "2025-11-22T00:00:00Z",
    quantity: 1,
    price_per_day: 75.0,
    total_price: 1050.0,
    status: "active" as const,
    created_at: "2025-11-07T13:00:00Z",
    updated_at: "2025-11-07T13:00:00Z",
  },
];

export async function getRentedProducts(input: GetRentedProductsInput = {}) {
  // TODO: Replace with actual GraphQL query when backend implements rented products
  // For now, return mock data for demonstration
  const page = input.page || 1;
  const pageSize = input.pageSize || 10;

  // Sort: active first, then completed, then cancelled
  const statusPriority = { active: 1, completed: 2, cancelled: 3 };
  const sortedProducts = [...MOCK_RENTED_PRODUCTS].sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Simulate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = sortedProducts.slice(startIndex, endIndex);

  // Simulate async delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    success: true,
    error: null,
    data: {
      items: paginatedItems,
      page_info: {
        current_page: page,
        page_size: pageSize,
        total_pages: Math.ceil(sortedProducts.length / pageSize),
      },
      total_count: sortedProducts.length,
    },
  };
}

export async function getRentedProduct(id: string) {
  // TODO: Replace with actual GraphQL query when backend implements rented product by ID
  await new Promise((resolve) => setTimeout(resolve, 100));

  const rental = MOCK_RENTED_PRODUCTS.find((r) => r.id === id);

  if (!rental) {
    return {
      success: false,
      error: "RENTAL_NOT_FOUND",
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: rental,
  };
}

export async function updateRental(input: UpdateRentalInput) {
  // TODO: Replace with actual GraphQL mutation when backend implements updateRental
  await new Promise((resolve) => setTimeout(resolve, 200));

  const rentalIndex = MOCK_RENTED_PRODUCTS.findIndex((r) => r.id === input.id);

  if (rentalIndex === -1) {
    return {
      success: false,
      error: "RENTAL_NOT_FOUND",
      data: null,
    };
  }

  const rental = MOCK_RENTED_PRODUCTS[rentalIndex];

  // Calculate new total price based on date range and quantity
  const startDate = new Date(input.rental_start_date);
  const endDate = new Date(input.rental_end_date);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const newTotalPrice = days * rental.price_per_day * input.quantity;

  const updatedRental = {
    ...rental,
    rental_start_date: input.rental_start_date,
    rental_end_date: input.rental_end_date,
    quantity: input.quantity,
    status: input.status,
    total_price: newTotalPrice,
    updated_at: new Date().toISOString(),
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  MOCK_RENTED_PRODUCTS[rentalIndex] = updatedRental as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Revalidate the rented products page
  revalidatePath("/[locale]/rented-products", "page");

  return {
    success: true,
    error: null,
    data: updatedRental,
  };
}

export async function cancelRental(id: string) {
  // TODO: Replace with actual GraphQL mutation when backend implements cancelRental
  await new Promise((resolve) => setTimeout(resolve, 200));

  const rentalIndex = MOCK_RENTED_PRODUCTS.findIndex((r) => r.id === id);

  if (rentalIndex === -1) {
    return {
      success: false,
      error: "RENTAL_NOT_FOUND",
    };
  }

  const updatedRental = {
    ...MOCK_RENTED_PRODUCTS[rentalIndex],
    status: "cancelled" as const,
    updated_at: new Date().toISOString(),
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  MOCK_RENTED_PRODUCTS[rentalIndex] = updatedRental as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Revalidate the rented products page
  revalidatePath("/[locale]/rented-products", "page");

  return {
    success: true,
    error: null,
  };
}
