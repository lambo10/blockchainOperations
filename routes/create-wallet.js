const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const authenticator = require("../authenticator/index.js");


const getAccountDetails = (mnemonic) => {
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    return {
        mnemonic: mnemonic,
        eth_wallet_address: mnemonicWallet.address,
        eth_wallet_privateKey: mnemonicWallet.privateKey,
        bsc_wallet_address: mnemonicWallet.address,
        bsc_wallet_privateKey: mnemonicWallet.privateKey,
    };
};


router.get("/", (req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(getAccountDetails(req.query.memornic_phrase));
        } catch (error) {
            res.json({
                success: false,
                msg: error.message,
            });
        }
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;