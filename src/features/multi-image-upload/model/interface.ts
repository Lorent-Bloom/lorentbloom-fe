export interface ImageFile {
  id: string;
  file: File | null;
  preview: string; // blob URL or existing URL
  position: number;
  is_main: boolean;
  base64?: string;
}

export interface MultiImageUploadProps {
  value: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  disabled?: boolean;
  error?: string;
}
