import { renderToBuffer } from "@react-pdf/renderer";
import {
  RentalContract,
  type RentalContractData,
} from "./templates/RentalContract";

export async function generateRentalContractPdf(
  data: RentalContractData,
  locale?: string,
): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(
    RentalContract({
      data: { ...data, locale: locale || data.locale || "ro" },
    }),
  );
  return Buffer.from(pdfBuffer);
}

export type { RentalContractData };
