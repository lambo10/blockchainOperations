let pancakeSwapAbi = [
    { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
];
let tokenAbi = [
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
];
const Web3 = require('web3');

/*
Required Node.js
-- Web3 Token Charting --
Checkout my repo about building a clone of poocoin/dextools on bsc/pancakeswap and on any other similar chain/dex
https://github.com/Linch1/Web3TokenCharting
-- Usage --
1. Make a directory on your pc
2. Open a terminal 
3. go inside the created directory
4. run : npm init
5. run : npm i --save web3
6. Create a file: tokenPrice.js
7. Copy this text inside that file
8. run: node tokenPrice.js
-- Direct contact --
https://www.reddit.com/user/Linch-1
*/


let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
const web3 = new Web3("https://bsc-dataseed1.binance.org");
async function calcSell(tokensToSell, tokenAddres) {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB

    let tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddres);
    let tokenDecimals = await tokenRouter.methods.decimals().call();

    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
        let router = await new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract);
        amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres, BNBTokenAddress]).call();
        amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) {}

    if (!amountOut) return 0;
    return amountOut;
}
async function calcBNBPrice() {
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
    const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955" //USDT
    let bnbToSell = web3.utils.toWei("1", "ether");
    let amountOut;
    try {
        let router = await new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract);
        amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress]).call();
        amountOut = web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if (!amountOut) return 0;
    return amountOut;
}

function setDecimals(number, decimals) {
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while (numberDecimals.length < decimals) {
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}

async function calcTokenPrice(tokenAddres) {
    let bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT
        // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
    let tokens_to_sell = 1;
    let priceInBnb = await calcSell(tokens_to_sell, tokenAddres) / tokens_to_sell; // calculate TOKEN price in BNB

    return {
        "token_price_in_BNB": priceInBnb,
        "token_price_in_BUSD": priceInBnb * bnbPrice
    }

}

module.exports = {
    calcBNBPrice,
    calcTokenPrice
};