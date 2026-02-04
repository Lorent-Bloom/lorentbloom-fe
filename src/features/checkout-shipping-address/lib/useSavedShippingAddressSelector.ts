"use client";

import { useState } from "react";
import type { CustomerAddress } from "@entities/customer-address";

export const useSavedShippingAddressSelector = (
  addresses: CustomerAddress[],
  onSelectAddress: (addressId: number | null) => void,
) => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );

  const handleSelectAddress = (addressId: number | null) => {
    setSelectedAddressId(addressId);
    onSelectAddress(addressId);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingAddress(null);
  };

  const handleEditSuccess = () => {
    handleCloseEditDialog();
    // The parent component should refetch addresses
  };

  return {
    selectedAddressId,
    handleSelectAddress,
    addresses,
    isEditDialogOpen,
    editingAddress,
    handleEditAddress,
    handleCloseEditDialog,
    handleEditSuccess,
  };
};
