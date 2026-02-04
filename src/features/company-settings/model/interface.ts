export interface CompanySettingsFormProps {
  defaultValues?: {
    companyName: string;
    companyPhone: string;
    companyLogo: string;
  };
  locale: string;
}

export interface UseCompanySettingsProps {
  defaultValues?: {
    companyName: string;
    companyPhone: string;
    companyLogo: string;
  };
  locale: string;
}

export interface LogoUploaderProps {
  value?: string;
  onChange: (key: string | undefined) => void;
  disabled?: boolean;
  error?: string;
}

export interface UseLogoUploaderProps {
  value?: string;
  onChange: (key: string | undefined) => void;
  disabled?: boolean;
}
