import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy endpoint for Grid API file download
app.get('/api/proxy-download/:seriesId', async (req, res) => {
  try {
    const { seriesId } = req.params;
    const apiKey = process.env.VITE_GRID_API_KEY;
    
    console.log(`🔍 Proxying file download for series: ${seriesId}`);
    console.log(`🔑 API Key available: ${apiKey ? 'YES' : 'NO'}`);
    
    if (!apiKey) {
      console.error('❌ API key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    console.log(`🌐 Fetching from: https://api.grid.gg/file-download/end-state/grid/series/${seriesId}`);
    
    const response = await fetch(`https://api.grid.gg/file-download/end-state/grid/series/${seriesId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ File Download Error: ${response.status} ${response.statusText}`);
      console.error(`❌ Error details: ${errorText}`);
      throw new Error(`File Download Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully downloaded series ${seriesId} data, size: ${JSON.stringify(data).length} bytes`);
    
    res.json(data);
    
  } catch (error) {
    console.error(`❌ Error proxying file download:`, error);
    console.error(`❌ Stack trace:`, error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 File download proxy: http://localhost:${PORT}/api/proxy-download/:seriesId`);
});
