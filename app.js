require("dotenv").config();
const express = require("express");
const ethers = require("ethers");

const bodyParser = require("body-parser");

// var timeout = require('connect-timeout');

const app = express();

// app.use(timeout('240s'));
// app.use(haltOnTimedout);

// function haltOnTimedout(req, res, next) {
//     if (!req.timedout) next();
// }

app.use(bodyParser({ extended: true }));
app.disable("x-powered-by");

const createWallet = require("./routes/create-wallet");
app.use("/create-wallet", createWallet);

const create_wallet_with_privateKey = require("./routes/create-wallet-with-privateKey");
app.use("/create-wallet-with-privateKey", create_wallet_with_privateKey);

const createSeedPhrase = require("./routes/create-seedPhrase");
app.use("/create-seedPhrase", createSeedPhrase);

const isValidSeedPhrase = require("./routes/is-valid-seed-phrase");
app.use("/is-valid-seed-phrase", isValidSeedPhrase);

const getNftsDetailWithMoralis = require("./routes/get-nfts-detail-with-moralis");
app.use("/get-nfts-detail-with-moralis", getNftsDetailWithMoralis);

const getNftsDetailWithWeb3js = require("./routes/get-nfts-with-web3js");
app.use("/get-nfts-with-web3js", getNftsDetailWithWeb3js);

const getNftsWithBscscan = require("./routes/get-nfts-with-bscscan");
app.use("/get-nfts-with-bscscan", getNftsWithBscscan);

const calc_nft_prices = require("./routes/calc_nft_prices");
app.use("/calc_nft_prices", calc_nft_prices);

const privateMint = require("./routes/private-mint");
app.use("/private-mint", privateMint);

const publicMint = require("./routes/public-mint");
app.use("/public-mint", publicMint);

const transferNFT = require("./routes/transferNFT");
app.use("/transferNFT", transferNFT);

const getNft_left_amount_and_price = require("./routes/getNft-left-amount-and-price");
app.use("/getNft-left-amount-and-price", getNft_left_amount_and_price);

const get_bnb_balance = require("./routes/get-bnb-balance");
app.use("/get-bnb-balance", get_bnb_balance);

const pay_winnings = require("./routes/pay-winnings");
app.use("/pay-winnings", pay_winnings);

const claim_tokens = require("./routes/claim-tokens");
app.use("/claim-tokens", claim_tokens);

const get_alive_nfts = require("./routes/get-alive-nfts");
app.use("/get-alive-nfts", get_alive_nfts);

const get_token_balance = require("./routes/get-token-balance");
app.use("/get-token-balance", get_token_balance);

const revive = require("./routes/revive");
app.use("/revive", revive);

const landMint = require("./routes/land-mint");
app.use("/land-mint", landMint);

const training_speedup = require("./routes/training-speedup");
app.use("/training-speedup", training_speedup);

const construction_speedup = require("./routes/construction-speedup");
app.use("/construction-speedup", construction_speedup);

const get_training_speedup_cost = require("./routes/get-training-speedup-cost");
app.use("/get-training-speedup-cost", get_training_speedup_cost);

const get_construction_speedup_cost = require("./routes/get-construction-speedup-cost");
app.use("/get-construction-speedup-cost", get_construction_speedup_cost);

const get_unclaimed_tokens = require("./routes/get-unclaimed-tokens");
app.use("/get-unclaimed-tokens", get_unclaimed_tokens);

const start_end_battle = require("./routes/start-end-battle");
app.use("/start-end-battle", start_end_battle);

const twenty_four_hour_shield_payment = require("./routes/twenty-four-hour-shield-payment");
app.use("/twenty-four-hour-shield-payment", twenty_four_hour_shield_payment);

const getTotalAmountPurchasedOnSeedSale = require("./routes/get-total-amount-purchased-on-seedsale");
app.use("/getTotalAmountPurchasedOnSeedSale", getTotalAmountPurchasedOnSeedSale);

const check_seedSale_payments = require("./routes/check-seedSale-payments");
app.use("/check-seedSale-payments", check_seedSale_payments);

const create_full_wallet = require("./routes/create-full-wallet");
app.use("/create-full-wallet", create_full_wallet);

const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Server Running on port ${port}`));