import { Task } from "@/models/Task";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL;

export async function GET(req: Request) {
  if (!apiUrl) {
    console.error("API_URLが設定されていません");
    return NextResponse.json({ error: "API_URLが設定されていません" }, { status: 500 });
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    const tasks: Task[] = await response.json();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("タスクの取得に失敗しました:", error);
    return NextResponse.json({ error: "タスクの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!apiUrl) {
    console.error("API_URLが設定されていません");
    return NextResponse.json({ error: "API_URLが設定されていません" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    const newTask = await response.json();
    return NextResponse.json(newTask);
  } catch (error) {
    console.error("タスクの作成に失敗しました:", error);
    return NextResponse.json({ error: "タスクの作成に失敗しました" }, { status: 500 });
  }
}
