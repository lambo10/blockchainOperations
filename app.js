require("dotenv").config();
const express = require("express");
const ethers = require("ethers");

const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser({ extended: true }));
app.disable("x-powered-by");

const createWallet = require("./routes/create-wallet");
app.use("/create-wallet", createWallet);

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


const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Server Running on port ${port}`));