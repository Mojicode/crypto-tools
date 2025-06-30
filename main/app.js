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
function formatNumber(num) {
    if (num === 0) return '0';
    
    if (num >= 1e15 || (num < 1e-6 && num > 0)) {
        return num.toExponential(6);
    }
    
    if (num < 1) {
        return num.toPrecision(8).replace(/\.?0+$/, '');
    }
    
    if (num >= 1000 && Number.isInteger(num)) {
        return num.toLocaleString();
    }
    
    return num.toString();
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
