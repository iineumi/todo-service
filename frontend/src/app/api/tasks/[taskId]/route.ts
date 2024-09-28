import { NextResponse } from "next/server";

type Params = {
  taskId: string
}

const apiUrl = process.env.API_URL;

export async function PUT(request: Request, context: { params: Params }) {
  if (!apiUrl) {
    console.error("API_URLが設定されていません");
    return NextResponse.json({ error: "API_URLが設定されていません" }, { status: 500 });
  }

  try {
    const taskId = context.params.taskId;
    const body = await request.json();
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      return NextResponse.json(updatedTask);
    } else {
      return NextResponse.json({ error: "タスクの更新に失敗しました" }, { status: response.status });
    }
  } catch (error) {
    console.error("タスクの更新に失敗しました:", error);
    return NextResponse.json({ error: "タスクの更新に失敗しました" }, { status: 500 });
  }
}
