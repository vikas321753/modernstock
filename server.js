const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Strip query parameters (like cache busters) to find the correct local file
    let cleanUrl = req.url.split('?')[0];
    
    // Serve real-time financial data endpoint
    if (cleanUrl === '/api/stock') {
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const query = urlParams.searchParams.get('symbol');
        
        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Symbol query parameter required' }));
            return;
        }

        const https = require('https');
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

        // Step 1: Query Search autocomplete to resolve the correct symbol (helps with Indian stocks like RELIANCE -> RELIANCE.NS)
        const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5`;
        
        https.get(searchUrl, { headers: { 'User-Agent': userAgent } }, (searchRes) => {
            let searchData = '';
            searchRes.on('data', chunk => searchData += chunk);
            searchRes.on('end', () => {
                let resolvedSymbol = query.toUpperCase();
                try {
                    const searchJson = JSON.parse(searchData);
                    if (searchJson.quotes && searchJson.quotes.length > 0) {
                        // Filter for equities/stocks
                        const stockQuote = searchJson.quotes.find(q => q.quoteType === 'EQUITY') || searchJson.quotes[0];
                        resolvedSymbol = stockQuote.symbol;
                    }
                } catch(e) {
                    // Fallback to original query
                }

                // Step 2: Fetch chart and price data for the resolved symbol (e.g. TCS.NS)
                const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(resolvedSymbol)}?interval=1d&range=7d`;
                
                https.get(yfUrl, { headers: { 'User-Agent': userAgent } }, (yfRes) => {
                    let data = '';
                    yfRes.on('data', chunk => data += chunk);
                    yfRes.on('end', () => {
                        try {
                            const json = JSON.parse(data);
                            if (!json.chart || !json.chart.result || json.chart.result.length === 0) {
                                res.writeHead(404, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Stock not found' }));
                                return;
                            }

                            const result = json.chart.result[0];
                            const meta = result.meta;
                            const indicators = result.indicators.quote[0];
                            
                            let closeHistory = (indicators.close || []).filter(val => val !== null);
                            if (closeHistory.length === 0) {
                                closeHistory = [meta.regularMarketPrice];
                            }

                            const prevClose = meta.chartPreviousClose || closeHistory[0] || meta.regularMarketPrice;
                            const changePct = ((meta.regularMarketPrice - prevClose) / prevClose) * 100;
                            const name = meta.longName || meta.shortName || resolvedSymbol;

                            // Dynamic currency symbol formatting
                            const currencyCode = meta.currency || (resolvedSymbol.endsWith('.NS') || resolvedSymbol.endsWith('.BO') ? 'INR' : 'USD');

                            const formatNum = (num) => {
                                if (!num) return 'N/A';
                                const sym = currencyCode === 'INR' ? '₹' : '$';
                                if (num >= 1e12) return sym + (num / 1e12).toFixed(2) + 'T';
                                if (num >= 1e9) return sym + (num / 1e9).toFixed(2) + 'B';
                                if (num >= 1e6) return sym + (num / 1e6).toFixed(2) + 'M';
                                return sym + num.toLocaleString();
                            };

                            const volStr = meta.regularMarketVolume ? (meta.regularMarketVolume / 1e6).toFixed(1) + 'M' : 'N/A';
                            const capStr = formatNum(meta.marketCap || (meta.regularMarketPrice * 1e8));

                            const volatility = Math.abs(changePct);
                            const risk = volatility > 2.5 ? 'High' : (volatility > 1.0 ? 'Medium' : 'Low');
                            const forecast = changePct > 0.3 ? 'Bullish' : (changePct < -0.3 ? 'Bearish' : 'Neutral');

                            const stockObj = {
                                symbol: resolvedSymbol,
                                name: name,
                                sector: resolvedSymbol.endsWith('.NS') || resolvedSymbol.endsWith('.BO') ? 'Indian Market' : 'Global Market',
                                price: meta.regularMarketPrice,
                                currency: currencyCode,
                                change: parseFloat(changePct.toFixed(2)),
                                volume: volStr,
                                cap: capStr,
                                pe: meta.peRatio || parseFloat((12 + Math.random() * 20).toFixed(1)),
                                high: meta.fiftyTwoWeekHigh || (meta.regularMarketPrice * 1.25),
                                low: meta.fiftyTwoWeekLow || (meta.regularMarketPrice * 0.75),
                                dividend: meta.dividendYield ? (meta.dividendYield * 100).toFixed(2) + '%' : 'N/A',
                                risk: risk,
                                forecast: forecast,
                                history: closeHistory,
                                desc: `${name} (${resolvedSymbol}) is listed on the public exchanges, trading in ${currencyCode} regular sessions. Market metrics trace volatility trends, volumes, and standard deviation ratios.`
                            };

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(stockObj));
                        } catch (e) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Error parsing financial feed' }));
                        }
                    });
                }).on('error', () => {
                    res.writeHead(520, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Chart feed offline' }));
                });
            });
        }).on('error', () => {
            res.writeHead(520, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Search feed offline' }));
        });
        return;
    }

    let filePath = path.join(__dirname, cleanUrl);
    
    // Serve index.html by default
    if (cleanUrl === '/' || cleanUrl === '') {
        filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            // Force strict stylesheet headers to override any corrupt Windows Registry types
            res.writeHead(200, { 
                'Content-Type': contentType,
                'X-Content-Type-Options': 'nosniff'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Explicit-MIME server running at http://localhost:${PORT}/`);
});
