export interface ContactFormProps {
  className?: string;
  defaultName?: string;
  defaultEmail?: string;
}

export interface SubmitContactFormInput {
  name: string;
  email: string;
  message: string;
}
