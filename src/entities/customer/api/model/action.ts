import { Customer } from "./entity";

export interface CreateCustomerInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  middlename?: string;
}

export interface CreateCustomerResponse {
  createCustomer: {
    customer: Customer;
  };
}

export interface GenerateCustomerTokenInput {
  email: string;
  password: string;
}

export interface GenerateCustomerTokenResponse {
  generateCustomerToken: {
    token: string;
  };
}

export interface CustomerUpdateInput {
  firstname?: string;
  lastname?: string;
  middlename?: string;
}

export interface UpdateEmailInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateCustomerV2Response {
  updateCustomerV2: {
    customer: Customer;
  };
}

export interface UpdateCustomerEmailResponse {
  updateCustomerEmail: {
    customer: Customer;
  };
}

export interface ChangeCustomerPasswordResponse {
  changeCustomerPassword: {
    email: string;
  };
}

export interface UpdateCustomerAttributesInput {
  custom_attributes: {
    attribute_code: string;
    value: string;
  }[];
}

export interface UpdateCustomerAttributesResponse {
  updateCustomerV2: {
    customer: Customer;
  };
}

export interface ConfirmEmailInput {
  confirmation_key: string;
  email: string;
}

export interface ConfirmEmailResponse {
  confirmEmail: {
    customer: Customer;
  };
}
