import { checkAndVerifyActiveUsers } from "@/server/checkUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await checkAndVerifyActiveUsers();
    return NextResponse.json(
      { message: "Users checked and verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking and verifying users:", error);
    return NextResponse.json(
      { error: "Failed to check and verify users" },
      { status: 500 }
    );
  }
}
