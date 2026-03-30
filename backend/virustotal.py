import os
import httpx
import base64
from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.getenv("VT_API_KEY")
VT_API_URL_FILES = "https://www.virustotal.com/api/v3/files/"
VT_API_URL_URLS = "https://www.virustotal.com/api/v3/urls/"

async def check_virustotal(sha256: str) -> dict:
    """
    Checks the given SHA256 hash against VirusTotal API.
    Returns a dict with verdict, flagged_count, and total_engines.
    """
    if not VT_API_KEY:
        return {"verdict": "unknown", "flagged_count": 0, "total_engines": 0, "error": "API Key missing"}

    headers = {
        "x-apikey": VT_API_KEY,
        "accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{VT_API_URL_FILES}{sha256}", headers=headers)
            
            if response.status_code == 404:
                return {"verdict": "unknown", "flagged_count": 0, "total_engines": 0, "message": "File not seen before"}
            
            response.raise_for_status()
            data = response.json()
            
            stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            undetected = stats.get("undetected", 0)
            harmless = stats.get("harmless", 0)
            
            flagged_count = malicious + suspicious
            total_engines = flagged_count + undetected + harmless
            
            if malicious > 0:
                verdict = "malicious"
            elif suspicious > 0:
                verdict = "suspicious"
            else:
                verdict = "clean"
                
            return {
                "verdict": verdict,
                "flagged_count": flagged_count,
                "total_engines": total_engines
            }
        except Exception as e:
            return {"verdict": "error", "flagged_count": 0, "total_engines": 0, "error": str(e)}

async def check_url_virustotal(url: str) -> dict:
    """
    Checks the given URL against VirusTotal API by url-safe encoding it.
    """
    if not VT_API_KEY:
        return {"verdict": "unknown", "flagged_count": 0, "total_engines": 0, "error": "API Key missing"}

    # VT requires URL to be url-safe base64 encoded without padding
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")

    headers = {
        "x-apikey": VT_API_KEY,
        "accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{VT_API_URL_URLS}{url_id}", headers=headers)
            
            if response.status_code == 404:
                return {"verdict": "unknown", "flagged_count": 0, "total_engines": 0, "message": "URL not seen before"}
            
            response.raise_for_status()
            data = response.json()
            
            stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            undetected = stats.get("undetected", 0)
            harmless = stats.get("harmless", 0)
            
            flagged_count = malicious + suspicious
            total_engines = flagged_count + undetected + harmless
            
            if malicious > 0:
                verdict = "malicious"
            elif suspicious > 0:
                verdict = "suspicious"
            else:
                verdict = "clean"
                
            return {
                "verdict": verdict,
                "flagged_count": flagged_count,
                "total_engines": total_engines
            }
        except Exception as e:
            return {"verdict": "error", "flagged_count": 0, "total_engines": 0, "error": str(e)}
