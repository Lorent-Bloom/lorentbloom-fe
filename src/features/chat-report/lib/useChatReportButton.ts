"use client";

import { useState, useCallback } from "react";

export const useChatReportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};
