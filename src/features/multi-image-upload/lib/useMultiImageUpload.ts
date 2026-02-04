import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ImageFile, MultiImageUploadProps } from "../model/interface";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_MAX_IMAGES,
} from "../model/const";

export const useMultiImageUpload = ({
  value,
  onChange,
  maxImages = DEFAULT_MAX_IMAGES,
  disabled,
}: MultiImageUploadProps) => {
  const t = useTranslations("multi-image-upload");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Max dimensions for compression
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(t("invalidFileType"));
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("fileTooLarge"));
      return false;
    }
    return true;
  };

  const handleAddImages = async (files: FileList | File[]) => {
    if (disabled) return;

    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(validateFile);

    if (value.length + validFiles.length > maxImages) {
      toast.error(t("maxImagesReached", { max: maxImages }));
      return;
    }

    const newImages: ImageFile[] = [];

    for (const file of validFiles) {
      const id = `${Date.now()}-${Math.random()}`;
      setUploadingIds((prev) => [...prev, id]);

      try {
        const base64 = await compressImage(file);
        const preview = URL.createObjectURL(file);

        newImages.push({
          id,
          file,
          preview,
          position: value.length + newImages.length,
          is_main: value.length === 0 && newImages.length === 0, // First image is main by default
          base64,
        });
      } catch (error) {
        console.error("Error compressing and converting image:", error);
        toast.error(t("uploadingImage"));
      } finally {
        setUploadingIds((prev) => prev.filter((uploadId) => uploadId !== id));
      }
    }

    onChange([...value, ...newImages]);
  };

  const handleRemove = (id: string) => {
    if (disabled) return;

    const removedImageWasMain =
      value.find((i) => i.id === id)?.is_main ?? false;
    const updatedImages = value
      .filter((img) => img.id !== id)
      .map((img, idx) => ({
        ...img,
        position: idx,
        // If we removed the main image, make the first one main
        is_main: img.is_main || (removedImageWasMain && idx === 0),
      }));

    // Revoke blob URL to prevent memory leaks
    const removedImage = value.find((img) => img.id === id);
    if (removedImage?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.preview);
    }

    onChange(updatedImages);
  };

  const handleSetMain = (id: string) => {
    if (disabled) return;

    const updatedImages = value.map((img) => ({
      ...img,
      is_main: img.id === id,
    }));

    onChange(updatedImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    if (toIndex < 0 || toIndex >= value.length) return;

    const updatedImages = [...value];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);

    // Update positions
    const reorderedImages = updatedImages.map((img, idx) => ({
      ...img,
      position: idx,
    }));

    onChange(reorderedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleAddImages(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAddImages(e.target.files);
    }
  };

  // Image drag and drop reordering
  const handleImageDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedIndex === index) return;
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedIndex === dropIndex) return;

    handleReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    images: value,
    handleAddImages,
    handleRemove,
    handleSetMain,
    handleReorder,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
    isDragOver,
    uploadingIds,
    draggedIndex,
    t,
  };
};
