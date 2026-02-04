export {
  createDocument,
  getDocument,
  getDocumentByOrderId,
  updateDocument,
  uploadDocumentToStorage,
  getDocumentUrl,
  addSignatureToDocument,
  getDocumentsForUser,
  getPendingSignatureCount,
} from "./api/action/server";

export type {
  Document,
  DocumentStatus,
  DocumentType,
  SignatureData,
  SignatureMethod,
  SigningParty,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentActionResponse,
  DocumentWithRole,
} from "./model/interface";
