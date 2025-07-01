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

// function convert() {
//     const selectedCoin = document.getElementById('coinSelect').value;
//     if (!selectedCoin) return;
    
//     const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
//     const fromUnit = document.getElementById('fromUnit').value;
//     const toUnit = document.getElementById('toUnit').value;
    
//     if (!fromUnit || !toUnit) return;
    
//     const units = COIN_DATA[selectedCoin].units;
//     const fromValue = units[fromUnit].value;
//     const toValue = units[toUnit].value;
    
//     // 转换逻辑：先转为最小单位，再转为目标单位
//     const result = (fromAmount * fromValue) / toValue;
    
//     document.getElementById('toAmount').value = formatNumber(result);
// }

// 使用高精度计算的转换函数
function convert() {
    const selectedCoin = document.getElementById('coinSelect').value;
    if (!selectedCoin) return;
    
    const fromAmount = document.getElementById('fromAmount').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (!fromAmount || !fromUnit || !toUnit || fromAmount === '') {
        document.getElementById('toAmount').value = '';
        return;
    }
    
    // 验证输入是否为有效数字
    if (isNaN(fromAmount) || parseFloat(fromAmount) < 0) {
        document.getElementById('toAmount').value = '请输入有效数字';
        return;
    }
    
    const units = COIN_DATA[selectedCoin].units;
    const fromValue = units[fromUnit].value;
    const toValue = units[toUnit].value;
    
    try {
        // 使用字符串计算避免精度问题
        const result = calculateConversion(fromAmount, fromValue, toValue);
        document.getElementById('toAmount').value = formatNumber(result);
    } catch (error) {
        console.error('转换计算错误:', error);
        document.getElementById('toAmount').value = '计算错误';
    }
}

// 高精度计算函数
function calculateConversion(amount, fromRate, toRate) {
    // 将所有数字转换为字符串进行精确计算
    const amountStr = amount.toString();
    const fromRateStr = fromRate.toString();
    const toRateStr = toRate.toString();
    
    // 如果涉及大数计算，使用BigNumber处理
    if (fromRate >= 1e15 || toRate >= 1e15 || parseFloat(amount) * fromRate >= 1e15) {
        return calculateWithBigNumber(amountStr, fromRateStr, toRateStr);
    } else {
        // 对于较小的数，使用改进的浮点数计算
        return calculateWithPrecision(parseFloat(amount), fromRate, toRate);
    }
}

// 使用BigNumber进行精确计算（模拟实现）
function calculateWithBigNumber(amount, fromRate, toRate) {
    // 简化的BigNumber实现
    const multiply = (a, b) => {
        const aStr = a.toString();
        const bStr = b.toString();
        
        // 获取小数位数
        const aDecimals = (aStr.split('.')[1] || '').length;
        const bDecimals = (bStr.split('.')[1] || '').length;
        const totalDecimals = aDecimals + bDecimals;
        
        // 转换为整数计算
        const aInt = parseInt(aStr.replace('.', ''));
        const bInt = parseInt(bStr.replace('.', ''));
        
        const result = aInt * bInt;
        
        if (totalDecimals === 0) {
            return result.toString();
        }
        
        const resultStr = result.toString();
        if (resultStr.length <= totalDecimals) {
            return '0.' + '0'.repeat(totalDecimals - resultStr.length) + resultStr;
        }
        
        const intPart = resultStr.slice(0, -totalDecimals);
        const decPart = resultStr.slice(-totalDecimals);
        return intPart + '.' + decPart.replace(/0+$/, '');
    };
    
    const divide = (a, b) => {
        // 简化的除法实现
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        
        if (bNum === 0) return '0';
        
        // 对于整数除法，直接计算
        if (aNum % bNum === 0) {
            return (aNum / bNum).toString();
        }
        
        // 使用长除法获得更精确的结果
        const quotient = Math.floor(aNum / bNum);
        let remainder = aNum - quotient * bNum;
        let decimal = '';
        let decimalPlaces = 0;
        const maxDecimalPlaces = 18;
        
        while (remainder !== 0 && decimalPlaces < maxDecimalPlaces) {
            remainder *= 10;
            const digit = Math.floor(remainder / bNum);
            decimal += digit.toString();
            remainder = remainder - digit * bNum;
            decimalPlaces++;
        }
        
        if (decimal === '') {
            return quotient.toString();
        }
        
        return quotient.toString() + '.' + decimal.replace(/0+$/, '');
    };
    
    const product = multiply(amount, fromRate);
    return divide(product, toRate);
}

// 改进的精度计算
function calculateWithPrecision(amount, fromRate, toRate) {
    // 确定所需的精度
    const precision = Math.max(
        getPrecision(amount),
        getPrecision(fromRate),
        getPrecision(toRate)
    ) + 6; // 额外增加6位精度
    
    // 使用更高精度的计算
    const factor = Math.pow(10, precision);
    const amountInt = Math.round(amount * factor);
    const fromRateInt = Math.round(fromRate * factor);
    const toRateInt = Math.round(toRate * factor);
    
    // 计算: (amount * fromRate) / toRate
    const numerator = (amountInt * fromRateInt) / factor; // 这里除以一个factor是因为我们乘了两次
    const result = numerator / toRateInt * factor;
    
    return result;
}

// 获取数字的精度（小数位数）
function getPrecision(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) return 0;
    return str.split('.')[1].length;
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

// 在 js/converter.js 中添加输入验证
function validateInput(input) {
    const value = input.value;
    
    // 移除非数字字符（除了小数点）
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    // 确保只有一个小数点
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
        input.value = parts[0] + '.' + parts.slice(1).join('');
        return;
    }
    
    // 确保负号只在开头
    if (cleanValue.indexOf('-') > 0) {
        input.value = cleanValue.replace(/-/g, '');
        return;
    }
    
    input.value = cleanValue;
}
