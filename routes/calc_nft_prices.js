const express = require("express");
const Web3 = require("web3");
const router = express.Router();
const authenticator = require("../authenticator/index.js");
const nftAmounts = [90000, 30000, 2400000, 2400000, 60000, 60000, 48000, 48000, 18000, 30000, 90000, 30000, 5400, 9000, 7200, 120000, 180000, 7200, 240000, 120000, 4800, 5400, 4800, 30000, 120000, 30000, 240000, 480000, 120000, 60000]

function calcNftPrices(k) {
    // recommended k = 18000
    result = [];

    nftAmounts.forEach(e => {
        result.push(k / e);
    });
    return result;
}


function ethPricesInWEI(prices) {
    result = [];
    prices.forEach(e => {
        result.push(Web3.utils.toWei(e + "", "ether"));
    });
    return result;
}

function calctotalBNBamountForEachNFT(prices) {
    result = [];
    count = 0;
    prices.forEach(e => {
        result.push(e * nftAmounts[count]);
        count++;
    });
    return result;
}

function calcTotalAmount(prices) {
    result = 0;
    prices.forEach(e => {
        result = result + e;
    });
    return result;
}

router.get("/", (req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
        _prices = calcNftPrices(req.query.k);
        res.json({
            prices: _prices,
            inWei: ethPricesInWEI(_prices),
            totalBNBamountForEachNFT: calctotalBNBamountForEachNFT(prices),
            totalAmounnt: calcTotalAmount(prices)
        });
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;