"use server";

import { getSupabaseServerClient } from "@shared/api/supabase";
import type {
  Document,
  DocumentActionResponse,
  CreateDocumentInput,
  UpdateDocumentInput,
  SignatureData,
  DocumentWithRole,
} from "../../model/interface";

export async function createDocument(
  input: CreateDocumentInput,
): Promise<DocumentActionResponse> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("documents")
      .insert({
        order_id: input.orderId,
        type: input.type || "rental_contract",
        status: "pending",
        owner_email: input.ownerEmail || null,
        renter_email: input.renterEmail || null,
        owner_personal_number: input.ownerPersonalNumber || null,
        renter_personal_number: input.renterPersonalNumber || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create document:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Failed to create document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDocument(
  documentId: string,
): Promise<DocumentActionResponse> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("Failed to get document:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Failed to get document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDocumentByOrderId(
  orderId: string,
): Promise<DocumentActionResponse> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("documents")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return { success: false, error: "Document not found" };
      }
      console.error("Failed to get document by order:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Failed to get document by order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateDocument(
  input: UpdateDocumentInput,
): Promise<DocumentActionResponse> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.status) updateData.status = input.status;
    if (input.unsignedPath) updateData.unsigned_path = input.unsignedPath;
    if (input.partiallySignedPath)
      updateData.partially_signed_path = input.partiallySignedPath;
    if (input.signedPath) updateData.signed_path = input.signedPath;
    if (input.ownerSignature) updateData.owner_signature = input.ownerSignature;
    if (input.renterSignature)
      updateData.renter_signature = input.renterSignature;
    if (input.ownerPersonalNumber)
      updateData.owner_personal_number = input.ownerPersonalNumber;
    if (input.renterPersonalNumber)
      updateData.renter_personal_number = input.renterPersonalNumber;

    const { data, error } = await db
      .from("documents")
      .update(updateData)
      .eq("id", input.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update document:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Failed to update document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function uploadDocumentToStorage(
  orderId: string,
  pdfBuffer: Buffer,
  folder: "pending" | "partial" | "signed",
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    const path = `${folder}/${orderId}/contract.pdf`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(path, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("Failed to upload document:", error);
      return { success: false, error: error.message };
    }

    return { success: true, path };
  } catch (error) {
    console.error("Failed to upload document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDocumentUrl(
  path: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error("Failed to get document URL:", error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error("Failed to get document URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addSignatureToDocument(
  documentId: string,
  party: "owner" | "renter",
  signature: SignatureData,
): Promise<DocumentActionResponse> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Get current document
    const { data: currentDoc, error: fetchError } = await db
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    const doc = currentDoc as Document;

    // Determine new status
    let newStatus = doc.status;
    if (party === "renter" && !doc.owner_signature) {
      newStatus = "partially_signed";
    } else if (party === "owner" && doc.renter_signature) {
      newStatus = "signed";
    } else if (party === "renter" && doc.owner_signature) {
      newStatus = "signed";
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (party === "owner") {
      updateData.owner_signature = signature;
      if (signature.signerPersonalNumber) {
        updateData.owner_personal_number = signature.signerPersonalNumber;
      }
      // Update owner email if not already set
      if (signature.signerEmail && !doc.owner_email) {
        updateData.owner_email = signature.signerEmail;
      }
    } else {
      updateData.renter_signature = signature;
      if (signature.signerPersonalNumber) {
        updateData.renter_personal_number = signature.signerPersonalNumber;
      }
      // Update renter email if not already set
      if (signature.signerEmail && !doc.renter_email) {
        updateData.renter_email = signature.signerEmail;
      }
    }

    const { data, error } = await db
      .from("documents")
      .update(updateData)
      .eq("id", documentId)
      .select()
      .single();

    if (error) {
      console.error("Failed to add signature:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Failed to add signature:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDocumentsForUser(
  userEmail: string,
): Promise<{ success: boolean; data?: DocumentWithRole[]; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Get all documents and filter client-side to handle legacy docs without email columns
    const { data, error } = await db
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to get documents for user:", error);
      return { success: false, error: error.message };
    }

    // Filter documents where user is owner or renter
    // Check both email columns AND signature emails (for legacy docs)
    const userDocuments = (data as Document[]).filter((doc) => {
      const ownerEmail = doc.owner_email || doc.owner_signature?.signerEmail;
      const renterEmail = doc.renter_email || doc.renter_signature?.signerEmail;
      return ownerEmail === userEmail || renterEmail === userEmail;
    });

    // Add role and needsSignature info to each document
    const documentsWithRole: DocumentWithRole[] = userDocuments.map((doc) => {
      const ownerEmail = doc.owner_email || doc.owner_signature?.signerEmail;
      const isOwner = ownerEmail === userEmail;

      // Determine user's role
      const userRole: "owner" | "renter" = isOwner ? "owner" : "renter";

      // Check if user needs to sign
      // Only owners can sign from the documents page
      // Renters sign during checkout, not from documents page
      let needsUserSignature = false;
      if (userRole === "owner" && !doc.owner_signature) {
        needsUserSignature = true;
      }

      return {
        ...doc,
        userRole,
        needsUserSignature,
      };
    });

    return { success: true, data: documentsWithRole };
  } catch (error) {
    console.error("Failed to get documents for user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPendingSignatureCount(
  userEmail: string,
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Get non-signed documents and filter client-side to handle legacy docs
    const { data, error } = await db
      .from("documents")
      .select("*")
      .neq("status", "signed");

    if (error) {
      console.error("Failed to get pending signature count:", error);
      return { success: false, count: 0, error: error.message };
    }

    // Count documents where user needs to sign
    // Check both email columns AND signature emails (for legacy docs)
    let count = 0;
    for (const doc of data as Document[]) {
      const ownerEmail = doc.owner_email || doc.owner_signature?.signerEmail;
      const isOwner = ownerEmail === userEmail;

      // Check if user is owner and hasn't signed
      // Only count for owners - renters sign during checkout, not from documents page
      if (isOwner && !doc.owner_signature) {
        count++;
      }
    }

    return { success: true, count };
  } catch (error) {
    console.error("Failed to get pending signature count:", error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
