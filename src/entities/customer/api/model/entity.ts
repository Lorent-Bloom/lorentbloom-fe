export interface CustomAttribute {
  code: string;
  value: string;
}

export interface Customer {
  email: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  custom_attributes?: CustomAttribute[];
}
