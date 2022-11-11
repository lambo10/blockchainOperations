require("dotenv").config();
const express = require("express");
const fs = require("fs");
const erc1155Abi = JSON.parse(fs.readFileSync("./erc1155.json", "utf8"));
const Web3 = require("web3");
const router = express.Router();
const authenticator = require("../authenticator/index.js");


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
                        rpc = "https://data-seed-prebsc-2-s3.binance.org:8545/";
                        break;
                    default:
                        res.json({
                            msg: "chainId not supported",
                            success: false,
                        });
                        break;
                }
                const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
                const erc1155Contract = new web3.eth.Contract(
                    erc1155Abi,
                    process.env.nft_contract_address, {
                        from: req.query.address,
                    }
                );

                let balance = await erc1155Contract.methods
                    .balanceOf(req.query.address, req.query.id)
                    .call();

                res.json({
                    msg: balance,
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