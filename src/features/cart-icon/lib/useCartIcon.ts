"use client";

import { useState } from "react";

export const useCartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCartClick = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    setIsOpen,
    handleCartClick,
  };
};
