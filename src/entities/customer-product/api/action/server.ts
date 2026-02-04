"use server";

import { revalidatePath } from "next/cache";
import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { GET_CUSTOMER_PRODUCTS, GET_CUSTOMER_PRODUCT } from "../gql/query";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../gql/mutation";
import type {
  GetCustomerProductsInput,
  CreateProductInput,
  UpdateProductInput,
} from "../model/action";
import type {
  CustomerProduct,
  ProductStatus,
  MagentoProductsResponse,
  MagentoProductResponse as MagentoSingleProductResponse,
} from "../model/entity";

/**
 * BACKEND INTEGRATION NOTES:
 *
 * GET MY PRODUCTS - Use myProducts query (requires authentication):
 * myProducts(
 *   search: String,           // Full-text search
 *   filter: ProductAttributeFilterInput,
 *   pageSize: Int = 20,
 *   currentPage: Int = 1,
 *   sort: ProductAttributeSortInput
 * ): Products
 *
 * CREATE/UPDATE PRODUCT - Use mutations with input:
 * {
 *   name: string,
 *   price: number,
 *   is_active: 1 | 2,    // 1 = Active, 2 = Disabled
 *   category_ids: [Int],  // Array of category IDs [category, subcategory, sub_subcategory]
 *   attributes: [
 *     { code: "description", value: string },
 *     { code: "short_description", value: string },
 *     { code: "manufacturer", value: string },
 *     { code: "is_active", value: "1" | "2" },
 *     { code: "color", value: string }  // Color option ID as string
 *   ],
 *   images: [
 *     {
 *       base64: string,  // Full data URI (e.g., "data:image/jpeg;base64,...")
 *       is_main: boolean
 *     }
 *   ]
 * }
 *
 * UPDATE PRODUCT additionally requires:
 * {
 *   sku: string,  // Required to identify product
 *   ...
 * }
 */

// Category interface from Magento ProductInterface
interface MagentoCategory {
  id: string;
  uid?: string;
  name: string;
  level: number; // level 2 = category, level 3 = subcategory, level 4 = sub-subcategory
  path: string;
}

// Helper interface for Magento product response
interface MagentoProductResponse {
  id?: string;
  uid?: string;
  sku: string;
  name: string;
  is_active?: number; // 1 = enabled, 2 = disabled (from backend)
  product_status?: string; // Product status from backend (e.g., "pending", "approved")
  description?: { html: string };
  short_description?: { html: string };
  manufacturer?: string;
  city?: number | null; // City ID
  city_name?: string | null; // City display name
  color?: number | null; // Color attribute option ID
  categories?: MagentoCategory[];
  price_range?: {
    minimum_price?: {
      regular_price?: {
        value: number;
      };
    };
  };
  media_gallery?: Array<{
    url: string;
    position?: number;
    disabled?: boolean;
  }>;
  image?: {
    url: string;
  };
  stock_status?: string;
  rental_quantity?: number;
  new_category?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Helper function to extract category IDs by level from Magento categories
function extractCategoryIds(categories?: MagentoCategory[]): {
  category_id: string | null;
  subcategory_id: string | null;
  sub_subcategory_id: string | null;
} {
  if (!categories || categories.length === 0) {
    return {
      category_id: null,
      subcategory_id: null,
      sub_subcategory_id: null,
    };
  }

  // Find categories by level:
  // level 2 = main category
  // level 3 = subcategory
  // level 4 = sub-subcategory
  const category = categories.find((c) => c.level === 2);
  const subcategory = categories.find((c) => c.level === 3);
  const subSubcategory = categories.find((c) => c.level === 4);

  // Use uid for form compatibility (form dropdowns use uid as value)
  // Fall back to id if uid is not available
  return {
    category_id: category?.uid || category?.id || null,
    subcategory_id: subcategory?.uid || subcategory?.id || null,
    sub_subcategory_id: subSubcategory?.uid || subSubcategory?.id || null,
  };
}

// Helper function to transform Magento product response to CustomerProduct
function transformMagentoProduct(
  product: MagentoProductResponse,
): CustomerProduct {
  // is_active: Use direct is_active field from backend (1 = enabled, 2 = disabled)
  // Fallback to stock_status derivation if is_active is not provided
  const is_active: ProductStatus =
    product.is_active === 1 || product.is_active === 2
      ? product.is_active
      : product.stock_status === "IN_STOCK"
        ? 1
        : 2;

  // Extract category IDs by level
  const { category_id, subcategory_id, sub_subcategory_id } =
    extractCategoryIds(product.categories);

  // Extract new_category directly from product response
  const new_category_path = product.new_category || null;

  // Color is returned as option ID (number), convert to string for form compatibility
  const color = product.color != null ? String(product.color) : null;

  return {
    id: product.uid || product.id || "",
    sku: product.sku,
    name: product.name,
    description: product.description?.html || null,
    short_description: product.short_description?.html || null,
    category_id,
    subcategory_id,
    sub_subcategory_id,
    new_category_path,
    city: product.city ?? null,
    city_name: product.city_name || null,
    color,
    manufacturer: product.manufacturer || null,
    price: product.price_range?.minimum_price?.regular_price?.value || 0,
    quantity: product.rental_quantity || 0,
    images:
      product.media_gallery?.map((img, idx: number) => ({
        id: `${product.uid}-${idx}`,
        url: img.url,
        file: "",
        position: img.position || idx,
        // Determine is_main by comparing with product.image.url (the thumbnail)
        is_main: product.image?.url === img.url,
      })) || [],
    is_active,
    product_status: product.product_status || "pending",
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
  };
}

export async function getCustomerProducts(
  input: GetCustomerProductsInput = {},
) {
  try {
    const variables: {
      search?: string;
      filter?: Record<string, unknown>;
      pageSize?: number;
      currentPage?: number;
      sort?: GetCustomerProductsInput["sort"];
    } = {};

    // Only add parameters if provided (backend has defaults: pageSize=20, currentPage=1)
    if (input.search) {
      variables.search = input.search;
    }
    if (input.filter) {
      variables.filter = input.filter;
    }
    if (input.pageSize !== undefined) {
      variables.pageSize = input.pageSize;
    }
    if (input.currentPage !== undefined) {
      variables.currentPage = input.currentPage;
    }
    if (input.sort) {
      variables.sort = input.sort;
    }

    const result = await getClient().query<MagentoProductsResponse>({
      query: GET_CUSTOMER_PRODUCTS,
      variables,
      fetchPolicy: "network-only",
    });

    if (!result.data?.myProducts) {
      console.error("No myProducts data in response:", result);
      return {
        success: false,
        error: "PRODUCTS_FETCH_FAILED",
        data: null,
      };
    }

    const products = result.data.myProducts;
    const transformedItems = (products.items as MagentoProductResponse[]).map(
      transformMagentoProduct,
    );

    return {
      success: true,
      error: null,
      data: {
        items: transformedItems,
        page_info: {
          current_page: products.page_info.current_page,
          page_size: products.page_info.page_size,
          total_pages: products.page_info.total_pages,
        },
        total_count: products.total_count,
      },
    };
  } catch (error) {
    console.error("Error fetching customer products:", error);

    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
        data: null,
      };
    }

    // Extract more specific error message
    const errorMessage =
      (error instanceof Error ? error.message : null) ||
      (error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray(error.graphQLErrors)
        ? error.graphQLErrors[0]?.message
        : null) ||
      "PRODUCTS_FETCH_FAILED";

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

export async function getCustomerProduct(id: string) {
  try {
    // Note: 'id' parameter is actually the SKU since we can't filter by uid
    const result = await getClient().query<MagentoSingleProductResponse>({
      query: GET_CUSTOMER_PRODUCT,
      variables: { sku: id },
      fetchPolicy: "network-only",
    });

    if (!result.data?.products?.items?.[0]) {
      return {
        success: false,
        error: "PRODUCT_NOT_FOUND",
        data: null,
      };
    }

    const product = transformMagentoProduct(
      result.data.products.items[0] as MagentoProductResponse,
    );

    return {
      success: true,
      error: null,
      data: product,
    };
  } catch (error) {
    console.error("Error fetching customer product:", error);

    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
        data: null,
      };
    }

    return {
      success: false,
      error: "PRODUCT_NOT_FOUND",
      data: null,
    };
  }
}

export async function createCustomerProduct(input: CreateProductInput) {
  try {
    // Build mutation input to match exact backend format
    const attributes = [];

    if (input.description) {
      attributes.push({ code: "description", value: input.description });
    }
    if (input.short_description) {
      attributes.push({
        code: "short_description",
        value: input.short_description,
      });
    }
    if (input.manufacturer) {
      attributes.push({ code: "manufacturer", value: input.manufacturer });
    }

    // is_active: 1 = Active, 2 = Disabled
    const isActiveValue = input.is_active === 2 ? "2" : "1";
    attributes.push({ code: "is_active", value: isActiveValue });

    // City attribute (send as string for GraphQL attributes array)
    if (input.city !== undefined) {
      attributes.push({ code: "city", value: String(input.city) });
    }

    // Color - moved to attributes array
    if (input.color !== undefined) {
      attributes.push({ code: "color", value: String(input.color) });
    }

    // Build category_ids - if new_category_path exists, only send root
    const ROOT_CATEGORY_ID = 2;
    const category_ids: number[] = [ROOT_CATEGORY_ID];

    if (input.new_category_path) {
      // New category: only root in category_ids, full path in attributes
      attributes.push({
        code: "new_category",
        value: input.new_category_path,
      });
    } else {
      // Existing categories: add their IDs
      if (input.category !== undefined) {
        category_ids.push(input.category);
      }
      if (input.subcategory !== undefined) {
        category_ids.push(input.subcategory);
      }
      if (input.sub_subcategory !== undefined) {
        category_ids.push(input.sub_subcategory);
      }
    }

    const mutationInput = {
      name: input.name,
      price: input.price,
      rental_quantity: input.quantity,
      category_ids,
      attributes,
      images: input.images.map((img) => ({
        base64: img.file,
        is_main: img.is_main,
      })),
    };

    const result = await getClient().mutate<{
      createProduct: { product: unknown };
    }>({
      mutation: CREATE_PRODUCT,
      variables: { input: mutationInput },
    });

    if (!result.data?.createProduct?.product) {
      console.error("Create product result:", result);
      return {
        success: false,
        error: "PRODUCT_CREATE_FAILED",
        data: null,
      };
    }

    const createdProduct = transformMagentoProduct(
      result.data.createProduct.product as MagentoProductResponse,
    );

    // Revalidate all locale variants of the my-products page
    revalidatePath("/[locale]/account/my-products", "page");

    return {
      success: true,
      error: null,
      data: createdProduct,
    };
  } catch (error) {
    console.error("Error creating customer product:", error);

    // Log more details about the error
    if (error && typeof error === "object") {
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Log GraphQL errors specifically
      if ("graphQLErrors" in error && Array.isArray(error.graphQLErrors)) {
        console.error(
          "GraphQL errors:",
          error.graphQLErrors.map(
            (e: { message?: string; extensions?: unknown }) => ({
              message: e.message,
              extensions: e.extensions,
            }),
          ),
        );
      }
    }

    // Check if it's a GraphQL error with specific message first
    const errorMessage =
      (error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray(error.graphQLErrors)
        ? error.graphQLErrors[0]?.message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "PRODUCT_CREATE_FAILED";

    // Only treat as session expired if it's specifically a token/session issue
    // Not just any authorization error (e.g., "not authorized to create product" is different)
    if (
      isAuthError(error) &&
      (errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("session") ||
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("consumer key"))
    ) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
        data: null,
      };
    }

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

export async function updateCustomerProduct(input: UpdateProductInput) {
  try {
    // Build mutation input directly from input data
    // No need to fetch current product - form provides all values
    // This also fixes the issue where disabled products can't be fetched via products query
    const attributes = [];

    if (input.description) {
      attributes.push({ code: "description", value: input.description });
    }

    if (input.short_description) {
      attributes.push({
        code: "short_description",
        value: input.short_description,
      });
    }

    if (input.manufacturer) {
      attributes.push({ code: "manufacturer", value: input.manufacturer });
    }

    // is_active: 1 = Active, 2 = Disabled (sent as "status" to backend)
    const statusValue = input.is_active ?? 1;

    // City attribute (send as string for GraphQL attributes array)
    if (input.city !== undefined) {
      attributes.push({ code: "city", value: String(input.city) });
    }

    // Color - moved to attributes array
    if (input.color !== undefined) {
      attributes.push({ code: "color", value: String(input.color) });
    }

    // Backend UpdateProductInput requires 'sku' and doesn't accept 'id'
    // Process all images - convert existing images (URLs) to base64 so they are sent as new
    const imagesToSend: { base64: string; is_main: boolean }[] = [];

    if (input.images && input.images.length > 0) {
      for (const img of input.images) {
        if (img.file && img.file.length > 0) {
          // Image already has base64 data (new upload)
          imagesToSend.push({
            base64: img.file,
            is_main: img.is_main,
          });
        } else if (img.url && img.url.length > 0) {
          // Existing image - fetch from URL and convert to base64
          try {
            const response = await fetch(img.url);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const contentType =
                response.headers.get("content-type") || "image/jpeg";
              const base64 = `data:${contentType};base64,${buffer.toString("base64")}`;
              imagesToSend.push({
                base64,
                is_main: img.is_main,
              });
            }
          } catch (fetchError) {
            console.error(
              "Failed to fetch existing image:",
              img.url,
              fetchError,
            );
            // Skip this image if fetch fails
          }
        }
      }
    }

    // Build category_ids - if new_category_path exists, only send root
    const ROOT_CATEGORY_ID = 2;
    const category_ids: number[] = [ROOT_CATEGORY_ID];

    if (input.new_category_path) {
      // New category: only root in category_ids, full path in attributes
      attributes.push({
        code: "new_category",
        value: input.new_category_path,
      });
    } else {
      // Existing categories: add their IDs
      if (input.category) {
        category_ids.push(input.category);
      }
      if (input.subcategory) {
        category_ids.push(input.subcategory);
      }
      if (input.sub_subcategory) {
        category_ids.push(input.sub_subcategory);
      }
    }

    const mutationInput = {
      sku: input.id,
      name: input.name,
      price: input.price,
      rental_quantity: input.quantity,
      is_active: statusValue,
      category_ids,
      attributes,
      ...(imagesToSend.length > 0 ? { images: imagesToSend } : {}),
    };

    const result = await getClient().mutate<{
      updateProduct: { product: unknown };
    }>({
      mutation: UPDATE_PRODUCT,
      variables: { input: mutationInput },
    });

    if (!result.data?.updateProduct?.product) {
      return {
        success: false,
        error: "PRODUCT_UPDATE_FAILED",
        data: null,
      };
    }

    // Revalidate the my-products page
    revalidatePath("/[locale]/account/my-products", "page");

    return {
      success: true,
      error: null,
      data: transformMagentoProduct(
        result.data.updateProduct.product as MagentoProductResponse,
      ),
    };
  } catch (error) {
    console.error("Error updating customer product:", error);

    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
        data: null,
      };
    }

    const errorMessage =
      (error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray(error.graphQLErrors)
        ? error.graphQLErrors[0]?.message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "PRODUCT_UPDATE_FAILED";

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

export async function toggleProductStatus(
  sku: string,
  newStatus: 1 | 2,
  categoryIds?: {
    category_id: string | null;
    subcategory_id: string | null;
    sub_subcategory_id: string | null;
  },
) {
  try {
    // Helper function to get numeric ID from uid (base64 encoded)
    const getNumericIdFromUid = (uid: string | null): number | null => {
      if (!uid) return null;
      if (/^\d+$/.test(uid)) {
        return parseInt(uid, 10);
      }
      try {
        const decoded = Buffer.from(uid, "base64").toString("utf-8");
        const parsed = parseInt(decoded, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      } catch {
        // Not valid base64
      }
      return null;
    };

    // Build category_ids array to preserve categories during status toggle
    // Backend clears categories on disable, so we need to send them back
    // Always include level 1 category (Default Category = 2) first
    const ROOT_CATEGORY_ID = 2; // Magento Default Category (level 1)
    const category_ids: number[] = [ROOT_CATEGORY_ID];
    if (categoryIds) {
      const catId = getNumericIdFromUid(categoryIds.category_id);
      const subCatId = getNumericIdFromUid(categoryIds.subcategory_id);
      const subSubCatId = getNumericIdFromUid(categoryIds.sub_subcategory_id);
      if (catId) category_ids.push(catId);
      if (subCatId) category_ids.push(subCatId);
      if (subSubCatId) category_ids.push(subSubCatId);
    }

    const mutationInput = {
      sku,
      is_active: newStatus,
      category_ids,
    };

    const result = await getClient().mutate<{
      updateProduct: { product: unknown };
    }>({
      mutation: UPDATE_PRODUCT,
      variables: { input: mutationInput },
    });

    if (!result.data?.updateProduct?.product) {
      return {
        success: false,
        error: "PRODUCT_STATUS_UPDATE_FAILED",
        data: null,
      };
    }

    // Revalidate the my-products page
    revalidatePath("/[locale]/account/my-products", "page");

    return {
      success: true,
      error: null,
      data: transformMagentoProduct(
        result.data.updateProduct.product as MagentoProductResponse,
      ),
    };
  } catch (error) {
    console.error("Error toggling product status:", error);

    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
        data: null,
      };
    }

    const errorMessage =
      (error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray(error.graphQLErrors)
        ? error.graphQLErrors[0]?.message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "PRODUCT_STATUS_UPDATE_FAILED";

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

export async function deleteCustomerProduct(id: string) {
  try {
    // For now, we'll implement soft delete by updating the product status
    // TODO: Check if backend supports a deleteProduct mutation
    const productResult = await getCustomerProduct(id);

    if (!productResult.success || !productResult.data) {
      return {
        success: false,
        error: "PRODUCT_NOT_FOUND",
      };
    }

    const currentProduct = productResult.data;

    // Disable the product (soft delete)
    const mutationInput = {
      id: id,
      name: currentProduct.name,
      price: currentProduct.price,
      is_active: 2, // 2 = Disabled
      images: currentProduct.images.map((img) => ({
        base64: img.file,
        is_main: img.is_main,
      })),
    };

    const result = await getClient().mutate<{
      updateProduct: { product: unknown };
    }>({
      mutation: UPDATE_PRODUCT,
      variables: { input: mutationInput },
    });

    if (!result.data?.updateProduct?.product) {
      return {
        success: false,
        error: "PRODUCT_DELETE_FAILED",
      };
    }

    // Revalidate the my-products page
    revalidatePath("/[locale]/account/my-products", "page");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting customer product:", error);

    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
      };
    }

    const errorMessage =
      (error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray(error.graphQLErrors)
        ? error.graphQLErrors[0]?.message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "PRODUCT_DELETE_FAILED";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
