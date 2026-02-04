import { NextResponse } from "next/server";
import { getCustomer } from "@entities/customer";

export async function GET() {
  try {
    const customer = await getCustomer();

    if (customer) {
      return NextResponse.json({ valid: true, customer });
    }

    // Token is invalid or expired - return invalid status
    return NextResponse.json({ valid: false }, { status: 401 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
