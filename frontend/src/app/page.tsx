"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { About } from "@/components/custom/index/about";

type FileTab = {
  name: string;
  code: string;
};

export default function Home() {
  const [files, setFiles] = useState<FileTab[]>([
    {
      name: "bot.py",
      code: `
import sys
sys.stdout.reconfigure(encoding='utf-8')
import discord
from discord.ext import commands
import os

#paste here your bot token
TOKEN = "BOT_TOKEN"

intents = discord.Intents.default()
intents.message_content = True

#prefix
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.command()
async def ping(ctx):
    await ctx.send("test")

# 3. Run bot
bot.run(TOKEN)

      `,
    },
  ]);
  const [activeIndex, _] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [polling, setPolling] = useState(false);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const saved = localStorage.getItem("files");
    if (saved) setFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(async () => {
      const res = await fetch("https://discode-web.onrender.com/logs");
      const data = await res.json();
      setOutput(data.logs || []);
    }, 2000);
    return () => clearInterval(id);
  }, [polling]);

  const runBot = async () => {
    const res = await fetch("https://discode-web.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: files[activeIndex].code }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setPolling(true);
      setStatus(`Running (PID ${data.pid})`);
      setOutput([`Bot started with PID ${data.pid}`]);
    }
  };

  const stopBot = async () => {
    const res = await fetch("https://discode-web.onrender.com/stop", {
      method: "POST",
    });
    const data = await res.json();
    setOutput((prev) => [...prev, data.status]);
    setPolling(false);
    setStatus("Stopped");
  };

  const handleEditorChange = (value: string | undefined) => {
    const updated = [...files];
    updated[activeIndex].code = value ?? "";
    setFiles(updated);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Discord Bot Online Compiler</h1>
      <p className="mt-3 text-sm underline">
        <em>
          Please note: because the backend is hosted on Render&apos;s free tier
          using FastAPI, compilation responses may be slower and unstable at
          times.
        </em>
      </p>
      <div className="text-sm text-gray-600">Status: {status}</div>

      <div className="rounded-lg border overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="python"
          value={files[activeIndex].code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>

      <div className="flex gap-3">
        <button
          disabled={!files[activeIndex].code.trim() || polling}
          onClick={runBot}
          className={`px-4 py-2 rounded-md border text-sm font-medium ${
            !files[activeIndex].code.trim() || polling
              ? "bg-gray-500 text-gray-300"
              : "bg-black text-white"
          }`}
        >
          {polling ? "Running…" : "Run Bot"}
        </button>
        <button
          onClick={stopBot}
          disabled={!polling}
          className={`px-4 py-2 rounded-md border text-sm font-medium ${
            polling ? "bg-black text-white" : "bg-gray-500 text-gray-300"
          }`}
        >
          Stop Bot
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Logs:</h3>
        <section className="h-[200px] overflow-y-auto bg-black text-white p-3 text-sm">
          <pre className="whitespace-pre-wrap">
            {output.length ? output.join("\n") : "No output yet"}
          </pre>
        </section>
      </div>
      <About />
    </main>
  );
}
