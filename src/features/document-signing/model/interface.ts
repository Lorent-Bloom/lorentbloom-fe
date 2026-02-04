import type { SignatureMethod } from "@entities/document";

export interface SignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

export interface DocumentPreviewProps {
  pdfUrl: string | null;
  isLoading?: boolean;
  className?: string;
}

export interface SigningFlowProps {
  contractData: ContractPreviewData;
  onSign: (
    signatureData: string,
    method: SignatureMethod,
    personalNumber?: string
  ) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isSigned?: boolean;
  signerRole: "owner" | "renter";
  existingPersonalNumber?: string;
}

export interface ContractPreviewData {
  contractNumber: string;
  contractDate: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  ownerPersonalNumber?: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  renterAddress: string;
  renterPersonalNumber?: string;
  productName: string;
  productSku: string;
  productDescription?: string;
  rentFromDate: string;
  rentToDate: string;
  totalDays: number;
  totalPrice: string;
  currency: string;
  paymentMethod: string;
  existingOwnerSignature?: string;
  existingRenterSignature?: string;
}

export interface UseSignaturePadReturn {
  signatureRef: React.RefObject<SignaturePadRef | null>;
  signature: string | null;
  isSigned: boolean;
  handleClear: () => void;
  handleEnd: () => void;
}

export interface UseDocumentSigningReturn {
  isGenerating: boolean;
  isSubmitting: boolean;
  error: string | null;
  pdfUrl: string | null;
  generatePreview: (data: ContractPreviewData) => Promise<void>;
  submitSignature: (
    signatureData: string,
    method: SignatureMethod,
    signerInfo: {
      name: string;
      email: string;
      role: "owner" | "renter";
    }
  ) => Promise<{ success: boolean; error?: string }>;
}
