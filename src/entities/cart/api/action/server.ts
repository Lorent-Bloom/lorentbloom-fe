"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { GET_CUSTOMER_CART } from "../gql/query";
import {
  ADD_PRODUCTS_TO_CART,
  UPDATE_CART_ITEMS,
  REMOVE_ITEM_FROM_CART,
  SET_BILLING_ADDRESS_ON_CART,
  SET_SHIPPING_ADDRESSES_ON_CART,
  SET_SHIPPING_METHOD_ON_CART,
} from "../gql/mutation";
import type {
  CustomerCartResponse,
  AddProductsToCartResponse,
  UpdateCartItemsResponse,
  RemoveItemFromCartResponse,
  SetBillingAddressOnCartResponse,
  SetShippingAddressesOnCartResponse,
  Cart,
  BillingAddress,
  ShippingAddress,
} from "../model/entity";
import type {
  AddToCartInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  ActionResponse,
} from "../model/action";

export async function getCart(): Promise<ActionResponse<Cart>> {
  try {
    const { data, error } = await getClient().query<CustomerCartResponse>({
      query: GET_CUSTOMER_CART,
      fetchPolicy: "network-only",
    });

    if (error || !data) {
      if (error && isAuthError(error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: error?.message || "CART_FETCH_FAILED",
      };
    }

    return { success: true, data: data.customerCart };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "CART_FETCH_FAILED",
    };
  }
}

export async function addToCart(
  input: AddToCartInput,
): Promise<ActionResponse<Cart>> {
  try {
    // First get the cart ID
    const cartResponse = await getCart();
    if (!cartResponse.success || !cartResponse.data) {
      return {
        success: false,
        error: cartResponse.error || "CART_FETCH_FAILED",
      };
    }

    const cartId = cartResponse.data.id;

    const result = await getClient().mutate<AddProductsToCartResponse>({
      mutation: ADD_PRODUCTS_TO_CART,
      variables: {
        cartId,
        cartItems: input.cartItems,
      },
    });

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: result.error?.message || "CART_ADD_FAILED",
      };
    }

    const data = result.data;

    if (data.addProductsToCart.user_errors.length > 0) {
      return {
        success: false,
        error: data.addProductsToCart.user_errors[0].message,
      };
    }

    return { success: true, data: data.addProductsToCart.cart };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "CART_ADD_FAILED",
    };
  }
}

export async function updateCartItem(
  input: UpdateCartItemInput,
): Promise<ActionResponse<Cart>> {
  try {
    // First get the cart ID
    const cartResponse = await getCart();
    if (!cartResponse.success || !cartResponse.data) {
      return {
        success: false,
        error: cartResponse.error || "CART_FETCH_FAILED",
      };
    }

    const cartId = cartResponse.data.id;

    const result = await getClient().mutate<UpdateCartItemsResponse>({
      mutation: UPDATE_CART_ITEMS,
      variables: {
        cartId,
        cartItems: input.cartItems,
      },
    });

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: result.error?.message || "CART_UPDATE_FAILED",
      };
    }

    const data = result.data;

    return { success: true, data: data.updateCartItems.cart };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "CART_UPDATE_FAILED",
    };
  }
}

export async function removeCartItem(
  input: RemoveCartItemInput,
): Promise<ActionResponse<Cart>> {
  try {
    // First get the cart ID
    const cartResponse = await getCart();
    if (!cartResponse.success || !cartResponse.data) {
      return {
        success: false,
        error: cartResponse.error || "CART_FETCH_FAILED",
      };
    }

    const cartId = cartResponse.data.id;

    const result = await getClient().mutate<RemoveItemFromCartResponse>({
      mutation: REMOVE_ITEM_FROM_CART,
      variables: {
        cartId,
        cartItemUid: input.cartItemUid,
      },
    });

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: result.error?.message || "CART_REMOVE_FAILED",
      };
    }

    const data = result.data;

    return { success: true, data: data.removeItemFromCart.cart };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "CART_REMOVE_FAILED",
    };
  }
}

export async function setBillingAddress(input: {
  cartId: string;
  customerAddressId: number;
}): Promise<ActionResponse<BillingAddress>> {
  try {
    const result = await getClient().mutate<SetBillingAddressOnCartResponse>({
      mutation: SET_BILLING_ADDRESS_ON_CART,
      variables: {
        cartId: input.cartId,
        customerAddressId: input.customerAddressId,
      },
    });

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: result.error?.message || "BILLING_ADDRESS_FAILED",
      };
    }

    const data = result.data;

    return {
      success: true,
      data: data.setBillingAddressOnCart.cart.billing_address,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "BILLING_ADDRESS_FAILED",
    };
  }
}

export async function setShippingAddress(input: {
  cartId: string;
  customerAddressId: number;
}): Promise<ActionResponse<ShippingAddress[]>> {
  try {
    const result = await getClient().mutate<SetShippingAddressesOnCartResponse>(
      {
        mutation: SET_SHIPPING_ADDRESSES_ON_CART,
        variables: {
          cartId: input.cartId,
          customerAddressId: input.customerAddressId,
        },
      },
    );

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: result.error?.message || "SHIPPING_ADDRESS_FAILED",
      };
    }

    const data = result.data;

    return {
      success: true,
      data: data.setShippingAddressesOnCart.cart.shipping_addresses,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "SHIPPING_ADDRESS_FAILED",
    };
  }
}

export async function setShippingMethod(input: {
  cartId: string;
  carrierCode: string;
  methodCode: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const result = await getClient().mutate({
      mutation: SET_SHIPPING_METHOD_ON_CART,
      variables: {
        cartId: input.cartId,
        carrierCode: input.carrierCode,
        methodCode: input.methodCode,
      },
    });

    if (result.error || !result.data) {
      if (result.error && isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      console.error("GraphQL error:", result.error);
      return {
        success: false,
        error: result.error?.message || "SHIPPING_METHOD_FAILED",
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    const errorMessage =
      error instanceof Error ? error.message : "SHIPPING_METHOD_FAILED";
    console.error("Set shipping method exception:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
