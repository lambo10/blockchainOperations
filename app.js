const bip39 = require("bip39");
require("dotenv").config();
const Moralis = require('moralis/node');
const express = require("express");
const ethers = require("ethers");
const serverUrl = "https://znqmxfvglzpr.usemoralis.com:2053/server";
const appId = "ghtzGwB0w5LCRpd3dCyWqVhD3wDwDHpYnRM1OGEA";
const masterKey = "Td928PD0DtnuT2L84xy3REdUhALcFjkEKhEsrsNp";
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser({ extended: true }));

app.disable("x-powered-by");

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


app.get("/create-wallet", (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(getAccountDetails(req.query.memornic_phrase));
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }
});
app.get("/create-seedPhrase", (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({
            seed: bip39.generateMnemonic(),
        });
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }
});

app.get("/is-valid-seed-phrase", (req, res) => {
    let mnemonic = req.query.mnemonic;
    let isValid = ethers.utils.isValidMnemonic(mnemonic);
    res.json({ isValid });
});

app.get("/get-nfts-detail/:address", async(req, res) => {
    try {
        res.json(await getUserNFT(req.params.address));
    } catch (errorMsg) {
        res.json({
            error: true,
            msg: errorMsg,
        });
    }
});


async function getUserNFT(address) {
    const options = {
        chain: "bsc",
        address: address,
        token_address: "0x1Ac44321888CE192B94060759ccCBaEc910c2018",
    };
    await Moralis.start({ serverUrl, appId, masterKey });
    const polygonNFTs = await Moralis.Web3API.account.getNFTsForContract(options);

    return (polygonNFTs);
}

const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Server Running on port ${port}`));