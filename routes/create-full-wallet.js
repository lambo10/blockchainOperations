const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const bip39 = require("bip39");


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

    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(getAccountDetails(bip39.generateMnemonic()));
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }

});

module.exports = router;