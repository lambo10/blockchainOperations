const express = require("express");
const fs = require("fs");
const tokenABI = JSON.parse(fs.readFileSync("./tokenABI.json", "utf8"));
const ethers = require('ethers');
const router = express.Router();
const authenticator = require("../authenticator/index.js");

const token_contract_address = process.env.token_address;


router.get(
    "/",
    async(req, res) => {

        if (authenticator.auth(req.query.apiKey)) {
            try {
                let rpc;
                switch (req.query.chainId) {
                    case "1":
                        rpc = "https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4";
                        break;
                    case "56":
                        rpc = "https://bsc-dataseed.binance.org/";
                        break;
                    case "137":
                        rpc = "https://polygon-rpc.com";
                        break;
                    case "97":
                        rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
                        break;
                    default:
                        res.json({
                            msg: "chainId not supported",
                            success: false,
                        });
                        break;
                }


                let provider = new ethers.providers.JsonRpcProvider(rpc);

                let contract = new ethers.Contract(token_contract_address, tokenABI, provider);

                let totalGverseToken = await contract.balanceOf(req.query.address);
                let totalGverseToken_json = JSON.parse(totalGverseToken);

                res.json({
                    msg: ethers.utils.formatEther(totalGverseToken_json + ""),
                    success: true,
                });


            } catch (e) {
                var error = e.toString();

                res.json({
                    msg: error,
                    success: false,
                });
            }
        } else {
            res.json({
                success: false,
                msg: "Invalid API key",
            });
        }
    }
);

module.exports = router;