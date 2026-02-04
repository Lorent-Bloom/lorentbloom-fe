"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { GET_AVAILABLE_PAYMENT_METHODS } from "../gql/query";
import { SET_PAYMENT_METHOD_ON_CART } from "../gql/mutation";
import type {
  AvailablePaymentMethodsResponse,
  SetPaymentMethodResponse,
} from "../model/entity";
import type {
  SetPaymentMethodInput,
  SetPaymentMethodActionResponse,
  GetAvailablePaymentMethodsActionResponse,
} from "../model/action";

export async function getAvailablePaymentMethods(
  cartId: string,
): Promise<GetAvailablePaymentMethodsActionResponse> {
  try {
    const { data } = await getClient().query<AvailablePaymentMethodsResponse>({
      query: GET_AVAILABLE_PAYMENT_METHODS,
      variables: { cartId },
    });

    return {
      success: true,
      data: data?.cart.available_payment_methods,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    return {
      success: false,
      error: "PAYMENT_METHODS_FETCH_FAILED",
    };
  }
}

export async function setPaymentMethod(
  input: SetPaymentMethodInput,
): Promise<SetPaymentMethodActionResponse> {
  try {
    const result = await getClient().mutate<SetPaymentMethodResponse>({
      mutation: SET_PAYMENT_METHOD_ON_CART,
      variables: {
        cartId: input.cartId,
        paymentMethodCode: input.paymentMethodCode,
      },
    });

    const { data, error } = result;

    // Check for GraphQL error
    if (error) {
      console.error("GraphQL error:", error);
      if (isAuthError(error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return {
        success: false,
        error: error.message || "PAYMENT_METHOD_SET_FAILED",
      };
    }

    if (!data?.setPaymentMethodOnCart?.cart?.selected_payment_method) {
      return {
        success: false,
        error: "PAYMENT_METHOD_SET_FAILED",
      };
    }

    return {
      success: true,
      data: data.setPaymentMethodOnCart.cart.selected_payment_method,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    // Provide more detailed error message
    const errorMessage =
      error instanceof Error ? error.message : "PAYMENT_METHOD_SET_FAILED";
    console.error("Set payment method exception:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
