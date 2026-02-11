import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "@shared/api";
import { getCustomer } from "@entities/customer";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ valid: false, hasToken: false });
  }

  try {
    const customer = await getCustomer();

    if (customer) {
      return NextResponse.json({ valid: true, hasToken: true, customer });
    }

    // Token is invalid or expired - return invalid status
    return NextResponse.json(
      { valid: false, hasToken: true },
      { status: 401 },
    );
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, hasToken: true },
      { status: 401 },
    );
  }
}
