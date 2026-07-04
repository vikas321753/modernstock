document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & DATA INITIALIZATION
    // ==========================================
    let userState = {
        name: "Trader",
        email: "",
        cash: 1000000.00, // 10 Lakhs INR starting cash
        portfolio: {
            // symbol: quantity
        },
        watchlist: ["RELIANCE.NS", "TCS.NS", "INFY.NS"]
    };

    const RAW_NIFTY_50 = [
        { s: "RELIANCE.NS", n: "Reliance Industries Limited", sec: "Energy", p: 2905.40, c: 1.15, vol: "6.8M", cap: "₹19.65T", pe: 26.4, h: 3029.00, l: 2220.30, div: "0.31%", desc: "Reliance Industries Limited is an Indian multinational conglomerate, active in energy, retail, and digital services." },
        { s: "TCS.NS", n: "Tata Consultancy Services Limited", sec: "Tech", p: 3850.75, c: 0.45, vol: "2.1M", cap: "₹14.08T", pe: 29.8, h: 4254.75, l: 3070.30, div: "1.25%", desc: "Tata Consultancy Services is a global leader in IT consulting and services." },
        { s: "HDFCBANK.NS", n: "HDFC Bank Limited", sec: "Finance", p: 1512.30, c: -0.85, vol: "18.4M", cap: "₹11.48T", pe: 19.5, h: 1757.50, l: 1363.55, div: "1.29%", desc: "HDFC Bank is India's largest private sector banking and financial provider." },
        { s: "INFY.NS", n: "Infosys Limited", sec: "Tech", p: 1475.20, c: 2.10, vol: "8.5M", cap: "₹6.12T", pe: 24.1, h: 1733.00, l: 1185.30, div: "2.44%", desc: "Infosys is a pioneer in global digital consulting and information services." },
        { s: "ICICIBANK.NS", n: "ICICI Bank Limited", sec: "Finance", p: 1115.40, c: 1.35, vol: "12.2M", cap: "₹7.83T", pe: 17.6, h: 1167.00, l: 898.30, div: "0.72%", desc: "ICICI Bank is a leading Indian multinational bank offering corporate and retail products." },
        { s: "SBIN.NS", n: "State Bank of India", sec: "Finance", p: 748.90, c: 1.85, vol: "24.5M", cap: "₹6.68T", pe: 11.2, h: 839.65, l: 501.85, div: "1.83%", desc: "State Bank of India is the largest public sector bank in the country." },
        { s: "BHARTIARTL.NS", n: "Bharti Airtel Limited", sec: "Tech", p: 1210.50, c: -0.25, vol: "5.4M", cap: "₹7.15T", pe: 42.1, h: 1234.00, l: 812.30, div: "0.33%", desc: "Bharti Airtel is a global telecom operator offering mobile and high-speed broadband." },
        { s: "LTIM.NS", n: "LTIMindtree Limited", sec: "Tech", p: 4850.20, c: 1.05, vol: "0.8M", cap: "₹1.44T", pe: 32.5, h: 6300.00, l: 4510.30, div: "1.10%", desc: "LTIMindtree is a leading digital transformation and IT solutions enterprise." },
        { s: "LT.NS", n: "Larsen & Toubro Limited", sec: "Energy", p: 3550.00, c: 0.95, vol: "2.4M", cap: "₹4.85T", pe: 35.5, h: 3780.00, l: 2150.30, div: "0.80%", desc: "Larsen & Toubro is an infrastructure, engineering, and energy technology conglomerate." },
        { s: "ITC.NS", n: "ITC Limited", sec: "Consumer", p: 425.30, c: 0.15, vol: "14.5M", cap: "₹5.31T", pe: 26.8, h: 499.70, l: 360.50, div: "3.70%", desc: "ITC is a diversified conglomerate present in FMCG, hotels, paperboards, and agri-business." },
        { s: "HINDUNILVR.NS", n: "Hindustan Unilever Limited", sec: "Consumer", p: 2410.60, c: -0.65, vol: "1.5M", cap: "₹5.66T", pe: 54.2, h: 2769.00, l: 2200.30, div: "1.85%", desc: "Hindustan Unilever is the leader in Indian fast-moving consumer goods sectors." },
        { s: "AXISBANK.NS", n: "Axis Bank Limited", sec: "Finance", p: 1055.40, c: 0.85, vol: "8.2M", cap: "₹3.25T", pe: 14.6, h: 1150.00, l: 850.30, div: "0.10%", desc: "Axis Bank is India's third largest private sector bank catering to retail and corporate clients." },
        { s: "KOTAKBANK.NS", n: "Kotak Mahindra Bank Limited", sec: "Finance", p: 1780.20, c: -0.15, vol: "3.1M", cap: "₹3.54T", pe: 22.8, h: 2060.00, l: 1650.30, div: "0.08%", desc: "Kotak Mahindra Bank offers corporate, investment, and personal retail banking services." },
        { s: "ADANIENT.NS", n: "Adani Enterprises Limited", sec: "Energy", p: 3120.40, c: 3.45, vol: "2.8M", cap: "₹3.55T", pe: 95.8, h: 3740.00, l: 1510.30, div: "0.04%", desc: "Adani Enterprises is the flagship business incubator of the Adani Group." },
        { s: "ADANIPORTS.NS", n: "Adani Ports and SEZ Limited", sec: "Energy", p: 1340.50, c: 2.15, vol: "3.5M", cap: "₹2.89T", pe: 28.5, h: 1420.00, l: 650.30, div: "0.35%", desc: "Adani Ports is India's largest commercial port developer and operator." },
        { s: "ASIANPAINT.NS", n: "Asian Paints Limited", sec: "Consumer", p: 2850.30, c: -1.05, vol: "1.1M", cap: "₹2.73T", pe: 51.5, h: 3560.00, l: 2700.30, div: "1.15%", desc: "Asian Paints is India's leading paint manufacturer and home decor company." },
        { s: "BAJFINANCE.NS", n: "Bajaj Finance Limited", sec: "Finance", p: 6850.40, c: 0.65, vol: "1.8M", cap: "₹4.24T", pe: 31.6, h: 8190.00, l: 5480.30, div: "0.52%", desc: "Bajaj Finance is a premier non-banking financial company focused on consumer lending." },
        { s: "BAJAJFINSV.NS", n: "Bajaj Finserv Limited", sec: "Finance", p: 1580.60, c: 0.25, vol: "2.1M", cap: "₹2.52T", pe: 34.2, h: 1740.00, l: 1220.30, div: "0.20%", desc: "Bajaj Finserv is a holding company tracking financial services, insurance, and lending." },
        { s: "BPCL.NS", n: "Bharat Petroleum Corporation Limited", sec: "Energy", p: 590.20, c: 1.45, vol: "6.5M", cap: "₹1.28T", pe: 5.6, h: 680.00, l: 320.30, div: "4.20%", desc: "Bharat Petroleum is a major public sector oil refining and distribution company." },
        { s: "CIPLA.NS", n: "Cipla Limited", sec: "Health", p: 1380.40, c: -0.65, vol: "2.4M", cap: "₹1.11T", pe: 27.2, h: 1519.00, l: 885.50, div: "0.62%", desc: "Cipla is a prominent global pharmaceutical developer specializing in respiratory care." },
        { s: "COALINDIA.NS", n: "Coal India Limited", sec: "Metals", p: 432.10, c: -0.65, vol: "8.1M", cap: "₹2.66T", pe: 9.2, h: 487.60, l: 207.70, div: "5.62%", desc: "Coal India is the largest coal mining and refining public sector undertaking in the world." },
        { s: "DIVISLAB.NS", n: "Divi's Laboratories Limited", sec: "Health", p: 3750.30, c: 0.15, vol: "0.8M", cap: "₹0.99T", pe: 52.8, h: 4100.00, l: 3120.30, div: "0.80%", desc: "Divi's Laboratories manufactures active pharmaceutical ingredients (APIs) globally." },
        { s: "DRREDDY.NS", n: "Dr. Reddy's Laboratories Limited", sec: "Health", p: 6150.30, c: 0.12, vol: "0.8M", cap: "₹1.03T", pe: 18.5, h: 6505.90, l: 4381.10, div: "0.65%", desc: "Dr. Reddy's is a leading global generic pharma company based in Hyderabad." },
        { s: "EICHERMOT.NS", n: "Eicher Motors Limited", sec: "Auto", p: 4250.40, c: 1.85, vol: "1.2M", cap: "₹1.16T", pe: 29.5, h: 4900.00, l: 2950.30, div: "1.00%", desc: "Eicher Motors is the manufacturer of the iconic Royal Enfield brand of motorcycles." },
        { s: "GRASIM.NS", n: "Grasim Industries Limited", sec: "Metals", p: 2250.60, c: 0.35, vol: "0.9M", cap: "₹1.48T", pe: 24.5, h: 2450.00, l: 1550.30, div: "0.45%", desc: "Grasim is the flagship company of the Aditya Birla Group, active in viscose fibre." },
        { s: "HCLTECH.NS", n: "HCL Technologies Limited", sec: "Tech", p: 1620.40, c: 1.15, vol: "2.4M", cap: "₹4.40T", pe: 26.5, h: 1700.00, l: 1020.30, div: "3.20%", desc: "HCL Tech provides global enterprise software, digital, and technology consulting." },
        { s: "HEROMOTOCO.NS", n: "Hero MotoCorp Limited", sec: "Auto", p: 4650.20, c: -0.45, vol: "0.7M", cap: "₹0.93T", pe: 22.1, h: 4950.00, l: 2650.30, div: "2.10%", desc: "Hero MotoCorp is the world's largest manufacturer of two-wheeler motorcycles." },
        { s: "HINDALCO.NS", n: "Hindalco Industries Limited", sec: "Metals", p: 580.40, c: 1.55, vol: "9.2M", cap: "₹1.30T", pe: 14.5, h: 630.00, l: 380.30, div: "0.55%", desc: "Hindalco is the global leader in aluminum rolling and copper metallurgy." },
        { s: "INDUSINDBK.NS", n: "IndusInd Bank Limited", sec: "Finance", p: 1490.50, c: -0.75, vol: "3.2M", cap: "₹1.15T", pe: 12.5, h: 1650.00, l: 990.30, div: "1.30%", desc: "IndusInd Bank is a private financial institution focusing on retail and corporate banking." },
        { s: "JSWSTEEL.NS", n: "JSW Steel Limited", sec: "Metals", p: 860.30, c: 1.25, vol: "2.8M", cap: "₹2.10T", pe: 16.5, h: 920.00, l: 650.30, div: "0.40%", desc: "JSW Steel is India's leading integrated steel manufacturer with global assets." },
        { s: "M&M.NS", n: "Mahindra & Mahindra Limited", sec: "Auto", p: 1920.40, c: 2.15, vol: "3.5M", cap: "₹2.38T", pe: 18.5, h: 2020.00, l: 1120.30, div: "0.85%", desc: "Mahindra & Mahindra is the dominant Indian utility SUV and agricultural tractor manufacturer." },
        { s: "MARUTI.NS", n: "Maruti Suzuki India Limited", sec: "Auto", p: 11450.00, c: 1.65, vol: "0.5M", cap: "₹3.48T", pe: 28.5, h: 12600.00, l: 8120.30, div: "0.80%", desc: "Maruti Suzuki is India's largest passenger vehicle auto manufacturer." },
        { s: "NESTLEIND.NS", n: "Nestle India Limited", sec: "Consumer", p: 2510.30, c: -0.25, vol: "0.6M", cap: "₹2.42T", pe: 75.8, h: 2750.00, l: 1900.30, div: "1.10%", desc: "Nestle India is an FMCG giant, famous for Maggi, Nescafe, and dairy products." },
        { s: "NTPC.NS", n: "NTPC Limited", sec: "Energy", p: 362.40, c: 1.95, vol: "9.5M", cap: "₹3.51T", pe: 16.4, h: 375.80, l: 166.30, div: "2.07%", desc: "NTPC is India's largest thermal power generating public utility enterprise." },
        { s: "ONGC.NS", n: "Oil and Natural Gas Corporation Limited", sec: "Energy", p: 272.50, c: 2.30, vol: "12.8M", cap: "₹3.43T", pe: 8.8, h: 292.00, l: 150.15, div: "4.15%", desc: "ONGC is the premier oil and natural gas explorer and producer in India." },
        { s: "POWERGRID.NS", n: "Power Grid Corporation of India Limited", sec: "Energy", p: 280.40, c: 0.95, vol: "8.5M", cap: "₹2.61T", pe: 15.4, h: 310.00, l: 180.30, div: "3.50%", desc: "Power Grid transmits over half of the total electrical power generated in India." },
        { s: "SBILIFE.NS", n: "SBI Life Insurance Company Limited", sec: "Finance", p: 1480.20, c: -0.45, vol: "1.1M", cap: "₹1.48T", pe: 65.2, h: 1560.00, l: 1050.30, div: "0.15%", desc: "SBI Life is a leading joint-venture life insurance provider in the country." },
        { s: "SUNPHARMA.NS", n: "Sun Pharmaceutical Industries Limited", sec: "Health", p: 1545.10, c: -0.45, vol: "1.8M", cap: "₹3.70T", pe: 34.6, h: 1638.00, l: 955.50, div: "0.87%", desc: "Sun Pharma is India's largest multinational pharmaceutical formulation company." },
        { s: "TATACONSUM.NS", n: "Tata Consumer Products Limited", sec: "Consumer", p: 1150.30, c: 0.45, vol: "1.8M", cap: "₹1.07T", pe: 68.2, h: 1250.00, l: 700.30, div: "0.75%", desc: "Tata Consumer manages global FMCG brands like Tata Tea, Himalayan Water, and Tetley." },
        { s: "TATAMOTORS.NS", n: "Tata Motors Limited", sec: "Auto", p: 980.50, c: 1.95, vol: "15.4M", cap: "₹3.25T", pe: 16.5, h: 1065.00, l: 501.85, div: "0.31%", desc: "Tata Motors is a global automotive giant and absolute leader in Indian EV adoption." },
        { s: "TATASTEEL.NS", n: "Tata Steel Limited", sec: "Metals", p: 150.45, c: -1.15, vol: "35.2M", cap: "₹1.88T", pe: 12.8, h: 172.00, l: 95.30, div: "2.40%", desc: "Tata Steel is one of the world's most geographically diversified steelmakers." },
        { s: "TECHM.NS", n: "Tech Mahindra Limited", sec: "Tech", p: 1280.30, c: -0.35, vol: "1.5M", cap: "₹1.25T", pe: 24.2, h: 1410.00, l: 980.30, div: "3.50%", desc: "Tech Mahindra specializes in enterprise communication and digital transformational services." },
        { s: "TITAN.NS", n: "Titan Company Limited", sec: "Consumer", p: 3650.40, c: 0.75, vol: "1.2M", cap: "₹3.24T", pe: 82.5, h: 3880.00, l: 2350.30, div: "0.27%", desc: "Titan is a premier retail lifestyle provider specializing in watches, jewelry, and eyewear." },
        { s: "ULTRACEMCO.NS", n: "UltraTech Cement Limited", sec: "Metals", p: 9850.60, c: 0.55, vol: "0.5M", cap: "₹2.84T", pe: 34.5, h: 10500.00, l: 7120.30, div: "0.35%", desc: "UltraTech is the largest manufacturer of grey cement and concrete in India." },
        { s: "UPL.NS", n: "UPL Limited", sec: "Energy", p: 480.20, c: -1.05, vol: "3.1M", cap: "₹0.36T", pe: 14.8, h: 580.00, l: 420.30, div: "2.10%", desc: "UPL is a global generic agrochemical provider focusing on crop protection services." },
        { s: "WIPRO.NS", n: "Wipro Limited", sec: "Tech", p: 475.30, c: -0.15, vol: "4.5M", cap: "₹2.48T", pe: 20.2, h: 540.00, l: 350.30, div: "0.21%", desc: "Wipro provides cognitive computing, business processing, and digital consulting services." },
        { s: "APOLLOHOSP.NS", n: "Apollo Hospitals Enterprise Limited", sec: "Health", p: 6250.40, c: 1.15, vol: "0.6M", cap: "₹0.90T", pe: 85.2, h: 6800.00, l: 4200.30, div: "0.24%", desc: "Apollo Hospitals is India's leading integrated healthcare delivery system developer." },
        { s: "BRITANNIA.NS", n: "Britannia Industries Limited", sec: "Consumer", p: 4950.20, c: 0.25, vol: "0.6M", cap: "₹1.19T", pe: 54.8, h: 5350.00, l: 4100.30, div: "1.45%", desc: "Britannia is one of India's oldest and most popular food brand manufacturers." },
        { s: "INDIGO.NS", n: "InterGlobe Aviation Limited", sec: "Consumer", p: 3450.00, c: 1.35, vol: "1.2M", cap: "₹1.33T", pe: 18.2, h: 3680.00, l: 1850.30, div: "N/A", desc: "InterGlobe Aviation operates IndiGo, the largest passenger airline company in India." },
        { s: "JIOFIN.NS", n: "Jio Financial Services Limited", sec: "Finance", p: 355.20, c: 4.85, vol: "12.4M", cap: "₹2.25T", pe: 45.2, h: 380.00, l: 210.30, div: "N/A", desc: "Jio Financial Services offers technology-enabled financial, lending, and brokerage services." },
        { s: "SUZLON.NS", n: "Suzlon Energy Limited", sec: "Energy", p: 52.40, c: 4.95, vol: "45.2M", cap: "₹71.2B", pe: 125.4, h: 56.00, l: 18.30, div: "N/A", desc: "Suzlon Energy is a pioneer wind energy turbine manufacturer and green power services leader in India." },
        { s: "YESBANK.NS", n: "Yes Bank Limited", sec: "Finance", p: 24.15, c: -1.25, vol: "110.8M", cap: "₹74.5B", pe: 48.2, h: 32.80, l: 14.10, div: "N/A", desc: "Yes Bank is a private sector commercial banking provider serving corporate and retail clients." },
        { s: "ZOMATO.NS", n: "Zomato Limited", sec: "Tech", p: 185.30, c: 3.12, vol: "24.5M", cap: "₹1.62T", pe: 110.5, h: 196.80, l: 72.30, div: "N/A", desc: "Zomato is India's leading online food ordering, table reservation, and hyper-local delivery portal." },
        { s: "IRFC.NS", n: "Indian Railway Finance Corporation", sec: "Finance", p: 172.50, c: 1.85, vol: "15.4M", cap: "₹2.25T", pe: 32.4, h: 192.00, l: 37.10, div: "0.85%", desc: "IRFC is the financing arm of Indian Railways, raising capital to fund rolling stock assets." },
        { s: "NHPC.NS", n: "NHPC Limited", sec: "Energy", p: 92.15, c: -0.45, vol: "12.8M", cap: "₹92.5B", pe: 19.8, h: 115.80, l: 45.20, div: "2.10%", desc: "NHPC is a leading public sector hydroelectric power generation company in India." },
        { s: "GMRINFRA.NS", n: "GMR Airports Infrastructure Limited", sec: "Consumer", p: 82.40, c: -2.15, vol: "18.2M", cap: "₹50.3B", pe: 72.4, h: 94.00, l: 38.10, div: "N/A", desc: "GMR Infrastructure operates premium airport facilities, highways, and global urban setups." },
        { s: "RVNL.NS", n: "Rail Vikas Nigam Limited", sec: "Energy", p: 380.12, c: 4.82, vol: "8.4M", cap: "₹79.2B", pe: 42.1, h: 420.00, l: 118.00, div: "0.55%", desc: "RVNL is the executing arm of the Ministry of Railways, constructing major railway infrastructure." },
        { s: "SJVN.NS", n: "SJVN Limited", sec: "Energy", p: 130.40, c: 1.95, vol: "11.2M", cap: "₹51.2B", pe: 35.8, h: 170.00, l: 55.20, div: "1.15%", desc: "SJVN is a hydro-electric power development company with global green projects." },
        { s: "IREDA.NS", n: "Indian Renewable Energy Development Agency", sec: "Finance", p: 178.60, c: 4.95, vol: "28.5M", cap: "₹48.2B", pe: 42.4, h: 215.00, l: 50.00, div: "N/A", desc: "IREDA is a public financial institution promoting and financing renewable energy projects." }
    ];

    // Generate dynamic values for database
    let stockData = RAW_NIFTY_50.map(item => {
        let hist = [];
        let price = item.p;
        for (let i = 0; i < 6; i++) {
            hist.unshift(parseFloat((price * (1 - (item.c / 100) * (6 - i) / 6)).toFixed(2)));
        }
        hist.push(price);

        const volatility = Math.abs(item.c);
        const risk = volatility > 2.0 ? 'High' : (volatility > 0.8 ? 'Medium' : 'Low');
        const forecast = item.c > 0.3 ? 'Bullish' : (item.c < -0.3 ? 'Bearish' : 'Neutral');

        return {
            symbol: item.s,
            name: item.n,
            sector: item.sec,
            price: price,
            change: item.c,
            volume: item.vol,
            cap: item.cap,
            pe: item.pe,
            high: item.h,
            low: item.l,
            dividend: item.div,
            risk: risk,
            forecast: forecast,
            currency: "INR",
            history: hist,
            desc: item.desc,
            book: parseFloat((price * (0.25 + Math.random() * 0.35)).toFixed(2)),
            roce: parseFloat((8 + Math.random() * 16).toFixed(2)),
            roe: parseFloat((6 + Math.random() * 12).toFixed(2)),
            face: [1, 2, 5, 10][Math.floor(Math.random() * 4)],
            customRatios: []
        };
    });

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    // Views
    const authBox = document.getElementById('auth-box');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const dashboardBox = document.getElementById('dashboard-box');
    
    // Auth controllers
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Inputs & Error Banners
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const signupNameInput = document.getElementById('signup-name');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const termsAgreeCheckbox = document.getElementById('terms-agree');
    const loginErrorBanner = document.getElementById('login-error-banner');
    const signupErrorBanner = document.getElementById('signup-error-banner');
    
    // Dashboard components
    const userDisplayName = document.getElementById('user-display-name');
    const filterSector = document.getElementById('filter-sector');
    const filterPrice = document.getElementById('filter-price');
    const filterSort = document.getElementById('filter-sort');
    const presetTabs = document.querySelectorAll('.preset-tab');
    const scannedCount = document.getElementById('scanned-count');
    const scannerTableBody = document.getElementById('scanner-results-tbody');
    const scannerSearchInput = document.getElementById('scanner-search');
    
    // Portfolio & Trade elements
    const portfolioTotal = document.getElementById('portfolio-total');
    const portfolioGrowth = document.getElementById('portfolio-growth');
    const portfolioCash = document.getElementById('portfolio-cash');
    const portfolioEquity = document.getElementById('portfolio-equity');
    const tradeSymbolSelect = document.getElementById('trade-symbol') || document.createElement('select');
    const tradeQtyInput = document.getElementById('trade-qty') || document.createElement('input');
    const tradeEstCost = document.getElementById('trade-est-cost') || document.createElement('span');
    const tradeBuyBtn = document.getElementById('trade-buy-btn') || document.createElement('button');
    const tradeSellBtn = document.getElementById('trade-sell-btn') || document.createElement('button');
    const tradeFeedbackBanner = document.getElementById('trade-feedback') || document.createElement('div');
    const watchlistContainer = document.getElementById('watchlist-container');
    
    // Modal elements
    const stockModal = document.getElementById('stock-detail-page');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const modalClose = document.getElementById('modal-close');
    const modalSymbol = document.getElementById('modal-symbol');
    const modalName = document.getElementById('modal-name');
    const modalSector = document.getElementById('modal-sector');
    const modalPrice = document.getElementById('modal-price');
    const modalChange = document.getElementById('modal-change');
    const modalHigh = document.getElementById('metric-high');
    const modalLow = document.getElementById('metric-low');
    const modalVolume = document.getElementById('metric-volume');
    const modalPE = document.getElementById('metric-pe');
    const modalCap = document.getElementById('metric-cap');
    const modalDiv = document.getElementById('metric-div');
    const modalDescription = document.getElementById('modal-description');
    const svgChartBox = document.getElementById('svg-chart-box');
    const modalRiskBadge = document.getElementById('modal-risk-badge');
    const modalForecastBadge = document.getElementById('modal-forecast-badge');
    const modalRiskFill = document.getElementById('modal-risk-fill');

    let currentPreset = 'all';
    let selectedModalStock = null;

    // Password SVG structures
    const eyeOpenSvg = `
        <svg fill="none" stroke="currentColor" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
    `;
    const eyeClosedSvg = `
        <svg fill="none" stroke="currentColor" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        </svg>
    `;

    // ==========================================
    // 3. THEME & GENERAL HELPERS
    // ==========================================
    const loadSavedTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    loadSavedTheme();

    // Password Eyes Toggling
    document.querySelectorAll('.password-toggle-btn').forEach(button => {
        button.innerHTML = eyeOpenSvg;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const passwordInput = button.closest('.input-container').querySelector('input');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                button.innerHTML = eyeClosedSvg;
            } else {
                passwordInput.type = 'password';
                button.innerHTML = eyeOpenSvg;
            }
        });
    });

    const formatCurrency = (val, currencyCode = 'INR') => {
        return new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', { 
            style: 'currency', 
            currency: currencyCode,
            maximumFractionDigits: 2
        }).format(val);
    };

    // ==========================================
    // 4. TRANSITIONS & ROUTING
    // ==========================================
    const switchAuthView = (fromView, toView) => {
        fromView.style.opacity = '0';
        fromView.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            fromView.classList.remove('active');
            toView.classList.add('active');
            requestAnimationFrame(() => {
                toView.style.opacity = '1';
                toView.style.transform = 'translateY(0)';
            });
        }, 200);
    };

    goToSignup.addEventListener('click', (e) => { e.preventDefault(); switchAuthView(loginView, signupView); });
    goToLogin.addEventListener('click', (e) => { e.preventDefault(); switchAuthView(signupView, loginView); });

    const enterDashboard = () => {
        authBox.classList.add('hidden');
        dashboardBox.classList.add('active');
        userDisplayName.textContent = userState.name;
        
        // Initial setup for stocks
        populateTradeSelect();
        updatePortfolioUI();
        renderScannerTable();
        renderWatchlist();
        calculateTradeCost();
        populateSipDropdown();
    };

    const leaveDashboard = () => {
        dashboardBox.classList.remove('active');
        authBox.classList.remove('hidden');
        switchAuthView(signupView, loginView);
        userState.name = "Trader";
        userState.email = "";
        userState.cash = 10000.00;
        userState.portfolio = {};
        loginForm.reset();
        signupForm.reset();
    };

    logoutBtn.addEventListener('click', leaveDashboard);

    // ==========================================
    // 5. VALIDATIONS & FORM SUBMITS
    // ==========================================
    const showBanner = (banner, message, type = 'error') => {
        const textSpan = banner.querySelector('.banner-text');
        textSpan.textContent = message;
        banner.className = `status-banner ${type}`;
    };

    const hideBanner = (banner) => { banner.className = 'status-banner hidden'; };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideBanner(loginErrorBanner);
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value;

        if (!email || !password) {
            showBanner(loginErrorBanner, 'Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showBanner(loginErrorBanner, 'Invalid email structure.');
            return;
        }

        if (password.length < 6) {
            showBanner(loginErrorBanner, 'Password must be at least 6 characters.');
            return;
        }

        // Mock success login
        userState.name = email.split('@')[0];
        userState.email = email;
        enterDashboard();
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideBanner(signupErrorBanner);
        const name = signupNameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value;
        const confirm = signupConfirmPasswordInput.value;
        const agree = termsAgreeCheckbox.checked;

        if (!name || !email || !password || !confirm) {
            showBanner(signupErrorBanner, 'All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showBanner(signupErrorBanner, 'Invalid email address.');
            return;
        }

        if (password.length < 8) {
            showBanner(signupErrorBanner, 'Password must be 8+ characters.');
            return;
        }

        if (password !== confirm) {
            showBanner(signupErrorBanner, 'Passwords do not match.');
            return;
        }

        if (!agree) {
            showBanner(signupErrorBanner, 'Please agree to Terms.');
            return;
        }

        userState.name = name;
        userState.email = email;
        enterDashboard();
    });

    // ==========================================
    // 6. REAL-TIME TICKING loop
    // ==========================================
    setInterval(() => {
        if (!dashboardBox.classList.contains('active')) return;
        
        stockData.forEach(stock => {
            // Fluctuate price by a small percentage (-1.2% to +1.2%)
            const percent = (Math.random() * 2.4 - 1.2) / 100;
            const priceDiff = stock.price * percent;
            
            stock.price = Math.max(1.00, +(stock.price + priceDiff).toFixed(2));
            stock.change = +(stock.change + (percent * 100)).toFixed(2);
            
            // Append new value to historical points
            stock.history.shift();
            stock.history.push(stock.price);
        });

        // Refresh components silently without redrawing everything
        updateTickingElements();
    }, 3000);

    const updateTickingElements = () => {
        // 1. Table cell updates
        stockData.forEach(stock => {
            const row = document.querySelector(`tr[data-stock="${stock.symbol}"]`);
            if (row) {
                const priceCell = row.querySelector('.price-td');
                const changeCell = row.querySelector('.trend-pill');
                const sparkline = row.querySelector('.sparkline-svg');
                
                if (priceCell) priceCell.textContent = formatCurrency(stock.price, stock.currency || 'USD');
                if (changeCell) {
                    changeCell.className = `trend-pill ${stock.change >= 0 ? 'positive' : 'negative'}`;
                    changeCell.innerHTML = `${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%`;
                }
                if (sparkline) {
                    sparkline.innerHTML = drawSparklineSvg(stock.history, stock.change >= 0);
                }
            }

            // 2. Watchlist ticking updates
            const wlItem = document.querySelector(`.watchlist-item[data-wl-stock="${stock.symbol}"]`);
            if (wlItem) {
                const priceSpan = wlItem.querySelector('.wl-price');
                const pillSpan = wlItem.querySelector('.trend-pill');
                if (priceSpan) priceSpan.textContent = formatCurrency(stock.price, stock.currency || 'USD');
                if (pillSpan) {
                    pillSpan.className = `trend-pill ${stock.change >= 0 ? 'positive' : 'negative'}`;
                    pillSpan.innerHTML = `${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%`;
                }
            }
        });

        // 3. Detail page updates if active
        if (!stockModal.classList.contains('hidden') && selectedModalStock) {
            const currentStock = stockData.find(s => s.symbol === selectedModalStock.symbol);
            if (currentStock) {
                modalPrice.textContent = formatCurrency(currentStock.price, currentStock.currency || 'INR');
                modalChange.className = `trend-pill ${currentStock.change >= 0 ? 'positive' : 'negative'}`;
                modalChange.innerHTML = `${currentStock.change >= 0 ? '▲' : '▼'} ${Math.abs(currentStock.change).toFixed(2)}%`;
                
                // Reactive updates for key metrics, AI model, and charts
                renderRatiosGrid(currentStock);
                updateAIInsights(currentStock);
                drawDetailedModalChart(currentStock, currentChartMode);
            }
        }

        // 4. Trade cost calculator updates
        calculateTradeCost();
        // 5. Total Portfolio value recalculates
        updatePortfolioUI();
    };

    // ==========================================
    // 7. STOCK SCANNER ENGINE
    // ==========================================
    const drawSparklineSvg = (history, isPositive) => {
        const minVal = Math.min(...history);
        const maxVal = Math.max(...history);
        const range = maxVal - minVal || 1;
        
        const width = 70;
        const height = 25;
        const padding = 2;
        
        const points = history.map((val, idx) => {
            const x = (idx / (history.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
            return `${x},${y}`;
        }).join(' ');

        return `<polyline class="spark-path ${isPositive ? 'positive' : 'negative'}" points="${points}"></polyline>`;
    };

    const renderScannerTable = () => {
        let filtered = [...stockData];

        // 0. Search Query Filtering
        const searchVal = scannerSearchInput.value.toLowerCase().trim();
        if (searchVal) {
            filtered = filtered.filter(s => s.symbol.toLowerCase().includes(searchVal) || s.name.toLowerCase().includes(searchVal));
        }

        // 1. Preset tabs filtering
        if (currentPreset === 'gainers') {
            filtered = filtered.filter(s => s.change > 0).sort((a, b) => b.change - a.change);
        } else if (currentPreset === 'losers') {
            filtered = filtered.filter(s => s.change < 0).sort((a, b) => a.change - b.change);
        } else if (currentPreset === 'volume') {
            filtered = filtered.filter(s => parseFloat(s.volume) > 25);
        } else if (currentPreset === 'tech') {
            filtered = filtered.filter(s => s.sector === 'Tech');
        }

        // 2. Custom Sector Filter
        const sectorVal = filterSector.value;
        if (sectorVal !== 'all') {
            filtered = filtered.filter(s => s.sector === sectorVal);
        }

        // 3. Custom Price Filter
        const priceVal = filterPrice.value;
        if (priceVal === 'under500') {
            filtered = filtered.filter(s => s.price < 500);
        } else if (priceVal === '500to2500') {
            filtered = filtered.filter(s => s.price >= 500 && s.price <= 2500);
        } else if (priceVal === 'over2500') {
            filtered = filtered.filter(s => s.price > 2500);
        }

        // 4. Custom Sort By
        const sortVal = filterSort.value;
        if (sortVal === 'changeDesc') {
            filtered.sort((a, b) => b.change - a.change);
        } else if (sortVal === 'changeAsc') {
            filtered.sort((a, b) => a.change - b.change);
        } else if (sortVal === 'priceDesc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'volDesc') {
            filtered.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
        } else if (sortVal === 'capDesc') {
            filtered.sort((a, b) => {
                const parseCap = cap => cap.includes('T') ? parseFloat(cap) * 1000 : parseFloat(cap);
                return parseCap(b.cap) - parseCap(a.cap);
            });
        }

        // Helper classes for Risk & Forecast
        const getRiskClass = (risk) => {
            if (risk === 'Low') return 'positive';
            if (risk === 'Medium') return 'warning';
            return 'negative';
        };

        const getForecastClass = (forecast) => {
            if (forecast === 'Bullish') return 'positive';
            if (forecast === 'Bearish') return 'negative';
            return 'neutral';
        };

        // Apply count badge
        scannedCount.textContent = filtered.length;
        
        scannerTableBody.innerHTML = '';
        if (filtered.length === 0) {
            scannerTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No stocks match your scan criteria.</td></tr>`;
            return;
        }

        filtered.forEach(stock => {
            const isFav = userState.watchlist.includes(stock.symbol);
            const row = document.createElement('tr');
            row.setAttribute('data-stock', stock.symbol);
            
            row.innerHTML = `
                <td><span class="sym-badge">${stock.symbol}</span></td>
                <td class="company-name-td">${stock.name}</td>
                <td class="price-td">${formatCurrency(stock.price, stock.currency || 'USD')}</td>
                <td>
                    <span class="trend-pill ${stock.change >= 0 ? 'positive' : 'negative'}">
                        ${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%
                    </span>
                </td>
                <td><span class="trend-pill ${getRiskClass(stock.risk)}">${stock.risk} Risk</span></td>
                <td><span class="trend-pill ${getForecastClass(stock.forecast)}">${stock.forecast}</span></td>
                <td>
                    <svg class="sparkline-svg">
                        ${drawSparklineSvg(stock.history, stock.change >= 0)}
                    </svg>
                </td>
                <td>
                    <div class="action-btns-td">
                        <button class="star-watch-btn ${isFav ? 'active' : ''}" data-symbol="${stock.symbol}" title="Add to Watchlist">★</button>
                        <button class="row-detail-btn" data-symbol="${stock.symbol}" title="Detailed Analytics">➜</button>
                    </div>
                </td>
            `;

            // Click row to open modal (unless clicking buttons)
            row.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                openModalForStock(stock.symbol);
            });

            // Watchlist toggle button
            row.querySelector('.star-watch-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWatchlist(stock.symbol);
            });

            // Arrow button modal toggle
            row.querySelector('.row-detail-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openModalForStock(stock.symbol);
            });

            scannerTableBody.appendChild(row);
        });
    };

    // Filter Listeners
    [filterSector, filterPrice, filterSort].forEach(el => {
        el.addEventListener('change', renderScannerTable);
    });

    let searchTimeout = null;
    
    const importStockData = (newStock) => {
        if (!newStock || !newStock.symbol) return;
        if (!stockData.some(s => s.symbol === newStock.symbol)) {
            // Populate ratio variables if not present
            if (!newStock.book) newStock.book = parseFloat((newStock.price * (0.25 + Math.random() * 0.35)).toFixed(2));
            if (!newStock.roce) newStock.roce = parseFloat((8 + Math.random() * 16).toFixed(2));
            if (!newStock.roe) newStock.roe = parseFloat((6 + Math.random() * 12).toFixed(2));
            if (!newStock.face) newStock.face = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
            if (!newStock.customRatios) newStock.customRatios = [];

            stockData.push(newStock);
            populateTradeSelect();
            renderScannerTable();
            populateSipDropdown();
        }
    };

    const fetchWithAllOrigins = (query) => {
        const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5`;
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(wrapper => JSON.parse(wrapper.contents))
            .then(searchJson => {
                if (searchJson.quotes && searchJson.quotes.length > 0) {
                    const equityQuotes = searchJson.quotes.filter(q => q.quoteType === 'EQUITY').slice(0, 5);
                    if (equityQuotes.length > 0) {
                        equityQuotes.forEach(quote => {
                            const symbol = quote.symbol;
                            if (stockData.some(s => s.symbol === symbol)) return;
                            
                            const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=7d`;
                            fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(yfUrl)}`)
                                .then(res => res.json())
                                .then(wrapper => JSON.parse(wrapper.contents))
                                .then(json => {
                                    if (!json.chart || !json.chart.result || json.chart.result.length === 0) return;
                                    const result = json.chart.result[0];
                                    const meta = result.meta;
                                    const indicators = result.indicators.quote[0];
                                    
                                    let closeHistory = (indicators.close || []).filter(val => val !== null);
                                    if (closeHistory.length === 0) {
                                        closeHistory = [meta.regularMarketPrice];
                                    }

                                    const prevClose = meta.chartPreviousClose || closeHistory[0] || meta.regularMarketPrice;
                                    const changePct = ((meta.regularMarketPrice - prevClose) / prevClose) * 100;
                                    const name = meta.longName || meta.shortName || meta.symbol;

                                    const currencyCode = meta.currency || (meta.symbol.endsWith('.NS') || meta.symbol.endsWith('.BO') ? 'INR' : 'USD');

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

                                    const newStock = {
                                        symbol: meta.symbol,
                                        name: name,
                                        sector: meta.symbol.endsWith('.NS') || meta.symbol.endsWith('.BO') ? 'Indian Market' : 'Global Market',
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
                                        desc: `${name} (${meta.symbol}) is listed on public exchanges, trading in ${currencyCode} regular sessions.`
                                    };

                                    importStockData(newStock);
                                })
                                .catch(() => {});
                        });
                    }
                }
            })
            .catch(() => {});
    };

    scannerSearchInput.addEventListener('input', () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        
        renderScannerTable();

        const query = scannerSearchInput.value.toUpperCase().trim();
        // Debounce fetching if query is a potential symbol or company name not in the database
        if (query.length >= 2 && !stockData.some(s => s.symbol === query || s.name.toUpperCase().includes(query))) {
            searchTimeout = setTimeout(() => {
                // Try relative API endpoint first (works on Vercel and local server)
                fetch(`/api/stock?symbol=${query}`)
                    .then(res => {
                        if (!res.ok) throw new Error();
                        return res.json();
                    })
                    .then(newStock => {
                        importStockData(newStock);
                    })
                    .catch(() => {
                        // Fallback to client-side CORS proxy resolver if static hosted
                        fetchWithAllOrigins(query);
                    });
            }, 750);
        }
    });

    presetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            presetTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPreset = tab.getAttribute('data-preset');
            renderScannerTable();
        });
    });

    // ==========================================
    // 8. PORTFOLIO & MOCK TRANSACTION ENGINE
    // ==========================================
    const populateTradeSelect = () => {
        tradeSymbolSelect.innerHTML = '';
        stockData.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.symbol;
            opt.textContent = `${s.symbol} (${formatCurrency(s.price, s.currency || 'INR')})`;
            tradeSymbolSelect.appendChild(opt);
        });
    };

    const updatePortfolioUI = () => {
        // Calculate equity value
        let equity = 0;
        for (const [symbol, qty] of Object.entries(userState.portfolio)) {
            const matchStock = stockData.find(s => s.symbol === symbol);
            if (matchStock) {
                equity += matchStock.price * qty;
            }
        }
        
        const totalVal = userState.cash + equity;
        const initialInvestment = 1000000.00; // Starting virtual cash of 10 Lakhs INR
        const growthPct = ((totalVal - initialInvestment) / initialInvestment) * 100;

        portfolioTotal.textContent = formatCurrency(totalVal, 'INR');
        portfolioCash.textContent = formatCurrency(userState.cash, 'INR');
        portfolioEquity.textContent = formatCurrency(equity, 'INR');
        
        portfolioGrowth.className = `trend-pill ${growthPct >= 0 ? 'positive' : 'negative'}`;
        portfolioGrowth.textContent = `${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}%`;
    };

    const calculateTradeCost = () => {
        const symbol = tradeSymbolSelect.value;
        const qty = parseInt(tradeQtyInput.value) || 0;
        const matchStock = stockData.find(s => s.symbol === symbol);
        
        if (matchStock && qty > 0) {
            tradeEstCost.textContent = formatCurrency(matchStock.price * qty, matchStock.currency || 'INR');
        } else {
            tradeEstCost.textContent = '₹0.00';
        }
    };

    tradeSymbolSelect.addEventListener('change', calculateTradeCost);
    tradeQtyInput.addEventListener('input', calculateTradeCost);

    const showTradeFeedback = (message, type = 'success') => {
        tradeFeedbackBanner.textContent = message;
        tradeFeedbackBanner.className = `status-banner ${type}`;
        setTimeout(() => {
            tradeFeedbackBanner.className = 'status-banner hidden';
        }, 3500);
    };

    // Transaction Handlers
    tradeBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const symbol = tradeSymbolSelect.value;
        const qty = parseInt(tradeQtyInput.value) || 0;
        const matchStock = stockData.find(s => s.symbol === symbol);

        if (!matchStock || qty <= 0) {
            showTradeFeedback('Please enter a valid quantity.', 'error');
            return;
        }

        const cost = matchStock.price * qty;
        if (cost > userState.cash) {
            showTradeFeedback('Insufficient cash balance.', 'error');
            return;
        }

        // Execute Buy
        userState.cash -= cost;
        userState.portfolio[symbol] = (userState.portfolio[symbol] || 0) + qty;
        
        showTradeFeedback(`Successfully bought ${qty} shares of ${symbol}!`, 'success');
        updatePortfolioUI();
        calculateTradeCost();
    });

    tradeSellBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const symbol = tradeSymbolSelect.value;
        const qty = parseInt(tradeQtyInput.value) || 0;
        const matchStock = stockData.find(s => s.symbol === symbol);

        if (!matchStock || qty <= 0) {
            showTradeFeedback('Please enter a valid quantity.', 'error');
            return;
        }

        const owned = userState.portfolio[symbol] || 0;
        if (qty > owned) {
            showTradeFeedback(`You only own ${owned} shares of ${symbol}.`, 'error');
            return;
        }

        // Execute Sell
        const proceeds = matchStock.price * qty;
        userState.cash += proceeds;
        userState.portfolio[symbol] -= qty;
        if (userState.portfolio[symbol] === 0) {
            delete userState.portfolio[symbol];
        }

        showTradeFeedback(`Successfully sold ${qty} shares of ${symbol}!`, 'success');
        updatePortfolioUI();
        calculateTradeCost();
    });

    // ==========================================
    // 9. WATCHLIST HANDLER
    // ==========================================
    const renderWatchlist = () => {
        watchlistContainer.innerHTML = '';
        if (userState.watchlist.length === 0) {
            watchlistContainer.innerHTML = `<div class="empty-watchlist-msg">No stocks on your watchlist yet. Click the star icon to add.</div>`;
            return;
        }

        userState.watchlist.forEach(symbol => {
            const stock = stockData.find(s => s.symbol === symbol);
            if (!stock) return;

            const wlDiv = document.createElement('div');
            wlDiv.className = 'watchlist-item';
            wlDiv.setAttribute('data-wl-stock', symbol);
            
            wlDiv.innerHTML = `
                <div class="wl-sym-side">
                    <span class="wl-symbol">${symbol}</span>
                    <span class="wl-name">${stock.name}</span>
                </div>
                <div class="wl-pricing-side">
                    <span class="wl-price">${formatCurrency(stock.price, stock.currency || 'USD')}</span>
                    <span class="trend-pill ${stock.change >= 0 ? 'positive' : 'negative'}">
                        ${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%
                    </span>
                    <button class="wl-remove-btn" data-symbol="${symbol}" title="Remove from watchlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            `;

            // Click to open modal
            wlDiv.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                openModalForStock(symbol);
            });

            // Remove button click
            wlDiv.querySelector('.wl-remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWatchlist(symbol);
            });

            watchlistContainer.appendChild(wlDiv);
        });
    };

    const toggleWatchlist = (symbol) => {
        const idx = userState.watchlist.indexOf(symbol);
        if (idx > -1) {
            userState.watchlist.splice(idx, 1);
        } else {
            userState.watchlist.push(symbol);
        }
        
        renderWatchlist();
        renderScannerTable();
    };

    // ==========================================
    // 10. MODAL & CHART BUILDER
    // ==========================================
    // ==========================================
    // 10. SCREENER.IN DETAIL VIEW & AI FORECASTING
    // ==========================================
    const getStockWebsite = (symbol) => {
        const clean = symbol.split('.')[0].toLowerCase();
        if (clean === 'reliance') return 'ril.com';
        if (clean === 'sbin') return 'sbi.co.in';
        if (clean === 'hdfcbank') return 'hdfcbank.com';
        if (clean === 'icicibank') return 'icicibank.com';
        if (clean === 'bhartiartl') return 'airtel.in';
        if (clean === 'kotakbank') return 'kotak.com';
        if (clean === 'lt') return 'larsentoubro.com';
        if (clean === 'hindunilvr') return 'hul.co.in';
        return `${clean}.com`;
    };

    const generateForecastData = (stock) => {
        const history = stock.history;
        const lastPrice = history[history.length - 1];
        const avgChange = (stock.change / 100) / 2; // scaled down daily drift
        
        let expected = [lastPrice];
        let bullish = [lastPrice];
        let bearish = [lastPrice];
        
        for (let i = 1; i <= 7; i++) {
            // expected path adding drift and minor random noise
            const noise = (Math.random() * 0.8 - 0.4) / 100;
            const drift = avgChange + noise;
            const expPrice = expected[expected.length - 1] * (1 + drift);
            expected.push(parseFloat(expPrice.toFixed(2)));
            
            // bullish/bearish cases spread wider as time increases (cone of uncertainty)
            const volatility = 0.015 * Math.sqrt(i);
            bullish.push(parseFloat((expPrice * (1 + volatility)).toFixed(2)));
            bearish.push(parseFloat((expPrice * (1 - volatility)).toFixed(2)));
        }
        
        return { expected, bullish, bearish };
    };

    const generateIntradayForecastData = (stock) => {
        const currentPrice = stock.price;
        // Simulate past 6 hours
        let hist = [];
        let p = currentPrice;
        for (let i = 0; i < 6; i++) {
            hist.unshift(parseFloat(p.toFixed(2)));
            const drift = (Math.random() * 0.3 - 0.15) / 100;
            p = p * (1 - drift);
        }
        
        // Project next 4 hours
        let expected = [currentPrice];
        let bullish = [currentPrice];
        let bearish = [currentPrice];
        const hourDrift = (stock.change / 100) / 8; // scaled hourly drift
        
        for (let i = 1; i <= 4; i++) {
            const noise = (Math.random() * 0.1 - 0.05) / 100;
            const nextPrice = expected[expected.length - 1] * (1 + hourDrift + noise);
            expected.push(parseFloat(nextPrice.toFixed(2)));
            
            const vol = 0.004 * Math.sqrt(i); // tight intraday volatility spread
            bullish.push(parseFloat((nextPrice * (1 + vol)).toFixed(2)));
            bearish.push(parseFloat((nextPrice * (1 - vol)).toFixed(2)));
        }
        
        return { history: hist, expected, bullish, bearish };
    };

    const getAIInsights = (stock, forecastData) => {
        const lastPrice = stock.price;
        const target = forecastData.expected[7];
        const bullishTarget = forecastData.bullish[7];
        const bearishTarget = forecastData.bearish[7];
        
        const changePct = ((target - lastPrice) / lastPrice) * 100;
        const direction = changePct > 0.5 ? 'Bullish' : (changePct < -0.5 ? 'Bearish' : 'Neutral');
        
        // Dynamic commentary
        const currencySymbol = stock.currency === 'INR' ? '₹' : '$';
        let commentary = "";
        if (direction === 'Bullish') {
            commentary = `Our LSTM forecasting model detects strong upward momentum for ${stock.name} (${stock.symbol}) on the daily chart. The stock has established solid support, and positive volume accumulation suggests a high probability of breakout. The projected 7-day target range of ${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()} aligns with the key resistance zones, backed by moving average indicator alignment.`;
        } else if (direction === 'Bearish') {
            commentary = `The daily forecast indicates potential overhead resistance and downside consolidation for ${stock.name} (${stock.symbol}). Profit-taking at higher bands has slowed down volume indexes. Expect consolidation or a minor pullback towards the support band of ${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()} before any sustained recovery occurs.`;
        } else {
            commentary = `The price trend is projected to remain range-bound for ${stock.name} (${stock.symbol}). With RSI hovering near neutral levels and low average true range volatility, the stock is expected to trade sideways. The 7-day projection places trading volume within the ${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()} bracket.`;
        }
        
        return {
            target: target,
            range: `${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()}`,
            direction: direction,
            commentary: commentary,
            confidence: Math.round(75 + (stock.pe % 15) + (Math.abs(stock.change) * 2)) + '%'
        };
    };

    const getIntradayAIInsights = (stock, intradayData) => {
        const lastPrice = stock.price;
        const target = intradayData.expected[4];
        const bullishTarget = intradayData.bullish[4];
        const bearishTarget = intradayData.bearish[4];
        
        const changePct = ((target - lastPrice) / lastPrice) * 100;
        const direction = changePct > 0.15 ? 'Bullish' : (changePct < -0.15 ? 'Bearish' : 'Neutral');
        
        const currencySymbol = stock.currency === 'INR' ? '₹' : '$';
        let commentary = "";
        if (direction === 'Bullish') {
            commentary = `Intraday algorithms detect short-term buying pressure. A golden cross on the 15-minute chart shows EMA (9) crossing above VWAP at ${currencySymbol}${lastPrice.toLocaleString()}. Heavy buy volume on order blocks points to a continuation towards the intraday target range of ${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()}. Maintain long bias for the remaining session hours.`;
        } else if (direction === 'Bearish') {
            commentary = `Intraday options call-writing at immediate strikes has limited upside momentum. Price has broken below the Volume Weighted Average Price (VWAP) line, indicating negative intraday momentum. Expect support to test near the lower boundary of ${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()} with increased selling volume.`;
        } else {
            commentary = `Intraday metrics show tight consolidation and low volume activity. Both RSI and stochastic levels are trading within the neutral channel, suggesting option sellers will dominate. The price is projected to trade range-bound between ${currencySymbol}${bearishTarget.toLocaleString()} and ${currencySymbol}${bullishTarget.toLocaleString()} for the rest of the session.`;
        }
        
        return {
            target: target,
            range: `${currencySymbol}${bearishTarget.toLocaleString()} - ${currencySymbol}${bullishTarget.toLocaleString()}`,
            direction: `Intraday ${direction}`,
            commentary: commentary,
            confidence: Math.round(70 + (stock.pe % 10) + (Math.random() * 8)) + '%'
        };
    };

    const getTechIndicators = (stock) => {
        const isBullish = stock.change >= 0;
        return [
            { name: "RSI (14)", val: isBullish ? "58.4 (Neutral/Buy)" : "42.1 (Neutral/Sell)", class: "neutral" },
            { name: "MACD", val: isBullish ? "Bullish Crossover" : "Bearish Divergence", class: isBullish ? "bullish" : "bearish" },
            { name: "SMA (50-Day)", val: isBullish ? `Above Line (${formatCurrency(stock.price * 0.94, stock.currency || 'INR')})` : `Below Line (${formatCurrency(stock.price * 1.04, stock.currency || 'INR')})`, class: isBullish ? "bullish" : "bearish" },
            { name: "Bollinger Bands", val: isBullish ? "Testing Upper Band" : "Consolidating Lower Band", class: isBullish ? "bullish" : "bearish" }
        ];
    };

    const getIntradayTechIndicators = (stock) => {
        const isBullish = stock.change >= 0;
        return [
            { name: "EMA (9) / VWAP", val: isBullish ? `Bullish Cross (${formatCurrency(stock.price * 0.998, stock.currency || 'INR')})` : `Below VWAP (${formatCurrency(stock.price * 1.002, stock.currency || 'INR')})`, class: isBullish ? "bullish" : "bearish" },
            { name: "RSI (5m)", val: isBullish ? "64.2 (Buy Strength)" : "37.5 (Sell Strength)", class: "neutral" },
            { name: "Stochastic Osc.", val: isBullish ? "78.4 (Overbought zone)" : "22.1 (Oversold zone)", class: "neutral" },
            { name: "Average True Range", val: formatCurrency(stock.price * 0.003, stock.currency || 'INR') + " (Low Vol)", class: "neutral" }
        ];
    };

    const renderRatiosGrid = (stock) => {
        const grid = document.getElementById('detail-ratios-grid');
        grid.innerHTML = '';
        
        const coreRatios = [
            { label: "Market Cap", val: stock.cap },
            { label: "Current Price", val: formatCurrency(stock.price, stock.currency || 'INR') },
            { label: "High / Low", val: `${formatCurrency(stock.low, stock.currency || 'INR')} / ${formatCurrency(stock.high, stock.currency || 'INR')}` },
            { label: "Stock P/E", val: stock.pe || 'N/A' },
            { label: "Book Value", val: formatCurrency(stock.book || (stock.price * 0.4), stock.currency || 'INR') },
            { label: "Dividend Yield", val: stock.dividend || 'N/A' },
            { label: "ROCE", val: `${stock.roce || 12.4}%` },
            { label: "ROE", val: `${stock.roe || 10.2}%` },
            { label: "Face Value", val: formatCurrency(stock.face || 10, stock.currency || 'INR') }
        ];
        
        coreRatios.forEach(r => {
            grid.appendChild(createRatioCard(r.label, r.val));
        });
        
        if (stock.customRatios) {
            stock.customRatios.forEach(cr => {
                grid.appendChild(createRatioCard(cr.label, cr.val));
            });
        }
    };
    
    const createRatioCard = (label, val) => {
        const card = document.createElement('div');
        card.className = 'ratio-card';
        card.innerHTML = `
            <span class="m-lbl">${label}</span>
            <span class="m-val">${val}</span>
        `;
        return card;
    };

    const updateFollowButton = (stock) => {
        const followBtn = document.getElementById('detail-follow-btn');
        const isFav = userState.watchlist.includes(stock.symbol);
        if (isFav) {
            followBtn.classList.add('following');
            followBtn.textContent = 'Following';
        } else {
            followBtn.classList.remove('following');
            followBtn.textContent = 'Follow';
        }
    };

    const updateAIInsights = (stock, mode = 'predict') => {
        let insights;
        let indicators;
        
        if (mode === 'intraday') {
            const intradayData = generateIntradayForecastData(stock);
            insights = getIntradayAIInsights(stock, intradayData);
            indicators = getIntradayTechIndicators(stock);
        } else {
            const forecastData = generateForecastData(stock);
            insights = getAIInsights(stock, forecastData);
            indicators = getTechIndicators(stock);
        }
        
        document.getElementById('pred-target-val').textContent = formatCurrency(insights.target, stock.currency || 'INR');
        document.getElementById('pred-target-range').textContent = insights.range;
        
        const dirSpan = document.getElementById('pred-direction-val');
        dirSpan.textContent = insights.direction;
        
        const isBullish = insights.direction.toLowerCase().includes('bullish');
        const isBearish = insights.direction.toLowerCase().includes('bearish');
        dirSpan.className = `pred-val ${isBullish ? 'positive' : (isBearish ? 'negative' : 'warning')}`;
        
        document.getElementById('pred-confidence-val').textContent = insights.confidence;
        document.getElementById('pred-commentary-text').textContent = insights.commentary;
        
        // Draw indicators list
        const listContainer = document.getElementById('pred-indicators-list');
        listContainer.innerHTML = '';
        
        indicators.forEach(ind => {
            const div = document.createElement('div');
            div.className = 'indicator-item';
            div.innerHTML = `
                <span class="m-lbl">${ind.name}</span>
                <span class="ind-val ${ind.class}">${ind.val}</span>
            `;
            listContainer.appendChild(div);
        });
    };

    const exportToCSV = (stock) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Day,Price (in " + (stock.currency || 'INR') + ")\n";
        
        stock.history.forEach((price, idx) => {
            const dayName = idx === stock.history.length - 1 ? "Current Price" : `Day -${stock.history.length - 1 - idx}`;
            csvContent += `${dayName},${price}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${stock.symbol}_price_history.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let currentChartMode = 'price';

    const drawDetailedModalChart = (stock, mode = 'price') => {
        svgChartBox.innerHTML = '';
        const width = svgChartBox.clientWidth || 550;
        const height = 280;
        const padding = 35;
        
        let history = [...stock.history];
        
        // Update headers dynamically
        const titleEl = document.getElementById('chart-type-title');
        const subtextEl = document.getElementById('chart-sub-text');
        if (titleEl && subtextEl) {
            if (mode === 'price') {
                titleEl.textContent = 'Price Performance';
                subtextEl.textContent = '7-Day historical close';
            } else if (mode === 'pe') {
                titleEl.textContent = 'Historical P/E Ratio';
                subtextEl.textContent = 'Price to Earnings multiple trend';
            } else if (mode === 'predict') {
                titleEl.textContent = '7-Day AI Price Forecast';
                subtextEl.textContent = 'Confidence interval bands projection';
            } else if (mode === 'intraday') {
                titleEl.textContent = 'Intraday AI Prediction';
                subtextEl.textContent = '6-Hour session trend and hourly projection';
            }
        }
        
        if (mode === 'price') {
            const minVal = Math.min(...history);
            const maxVal = Math.max(...history);
            const range = maxVal - minVal || 1;
            
            const points = history.map((val, idx) => {
                const x = (idx / (history.length - 1)) * (width - padding * 2) + padding;
                const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
                return { x, y, val };
            });
            
            const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
            const fillPath = `M ${points[0].x} ${height - padding} ` + 
                             points.map(p => `L ${p.x} ${p.y}`).join(' ') + 
                             ` L ${points[points.length - 1].x} ${height - padding} Z`;
                             
            const isPositive = stock.change >= 0;
            const chartSvg = `
                <svg class="chart-svg-elem" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--accent-color)'}" stop-opacity="0.2"/>
                            <stop offset="100%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--accent-color)'}" stop-opacity="0.00"/>
                        </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    
                    <!-- Axis labels -->
                    <text x="${padding}" y="${padding - 8}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(maxVal, stock.currency || 'INR')}</text>
                    <text x="${padding}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(minVal, stock.currency || 'INR')}</text>
                    
                    <!-- Chart Area Fill -->
                    <path d="${fillPath}" class="chart-grad-fill" fill="url(#chartGrad)"></path>

                    <!-- Performance Line -->
                    <polyline class="main-chart-line ${isPositive ? 'positive' : 'accent'}" points="${polylinePoints}" stroke="${isPositive ? 'var(--success-color)' : 'var(--accent-color)'}" fill="none" stroke-width="3"></polyline>
                    
                    <!-- Dot overlay at current price -->
                    <circle cx="${points[points.length-1].x}" cy="${points[points.length-1].y}" r="4" fill="${isPositive ? 'var(--success-color)' : 'var(--accent-color)'}"></circle>
                    <circle cx="${points[points.length-1].x}" cy="${points[points.length-1].y}" r="8" fill="none" stroke="${isPositive ? 'var(--success-color)' : 'var(--accent-color)'}" stroke-width="2" opacity="0.4"></circle>
                </svg>
            `;
            svgChartBox.innerHTML = chartSvg;
            
        } else if (mode === 'pe') {
            const eps = stock.price / (stock.pe || 15);
            const peHistory = history.map(p => parseFloat((p / eps).toFixed(2)));
            
            const minVal = Math.min(...peHistory);
            const maxVal = Math.max(...peHistory);
            const range = maxVal - minVal || 1;
            
            const points = peHistory.map((val, idx) => {
                const x = (idx / (peHistory.length - 1)) * (width - padding * 2) + padding;
                const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
                return { x, y, val };
            });
            
            const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
            const fillPath = `M ${points[0].x} ${height - padding} ` + 
                             points.map(p => `L ${p.x} ${p.y}`).join(' ') + 
                             ` L ${points[points.length - 1].x} ${height - padding} Z`;
                             
            const chartSvg = `
                <svg class="chart-svg-elem" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <linearGradient id="peGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="var(--warning-color)" stop-opacity="0.18"/>
                            <stop offset="100%" stop-color="var(--warning-color)" stop-opacity="0.00"/>
                        </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    
                    <!-- Axis labels -->
                    <text x="${padding}" y="${padding - 8}" fill="var(--text-muted)" font-size="9" font-weight="600">P/E: ${maxVal.toFixed(1)}</text>
                    <text x="${padding}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="9" font-weight="600">P/E: ${minVal.toFixed(1)}</text>
                    
                    <!-- Chart Area Fill -->
                    <path d="${fillPath}" class="chart-grad-fill" fill="url(#peGrad)"></path>

                    <!-- Performance Line -->
                    <polyline class="main-chart-line" points="${polylinePoints}" stroke="var(--warning-color)" fill="none" stroke-width="3"></polyline>
                    
                    <!-- Dot overlay at current PE -->
                    <circle cx="${points[points.length-1].x}" cy="${points[points.length-1].y}" r="4" fill="var(--warning-color)"></circle>
                </svg>
            `;
            svgChartBox.innerHTML = chartSvg;
            
        } else if (mode === 'predict') {
            const forecastData = generateForecastData(stock);
            
            const expPath = [...history.slice(0, 6), ...forecastData.expected];
            const bullPath = [...history.slice(0, 6), ...forecastData.bullish];
            const bearPath = [...history.slice(0, 6), ...forecastData.bearish];
            
            const minVal = Math.min(...bearPath);
            const maxVal = Math.max(...bullPath);
            const range = maxVal - minVal || 1;
            
            const getCoords = (pathArr) => {
                return pathArr.map((val, idx) => {
                    const x = (idx / (pathArr.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
                    return { x, y, val };
                });
            };
            
            const expCoords = getCoords(expPath);
            const bullCoords = getCoords(bullPath);
            const bearCoords = getCoords(bearPath);
            
            const histCoords = expCoords.slice(0, 7);
            const polylineHistPoints = histCoords.map(p => `${p.x},${p.y}`).join(' ');
            
            const predCoords = expCoords.slice(6);
            const polylinePredPoints = predCoords.map(p => `${p.x},${p.y}`).join(' ');
            
            const polyPoints = [];
            for (let i = 6; i < 14; i++) {
                polyPoints.push(`${bullCoords[i].x},${bullCoords[i].y}`);
            }
            for (let i = 13; i >= 6; i--) {
                polyPoints.push(`${bearCoords[i].x},${bearCoords[i].y}`);
            }
            const polygonPointsStr = polyPoints.join(' ');
            
            const isPositive = forecastData.expected[7] >= history[history.length-1];
            const separatorX = expCoords[6].x;
            
            const chartSvg = `
                <svg class="chart-svg-elem" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" stop-opacity="0.08"/>
                            <stop offset="100%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" stop-opacity="0.00"/>
                        </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    
                    <!-- Vertical separator -->
                    <line x1="${separatorX}" y1="${padding}" x2="${separatorX}" y2="${height - padding}" stroke="rgba(168, 85, 247, 0.25)" stroke-width="1.5" stroke-dasharray="3,3"/>
                    
                    <!-- Axis labels -->
                    <text x="${padding}" y="${padding - 8}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(maxVal, stock.currency || 'INR')}</text>
                    <text x="${padding}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(minVal, stock.currency || 'INR')}</text>
                    
                    <text x="${separatorX - 8}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="7.5" font-weight="700" text-anchor="end">PAST</text>
                    <text x="${separatorX + 8}" y="${height - padding + 15}" fill="#c084fc" font-size="7.5" font-weight="700" text-anchor="start">✨ AI FORECAST</text>

                    <!-- Shaded Confidence Cone -->
                    <polygon points="${polygonPointsStr}" fill="url(#predGrad)" opacity="0.85"></polygon>

                    <!-- Historical Price Line -->
                    <polyline points="${polylineHistPoints}" stroke="var(--text-secondary)" fill="none" stroke-width="2" opacity="0.5"></polyline>
                    
                    <!-- Expected Target Line -->
                    <polyline points="${polylinePredPoints}" stroke="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" fill="none" stroke-width="2.5" stroke-dasharray="3,3"></polyline>
                    
                    <!-- Upper Band -->
                    <polyline points="${bullCoords.slice(6).map(p=>`${p.x},${p.y}`).join(' ')}" stroke="rgba(16, 185, 129, 0.2)" fill="none" stroke-width="1" stroke-dasharray="1,1"></polyline>
                    
                    <!-- Lower Band -->
                    <polyline points="${bearCoords.slice(6).map(p=>`${p.x},${p.y}`).join(' ')}" stroke="rgba(244, 63, 94, 0.2)" fill="none" stroke-width="1" stroke-dasharray="1,1"></polyline>

                    <!-- Target End Dot -->
                    <circle cx="${expCoords[13].x}" cy="${expCoords[13].y}" r="4" fill="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}"></circle>
                </svg>
            `;
            svgChartBox.innerHTML = chartSvg;
            
        } else if (mode === 'intraday') {
            const intradayData = generateIntradayForecastData(stock);
            
            const expPath = [...intradayData.history, ...intradayData.expected.slice(1)];
            const bullPath = [...intradayData.history, ...intradayData.bullish.slice(1)];
            const bearPath = [...intradayData.history, ...intradayData.bearish.slice(1)];
            
            const minVal = Math.min(...bearPath);
            const maxVal = Math.max(...bullPath);
            const range = maxVal - minVal || 1;
            
            const getCoords = (pathArr) => {
                return pathArr.map((val, idx) => {
                    const x = (idx / (pathArr.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
                    return { x, y, val };
                });
            };
            
            const expCoords = getCoords(expPath);
            const bullCoords = getCoords(bullPath);
            const bearCoords = getCoords(bearPath);
            
            const histCoords = expCoords.slice(0, 6);
            const polylineHistPoints = histCoords.map(p => `${p.x},${p.y}`).join(' ');
            
            const predCoords = expCoords.slice(5);
            const polylinePredPoints = predCoords.map(p => `${p.x},${p.y}`).join(' ');
            
            const polyPoints = [];
            for (let i = 5; i < 10; i++) {
                polyPoints.push(`${bullCoords[i].x},${bullCoords[i].y}`);
            }
            for (let i = 9; i >= 5; i--) {
                polyPoints.push(`${bearCoords[i].x},${bearCoords[i].y}`);
            }
            const polygonPointsStr = polyPoints.join(' ');
            
            const isPositive = intradayData.expected[4] >= stock.price;
            const separatorX = expCoords[5].x;
            
            const chartSvg = `
                <svg class="chart-svg-elem" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <linearGradient id="intraGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" stop-opacity="0.08"/>
                            <stop offset="100%" stop-color="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" stop-opacity="0.00"/>
                        </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                    
                    <!-- Vertical separator -->
                    <line x1="${separatorX}" y1="${padding}" x2="${separatorX}" y2="${height - padding}" stroke="rgba(168, 85, 247, 0.25)" stroke-width="1.5" stroke-dasharray="3,3"/>
                    
                    <!-- Axis labels -->
                    <text x="${padding}" y="${padding - 8}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(maxVal, stock.currency || 'INR')}</text>
                    <text x="${padding}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="9" font-weight="600">${formatCurrency(minVal, stock.currency || 'INR')}</text>
                    
                    <text x="${separatorX - 8}" y="${height - padding + 15}" fill="var(--text-muted)" font-size="7.5" font-weight="700" text-anchor="end">PAST HOURS</text>
                    <text x="${separatorX + 8}" y="${height - padding + 15}" fill="#c084fc" font-size="7.5" font-weight="700" text-anchor="start">⚡ INTRADAY AI</text>

                    <!-- Shaded Confidence Cone -->
                    <polygon points="${polygonPointsStr}" fill="url(#intraGrad)" opacity="0.85"></polygon>

                    <!-- Historical Price Line -->
                    <polyline points="${polylineHistPoints}" stroke="var(--text-secondary)" fill="none" stroke-width="2" opacity="0.5"></polyline>
                    
                    <!-- Expected Target Line -->
                    <polyline points="${polylinePredPoints}" stroke="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}" fill="none" stroke-width="2.5" stroke-dasharray="3,3"></polyline>
                    
                    <!-- Upper Band -->
                    <polyline points="${bullCoords.slice(5).map(p=>`${p.x},${p.y}`).join(' ')}" stroke="rgba(16, 185, 129, 0.2)" fill="none" stroke-width="1" stroke-dasharray="1,1"></polyline>
                    
                    <!-- Lower Band -->
                    <polyline points="${bearCoords.slice(5).map(p=>`${p.x},${p.y}`).join(' ')}" stroke="rgba(244, 63, 94, 0.2)" fill="none" stroke-width="1" stroke-dasharray="1,1"></polyline>

                    <!-- Target End Dot -->
                    <circle cx="${expCoords[9].x}" cy="${expCoords[9].y}" r="4" fill="${isPositive ? 'var(--success-color)' : 'var(--error-color)'}"></circle>
                </svg>
            `;
            svgChartBox.innerHTML = chartSvg;
        }
    };

    const openModalForStock = (symbol) => {
        const stock = stockData.find(s => s.symbol === symbol);
        if (!stock) return;

        selectedModalStock = stock;
        
        // Hide scanner grid, show detail page
        dashboardGrid.classList.add('hidden');
        stockModal.classList.remove('hidden');
        
        // Fill header
        modalName.textContent = stock.name;
        modalSector.textContent = stock.sector;
        modalPrice.textContent = formatCurrency(stock.price, stock.currency || 'INR');
        
        modalChange.className = `trend-pill ${stock.change >= 0 ? 'positive' : 'negative'}`;
        modalChange.innerHTML = `${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%`;
        
        // NSE/BSE & Website tags
        const cleanSym = stock.symbol.split('.')[0].toUpperCase();
        document.getElementById('modal-symbol').textContent = cleanSym;
        let code = 500000;
        for (let i = 0; i < cleanSym.length; i++) code += cleanSym.charCodeAt(i) * 123;
        document.getElementById('detail-bse-tag').textContent = `BSE: ${code % 900000 + 100000}`;
        
        const website = getStockWebsite(stock.symbol);
        const urlA = document.getElementById('detail-company-url');
        urlA.href = `https://www.${website}`;
        document.getElementById('detail-company-website-text').textContent = website;
        
        // Load Core stats into fallback labels
        modalHigh.textContent = formatCurrency(stock.high, stock.currency || 'INR');
        modalLow.textContent = formatCurrency(stock.low, stock.currency || 'INR');
        modalPE.textContent = stock.pe;
        modalCap.textContent = stock.cap;
        modalDiv.textContent = stock.dividend;
        modalDescription.textContent = stock.desc;

        // Set Risk badges
        const getRiskClass = (risk) => {
            if (risk === 'Low') return 'positive';
            if (risk === 'Medium') return 'warning';
            return 'negative';
        };

        const getForecastClass = (forecast) => {
            if (forecast === 'Bullish') return 'positive';
            if (forecast === 'Bearish') return 'negative';
            return 'neutral';
        };

        modalRiskBadge.textContent = `${stock.risk} Risk`;
        modalRiskBadge.className = `trend-pill ${getRiskClass(stock.risk)}`;
        modalForecastBadge.textContent = stock.forecast;
        modalForecastBadge.className = `trend-pill ${getForecastClass(stock.forecast)}`;
        
        let riskWidth = '50%';
        let riskColor = 'var(--warning-color)';
        if (stock.risk === 'Low') {
            riskWidth = '25%';
            riskColor = 'var(--success-color)';
        } else if (stock.risk === 'High') {
            riskWidth = '85%';
            riskColor = 'var(--error-color)';
        }
        
        modalRiskFill.style.width = riskWidth;
        modalRiskFill.style.backgroundColor = riskColor;

        // Reset chart toggle buttons layout
        document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-chart-mode') === 'price') {
                btn.classList.add('active');
            }
        });
        currentChartMode = 'price';
        
        // Set selector selection to this stock in trading panel for sync convenience
        tradeSymbolSelect.value = symbol;
        calculateTradeCost();

        // Call our advanced sub-renders
        renderRatiosGrid(stock);
        updateFollowButton(stock);
        updateAIInsights(stock);

        // Delay chart draw slightly to ensure DOM layout calculation is accurate
        setTimeout(() => {
            drawDetailedModalChart(stock, 'price');
        }, 150);
    };

    const closeModal = () => {
        stockModal.classList.add('hidden');
        dashboardGrid.classList.remove('hidden');
        selectedModalStock = null;
    };

    modalClose.addEventListener('click', closeModal);

    // Dynamic Chart Switcher
    document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChartMode = btn.getAttribute('data-chart-mode');
            
            if (selectedModalStock) {
                drawDetailedModalChart(selectedModalStock, currentChartMode);
                updateAIInsights(selectedModalStock, currentChartMode);
            }
        });
    });

    // Custom Ratio autocomplete and search builders
    const AVAILABLE_RATIOS = {
        "Promoter Holding": (s) => `${(40 + Math.random() * 35).toFixed(1)}%`,
        "Debt to Equity": (s) => (Math.random() * 1.2).toFixed(2),
        "EPS": (s) => formatCurrency(parseFloat((s.price / (s.pe || 15)).toFixed(2)), s.currency || 'INR'),
        "Sales Growth": (s) => `${(5 + Math.random() * 20).toFixed(1)}%`,
        "Operating Margin": (s) => `${(10 + Math.random() * 30).toFixed(1)}%`,
        "Interest Coverage": (s) => `${(1.5 + Math.random() * 10).toFixed(1)}x`,
        "Pledged Shares": (s) => Math.random() > 0.8 ? `${(Math.random() * 8).toFixed(1)}%` : '0.00%',
        "ROE 3-Yr Avg": (s) => `${(8 + Math.random() * 12).toFixed(1)}%`,
        "Current Ratio": (s) => (1.0 + Math.random() * 2.0).toFixed(2),
        "Quick Ratio": (s) => (0.8 + Math.random() * 1.5).toFixed(2),
        "Asset Turnover": (s) => (0.5 + Math.random() * 1.5).toFixed(1) + 'x'
    };

    const ratioInput = document.getElementById('add-ratio-input');
    const suggestionsBox = document.getElementById('ratio-suggestions-box');
    const addRatioBtn = document.getElementById('add-ratio-btn');

    if (ratioInput && suggestionsBox && addRatioBtn) {
        ratioInput.addEventListener('input', () => {
            const val = ratioInput.value.toLowerCase().trim();
            if (!val || !selectedModalStock) {
                suggestionsBox.classList.add('hidden');
                return;
            }

            const addedLabels = (selectedModalStock.customRatios || []).map(cr => cr.label);
            const filtered = Object.keys(AVAILABLE_RATIOS).filter(key => 
                key.toLowerCase().includes(val) && !addedLabels.includes(key)
            );

            if (filtered.length === 0) {
                suggestionsBox.classList.add('hidden');
                return;
            }

            suggestionsBox.innerHTML = '';
            filtered.forEach(key => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = key;
                div.addEventListener('click', () => {
                    addCustomRatio(key);
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.classList.remove('hidden');
        });

        const addCustomRatio = (key) => {
            if (!selectedModalStock || !AVAILABLE_RATIOS[key]) return;
            
            if (!selectedModalStock.customRatios) {
                selectedModalStock.customRatios = [];
            }

            const val = AVAILABLE_RATIOS[key](selectedModalStock);
            selectedModalStock.customRatios.push({ label: key, val: val });

            renderRatiosGrid(selectedModalStock);
            
            ratioInput.value = '';
            suggestionsBox.classList.add('hidden');
        };

        addRatioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const typed = ratioInput.value.trim();
            const matched = Object.keys(AVAILABLE_RATIOS).find(key => key.toLowerCase() === typed.toLowerCase());
            if (matched) {
                addCustomRatio(matched);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target !== ratioInput && e.target !== suggestionsBox) {
                suggestionsBox.classList.add('hidden');
            }
        });
    }

    // Follow and CSV actions
    const csvExportBtn = document.getElementById('detail-export-csv');
    const detailFollowBtn = document.getElementById('detail-follow-btn');
    
    if (csvExportBtn) {
        csvExportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedModalStock) {
                exportToCSV(selectedModalStock);
            }
        });
    }

    if (detailFollowBtn) {
        detailFollowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedModalStock) {
                toggleWatchlist(selectedModalStock.symbol);
                updateFollowButton(selectedModalStock);
            }
        });
    }

    // ==========================================
    // 11. SOVEREIGN & EQUITY SIP PLANNER ENGINE
    // ==========================================
    const sipForm = document.getElementById('govt-sip-form');
    const sipScheme = document.getElementById('sip-scheme');
    const sipAmount = document.getElementById('sip-amount');
    const sipTenure = document.getElementById('sip-tenure');
    const sipInvested = document.getElementById('sip-invested');
    const sipInterest = document.getElementById('sip-interest');
    const sipTotal = document.getElementById('sip-total');
    const sipMiniChart = document.getElementById('sip-mini-chart');
    const sipFeedback = document.getElementById('sip-feedback');

    const populateSipDropdown = () => {
        if (!sipScheme) return;
        
        // Remove any existing optgroups to avoid duplicate appends
        const oldOptgroups = sipScheme.querySelectorAll('optgroup');
        oldOptgroups.forEach(og => og.remove());
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = "Company Stock SIPs (Market-Linked)";
        
        stockData.forEach(stock => {
            const baseCAGR = stock.risk === 'High' ? 16.5 : (stock.risk === 'Medium' ? 12.2 : 9.5);
            // CAGR varies dynamically based on stock change
            const stockCAGR = parseFloat((baseCAGR + (stock.change / 3)).toFixed(1));
            
            const option = document.createElement('option');
            option.value = `stock_${stock.symbol}`;
            option.setAttribute('data-rate', stockCAGR);
            option.setAttribute('data-is-stock', 'true');
            option.textContent = `${stock.symbol} (CAGR: ${stockCAGR}%)`;
            optgroup.appendChild(option);
        });
        
        sipScheme.appendChild(optgroup);
        calculateGovtSIP();
    };

    const calculateGovtSIP = () => {
        if (!sipForm || !sipAmount || !sipTenure || !sipScheme) return;

        const monthlyAmt = parseFloat(sipAmount.value) || 0;
        const tenureYears = parseInt(sipTenure.value) || 0;
        const selectedOpt = sipScheme.options[sipScheme.selectedIndex];
        if (!selectedOpt) return;
        
        const rate = parseFloat(selectedOpt.getAttribute('data-rate')) || 0;

        const totalMonths = tenureYears * 12;
        const invested = monthlyAmt * totalMonths;

        let maturity = 0;
        if (rate > 0 && monthlyAmt > 0 && totalMonths > 0) {
            const monthlyRate = rate / 12 / 100;
            // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
            maturity = monthlyAmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        }

        const interest = Math.max(0, maturity - invested);

        sipInvested.textContent = formatCurrency(invested, 'INR');
        sipInterest.textContent = formatCurrency(interest, 'INR');
        sipTotal.textContent = formatCurrency(maturity || invested, 'INR');

        // Draw interactive SVG line chart inside the 200x45 box
        if (sipMiniChart) {
            const width = 200;
            const height = 45;
            const padding = 5;

            let pointsInvested = [];
            let pointsMaturity = [];

            for (let yr = 0; yr <= tenureYears; yr++) {
                const x = padding + (yr / tenureYears) * (width - padding * 2);
                
                // Invested path at year 'yr'
                const yrMonths = yr * 12;
                const yrInvested = monthlyAmt * yrMonths;
                
                // Maturity path at year 'yr'
                let yrMaturity = yrInvested;
                if (rate > 0 && monthlyAmt > 0 && yrMonths > 0) {
                    const monthlyRate = rate / 12 / 100;
                    yrMaturity = monthlyAmt * ((Math.pow(1 + monthlyRate, yrMonths) - 1) / monthlyRate) * (1 + monthlyRate);
                }

                // Map to coordinate system
                const maxVal = maturity || 1;
                const yInv = height - (yrInvested / maxVal) * (height - padding * 2) - padding;
                const yMat = height - (yrMaturity / maxVal) * (height - padding * 2) - padding;

                pointsInvested.push(`${x},${yInv}`);
                pointsMaturity.push(`${x},${yMat}`);
            }

            const investedLine = pointsInvested.join(' ');
            const maturityLine = pointsMaturity.join(' ');
            
            // Build fill path for maturity area
            const fillPath = `M ${padding} ${height - padding} ` + 
                             pointsMaturity.join(' L ') + 
                             ` L ${width - padding} ${height - padding} Z`;

            sipMiniChart.innerHTML = `
                <defs>
                    <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--success-color)" stop-opacity="0.15"/>
                        <stop offset="100%" stop-color="var(--success-color)" stop-opacity="0.00"/>
                    </linearGradient>
                </defs>
                <!-- Stacked Fill -->
                <path d="${fillPath}" fill="url(#sipGrad)"></path>
                <!-- Muted Invested Path -->
                <polyline points="${investedLine}" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="2,2" fill="none" opacity="0.6"></polyline>
                <!-- Maturity Growth Path -->
                <polyline points="${maturityLine}" stroke="var(--success-color)" stroke-width="2" fill="none"></polyline>
                <!-- Maturity End Dot -->
                <circle cx="${width - padding}" cy="${padding}" r="3" fill="var(--success-color)"></circle>
            `;
        }
    };

    if (sipForm) {
        // Recalculate on inputs change
        [sipScheme, sipAmount, sipTenure].forEach(el => {
            el.addEventListener('input', calculateGovtSIP);
            el.addEventListener('change', calculateGovtSIP);
        });

        // Calculate initially
        calculateGovtSIP();

        sipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const monthlyAmt = parseFloat(sipAmount.value) || 0;
            const selectedOpt = sipScheme.options[sipScheme.selectedIndex];
            if (!selectedOpt) return;

            const isStock = selectedOpt.getAttribute('data-is-stock') === 'true';
            const name = selectedOpt.text.split(' (')[0];

            if (sipFeedback) {
                if (isStock) {
                    sipFeedback.querySelector('.banner-text').textContent = `⚡ Equity SIP registered for ₹${monthlyAmt.toLocaleString()}/month in ${name} under Exchange mandate!`;
                } else {
                    sipFeedback.querySelector('.banner-text').textContent = `🛡️ Sovereign SIP mandate established for ₹${monthlyAmt.toLocaleString()}/month in ${name} under Government guarantee!`;
                }
                sipFeedback.classList.remove('hidden');
                
                setTimeout(() => {
                    sipFeedback.classList.add('hidden');
                }, 4500);
            }
        });
    }

    // Draw graph dynamically on resize
    window.addEventListener('resize', () => {
        if (!stockModal.classList.contains('hidden') && selectedModalStock) {
            drawDetailedModalChart(selectedModalStock, currentChartMode);
        }
    });
});
