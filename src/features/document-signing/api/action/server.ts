"use server";

import { generateRentalContractPdf } from "@shared/lib/pdf";
import type { RentalContractData } from "@shared/lib/pdf";
import {
  createDocument,
  updateDocument,
  addSignatureToDocument,
  uploadDocumentToStorage,
  getDocumentUrl,
  getDocumentByOrderId,
} from "@entities/document";
import type { SignatureMethod } from "@entities/document";
import { sendContractSignedNotification } from "@shared/api/resend";
import type { ContractPreviewData } from "../../model/interface";

function mapPreviewDataToContractData(
  data: ContractPreviewData,
  ownerSignature?: { image: string; date: string },
  renterSignature?: { image: string; date: string }
): RentalContractData {
  return {
    contractNumber: data.contractNumber,
    contractDate: data.contractDate,
    owner: {
      name: data.ownerName,
      address: data.ownerAddress,
      phone: data.ownerPhone,
      email: data.ownerEmail,
      idnp: data.ownerPersonalNumber,
    },
    renter: {
      name: data.renterName,
      address: data.renterAddress,
      phone: data.renterPhone,
      email: data.renterEmail,
      idnp: data.renterPersonalNumber,
    },
    product: {
      name: data.productName,
      sku: data.productSku,
      description: data.productDescription,
    },
    dates: {
      from: data.rentFromDate,
      to: data.rentToDate,
      totalDays: data.totalDays,
    },
    price: {
      total: data.totalPrice,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
    },
    ownerSignature,
    renterSignature,
    locale: "ro", // Default to Romanian, can be made dynamic later
  };
}

export async function generateContractPreview(
  data: ContractPreviewData,
  locale?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const contractData = mapPreviewDataToContractData(data);
    // For preview, allow any language; for final document, always use Romanian
    const pdfBuffer = await generateRentalContractPdf(contractData, locale || "ro");

    // For preview, we create a data URL
    const base64 = pdfBuffer.toString("base64");
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error) {
    console.error("Failed to generate contract preview:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface CreateAndUploadContractInput {
  orderId: string;
  contractData: ContractPreviewData;
  renterSignature?: {
    data: string;
    method: SignatureMethod;
    signerName: string;
    signerEmail: string;
    signerPersonalNumber?: string;
  };
  ownerInfo?: {
    email: string;
    name: string;
  };
  locale?: string;
}

export async function createAndUploadContract(
  input: CreateAndUploadContractInput
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    // Create document record with owner and renter emails and personal numbers for querying
    const createResult = await createDocument({
      orderId: input.orderId,
      ownerEmail: input.contractData.ownerEmail,
      renterEmail: input.contractData.renterEmail,
      ownerPersonalNumber: input.contractData.ownerPersonalNumber,
      renterPersonalNumber: input.contractData.renterPersonalNumber,
    });
    if (!createResult.success || !createResult.data) {
      return { success: false, error: createResult.error };
    }

    const documentId = createResult.data.id;

    // Build signature data if provided
    let renterSignatureForPdf: { image: string; date: string } | undefined;
    if (input.renterSignature) {
      renterSignatureForPdf = {
        image: input.renterSignature.data,
        date: new Date().toLocaleDateString("ro-RO"),
      };
    }

    // Generate PDF
    const contractData = mapPreviewDataToContractData(
      input.contractData,
      undefined, // No owner signature yet
      renterSignatureForPdf
    );
    const pdfBuffer = await generateRentalContractPdf(contractData);

    // Determine folder based on signature status
    const folder = input.renterSignature ? "partial" : "pending";

    // Upload to Supabase storage
    const uploadResult = await uploadDocumentToStorage(
      input.orderId,
      pdfBuffer,
      folder
    );
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    // Update document record
    const updateData: Parameters<typeof updateDocument>[0] = {
      id: documentId,
    };

    if (folder === "pending") {
      updateData.unsignedPath = uploadResult.path;
    } else {
      updateData.partiallySignedPath = uploadResult.path;
      updateData.status = "partially_signed";
    }

    if (input.renterSignature) {
      updateData.renterSignature = {
        data: input.renterSignature.data,
        signedAt: new Date().toISOString(),
        method: input.renterSignature.method,
        signerName: input.renterSignature.signerName,
        signerEmail: input.renterSignature.signerEmail,
        signerPersonalNumber: input.renterSignature.signerPersonalNumber,
      };
      if (input.renterSignature.signerPersonalNumber) {
        updateData.renterPersonalNumber = input.renterSignature.signerPersonalNumber;
      }
    }

    const updateResult = await updateDocument(updateData);
    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    // Note: Email notifications are sent after BOTH parties sign (in finalizeContract)

    return { success: true, documentId };
  } catch (error) {
    console.error("Failed to create and upload contract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface SubmitContractSignatureInput {
  documentId: string;
  signatureData: string;
  method: SignatureMethod;
  signerName: string;
  signerEmail: string;
  signerPersonalNumber?: string;
  signerRole: "owner" | "renter";
}

export async function submitContractSignature(
  input: SubmitContractSignatureInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const signatureData = {
      data: input.signatureData,
      signedAt: new Date().toISOString(),
      method: input.method,
      signerName: input.signerName,
      signerEmail: input.signerEmail,
      signerPersonalNumber: input.signerPersonalNumber,
    };

    const result = await addSignatureToDocument(
      input.documentId,
      input.signerRole,
      signatureData
    );

    return { success: result.success, error: result.error };
  } catch (error) {
    console.error("Failed to submit signature:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getContractPdfUrl(
  orderId: string
): Promise<{ success: boolean; url?: string; status?: string; error?: string }> {
  try {
    const docResult = await getDocumentByOrderId(orderId);
    if (!docResult.success || !docResult.data) {
      return { success: false, error: docResult.error || "Document not found" };
    }

    const doc = docResult.data;
    let path: string | null = null;

    // Get the most recent version of the document
    if (doc.signed_path) {
      path = doc.signed_path;
    } else if (doc.partially_signed_path) {
      path = doc.partially_signed_path;
    } else if (doc.unsigned_path) {
      path = doc.unsigned_path;
    }

    if (!path) {
      return { success: false, error: "No document file found" };
    }

    const urlResult = await getDocumentUrl(path);
    if (!urlResult.success) {
      return { success: false, error: urlResult.error };
    }

    return {
      success: true,
      url: urlResult.url,
      status: doc.status,
    };
  } catch (error) {
    console.error("Failed to get contract PDF URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function finalizeContract(
  orderId: string,
  contractData: ContractPreviewData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const docResult = await getDocumentByOrderId(orderId);
    if (!docResult.success || !docResult.data) {
      return { success: false, error: docResult.error || "Document not found" };
    }

    const doc = docResult.data;

    // Ensure both signatures are present
    if (!doc.owner_signature || !doc.renter_signature) {
      return {
        success: false,
        error: "Both signatures are required to finalize the contract",
      };
    }

    // Merge personal numbers from document record into contract data
    // These values may have been entered during signing and stored in the document
    const contractDataWithPersonalNumber: ContractPreviewData = {
      ...contractData,
      ownerPersonalNumber: doc.owner_personal_number || doc.owner_signature.signerPersonalNumber || contractData.ownerPersonalNumber,
      renterPersonalNumber: doc.renter_personal_number || doc.renter_signature.signerPersonalNumber || contractData.renterPersonalNumber,
    };

    // Generate final PDF with both signatures
    const finalContractData = mapPreviewDataToContractData(
      contractDataWithPersonalNumber,
      {
        image: doc.owner_signature.data,
        date: new Date(doc.owner_signature.signedAt).toLocaleDateString("ro-RO"),
      },
      {
        image: doc.renter_signature.data,
        date: new Date(doc.renter_signature.signedAt).toLocaleDateString("ro-RO"),
      }
    );

    const pdfBuffer = await generateRentalContractPdf(finalContractData);

    // Upload final signed document
    const uploadResult = await uploadDocumentToStorage(
      orderId,
      pdfBuffer,
      "signed"
    );
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    // Update document record
    await updateDocument({
      id: doc.id,
      signedPath: uploadResult.path,
      status: "signed",
    });

    // Get signed URL for the final document
    const urlResult = await getDocumentUrl(uploadResult.path!);

    // Send email notifications to BOTH parties now that contract is fully signed
    const ownerEmail = doc.owner_email || doc.owner_signature.signerEmail;
    const renterEmail = doc.renter_email || doc.renter_signature.signerEmail;
    const ownerName = doc.owner_signature.signerName;
    const renterName = doc.renter_signature.signerName;

    // Send to owner
    if (ownerEmail) {
      try {
        await sendContractSignedNotification({
          to: ownerEmail,
          recipientName: ownerName,
          orderNumber: orderId,
          ownerName,
          renterName,
          productName: contractData.productName,
        });
      } catch (emailError) {
        console.error("Failed to send signed notification to owner:", emailError);
      }
    }

    // Send to renter
    if (renterEmail) {
      try {
        await sendContractSignedNotification({
          to: renterEmail,
          recipientName: renterName,
          orderNumber: orderId,
          ownerName,
          renterName,
          productName: contractData.productName,
        });
      } catch (emailError) {
        console.error("Failed to send signed notification to renter:", emailError);
      }
    }

    return {
      success: true,
      url: urlResult.url,
    };
  } catch (error) {
    console.error("Failed to finalize contract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
