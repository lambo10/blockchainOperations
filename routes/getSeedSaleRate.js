const express = require("express");
const fs = require("fs");
const seedSaleContractAbi = JSON.parse(fs.readFileSync("./seedSaleContractAbi.json", "utf8"));
const ethers = require('ethers');
const router = express.Router();

const seedSale_ETH_address = process.env.seedSale_ETH_address;
const seedSale_BSC_address = process.env.seedSale_BSC_address;


router.get(
    "/",
    async(req, res) => {

            try {
                
                let Contract = null
                if(req.query.network.localeCompare("USDT") == 0 || req.query.network.localeCompare("ETH") == 0){
                    let eth_provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4");
                     Contract = new ethers.Contract(seedSale_ETH_address,seedSaleContractAbi,eth_provider);
                }else if(req.query.network.localeCompare("BUSD") == 0 || req.query.network.localeCompare("BNB") == 0){
                    let bsc_provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
                     Contract = new ethers.Contract(seedSale_BSC_address,seedSaleContractAbi,bsc_provider);
                }

                if(wkrSelectedOption.localeCompare("BNB") == 0 || wkrSelectedOption.localeCompare("ETH") == 0){
                    const gverseUsdRate = await Contract.gverse_usd_conversion_rate();
                    const bnbUsdRate = await Contract.getBNBtoBusdPrice("1");
                    res.json({
                        msg: gverseUsdRate*bnbUsdRate,
                        success: true,
                    });
                }else{
                    res.json({
                        msg: await Contract.gverse_usd_conversion_rate(),
                        success: true,
                    });
                }


            } catch (e) {
                var error = e.toString();
                res.json({
                    msg: error,
                    success: false,
                });
            }
        
    }
);

module.exports = router;