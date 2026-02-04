import type { DocumentWithRole } from "@entities/document";

export interface DocumentsPageProps {
  documents: DocumentWithRole[];
  userEmail: string;
}
