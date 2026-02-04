"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { PLACE_ORDER } from "../gql/mutation";
import { GET_CUSTOMER_ORDERS } from "../gql/query";
import { GET_ORDER_DETAIL, GET_RENTAL_ORDER_DETAIL } from "../gql/queryDetail";
import type {
  PlaceOrderResponse,
  CustomerOrdersResponse,
  CustomerOrderDetailResponse,
  RentalOrderDetailResponse,
} from "../model/entity";
import type {
  PlaceOrderInput,
  PlaceOrderActionResponse,
  GetCustomerOrdersActionResponse,
  GetOrderDetailActionResponse,
} from "../model/action";

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderActionResponse> {
  try {
    const result = await getClient().mutate<PlaceOrderResponse>({
      mutation: PLACE_ORDER,
      variables: { cartId: input.cartId },
    });

    const { data } = result;
    // Apollo Client mutation result includes errors in a different way
    const errors = (result as { errors?: { message: string }[] }).errors;

    // Check for GraphQL errors array (Apollo returns errors, not error)
    if (errors && errors.length > 0) {
      console.error("GraphQL errors:", errors);
      const errorMessage = errors.map((e) => e.message).join(", ");
      if (isAuthError({ graphQLErrors: errors })) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Check for errors in the placeOrder response
    if (data?.placeOrder?.errors && data.placeOrder.errors.length > 0) {
      const errorMessage = data.placeOrder.errors
        .map((e) => e.message)
        .join(", ");
      console.error("PlaceOrder errors:", data.placeOrder.errors);
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (!data?.placeOrder?.order) {
      return {
        success: false,
        error: "ORDER_PLACE_FAILED",
      };
    }

    return {
      success: true,
      data: {
        order_number: data.placeOrder.order.order_number,
      },
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    // Extract detailed error information from GraphQL errors
    let errorMessage = "ORDER_PLACE_FAILED";
    if (error && typeof error === "object") {
      const graphQLError = error as {
        graphQLErrors?: Array<{ message: string; extensions?: unknown }>;
        networkError?: { result?: { errors?: Array<{ message: string }> } };
        message?: string;
      };

      // Try to get specific error messages from GraphQL
      if (graphQLError.graphQLErrors && graphQLError.graphQLErrors.length > 0) {
        errorMessage = graphQLError.graphQLErrors
          .map((e) => e.message)
          .join(", ");
        console.error("GraphQL errors detail:", graphQLError.graphQLErrors);
      } else if (graphQLError.networkError?.result?.errors) {
        errorMessage = graphQLError.networkError.result.errors
          .map((e) => e.message)
          .join(", ");
        console.error("Network error detail:", graphQLError.networkError);
      } else if (graphQLError.message) {
        errorMessage = graphQLError.message;
      }
    }

    console.error("Place order exception:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getCustomerOrders(): Promise<GetCustomerOrdersActionResponse> {
  try {
    const { data } = await getClient().query<CustomerOrdersResponse>({
      query: GET_CUSTOMER_ORDERS,
    });

    return {
      success: true,
      data: data?.customer.orders.items,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    return {
      success: false,
      error: "ORDERS_FETCH_FAILED",
    };
  }
}

export async function getOrderDetail(
  orderNumber: string,
): Promise<GetOrderDetailActionResponse> {
  try {
    const { data } = await getClient().query<CustomerOrderDetailResponse>({
      query: GET_ORDER_DETAIL,
      variables: { orderNumber },
    });

    const order = data?.customer?.orders?.items?.[0];

    if (!order) {
      return {
        success: false,
        error: "ORDER_NOT_FOUND",
      };
    }

    // Normalize field names (customer.orders uses 'number'/'order_date', myRentalOrders uses 'order_number'/'created_at')
    const normalizedOrder = {
      ...order,
      order_number: order.number || order.order_number,
      created_at: order.order_date || order.created_at,
    };

    return {
      success: true,
      data: normalizedOrder,
    };
  } catch (error) {
    console.error("[getOrderDetail] Error:", error);
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    return {
      success: false,
      error: "ORDER_FETCH_FAILED",
    };
  }
}

export async function getRentalOrderDetail(
  orderNumber: string,
): Promise<GetOrderDetailActionResponse> {
  try {
    const { data } = await getClient().query<RentalOrderDetailResponse>({
      query: GET_RENTAL_ORDER_DETAIL,
      variables: { orderNumber },
    });

    const order = data?.myRentalOrders?.items?.[0];

    if (!order) {
      return {
        success: false,
        error: "ORDER_NOT_FOUND",
      };
    }

    // Normalize field names (myRentalOrders uses 'order_number'/'created_at')
    const normalizedOrder = {
      ...order,
      order_number: order.order_number || order.number,
      created_at: order.created_at || order.order_date,
    };

    return {
      success: true,
      data: normalizedOrder,
    };
  } catch (error) {
    console.error("[getRentalOrderDetail] Error:", error);
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    return {
      success: false,
      error: "ORDER_FETCH_FAILED",
    };
  }
}
