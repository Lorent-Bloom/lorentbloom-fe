export interface ChatReportButtonProps {
  conversationId: string;
}

export interface ChatReportModalProps {
  conversationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface SubmitChatReportInput {
  conversationId: string;
  description: string;
}
