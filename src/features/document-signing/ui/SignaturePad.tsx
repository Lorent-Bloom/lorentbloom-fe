"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Eraser, PenTool } from "lucide-react";
import type { SignaturePadProps } from "../model/interface";

interface SignaturePadComponentProps extends Omit<SignaturePadProps, "onSignatureChange"> {
  onSignatureChange: (signatureData: string | null) => void;
}

export function SignaturePad({
  onSignatureChange,
  width = 400,
  height = 200,
  className,
}: SignaturePadComponentProps) {
  const t = useTranslations("document-signing");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Get canvas context
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  }, []);

  // Get coordinates from event
  const getCoordinates = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    setIsDrawing(true);
    lastPointRef.current = coords;
  }, [getCoordinates]);

  // Draw
  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !lastPointRef.current) return;
    e.preventDefault();
    const ctx = getContext();
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    lastPointRef.current = coords;
    setIsSigned(true);
  }, [isDrawing, getContext, getCoordinates]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (isDrawing && isSigned) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        onSignatureChange(dataUrl);
      }
    }
    setIsDrawing(false);
    lastPointRef.current = null;
  }, [isDrawing, isSigned, onSignatureChange]);

  // Clear signature
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsSigned(false);
    onSignatureChange(null);
  }, [getContext, onSignatureChange]);

  // Setup event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PenTool className="h-4 w-4" />
          {t("signatureTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-white dark:bg-slate-950">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="touch-none"
            style={{
              width: "100%",
              height: `${height}px`,
            }}
          />
          {!isSigned && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {t("signatureHint")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isSigned ? t("signatureComplete") : t("signatureRequired")}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!isSigned}
          >
            <Eraser className="mr-2 h-4 w-4" />
            {t("clearSignature")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
