"use client";

import { useState } from "react";

export function useProductReviewsSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    // Increment trigger to refresh the review list
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    refreshTrigger,
    handleReviewSubmitted,
  };
}
