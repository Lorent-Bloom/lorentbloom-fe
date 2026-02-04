"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import {
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_ADDRESS,
} from "../gql/mutation";
import { GET_CUSTOMER_ADDRESSES } from "../gql/query";
import {
  CustomerAddressInput,
  CreateCustomerAddressResponse,
  UpdateCustomerAddressResponse,
  DeleteCustomerAddressResponse,
  GetCustomerAddressesResponse,
} from "../model/action";
import { CustomerAddress } from "../model/entity";
import { clearExpiredToken } from "@entities/customer";

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  try {
    const result = await getClient().query<GetCustomerAddressesResponse>({
      query: GET_CUSTOMER_ADDRESSES,
    });

    if (result.error?.message) {
      return [];
    }

    return result.data?.customer?.addresses || [];
  } catch (err) {
    console.error("Failed to get customer addresses:", err);
    return [];
  }
}

export async function createCustomerAddress(input: CustomerAddressInput) {
  try {
    // Sanitize input - use city as region fallback
    const sanitizedInput: CustomerAddressInput = {
      ...input,
      region: input.region || { region: input.city || "" },
    };

    const result = await getClient().mutate<CreateCustomerAddressResponse>({
      mutation: CREATE_CUSTOMER_ADDRESS,
      variables: { input: sanitizedInput },
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      if (isAuthError(result.error.message)) {
        await clearExpiredToken();
        return {
          success: false,
          error: "SESSION_EXPIRED",
        };
      }
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      data: result.data?.createCustomerAddress,
    };
  } catch (err) {
    console.error("Failed to create customer address:", err);
    if (isAuthError(err)) {
      await clearExpiredToken();
      return {
        success: false,
        error: "SESSION_EXPIRED",
      };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}

export async function updateCustomerAddress(
  id: number,
  input: CustomerAddressInput,
) {
  try {
    // Sanitize input - use city as region fallback
    const sanitizedInput: CustomerAddressInput = {
      ...input,
      region: input.region || { region: input.city || "" },
    };

    const result = await getClient().mutate<UpdateCustomerAddressResponse>({
      mutation: UPDATE_CUSTOMER_ADDRESS,
      variables: { id, input: sanitizedInput },
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      if (isAuthError(result.error.message)) {
        await clearExpiredToken();
        return {
          success: false,
          error: "SESSION_EXPIRED",
        };
      }
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      data: result.data?.updateCustomerAddress,
    };
  } catch (err) {
    console.error("Failed to update customer address:", err);
    if (isAuthError(err)) {
      await clearExpiredToken();
      return {
        success: false,
        error: "SESSION_EXPIRED",
      };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}

export async function deleteCustomerAddress(id: number) {
  try {
    const result = await getClient().mutate<DeleteCustomerAddressResponse>({
      mutation: DELETE_CUSTOMER_ADDRESS,
      variables: { id },
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      if (isAuthError(result.error.message)) {
        await clearExpiredToken();
        return {
          success: false,
          error: "SESSION_EXPIRED",
        };
      }
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      data: result.data?.deleteCustomerAddress,
    };
  } catch (err) {
    console.error("Failed to delete customer address:", err);
    if (isAuthError(err)) {
      await clearExpiredToken();
      return {
        success: false,
        error: "SESSION_EXPIRED",
      };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}
