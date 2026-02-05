import type {
  ConversationStep,
  ConversationProgress,
} from "@entities/flow-step";
import type { Conversation } from "@entities/conversation";

export interface FlowStepActionProps {
  conversation: Conversation;
  currentStep: ConversationStep | null;
  completedSteps: ConversationProgress[];
  currentUserId: string;
  onStepComplete: () => void;
}

export interface UseFlowStepActionReturn {
  canTrigger: boolean;
  requiresImages: boolean;
  requiresConfirm: boolean;
  isCompleting: boolean;
  imageKeys: string[];
  isUploading: boolean;
  handleImageUpload: (files: File[]) => Promise<void>;
  removeImage: (index: number) => void;
  handleComplete: () => Promise<void>;
  userRole: "owner" | "receiver";
}
