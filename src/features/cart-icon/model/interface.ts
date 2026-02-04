export interface CartIconProps {
  className?: string;
}

export interface CartIconClientProps {
  itemCount: number;
  onCartClick: () => void;
  className?: string;
}
