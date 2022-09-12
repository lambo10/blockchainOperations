const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const authenticator = require("../authenticator/index.js");


router.get("/", (req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
        let mnemonic = req.query.mnemonic;
        let isValid = ethers.utils.isValidMnemonic(mnemonic);
        res.json({ isValid });
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;