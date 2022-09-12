const express = require("express");
const bip39 = require("bip39");
const router = express.Router();
const authenticator = require("../authenticator/index.js");

router.get("/", (req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
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
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;