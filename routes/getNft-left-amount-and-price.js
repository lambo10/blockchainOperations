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
                        rpc = "https://data-seed-prebsc-1-s3.binance.org:8545/";
                        break;
                    default:
                        res.json({
                            msg: "chainId not supported",
                            amountLeft: "",
                            price: "",
                            success: false,
                        });
                        break;
                }


                let provider = new ethers.providers.JsonRpcProvider(rpc);

                let contract = new ethers.Contract(nft_contract_address, erc1155Abi, provider);

                let maxNftsAmount = await contract.maxNftsAmount(req.query.id);
                let maxNftsAmount_json = JSON.parse(maxNftsAmount);

                let mintedNftsAmount = await contract.mintedNftsAmount(req.query.id);
                let mintedNftsAmount_json = JSON.parse(mintedNftsAmount);

                let price = await contract.nftMintPrice(req.query.id);
                let price_json = JSON.parse(price);



                res.json({
                    amountLeft: (maxNftsAmount_json - mintedNftsAmount_json),
                    price: ethers.utils.formatEther(price_json + ""),
                    msg: "",
                    success: true,
                });


            } catch (e) {
                var error = e.toString();
                res.json({
                    msg: error,
                    amountLeft: "",
                    price: "",
                    success: false,
                });
            }
        } else {
            res.json({
                success: false,
                amountLeft: "",
                price: "",
                msg: "Invalid API key",
            });
        }
    }
);

module.exports = router;