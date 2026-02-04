export interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export interface ChatListProps {
  currentUserId: string;
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
}

export interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  onBack?: () => void;
  showBackButton?: boolean;
}
