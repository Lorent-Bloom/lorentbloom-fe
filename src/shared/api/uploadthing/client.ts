import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "./core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

/**
 * Construct UploadThing file URL from file key
 * @param key - The file key returned from upload
 * @returns Full URL to access the file
 */
export function getUploadThingUrl(key: string): string {
  return `https://utfs.io/f/${key}`;
}
