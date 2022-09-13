require("dotenv").config();
const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const authenticator = require("../authenticator/index.js");


const moralis_serverUrl = process.env.moralis_serverUrl;
const moralis_appId = process.env.momoralis_appID;
const moralis_masterKey = process.env.moralis_masterKey;
const nft_contract_address = process.env.nft_contract_address;


router.get("/", async(req, res) => {

    if (authenticator.auth(req.query.apiKey)) {
        try {
            res.json(await getUserNFT(req.query.address));
        } catch (errorMsg) {
            res.json({
                error: true,
                msg: errorMsg,
            });
        }
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

async function getUserNFT(address) {

    const options = {
        chain: "bsc",
        address: address,
        token_address: nft_contract_address,
    };
    await Moralis.start({ apiKey: "fCtAI9Fs6Eff1je1ZOHmN56zW9S2fnsf6ZuWvA9ViVobrnJXOZlqWyDTV7dmN6Vl" });
    // const Nfts = await Moralis.Web3API.account.getNFTsForContract(options);

    const Nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
    });

    return (Nfts);
}

module.exports = router;