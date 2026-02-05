export interface ChatInputProps {
  onSend: (
    content?: string,
    imageKeys?: string[],
  ) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
}

export interface UseChatInputReturn {
  message: string;
  setMessage: (message: string) => void;
  imageKeys: string[];
  isUploading: boolean;
  isSending: boolean;
  handleSubmit: () => Promise<void>;
  handleImageUpload: (files: File[]) => Promise<void>;
  removeImage: (index: number) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}
