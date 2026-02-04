export interface ChatIconProps {
  className?: string;
}

export interface UseChatIconReturn {
  unreadCount: number;
  isOpen: boolean;
  handleClick: () => void;
  handleClose: () => void;
}
