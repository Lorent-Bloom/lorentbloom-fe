import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lorent Bloom - Rental Marketplace in Moldova";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const taglines: Record<string, string> = {
  en: "Rental Marketplace in Moldova",
  ru: "Маркетплейс аренды в Молдове",
  ro: "Piața de închiriere în Moldova",
};

const subtitles: Record<string, string> = {
  en: "Rent electronics, tools, equipment and more in Chișinău",
  ru: "Аренда электроники, инструментов и оборудования в Кишинёве",
  ro: "Închiriază electronice, unelte, echipamente în Chișinău",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = taglines[locale] || taglines.en;
  const subtitle = subtitles[locale] || subtitles.en;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d9488 0%, #6366f1 100%)",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          padding: "50px 60px",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#0d9488",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          Lorent Bloom
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "12px",
            display: "flex",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#6b7280",
            textAlign: "center",
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
