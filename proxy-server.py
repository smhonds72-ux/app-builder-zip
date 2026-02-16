from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import sys
from pathlib import Path

# Add current directory to Python path
sys.path.append(str(Path(__file__).parent))

try:
    from dotenv import load_dotenv
except ImportError:
    print("❌ python-dotenv not installed. Run: pip install python-dotenv")
    sys.exit(1)

try:
    import logging
except ImportError:
    print("❌ logging module not available")
    sys.exit(1)

# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

app = FastAPI(title="Grid API Proxy")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/proxy-download/{series_id}")
async def download_series_file(series_id: str):
    """Download series file from GRID API"""
    try:
        api_key = os.getenv("VITE_GRID_API_KEY")
        
        if not api_key:
            logger.error("❌ API key not configured")
            return {"error": "API key not configured"}, 500
        
        logger.info(f"🔍 Proxying file download for series: {series_id}")
        logger.info(f"🔑 API Key available: YES")
        
        url = f"https://api.grid.gg/file-download/end-state/grid/series/{series_id}"
        headers = {"x-api-key": api_key}
        
        logger.info(f"🌐 Fetching from: {url}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers)
            
            logger.info(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ Successfully downloaded series {series_id} data, size: {len(str(data))} bytes")
                return data
            else:
                error_text = response.text
                logger.error(f"❌ File Download Error: {response.status_code} {response.reason_phrase}")
                logger.error(f"❌ Error details: {error_text}")
                return {"error": f"Failed to download file: {response.status_code} {response.reason_phrase}"}, response.status_code
                
    except httpx.TimeoutException:
        logger.error("❌ Request timeout")
        return {"error": "Request timeout"}, 504
    except Exception as e:
        logger.error(f"❌ File download error: {str(e)}")
        return {"error": str(e)}, 500

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "OK", "timestamp": "2024-04-24T15:00:07+02:00"}

if __name__ == "__main__":
    try:
        import uvicorn
    except ImportError:
        print("❌ uvicorn not installed. Run: pip install uvicorn")
        sys.exit(1)
    
    uvicorn.run(app, host="localhost", port=3001, log_level="info")
