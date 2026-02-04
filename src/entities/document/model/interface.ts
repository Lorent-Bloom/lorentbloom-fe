export type DocumentStatus = "pending" | "partially_signed" | "signed";

export type DocumentType = "rental_contract";

export type SignatureMethod = "draw" | "type" | "upload" | "camera";

export type SigningParty = "owner" | "renter";

export interface SignatureData {
  data: string; // base64 encoded image
  signedAt: string; // ISO timestamp
  method: SignatureMethod;
  signerName: string;
  signerEmail: string;
  signerPersonalNumber?: string; // Moldovan IDNP (personal_number)
}

export interface Document {
  id: string;
  order_id: string;
  type: DocumentType;
  status: DocumentStatus;
  owner_email: string | null;
  renter_email: string | null;
  owner_personal_number: string | null;
  renter_personal_number: string | null;
  unsigned_path: string | null;
  partially_signed_path: string | null;
  signed_path: string | null;
  owner_signature: SignatureData | null;
  renter_signature: SignatureData | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentInput {
  orderId: string;
  type?: DocumentType;
  ownerEmail?: string;
  renterEmail?: string;
  ownerPersonalNumber?: string;
  renterPersonalNumber?: string;
}

export interface UpdateDocumentInput {
  id: string;
  status?: DocumentStatus;
  unsignedPath?: string;
  partiallySignedPath?: string;
  signedPath?: string;
  ownerSignature?: SignatureData;
  renterSignature?: SignatureData;
  ownerPersonalNumber?: string;
  renterPersonalNumber?: string;
}

export interface DocumentActionResponse<T = Document> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DocumentWithRole extends Document {
  userRole: "owner" | "renter";
  needsUserSignature: boolean;
}
