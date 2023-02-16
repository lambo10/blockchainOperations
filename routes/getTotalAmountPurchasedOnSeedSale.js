const express = require("express");
const fs = require("fs");
const seedSaleContractAbi = JSON.parse(fs.readFileSync("./seedSaleContractAbi.json", "utf8"));
const ethers = require('ethers');
const router = express.Router();
const authenticator = require("../authenticator/index.js");
const tokenPrices = require("../libraries/tokenPrices.js");

const seedSale_ETH_address = process.env.seedSale_ETH_address;
const seedSale_BSC_address = process.env.seedSale_BSC_address;


router.get(
    "/",
    async(req, res) => {

        if (authenticator.auth(req.query.apiKey)) {
            try {
                
                //ethereum network
                let eth_provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4");
                let eth_contract = new eth_contract.Contract(seedSale_ETH_address, seedSaleContractAbi, eth_provider);
                let eth_totalPurchaseAmount = await contract.totalPurchaseAmount();
                let eth_totalPurchaseAmount_json = JSON.parse(eth_totalPurchaseAmount);

                //bsc network
                let bsc_provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
                let bsc_contract = new ethers.Contract(seedSale_BSC_address, seedSaleContractAbi, bsc_provider);
                let bsc_totalPurchaseAmount = await bsc_contract.totalPurchaseAmount();
                let bsc_totalPurchaseAmount_json = JSON.parse(bsc_totalPurchaseAmount);


                if((eth_totalPurchaseAmount_json + bsc_totalPurchaseAmount_json) > 5000000){
                    res.json({
                        msg: (eth_totalPurchaseAmount_json + bsc_totalPurchaseAmount_json)+"",
                        success: true,
                    });
                }else{
                    res.json({
                        msg: "Code:883",
                        success: false,
                    });
                }
                



            } catch (e) {
                var error = e.toString();
                res.json({
                    msg: error,
                    success: false,
                });
            }
        } else {
            res.json({
                msg: "Invalid API key",
                success: false
            });
        }
    }
);

module.exports = router;