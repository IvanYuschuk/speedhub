import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api"; // Перевір, щоб тут було рівно 3 рази "../"
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  console.log(">>> API Register Route hit!"); // Якщо побачиш це в терміналі — 404 зникне

  try {
    const body = await req.json();

    // Стукаємо на твій Express бекенд (Render)
    // Переконайся, що в api.ts baseURL закінчується на /api
    const apiRes = await api.post("users/register", body);

    return NextResponse.json(apiRes.data, { status: 201 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios Error in Register:", error.response?.data);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Помилка реєстрації на сервері",
        },
        { status: error.response?.status || 400 },
      );
    }

    console.error("Unknown Error in Register:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера Next.js" },
      { status: 500 },
    );
  }
}
