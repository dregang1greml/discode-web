from fastapi import FastAPI
from pydantic import BaseModel
import subprocess, tempfile, os, threading
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://discode-web.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

running_process = None
running_logs = []
current_file = None 

def stream_output(pipe, prefix):
    """Read process stdout/stderr line by line and store them."""
    global running_logs
    for line in iter(pipe.readline, ''):
        if not line:
            break
        running_logs.append(f"[{prefix}] {line.strip()}")

@app.post("/run")
def run_code(req: CodeRequest):
    global running_process, running_logs, current_file

    if running_process and running_process.poll() is None:
        return {"error": "A bot is already running. Stop it first."}

    running_logs = [] 
    tmp = tempfile.NamedTemporaryFile(suffix=".py", delete=False)
    tmp.write(req.code.encode("utf-8"))
    tmp_path = tmp.name
    tmp.close()
    current_file = tmp_path 

    process = subprocess.Popen(
        ["python", tmp_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

    running_process = process

    threading.Thread(target=stream_output, args=(process.stdout, "OUT"), daemon=True).start()
    threading.Thread(target=stream_output, args=(process.stderr, "INFO"), daemon=True).start()

    return {"status": "Bot started", "pid": process.pid}

@app.get("/logs")
def get_logs():
    return {"logs": running_logs}

@app.post("/stop")
def stop_bot():
    global running_process, current_file
    if running_process and running_process.poll() is None:
        running_process.terminate()
        running_process.wait()

    if current_file and os.path.exists(current_file):
        os.unlink(current_file)
        current_file = None

    return {"status": "Bot stopped"}