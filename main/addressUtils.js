// 地址工具功能
function processAddress() {
    const address = document.getElementById('addressInput').value.trim();
    const infoDiv = document.getElementById('addressInfo');
    const detailsDiv = document.getElementById('addressDetails');
    
    if (!address) {
        infoDiv.style.display = 'none';
        return;
    }
    
    // 显示地址信息
    infoDiv.style.display = 'block';
    
    const addressType = detectAddressType(address);
    const isValid = validateAddress(address, addressType);
    
    detailsDiv.innerHTML = `
        <p><strong>地址类型:</strong> ${addressType}</p>
        <p><strong>长度:</strong> ${address.length} 字符</p>
        <p><strong>格式验证:</strong> 
            <span class="badge ${isValid ? 'bg-success' : 'bg-danger'}">
                ${isValid ? '有效' : '无效'}
            </span>
        </p>
        <p><strong>格式:</strong> ${getAddressFormat(address)}</p>
    `;
}

function detectAddressType(address) {
    if (address.startsWith('0x') && address.length === 42) {
        return 'Ethereum';
    } else if (address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3')) {
        return 'Bitcoin';
    } else if (address.startsWith('bnb')) {
        return 'Binance Chain';
    } else if (address.startsWith('addr1')) {
        return 'Cardano';
    } else if (address.length === 48) {
        return 'Polkadot';
    }
    return '未知';
}

function validateAddress(address, type) {
    try {
        switch (type) {
            case 'Ethereum':
                return /^0x[a-fA-F0-9]{40}$/.test(address);
            case 'Bitcoin':
                return address.length >= 26 && address.length <= 35;
            case 'Binance Chain':
                return address.startsWith('bnb') && address.length === 43;
            case 'Cardano':
                return address.startsWith('addr1') && address.length >= 100;
            case 'Polkadot':
                return address.length === 48;
            default:
                return false;
        }
    } catch (error) {
        return false;
    }
}

function getAddressFormat(address) {
    if (address.startsWith('0x')) {
        const addr = address.slice(2);
        if (addr === addr.toLowerCase()) return '全小写';
        if (addr === addr.toUpperCase()) return '全大写';
        if (isChecksumAddress(address)) return '校验和格式';
        return '混合格式';
    }
    return '标准格式';
}

function convertToLowercase() {
    const input = document.getElementById('addressInput').value.trim();
    const output = document.getElementById('addressOutput');
    
    if (input.startsWith('0x')) {
        output.value = '0x' + input.slice(2).toLowerCase();
    } else {
        output.value = input.toLowerCase();
    }
}

function convertToUppercase() {
    const input = document.getElementById('addressInput').value.trim();
    const output = document.getElementById('addressOutput');
    
    if (input.startsWith('0x')) {
        output.value = '0x' + input.slice(2).toUpperCase();
    } else {
        output.value = input.toUpperCase();
    }
}

function convertToChecksum() {
    const input = document.getElementById('addressInput').value.trim();
    const output = document.getElementById('addressOutput');
    
    if (!input.startsWith('0x') || input.length !== 42) {
        showToast('请输入有效的以太坊地址', 'warning');
        return;
    }
    
    try {
        const checksumAddress = toChecksumAddress(input);
        output.value = checksumAddress;
    } catch (error) {
        showToast('转换失败：' + error.message, 'error');
    }
}

function toChecksumAddress(address) {
    const addr = address.toLowerCase().replace('0x', '');
    const hash = CryptoJS.SHA3(addr, { outputLength: 256 }).toString();
    let checksum = '0x';
    
    for (let i = 0; i < addr.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            checksum += addr[i].toUpperCase();
        } else {
            checksum += addr[i];
        }
    }
    
    return checksum;
}

function isChecksumAddress(address) {
    try {
        const checksumAddr = toChecksumAddress(address);
        return address === checksumAddr;
    } catch (error) {
        return false;
    }
}
