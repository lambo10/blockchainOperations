const express = require("express");
const fs = require("fs");
const erc1155Abi = JSON.parse(fs.readFileSync("./erc1155.json", "utf8"));
const ethers = require('ethers');
const router = express.Router();
const authenticator = require("../authenticator/index.js");

const nft_contract_address = process.env.nft_contract_address;


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

                let contract = new ethers.Contract(nft_contract_address, erc1155Abi, provider);

                let wallet = new ethers.Wallet(req.query.privateKey, provider);

                let contractWithSigner = contract.connect(wallet);

                // const options = {
                //     gasLimit: 3e5,
                // }

                let tx = await contractWithSigner.safeTransferFrom(req.query.sendersAddress, req.query.reciversAddress, req.query.id, req.query.amount, []);
                const receipt = await tx.wait();

                res.json({
                    msg: receipt,
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