const COIN_DATA = {
    ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        mainUnit: 'ETH',
        geckoId: 'ethereum',
        addressFormat: 'ethereum',
        units: {
            'wei': { value: 1, description: '最小单位' },
            'kwei': { value: 1e3, description: '千wei' },
            'mwei': { value: 1e6, description: '百万wei' },
            'gwei': { value: 1e9, description: '十亿wei，常用于Gas费' },
            'szabo': { value: 1e12, description: '万亿wei' },
            'finney': { value: 1e15, description: '千万亿wei' },
            'ether': { value: 1e18, description: '以太币主单位' },
            'ETH': { value: 1e18, description: '以太币主单位' }
        }
    },
    BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        mainUnit: 'BTC',
        geckoId: 'bitcoin',
        addressFormat: 'bitcoin',
        units: {
            'satoshi': { value: 1, description: '最小单位，聪' },
            'microBTC': { value: 100, description: '微比特币' },
            'milliBTC': { value: 1e5, description: '毫比特币' },
            'centiBTC': { value: 1e6, description: '厘比特币' },
            'deciBTC': { value: 1e7, description: '分比特币' },
            'BTC': { value: 1e8, description: '比特币主单位' }
        }
    },
    BNB: {
        name: 'Binance Coin',
        symbol: 'BNB',
        mainUnit: 'BNB',
        geckoId: 'binancecoin',
        addressFormat: 'ethereum',
        units: {
            'jager': { value: 1, description: '最小单位' },
            'BNB': { value: 1e8, description: 'BNB主单位' }
        }
    },
    ADA: {
        name: 'Cardano',
        symbol: 'ADA',
        mainUnit: 'ADA',
        geckoId: 'cardano',
        addressFormat: 'cardano',
        units: {
            'lovelace': { value: 1, description: '最小单位' },
            'ADA': { value: 1e6, description: 'ADA主单位' }
        }
    },
    DOT: {
        name: 'Polkadot',
        symbol: 'DOT',
        mainUnit: 'DOT',
        geckoId: 'polkadot',
        addressFormat: 'substrate',
        units: {
            'planck': { value: 1, description: '最小单位' },
            'DOT': { value: 1e10, description: 'DOT主单位' }
        }
    }
};

const SUPPORTED_COINS = Object.keys(COIN_DATA);
