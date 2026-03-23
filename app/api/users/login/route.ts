import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

interface BackendError {
  error?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("users/login", body);
    const { token, ...userData } = apiRes.data;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return NextResponse.json(userData, { status: 200 });
    }
    
    return NextResponse.json({ error: "Токен не знайдено" }, { status: 401 });

  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as BackendError;
      const status = error.response?.status || 500;
      const message = data?.error || data?.message || "Помилка бекенду";
      
      return NextResponse.json({ error: message }, { status });
    }

    const genericError = error as Error;
    return NextResponse.json(
      { error: genericError.message || "Внутрішня помилка сервера" }, 
      { status: 500 }
    );
  }
}