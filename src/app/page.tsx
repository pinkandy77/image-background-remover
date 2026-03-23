"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("请上传图片文件");
      return;
    }
    setFile(f);
    setResult("");
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("border-purple-500", "bg-purple-50");
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "Rhc2ubvjW4aT78ypzRBw5jSE" },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message || "处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🖼️ Remove Background
        </h1>

        <div
          ref={dropRef}
          className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
          onClick={() => document.getElementById("file")?.click()}
          onDragOver={(e) => { e.preventDefault(); dropRef.current?.classList.add("border-purple-500", "bg-purple-50"); }}
          onDragLeave={() => dropRef.current?.classList.remove("border-purple-500", "bg-purple-50")}
          onDrop={handleDrop}
        >
          <input
            id="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600">点击或拖拽上传图片</p>
        </div>

        {preview && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">原始图片：</p>
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {loading ? "处理中..." : "移除背景"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">处理结果：</p>
            <img src={result} alt="Result" className="max-h-64 mx-auto rounded-lg shadow" />
            <a
              href={result}
              download="removed-bg.png"
              className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600"
            >
              ⬇️ 下载图片
            </a>
          </div>
        )}

        <p className="text-center text-gray-400 text-xs mt-6">
          免费额度: 100张/月 | Powered by Remove.bg
        </p>
      </div>
    </div>
  );
}