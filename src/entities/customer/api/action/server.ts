"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import {
  CREATE_CUSTOMER,
  GENERATE_CUSTOMER_TOKEN,
  UPDATE_CUSTOMER_V2,
  UPDATE_CUSTOMER_EMAIL,
  CHANGE_CUSTOMER_PASSWORD,
  UPDATE_CUSTOMER_ATTRIBUTES,
  CONFIRM_EMAIL,
} from "../gql/mutation";
import {
  CreateCustomerInput,
  CreateCustomerResponse,
  GenerateCustomerTokenInput,
  GenerateCustomerTokenResponse,
  CustomerUpdateInput,
  UpdateEmailInput,
  ChangePasswordInput,
  UpdateCustomerV2Response,
  UpdateCustomerEmailResponse,
  ChangeCustomerPasswordResponse,
  UpdateCustomerAttributesInput,
  UpdateCustomerAttributesResponse,
  ConfirmEmailInput,
  ConfirmEmailResponse,
} from "../model/action";
import { TOKEN_COOKIE_NAME } from "@shared/api";
import { GET_CUSTOMER } from "../gql/query";
import { Customer } from "../model/entity";

// Server action to clear expired token
export async function clearExpiredToken() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);
  } catch (err) {
    console.error("Failed to clear token:", err);
  }
}

export async function createCustomer(input: CreateCustomerInput) {
  try {
    const result = await getClient().mutate<CreateCustomerResponse>({
      mutation: CREATE_CUSTOMER,
      variables: input,
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      return {
        success: false,
        error: result.error.message,
      };
    }

    if (!result.data?.createCustomer?.customer) {
      return {
        success: false,
        error: "NO_CUSTOMER_CREATED",
      };
    }

    return {
      success: true,
      data: result.data.createCustomer.customer,
    };
  } catch (err) {
    console.error("Failed to create customer:", err);

    // Handle CombinedGraphQLErrors (Apollo error with errors array)
    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray((err as { errors: unknown[] }).errors)
    ) {
      const errors = (err as { errors: { message: string }[] }).errors;
      if (errors[0]?.message) {
        return {
          success: false,
          error: errors[0].message,
        };
      }
    }

    // Try to extract error message from GraphQL error with bodyText
    if (err && typeof err === "object" && "bodyText" in err) {
      try {
        const errorBody = JSON.parse(err.bodyText as string);
        if (errorBody.errors && errorBody.errors[0]?.message) {
          return {
            success: false,
            error: errorBody.errors[0].message,
          };
        }
      } catch {
        // Failed to parse error body, continue with default error handling
      }
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}

export async function signInCustomer(input: GenerateCustomerTokenInput) {
  try {
    const result = await getClient().mutate<GenerateCustomerTokenResponse>({
      mutation: GENERATE_CUSTOMER_TOKEN,
      variables: input,
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      return {
        success: false,
        error: result.error.message,
      };
    }

    const token = result.data?.generateCustomerToken.token;

    if (!token) {
      return {
        success: false,
        error: "NO_TOKEN_RECEIVED",
      };
    }

    const cookieStore = await cookies();

    // In development (HTTP), secure cookies won't work
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Revalidate the layout to update the auth state
    revalidatePath("/", "layout");

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    console.error("Failed to generate customer token:", err);

    // Try to extract error message from GraphQL error
    if (err && typeof err === "object" && "bodyText" in err) {
      try {
        const errorBody = JSON.parse(err.bodyText as string);
        if (errorBody.errors && errorBody.errors[0]?.message) {
          return {
            success: false,
            error: errorBody.errors[0].message,
          };
        }
      } catch {
        // Failed to parse error body, continue with default error handling
      }
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}

export async function getCustomer(): Promise<Customer | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const result = await getClient().query<{ customer: Customer }>({
      query: GET_CUSTOMER,
    });

    if (result.error?.message) {
      if (!isAuthError(result.error.message)) {
        console.error("GraphQL errors:", result.error.message);
      }
      return null;
    }

    return result.data?.customer || null;
  } catch (err) {
    if (!isAuthError(err)) {
      console.error("Failed to get customer:", err);
      // Log more details about the error
      if (err && typeof err === "object") {
        console.error("Error details:", JSON.stringify(err, null, 2));
      }
    }
    return null;
  }
}

export async function logoutCustomer() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);
  } catch (err) {
    console.error("Failed to logout customer:", err);
    throw err;
  }
}

export async function updateCustomerName(input: CustomerUpdateInput) {
  try {
    const result = await getClient().mutate<UpdateCustomerV2Response>({
      mutation: UPDATE_CUSTOMER_V2,
      variables: { input },
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
      data: result.data?.updateCustomerV2.customer,
    };
  } catch (err) {
    console.error("Failed to update customer name:", err);
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

export async function updateCustomerEmail(input: UpdateEmailInput) {
  try {
    const result = await getClient().mutate<UpdateCustomerEmailResponse>({
      mutation: UPDATE_CUSTOMER_EMAIL,
      variables: input,
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
      data: result.data?.updateCustomerEmail.customer,
    };
  } catch (err) {
    console.error("Failed to update customer email:", err);
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

export async function changeCustomerPassword(input: ChangePasswordInput) {
  try {
    const result = await getClient().mutate<ChangeCustomerPasswordResponse>({
      mutation: CHANGE_CUSTOMER_PASSWORD,
      variables: input,
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
      data: result.data?.changeCustomerPassword,
    };
  } catch (err) {
    console.error("Failed to change customer password:", err);
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

export async function updateCustomerAttributes(
  input: UpdateCustomerAttributesInput,
) {
  try {
    const result = await getClient().mutate<UpdateCustomerAttributesResponse>({
      mutation: UPDATE_CUSTOMER_ATTRIBUTES,
      variables: { input },
      refetchQueries: [{ query: GET_CUSTOMER }],
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

    if (!result.data?.updateCustomerV2?.customer) {
      console.error("No customer data returned from mutation");
      return {
        success: false,
        error: "NO_DATA_RETURNED",
      };
    }

    return {
      success: true,
      data: result.data.updateCustomerV2.customer,
    };
  } catch (err) {
    console.error("Failed to update customer attributes:", err);
    if (err && typeof err === "object") {
      console.error("Error details:", JSON.stringify(err, null, 2));
    }
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

export async function confirmEmail(input: ConfirmEmailInput) {
  try {
    const result = await getClient().mutate<ConfirmEmailResponse>({
      mutation: CONFIRM_EMAIL,
      variables: { input },
    });

    if (result.error?.message) {
      console.error("GraphQL errors:", result.error.message);
      return {
        success: false,
        error: result.error.message,
      };
    }

    if (!result.data?.confirmEmail?.customer) {
      return {
        success: false,
        error: "EMAIL_CONFIRMATION_FAILED",
      };
    }

    return {
      success: true,
      data: result.data.confirmEmail.customer,
    };
  } catch (err) {
    console.error("Failed to confirm email:", err);

    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray((err as { errors: unknown[] }).errors)
    ) {
      const errors = (err as { errors: { message: string }[] }).errors;
      if (errors[0]?.message) {
        return {
          success: false,
          error: errors[0].message,
        };
      }
    }

    if (err && typeof err === "object" && "bodyText" in err) {
      try {
        const errorBody = JSON.parse(err.bodyText as string);
        if (errorBody.errors && errorBody.errors[0]?.message) {
          return {
            success: false,
            error: errorBody.errors[0].message,
          };
        }
      } catch {
        // Failed to parse error body
      }
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    };
  }
}
