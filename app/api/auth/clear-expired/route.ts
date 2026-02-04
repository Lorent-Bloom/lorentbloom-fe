import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "@shared/api";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);

    const { locale } = await request.json();
    const redirectUrl = `/${locale || "en"}/sign-in`;

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error("Failed to clear expired token:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear token" },
      { status: 500 },
    );
  }
}
