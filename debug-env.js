// Test environment variables in the browser console
console.log('🔍 Environment Variables Debug');
console.log('==================================');

// Check all VITE_ variables
const viteVars = {};
for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith('VITE_')) {
        viteVars[key] = value ? (key.includes('KEY') ? `${value.substring(0, 10)}...` : value) : 'NOT SET';
    }
}

console.log('🔑 VITE Variables:', viteVars);

// Specifically check Grid API key
const gridApiKey = import.meta.env.VITE_GRID_API_KEY;
console.log('🔑 Grid API Key:', gridApiKey ? `${gridApiKey.substring(0, 20)}...` : 'NOT FOUND');

// Test API call if key exists
if (gridApiKey && gridApiKey !== 'placeholder') {
    console.log('📡 Testing API call...');
    
    fetch('https://api-op.grid.gg/central-data/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gridApiKey}`,
            'X-API-Key': gridApiKey
        },
        body: JSON.stringify({
            query: `query GetPlayers($first: Int) { players(first: $first) { edges { node { id nickname title { name } } } totalCount } }`,
            variables: { first: 3 }
        }),
    })
    .then(response => response.json())
    .then(result => {
        if (result.data) {
            console.log('✅ API call successful!');
            console.log('📊 Total players:', result.data.players.totalCount);
            console.log('👥 Players:', result.data.players.edges.map(p => p.node.nickname));
        } else {
            console.log('❌ API call failed:', result.errors);
        }
    })
    .catch(error => {
        console.log('❌ Network error:', error);
    });
} else {
    console.log('❌ No Grid API key found');
}

console.log('📋 Instructions:');
console.log('1. Check if VITE_GRID_API_KEY is properly set');
console.log('2. Restart dev server if you changed .env.local');
console.log('3. Open browser console to see this debug output');
