// 应用程序主文件
class CryptoToolsApp {
    constructor() {
        this.currentTab = 'converter';
        this.init();
    }

    init() {
        this.populateCoinSelects();
        this.showTab('converter');
    }

    populateCoinSelects() {
        const selects = ['coinSelect', 'priceSelect'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                // 保留第一个默认选项
                const defaultOption = select.querySelector('option[value=""]');
                select.innerHTML = '';
                if (defaultOption) {
                    select.appendChild(defaultOption);
                }
                
                // 添加币种选项
                SUPPORTED_COINS.forEach(coin => {
                    const option = document.createElement('option');
                    option.value = coin;
                    option.textContent = `${COIN_DATA[coin].name} (${coin})`;
                    select.appendChild(option);
                });
            }
        });
    }
}

// 标签页切换
function showTab(tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 工具函数
// function formatNumber(num) {
//     if (num === 0) return '0';
    
//     if (num >= 1e15 || (num < 1e-6 && num > 0)) {
//         return num.toExponential(6);
//     }
    
//     if (num < 1) {
//         return num.toPrecision(8).replace(/\.?0+$/, '');
//     }
    
//     if (num >= 1000 && Number.isInteger(num)) {
//         return num.toLocaleString();
//     }
    
//     return num.toString();
// }
// 增强版 formatNumber 函数
function formatNumber(num, options = {}) {
    const {
        maxDecimalPlaces = null,  // 最大小数位数，null表示不限制
        trimTrailingZeros = true  // 是否去掉末尾的零
    } = options;
    
    if (num === 0) return '0';
    
    // 展开科学计数法
    let numStr = expandScientificNotation(num);
    
    // 分离整数和小数部分
    const parts = numStr.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
    
    // 处理小数位数限制
    if (maxDecimalPlaces !== null && decimalPart.length > maxDecimalPlaces) {
        decimalPart = decimalPart.slice(0, maxDecimalPlaces);
    }
    
    // 去掉末尾的零
    if (trimTrailingZeros && decimalPart) {
        decimalPart = decimalPart.replace(/0+$/, '');
    }
    
    // 为整数部分添加逗号分隔
    const formattedInteger = addCommas(integerPart);
    
    // 组合结果
    if (decimalPart) {
        return formattedInteger + '.' + decimalPart;
    } else {
        return formattedInteger;
    }
}
// 展开科学计数法
function expandScientificNotation(num) {
    const str = num.toString();
    
    if (!str.includes('e')) {
        return str;
    }
    
    const [base, exponent] = str.split('e');
    const exp = parseInt(exponent, 10);
    const [intPart, decPart = ''] = base.split('.');
    
    if (exp > 0) {
        // 正指数：向右移动小数点
        const totalDigits = intPart + decPart;
        const newDecimalPos = 1 + exp;
        
        if (newDecimalPos >= totalDigits.length) {
            // 需要补零
            return totalDigits + '0'.repeat(newDecimalPos - totalDigits.length);
        } else {
            // 插入小数点
            return totalDigits.slice(0, newDecimalPos) + '.' + totalDigits.slice(newDecimalPos);
        }
    } else {
        // 负指数：向左移动小数点
        const absExp = Math.abs(exp);
        const totalDigits = intPart + decPart;
        
        if (absExp > 0) {
            return '0.' + '0'.repeat(absExp - 1) + totalDigits;
        } else {
            return totalDigits;
        }
    }
}

// 为数字添加逗号分隔
function addCommas(numStr) {
    // 处理负号
    const isNegative = numStr.startsWith('-');
    const positiveNumStr = isNegative ? numStr.slice(1) : numStr;
    
    // 从右到左每三位添加逗号
    const reversed = positiveNumStr.split('').reverse();
    const withCommas = [];
    
    for (let i = 0; i < reversed.length; i++) {
        if (i > 0 && i % 3 === 0) {
            withCommas.push(',');
        }
        withCommas.push(reversed[i]);
    }
    
    const result = withCommas.reverse().join('');
    return isNegative ? '-' + result : result;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function showToast(message, type = 'info') {
    // 简单的提示消息实现
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new CryptoToolsApp();
});
