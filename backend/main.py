from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import tempfile, os
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  #local url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.get("/")
def root():
    return {"message": "backend is runnin broski"}

@app.post("/run")
def run_code(req: CodeRequest):
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tmp:
        tmp.write(req.code.encode("utf-8"))
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["python", tmp_path],  #no dockr yet in thiss proj
            capture_output=True, text=True, timeout=5
        )
        return {"stdout": result.stdout, "stderr": result.stderr}
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Execution timed out"}
    finally:
        os.unlink(tmp_path)


@app.get("/status")
def root():
    return {"status": "ok"}