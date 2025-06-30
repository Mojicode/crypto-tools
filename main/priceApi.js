// 价格查询功能
async function fetchPrice() {
    const selectedCoin = document.getElementById('priceSelect').value;
    const priceInfo = document.getElementById('priceInfo');
    
    if (!selectedCoin) {
        priceInfo.style.display = 'none';
        return;
    }
    
    priceInfo.style.display = 'block';
    
    // 显示加载状态
    document.getElementById('currentPriceUSD').textContent = '加载中...';
    document.getElementById('priceChange24h').textContent = '加载中...';
    document.getElementById('marketCap').textContent = '加载中...';
    
    try {
        const geckoId = COIN_DATA[selectedCoin].geckoId;
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`);
        const data = await response.json();
        
        if (data[geckoId]) {
            const coinData = data[geckoId];
            
            // 更新价格
            document.getElementById('currentPriceUSD').textContent = format
