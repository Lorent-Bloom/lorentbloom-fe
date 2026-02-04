export interface UnifiedAccountSettingsFormProps {
  defaultValues: {
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    personal_number: string;
  };
  locale: string;
  highlightField?: string;
}

export interface UseUnifiedAccountSettingsFormProps {
  defaultValues: {
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    personal_number: string;
  };
  locale: string;
  highlightField?: string;
}

export interface EnabledSections {
  name: boolean;
  email: boolean;
  password: boolean;
}
