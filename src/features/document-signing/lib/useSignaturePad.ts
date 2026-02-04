"use client";

import { useRef, useState, useCallback } from "react";
import type SignatureCanvas from "react-signature-canvas";

export interface UseSignaturePadReturn {
  signatureRef: React.RefObject<SignatureCanvas | null>;
  signature: string | null;
  isSigned: boolean;
  handleClear: () => void;
  handleEnd: () => void;
}

export function useSignaturePad(): UseSignaturePadReturn {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  const handleClear = useCallback(() => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignature(null);
      setIsSigned(false);
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataUrl = signatureRef.current.toDataURL("image/png");
      setSignature(dataUrl);
      setIsSigned(true);
    }
  }, []);

  return {
    signatureRef,
    signature,
    isSigned,
    handleClear,
    handleEnd,
  };
}
