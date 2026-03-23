import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Можна повернути статус, або зробити запит до беку /auth/me, щоб отримати дані юзера
  return NextResponse.json({ authenticated: true });
}
