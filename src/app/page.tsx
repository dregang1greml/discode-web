"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

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
    setOutput("init");
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

  return (
    <div className="p-[20px]">
      <h1 className="mb-4">Discord Bot Online Compiler</h1>

      <div className="flex gap-2 mb-2 border-b pb-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className={`flex items-center px-2 py-1 rounded-t ${
              idx === activeIndex
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <button onClick={() => setActiveIndex(idx)} className="mr-2">
              {file.name}
            </button>
            <button
              onClick={() => removeFile(idx)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={addNewFile}
          className="px-4 py-2 bg-black text-white rounded-t"
        >
          New File
        </button>
      </div>

      <Editor
        height="400px"
        defaultLanguage="python"
        value={files[activeIndex].code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />

      <div className="mt-8 flex gap-4">
        <button
          onClick={runCode}
          className="px-[15px] hover:cursor-pointer rounded-md py-[10px] bg-gray-500 text-white"
        >
          Run
        </button>
        <button
          onClick={() =>
            downloadFile(files[activeIndex].name, files[activeIndex].code)
          }
          className="px-[15px] hover:cursor-pointer rounded-md py-[10px] bg-blue-500 text-white"
        >
          Save File
        </button>
      </div>

      <h3 className="mt-5">Output:</h3>
      <pre className="bg-[#1e1e1e] text-white p-[10px] min-h-[100px]">
        {output}
      </pre>
    </div>
  );
}
