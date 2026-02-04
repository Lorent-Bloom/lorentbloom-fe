"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { CREATE_PRODUCT_RESERVATION } from "../gql/mutation";
import type {
  ProductReservation,
  CreateProductReservationResponse,
} from "../model/entity";
import type {
  CreateProductReservationInput,
  ActionResponse,
} from "../model/action";

export async function createProductReservation(
  input: CreateProductReservationInput,
): Promise<ActionResponse<ProductReservation>> {
  try {
    const result = await getClient().mutate<CreateProductReservationResponse>({
      mutation: CREATE_PRODUCT_RESERVATION,
      variables: { input },
    });

    if (result.error) {
      if (isAuthError(result.error)) {
        return { success: false, error: "SESSION_EXPIRED" };
      }
      return { success: false, error: result.error.message };
    }

    if (!result.data) {
      return { success: false, error: "RESERVATION_FAILED" };
    }

    return {
      success: true,
      data: result.data.createProductReservation.reservation,
    };
  } catch (error) {
    if (isAuthError(error)) {
      return { success: false, error: "SESSION_EXPIRED" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "RESERVATION_FAILED",
    };
  }
}
