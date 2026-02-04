export interface ConfirmEmailPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; id?: string; key?: string }>;
}

export interface ConfirmEmailCardProps {
  className?: string;
  email?: string;
  id?: string;
  confirmationKey?: string;
  hasValidParams: boolean;
}
