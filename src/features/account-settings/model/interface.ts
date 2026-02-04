export interface UpdateNameFormProps {
  defaultValues: {
    firstname: string;
    lastname: string;
  };
  locale: string;
}

export interface UpdateEmailFormProps {
  currentEmail: string;
  locale: string;
}

export interface ChangePasswordFormProps {
  locale: string;
}

export interface UseUpdateNameFormProps {
  defaultValues: {
    firstname: string;
    lastname: string;
  };
  locale: string;
}

export interface UseUpdateEmailFormProps {
  currentEmail: string;
  locale: string;
}

export interface UseChangePasswordFormProps {
  locale: string;
}
