from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from hash_engine import compute_hashes
from virustotal import check_virustotal, check_url_virustotal

app = FastAPI(title="HashVault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "HashVault API is running"}

@app.post("/scan")
async def scan_file(file: UploadFile = File(...)):
    # Read file bytes
    file_bytes = await file.read()
    
    # Compute hashes
    hashes = compute_hashes(file_bytes)
    
    # Check VirusTotal using SHA256
    vt_results = await check_virustotal(hashes["SHA256"])
    
    return {
        "hashes": hashes,
        "virustotal": vt_results,
        "filename": file.filename,
        "size": len(file_bytes)
    }

class URLScanRequest(BaseModel):
    url: str

@app.post("/scan-url")
async def scan_url(request: URLScanRequest):
    # Check VirusTotal using URL
    vt_results = await check_url_virustotal(request.url)
    
    return {
        "virustotal": vt_results,
        "url": request.url
    }
