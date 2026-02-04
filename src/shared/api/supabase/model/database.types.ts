export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// JSONB types for owner/receiver
export interface ConversationParticipant {
  id: string;
  email: string | null;
  name?: string | null;
}

// JSONB type for document signatures
export interface DocumentSignature {
  data: string; // base64 encoded image
  signedAt: string; // ISO timestamp
  method: "draw" | "type" | "upload" | "camera";
  signerName: string;
  signerEmail: string;
}

export interface Database {
  public: {
    Tables: {
      conversation_steps: {
        Row: {
          id: number;
          step_key: string;
          step_order: number;
          name: string;
          description: string | null;
          triggered_by: "owner" | "receiver" | "system";
          required_action: "confirm" | "upload_images" | "both" | "none";
          notify_party: "owner" | "receiver" | "both";
          next_step_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          step_key: string;
          step_order: number;
          name: string;
          description?: string | null;
          triggered_by: "owner" | "receiver" | "system";
          required_action: "confirm" | "upload_images" | "both" | "none";
          notify_party: "owner" | "receiver" | "both";
          next_step_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          step_key?: string;
          step_order?: number;
          name?: string;
          description?: string | null;
          triggered_by?: "owner" | "receiver" | "system";
          required_action?: "confirm" | "upload_images" | "both" | "none";
          notify_party?: "owner" | "receiver" | "both";
          next_step_id?: number | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          order_id: string;
          owner: ConversationParticipant;
          receiver: ConversationParticipant;
          current_step_id: number | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          owner: ConversationParticipant;
          receiver: ConversationParticipant;
          current_step_id?: number | null;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          owner?: ConversationParticipant;
          receiver?: ConversationParticipant;
          current_step_id?: number | null;
          last_message_at?: string | null;
          created_at?: string;
        };
      };
      conversation_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          sender_role: "owner" | "receiver" | "system";
          content: string | null;
          image_keys: string[] | null;
          is_system_message: boolean;
          step_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          sender_role: "owner" | "receiver" | "system";
          content?: string | null;
          image_keys?: string[] | null;
          is_system_message?: boolean;
          step_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          sender_role?: "owner" | "receiver" | "system";
          content?: string | null;
          image_keys?: string[] | null;
          is_system_message?: boolean;
          step_id?: number | null;
          created_at?: string;
        };
      };
      conversation_progress: {
        Row: {
          id: string;
          conversation_id: string;
          step_id: number;
          completed_by: number;
          completed_at: string;
          image_keys: string[] | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          step_id: number;
          completed_by: number;
          completed_at?: string;
          image_keys?: string[] | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          step_id?: number;
          completed_by?: number;
          completed_at?: string;
          image_keys?: string[] | null;
        };
      };
      conversation_message_reads: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          last_read_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          last_read_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          last_read_at?: string;
        };
      };
      admin_email_config: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      chat_reports: {
        Row: {
          id: string;
          conversation_id: string;
          reporter_email: string;
          reporter_role: "owner" | "receiver";
          description: string;
          status: "pending" | "reviewed" | "resolved" | "dismissed";
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          reporter_email: string;
          reporter_role: "owner" | "receiver";
          description: string;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          reporter_email?: string;
          reporter_role?: "owner" | "receiver";
          description?: string;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          order_id: string;
          type: "rental_contract";
          status: "pending" | "partially_signed" | "signed";
          unsigned_path: string | null;
          partially_signed_path: string | null;
          signed_path: string | null;
          owner_signature: DocumentSignature | null;
          renter_signature: DocumentSignature | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          type?: "rental_contract";
          status?: "pending" | "partially_signed" | "signed";
          unsigned_path?: string | null;
          partially_signed_path?: string | null;
          signed_path?: string | null;
          owner_signature?: DocumentSignature | null;
          renter_signature?: DocumentSignature | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          type?: "rental_contract";
          status?: "pending" | "partially_signed" | "signed";
          unsigned_path?: string | null;
          partially_signed_path?: string | null;
          signed_path?: string | null;
          owner_signature?: DocumentSignature | null;
          renter_signature?: DocumentSignature | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type ConversationStep = Database["public"]["Tables"]["conversation_steps"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type ConversationMessage = Database["public"]["Tables"]["conversation_messages"]["Row"];
export type ConversationProgress = Database["public"]["Tables"]["conversation_progress"]["Row"];
export type ConversationMessageRead = Database["public"]["Tables"]["conversation_message_reads"]["Row"];
export type AdminEmailConfig = Database["public"]["Tables"]["admin_email_config"]["Row"];
export type ChatReport = Database["public"]["Tables"]["chat_reports"]["Row"];
export type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];
