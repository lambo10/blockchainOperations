const express = require("express");
const fs = require("fs");
const seedSaleContractAbi = JSON.parse(fs.readFileSync("./seedSaleContractAbi.json", "utf8"));
const ethers = require('ethers');
const router = express.Router();

router.get(
    "/",
    async(req, res) => {

            try {
                    
                if(req.query.chainId === "1" && req.query.token === "USDT"){
                //ethereum network
                let provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4");

                let contract = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", tokenABI, provider);

                let tokenBalance = await contract.balanceOf(req.query.address);
                let tokenBalance_json = tokenBalance;

                res.json({
                    msg: parseFloat(ethers.utils.formatEther(tokenBalance_json)).toFixed(3),
                    success: true,
                });

                }else if(req.query.chainId === "1"  && req.query.token === "ETH"){
                //bsc network
                let provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4");

                bnbBalance = await provider.getBalance(req.query.address);

                res.json({
                    msg: parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(3),
                    success: true,
                });

                }else if(req.query.chainId === "56"  && req.query.token === "BUSD"){
                    //bsc network
                    let provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    
                    let contract = new ethers.Contract("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", tokenABI, provider);
    
                    let tokenBalance = await contract.balanceOf(req.query.address);
                    let tokenBalance_json = tokenBalance;
    
                    res.json({
                        msg: parseFloat(ethers.utils.formatEther(tokenBalance_json)).toFixed(3),
                        success: true,
                    });
    
                }else if(req.query.chainId === "56"  && req.query.token === "BNB"){
                    //bsc network
                    let provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    
                    bnbBalance = await provider.getBalance(req.query.address);
    
                    res.json({
                        msg: parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(3),
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