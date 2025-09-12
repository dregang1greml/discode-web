"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import FileMenu from "@/components/custom/index/menu";

type FileTab = {
  name: string;
  code: string;
};

export default function Home() {
  const [files, setFiles] = useState<FileTab[]>([{ name: "bot.py", code: "" }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("files");
    if (saved) setFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  const runCode = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: files[activeIndex].code }),
      });

      const data = await res.json();
      setOutput(data.stderr ? data.stderr : data.stdout);
    } catch (err) {
      setOutput("error connecting to backend");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const updated = [...files];
    updated[activeIndex].code = value ?? "";
    setFiles(updated);
  };

  const addNewFile = () => {
    setFiles([...files, { name: `file${files.length + 1}.py`, code: "" }]);
    setActiveIndex(files.length);
  };

  const downloadFile = (fileName: string, code: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const removeFile = (index: number) => {
    if (files.length === 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (activeIndex >= index) {
      setActiveIndex(Math.max(0, activeIndex - 1));
    }
  };

  const renameFile = (index: number) => {
    const newName = prompt("Enter new file name", files[index].name);
    if (newName) {
      const updated = [...files];
      updated[index].name = newName + ".py";
      setFiles(updated);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Discord Bot Online Compiler</h1>

      <div className=" flex flex-wrap items-center gap-2 border-b pb-2 z-50">
        {files.map((file, idx) => (
          <div
            key={idx}
            className={`flex items-center rounded-t-lg border px-2 py-1 ${
              idx === activeIndex ? "font-semibold" : ""
            }`}
          >
            <button
              onClick={() => setActiveIndex(idx)}
              className="mr-1 text-sm focus:outline-none"
            >
              {file.name}
            </button>

            <FileMenu
              onRename={() => renameFile(idx)}
              onDownload={() => downloadFile(files[idx].name, files[idx].code)}
              onRemove={() => removeFile(idx)}
            />
          </div>
        ))}

        <button
          onClick={addNewFile}
          className="px-3 py-1 rounded-t-lg border text-sm font-medium"
        >
          <b>&#43;</b> New File
        </button>
      </div>

      <div className="rounded-lg border overflow-hidden -z-40">
        <Editor
          height="400px"
          defaultLanguage="python"
          value={files[activeIndex].code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>

      <div className="flex gap-3">
        <button
          disabled={!files[activeIndex].code.trim()}
          onClick={runCode}
          className={`px-4 ${
            !files[activeIndex].code.trim()
              ? "bg-gray-500 text-gray-300"
              : "bg-white text-black hover:cursor-pointer"
          } py-2 rounded-md border text-sm font-medium `}
        >
          Run
        </button>
        <button
          onClick={() =>
            downloadFile(files[activeIndex].name, files[activeIndex].code)
          }
          className="px-4 py-2 rounded-md border text-sm font-medium"
        >
          Save File
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Output:</h3>
        <section className="h-[200px] overflow-y-auto bg-black text-white p-3 text-sm">
          <pre className="otext-sm whitespace-pre-wrap">{output}</pre>
        </section>
      </div>
    </div>
  );
}
