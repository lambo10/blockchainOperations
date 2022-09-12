const express = require("express");
const Web3 = require("web3");
const router = express.Router();
const authenticator = require("../authenticator/index.js");

function calcNftPrices(k) {
    // recommended k = 18000
    result = [];
    nftAmounts = [45000, 15000, 1200000, 1200000, 30000, 30000, 24000, 24000, 9000, 15000, 45000, 15000,
        2700, 4500, 3600, 60000, 90000, 3600, 120000, 60000, 2400, 2700, 2400, 15000, 60000,
        15000, 120000, 240000, 60000, 30000
    ];
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

router.get("/", (req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
        _prices = calcNftPrices(req.query.k);
        res.json({
            prices: _prices,
            inWei: ethPricesInWEI(_prices)
        });
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;