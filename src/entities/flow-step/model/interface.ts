import type { ConversationStep as ConversationStepDB, ConversationProgress } from "@shared/api/supabase";

export type ConversationStep = ConversationStepDB;
export type { ConversationProgress };

export type TriggeredBy = "owner" | "receiver" | "system";
export type RequiredAction = "confirm" | "upload_images" | "both" | "none";
export type NotifyParty = "owner" | "receiver" | "both";

export interface FlowStepConfig {
  stepKey: string;
  stepOrder: number;
  name: string;
  description?: string;
  triggeredBy: TriggeredBy;
  requiredAction: RequiredAction;
  notifyParty: NotifyParty;
  nextStepId: number | null;
}

export interface CompleteStepInput {
  conversationId: string;
  stepId: number;
  imageKeys?: string[];
}

export interface FlowStepBadgeProps {
  currentStepId: number | null;
  steps: ConversationStep[];
}

export interface FlowStepProgressProps {
  currentStepId: number | null;
  completedSteps: ConversationProgress[];
  steps: ConversationStep[];
}
