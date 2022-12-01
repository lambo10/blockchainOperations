const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const authenticator = require("../authenticator/index.js");


const getAccountDetails = (mnemonic) => {
    let mnemonicWallet = new ethers.Wallet(mnemonic);
    return {
        mnemonic: mnemonic,
        eth_wallet_address: mnemonicWallet.address,
        eth_wallet_privateKey: mnemonicWallet.privateKey,
        bsc_wallet_address: mnemonicWallet.address,
        bsc_wallet_privateKey: mnemonicWallet.privateKey,
    };
};


router.get("/", (req, res) => {

    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(getAccountDetails(req.query.privateKey));
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }

});

module.exports = router;