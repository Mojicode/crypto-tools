// 单位转换功能
function updateUnits() {
    const selectedCoin = document.getElementById('coinSelect').value;
    const converterSection = document.getElementById('converterSection');
    const unitsTable = document.getElementById('unitsTable');
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (!selectedCoin) {
        converterSection.style.display = 'none';
        unitsTable.style.display = 'none';
        priceDisplay.style.display = 'none';
        return;
    }

    converterSection.style.display = 'block';
    unitsTable.style.display = 'block';
    priceDisplay.style.display = 'block';
    
    populateUnitSelects(selectedCoin);
    updateUnitsTable(selectedCoin);
    fetchCoinPrice(selectedCoin);
    convert();
}

function populateUnitSelects(coinType) {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const units = COIN_DATA[coinType].units;
    
    // 清空选项
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // 添加单位选项
    Object.keys(units).forEach(unit => {
        const option1 = new Option(unit, unit);
        const option2 = new Option(unit, unit);
        fromUnit.add(option1);
        toUnit.add(option2);
    });
    
    // 设置默认值
    const mainUnit = COIN_DATA[coinType].mainUnit;
    fromUnit.value = mainUnit;
    toUnit.value = Object.keys(units)[0]; // 最小单位
}

function convert() {
    const selectedCoin = document.getElementById('coinSelect').value;
    if (!selectedCoin) return;
    
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (!fromUnit || !toUnit) return;
    
    const units = COIN_DATA[selectedCoin].units;
    const fromValue = units[fromUnit].value;
    const toValue = units[toUnit].value;
    
    // 转换逻辑：先转为最小单位，再转为目标单位
    const result = (fromAmount * fromValue) / toValue;
    
    document.getElementById('toAmount').value = formatNumber(result);
}

function updateUnitsTable(coinType) {
    const tableBody = document.getElementById('unitsTableBody');
    const tableTitle = document.getElementById('unitsTableTitle');
    const units = COIN_DATA[coinType].units;
    const mainUnit = COIN_DATA[coinType].mainUnit;
    
    tableTitle.textContent = `${COIN_DATA[coinType].name} 单位换算表`;
    tableBody.innerHTML = '';
    
    Object.entries(units).forEach(([unit, data]) => {
        const row = tableBody.insertRow();
        const mainUnitValue = units[mainUnit].value;
        const ratio = mainUnitValue / data.value;
        
        row.innerHTML = `
            <td><strong>${unit}</strong></td>
            <td class="text-primary"><code>1 ${mainUnit} = ${formatNumber(ratio)} ${unit}</code></td>
            <td class="text-muted">${data.description}</td>
        `;
    });
}

async function fetchCoinPrice(coinSymbol) {
    const priceElement = document.getElementById('currentPrice');
    const geckoId = COIN_DATA[coinSymbol].geckoId;
    
    try {
        priceElement.textContent = '加载中...';
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd`);
        const data = await response.json();
        
        if (data[geckoId] && data[geckoId].usd) {
            priceElement.textContent = formatCurrency(data[geckoId].usd);
        } else {
            priceElement.textContent = '无法获取价格';
        }
    } catch (error) {
        console.error('获取价格失败:', error);
        priceElement.textContent = '获取失败';
    }
}
