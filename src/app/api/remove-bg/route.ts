import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 转发到 remove.bg API
    const apiFormData = new FormData();
    apiFormData.append("image_file", imageFile);
    apiFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": "Rhc2ubvjW4aT78ypzRBw5jSE" },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    // 返回图片
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="removed-bg.png"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}