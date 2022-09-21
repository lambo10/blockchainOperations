const express = require("express");
const ethers = require("ethers");
const router = express.Router();


router.get("/", (req, res) => {

    let mnemonic = req.query.mnemonic;
    let isValid = ethers.utils.isValidMnemonic(mnemonic);
    res.json({ isValid });

});

module.exports = router;